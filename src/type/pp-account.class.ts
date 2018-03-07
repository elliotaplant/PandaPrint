import { Order, Address } from '../type'
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
    newAccount.address = signupInfo.address;
    newAccount.stripeCustId = signupInfo.stripeCustId;
    return newAccount;
  }
}
