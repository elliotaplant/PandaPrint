/**
  Client for interacting with the Stripe API
 */

export class StripeClient {
  public chargeCustomer(customerId: string, amount: number) {
    return Promise.resolve(true);
  }

  public createCustomer(email: string, stripeToken: string): Promise<{ id: string }> { // : StripeCustomer
    return Promise.resolve(email + stripeToken) // silly way of making customer id
      .then(id => ({ id }));
  }
}
