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
      phone: signupAccountReq.phone,
    }
  }
}
