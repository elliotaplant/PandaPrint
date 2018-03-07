/**
  Client for interacting with the Stripe API
 */


export default class StripeClient {
  public chargeCustomer(customerId: string, amount: number) {
    return Promise.resolve(true);
  }
}
