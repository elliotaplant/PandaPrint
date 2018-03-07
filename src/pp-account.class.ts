import { Order, Address, BillingInfo } from './types'
/**
  Class to represent pandaprint accounts in memory
 */

export default class PpAccount {
  firstName?: string;
  lastName?: string;
  email?: string;
  address?: Address;
  phone: string;
  currentOrder: Order;
  previousOrders: Order[];
  billingInfo?: BillingInfo;

  constructor(phone: string) {
    this.phone = phone;
    this.currentOrder = new Order();
    this.previousOrders = [];
  }

  get isFullAccount(): boolean {
    return !!(this.firstName && this.lastName && this.email && this.address && this.billingInfo)
  }

  // This needs some work
  static fromSignupForm(signupInfo: any): PpAccount { // signupInfo should be an interface
    const newAccount = new PpAccount(signupInfo.phone);
    newAccount.firstName = signupInfo.firstName;
    newAccount.lastName = signupInfo.lastName;
    newAccount.email = signupInfo.email;
    newAccount.address = signupInfo.address;
    newAccount.billingInfo = signupInfo.billingInfo;
    return newAccount;
  }
}
