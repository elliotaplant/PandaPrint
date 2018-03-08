import { Order, Address } from './types'
/**
  Class to represent pandaprint accounts in memory
 */

export class PpAccount {
  firstName?: string;
  lastName?: string;
  email?: string;
  address?: Address;
  phone: string;
  currentOrder: Order;
  previousOrders: Order[];
  stripeCustId?: string;

  constructor() {
    this.currentOrder = new Order();
    this.previousOrders = [];
  }

  get isFullAccount(): boolean {
    return !!(this.firstName && this.lastName && this.email && this.address && this.stripeCustId)
  }

  static fromPhone(phone: string): PpAccount {
    const newAccount = new PpAccount();
    newAccount.phone = phone;
    return newAccount;
  }

  // This needs some work
  static fromSignupFormRequest(signupInfo: any): PpAccount { // signupInfo should be an interface
    const newAccount = new PpAccount();
    newAccount.phone = signupInfo.phone;
    newAccount.firstName = signupInfo.firstName;
    newAccount.lastName = signupInfo.lastName;
    newAccount.email = signupInfo.email;
    newAccount.address = {
      street1: signupInfo.street1,
      street2: signupInfo.street2 || null,
      city: signupInfo.city,
      state: signupInfo.state,
      zip: signupInfo.zip,
    };
    newAccount.stripeCustId = signupInfo.stripeCustId;
    return newAccount;
  }
}
