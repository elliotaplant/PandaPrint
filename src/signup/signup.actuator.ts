import { DbClient, EntryPpAccount, PpAccount } from '../db';
import { MessageActuator } from '../messages';
import { SignupAccountRequest } from './types';
/**
  Actuator for signups from the front end
 */

export class SignupActuator {
  constructor(private dbClient: DbClient) { }

  // This can be better
  public handleSignup(signupAccountReq: SignupAccountRequest): Promise<string> {
    // stripeClient.createCustomer(signupAccountReq.email, signupAccountReq.stripeToken)
    //  .then(customer => PpAccount.fromSignupFormRequest(signupAccountReq, customer.id))
    //  .then(newPpAccount => dbClient.createAccount(newPpAccount))
    return this.dbClient.createAccount(this.signupAccountRequestToEntryPpAccount(signupAccountReq))
      .then(createdAccount => this.signupWelcomeMessage(createdAccount));
  }

  // private methods
  private signupWelcomeMessage(account: PpAccount): string {
    return `Welcome to Panda Print ${account.firstName}! Try sending us a picture to print.`
  }

  private signupAccountRequestToEntryPpAccount(signupAccountReq: SignupAccountRequest): EntryPpAccount {
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
