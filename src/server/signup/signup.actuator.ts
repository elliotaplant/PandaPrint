import { BillingActuator, StripeClient } from '../billing';
import { DbClient, IEntryPpAccount, IPpAccount } from '../db';
import { ErrorActuator, ErrorCode } from '../error';
import { MessageActuator, TwilioClient } from '../messages';
import { ISignupAccountRequest, ISignupMessageSend, ISignupWithStripeId } from './types';
/**
 * Actuator for signups from the front end
 */
export class SignupActuator {
  constructor(private dbClient: DbClient, private stripeClient: StripeClient, private twilioClient: TwilioClient) { }

  // This can be better
  public handleSignup(signupAccountReq: ISignupAccountRequest) {
    // Check if customer already exists
    return this.dbClient.loadAccountByPhone(this.sanitizePhone(signupAccountReq.phone))
      .then((foundAccount) => {
        // If the found account isn't full, this is a duplicate signup
        if (foundAccount && foundAccount.email && foundAccount.stripeCustId) {
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
      .then((entryPpAcctReq) => this.dbClient.createOrUpdateAccount(entryPpAcctReq))
      // Send the welcome message to new user
      .then((createdAccount) => this.sendWelcomeMessage(createdAccount));
  }

  // private methods
  private sendWelcomeMessage(account: IPpAccount) {
    return this.twilioClient.sendMessageToPhone(this.signupWelcomeMessage(account), account.phone);
  }

  private signupWelcomeMessage(account: IPpAccount): string {
    return `Hi ${account.firstName}! Welcome to Panda Print. We'll save all of the photos you send us, and when you're ready to print them, just write us a message that says "Send it!" Orders cost ${BillingActuator.shippingPriceString()} to ship and each print costs just ${BillingActuator.photosPriceString()}. We won't charge your card until you ask us to print your photos. If you have any questions, please send an email to support@pandaprint.co or send a message to Elliot at (510) 917-5552`;
  }

  private accountReqSanitizePhone(signupWithStripeId: ISignupWithStripeId): ISignupWithStripeId {
    return { ...signupWithStripeId, phone: this.sanitizePhone(signupWithStripeId.phone) };
  }

  private sanitizePhone(phone: string): string {
    if (!phone) {
      throw new Error('Non-existant phone number');
    }

    const justDigits = phone.replace(/\D/g, '');
    if (justDigits.length < 10) {
      throw new Error('Recieved phone with fewer than 10 digits');
    } else if (justDigits.length === 10) {
      return '+1' + phone;
    } else if (justDigits.length === 11 && justDigits.startsWith('1')) {
      return '+' + justDigits;
    }

    throw new Error('Improperly formatted phone signup');
  }
}
