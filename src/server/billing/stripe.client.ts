import * as Stripe from 'stripe';
const stripeKeys = require('../../../keys.json').stripe;

/**
  Client for interacting with the Stripe API
 */

export class StripeClient {
  private stripe: Stripe;

  public init() {
    this.stripe = new Stripe(stripeKeys.secretKey);
  }

  public chargeCustomer(stripeCustomerId: string, amount: number): Promise<Stripe.charges.ICharge> {
    return this.stripe.charges.create({
      amount,
      currency: 'usd',
      customer: stripeCustomerId
    });
  }

  public createCustomer(email: string, stripeToken: string): Promise<Stripe.customers.ICustomer> {
    return this.stripe.customers.create({ email, source: stripeToken })
  }
}
