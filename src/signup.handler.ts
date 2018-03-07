import DbClient from './db.client';
import MessageHandler from './message.handler';
import PpAccount from './pp-account.class';
import { SignupAccountRequest } from './types';
/**
  Handler for signups from the front end
 */

export default class SignupHandler {
  constructor(private dbClient: DbClient) { }

  // This can be better
  public handleSignup(signupAccountReq: SignupAccountRequest): Promise<string> {
    // stripeClient.createCustomer(signupAccountReq.email, signupAccountReq.stripeToken)
    //  .then(customer => PpAccount.fromSignupFormRequest(signupAccountReq, customer.id))
    //  .then(newPpAccount => dbClient.createAccount(newPpAccount))
    return this.dbClient.createAccount(PpAccount.fromSignupFormRequest(signupAccountReq))
      .then(createdAccount => this.signupWelcomeMessage(createdAccount));
  }

  // private methods
  private signupWelcomeMessage(account: PpAccount): string {
    return `Welcome to Panda Print ${account.firstName}! Try sending us a picture to print.`
  }
}
