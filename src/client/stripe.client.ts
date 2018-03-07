/**
  Client for interacting with the Stripe API
 */


export class StripeClient {
  public chargeCustomer(customerId: string, amount: number) {
    return Promise.resolve(true);
  }
}
