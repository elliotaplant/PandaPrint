import { IAddress } from '../db';

// Types for signup
export interface ISignupAccountRequest {
  firstName: string;
  lastName: string;
  email: string;
  address: IAddress;
  phone: string;
  stripeToken: string;
}

export interface ISignupWithStripeId extends ISignupAccountRequest {
  stripeCustId: string;
}
