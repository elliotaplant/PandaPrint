// Types for signup
export interface ISignupAccountRequest {
  firstName: string;
  lastName: string;
  email: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  stripeToken: string;
  phone: string;
}

export interface ISignupWithStripeId extends ISignupAccountRequest {
  stripeCustId: string;
}
