import { DbClient, EntryPpAccount, PpAccount } from '../db';
import { MessageActuator } from '../messages';
import { StripeClient } from '../billing';
import { SignupWithStripeId, SignupAccountRequest } from './types';
/**
  Actuator for signups from the front end
 */

export class SignupActuator {
  constructor(private dbClient: DbClient, private stripeClient: StripeClient) { }

  // This can be better
  public handleSignup(signupAccountReq: SignupAccountRequest): Promise<string> {
    return this.stripeClient.createCustomer(signupAccountReq.email, signupAccountReq.stripeToken)
     .then(customer => ({ ...signupAccountReq, stripeCustId: customer.id }))
     .then(signupReqWithStripe => this.accountReqSanitizePhone(signupReqWithStripe))
     .then(signupReq => this.signupRequestToEntryPpAccount(signupReq))
     .then(entryPpAcctReq => this.dbClient.createAccount(entryPpAcctReq))
     .then(createdAccount => this.signupWelcomeMessage(createdAccount));
     // .catch?
  }

  // private methods
  private signupWelcomeMessage(account: PpAccount): string {
    return `Welcome to Panda Print ${account.firstName}! Try sending us a picture to print.`
  }

  private signupRequestToEntryPpAccount(signupAccountReq: SignupAccountRequest): EntryPpAccount {
    return {
      firstName: signupAccountReq.firstName,
      lastName: signupAccountReq.lastName,
      email: signupAccountReq.email,
      address: {
        street1: signupAccountReq.street1,
        street2: signupAccountReq.street2,
        city: signupAccountReq.city,
        state: signupAccountReq.state,
        zip: signupAccountReq.zip,
      },
      stripeCustId: signupAccountReq.stripeToken, // this has gotta change
      phone: signupAccountReq.phone, // this needs sanitization
    }
  }

  private accountReqSanitizePhone(signupWithStripeId: SignupWithStripeId): SignupWithStripeId {
    return { ...signupWithStripeId, phone: this.sanitizePhone(signupWithStripeId.phone) };
  }

  private sanitizePhone(phone: string): string {
    const justDigits = phone.replace(/\D/g,'');
    if (phone.length > 10) {
      throw new Error('Recieved phone with less than 10 digits');
    }
    // Assume everyone is American
    else if (phone.length === 10) {
      return '+1' + phone;
    }

    else if (phone.length === 11 && phone.startsWith('1')) {
      return '+' + phone;
    }

    else if (phone.startsWith('+1')) {
      return phone;
    }

    throw new Error('Improperly formatted phone signup')
  }
}
