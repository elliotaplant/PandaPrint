import { DbClient, EntryPpAccount, PpAccount } from '../db';
import { MessageActuator } from '../messages';
import { StripeClient } from '../billing';
import { SignupWithStripeId, SignupAccountRequest } from './types';
import { ErrorActuator } from '../error';
/**
  Actuator for signups from the front end
 */

export class SignupActuator {
  constructor(private dbClient: DbClient, private stripeClient: StripeClient) { }

  // This can be better
  public handleSignup(signupAccountReq: SignupAccountRequest): Promise<string> {
    // First register the customer with a stripe account
    return this.stripeClient.createCustomer(signupAccountReq.email, signupAccountReq.stripeToken)
     // Attach the stripe customer id to the request
     .then(customer => ({ ...signupAccountReq, stripeCustId: customer.id }))
     // Sanitize the phone number in the request
     .then(signupReqWithStripe => this.accountReqSanitizePhone(signupReqWithStripe))
     // Convert the signup form into the format used in DB
     .then(signupReq => this.signupRequestToEntryPpAccount(signupReq))
     // Create the account in the DB
     .then(entryPpAcctReq => this.dbClient.createAccount(entryPpAcctReq))
     // Return the welcome message to send to user
     .then(createdAccount => this.signupWelcomeMessage(createdAccount))
     // Handle failures and notify user if possible
     .catch(error => {
       ErrorActuator.handleError(error, 'Failed to sign up user');
       return `Sorry, but something went wrong when we tried to sign you up. We'll try to fix it on our end and let you know when we resolve it.`;
     });
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
        address1: signupAccountReq.address1,
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
    if (!phone) {
      throw new Error('Non-existant phone number');
    }

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
