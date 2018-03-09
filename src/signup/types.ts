// Types for signup
export interface SignupAccountRequest {
  firstName: string;
  lastName: string;
  email: string;
  street1: string;
  street2: string;
  city: string;
  state: string;
  zip: string;
  stripeToken: string;
  phone: string;
}
