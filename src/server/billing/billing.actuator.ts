import { IEntryPpAccount, IOrder } from '../db';
import { StripeClient } from './stripe.client';
/**
 * Actuator for billing
 */

export class BillingActuator {
  private readonly shippingPrice = 3.49; // USD price of shipping
  private readonly pricePerPhoto = 0.49; // USD price per photo

  constructor(private stripeClient: StripeClient) { }

  public calculatePriceForOrder(order: IOrder): number {
    if (order.pictureUrls.length === 0) {
      return 0;
    }
    return this.shippingPrice + order.pictureUrls.length * this.pricePerPhoto;
  }

  public chargeCustomerForOrder(account: IEntryPpAccount, order: IOrder) {
    if (!account.stripeCustId) {
      throw new Error('Attempting to charge a customer without a Stripe Customer ID.');
    }
    if (order.pictureUrls.length === 0) {
      throw new Error('Attempting to charge a customer for an empty order.');
    }
    return this.stripeClient.chargeCustomer(account.stripeCustId, this.calculatePriceForOrder(order));
  }
}
