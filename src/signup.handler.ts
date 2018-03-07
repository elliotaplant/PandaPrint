import DbClient from './db.client';
import PpAccount from './pp-account.class';
/**
  Handler for signups from the front end
 */

export default class SignupHandler {
  constructor(private dbClient: DbClient) { }

  // This can be better
  public handleSignup(newAccountInfo: PpAccount): Promise<PpAccount> {
    return this.dbClient.createAccount(newAccountInfo);
  }
}
