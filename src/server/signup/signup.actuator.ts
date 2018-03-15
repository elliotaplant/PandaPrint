import { StripeClient } from '../billing';
import { DbClient, IEntryPpAccount, IPpAccount } from '../db';
import { ErrorActuator, ErrorCode } from '../error';
import { MessageActuator } from '../messages';
import { ISignupAccountRequest, ISignupMessageSend, ISignupWithStripeId } from './types';
/**
 * Actuator for signups from the front end
 */
export class SignupActuator {
  constructor(private dbClient: DbClient, private stripeClient: StripeClient) { }

  // This can be better
  public handleSignup(signupAccountReq: ISignupAccountRequest): Promise<ISignupMessageSend> {
    // Check if customer already exists
    return this.dbClient.loadAccountByPhone(this.sanitizePhone(signupAccountReq.phone))
      .then((foundAccount) => {
        if (foundAccount) {
          throw new Error(ErrorCode.AccountWithPhoneAlreadyExists);
        }
      })
      // Register the new customer with a stripe account
      .then(() => this.stripeClient.createCustomer(signupAccountReq.email, signupAccountReq.stripeToken))
      // Attach the stripe customer id to the request
      .then((customer) => ({ ...signupAccountReq, stripeCustId: customer.id }))
      // Sanitize the phone number in the request
      .then((signupReqWithStripe) => this.accountReqSanitizePhone(signupReqWithStripe))
      // Create the account in the DB
      .then((entryPpAcctReq) => this.dbClient.createAccount(entryPpAcctReq))
      // Return the welcome message to send to user
      .then((createdAccount) => ({
        message: this.signupWelcomeMessage(createdAccount),
        phone: createdAccount.phone,
      }));
  }

  // private methods
  private signupWelcomeMessage(account: IPpAccount): string {
    return `Welcome to Panda Print ${account.firstName}! Try sending us a picture to print.`;
  }

  private accountReqSanitizePhone(signupWithStripeId: ISignupWithStripeId): ISignupWithStripeId {
    return { ...signupWithStripeId, phone: this.sanitizePhone(signupWithStripeId.phone) };
  }

  private sanitizePhone(phone: string): string {
    if (!phone) {
      throw new Error('Non-existant phone number');
    }

    const justDigits = phone.replace(/\D/g, '');
    if (phone.length > 10) {
      throw new Error('Recieved phone with less than 10 digits');
    } else if (phone.length === 10) {
      return '+1' + phone;
    } else if (phone.length === 11 && phone.startsWith('1')) {
      return '+' + phone;
    } else if (phone.startsWith('+1')) {
      return phone;
    }

    throw new Error('Improperly formatted phone signup');
  }
}
