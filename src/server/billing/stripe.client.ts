import * as Stripe from 'stripe';
import { Utils } from '../utils';

/**
 * Client for interacting with the Stripe API
 */

export class StripeClient {
  private stripe: Stripe;

  public init() {
    this.stripe = new Stripe(Utils.getKey('STRIPE_SECRET_KEY'));
  }

  public createCustomer(email: string, stripeToken: string): Promise<Stripe.customers.ICustomer> {
    return this.stripe.customers.create({ email, source: stripeToken });
  }

  public chargeCustomer(stripeCustomerId: string, amount: number): Promise<Stripe.charges.ICharge> {
    return this.stripe.charges.create({
      amount,
      currency: 'usd',
      customer: stripeCustomerId,
    });
  }
}
