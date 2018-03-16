import { IEntryPpAccount, IOrder } from '../db';
import { Utils } from '../utils';
import { StripeClient } from './stripe.client';
/**
 * Actuator for billing
 */

export class BillingActuator {
  public static readonly shippingPrice = 3.49; // USD price of shipping
  public static readonly pricePerPhoto = 0.49; // USD price per photo

  // Get the shipping prices as a formatted string with $
  public static shippingPriceString() {
    return `$${BillingActuator.shippingPrice.toFixed(2)}`;
  }
  public static photosPriceString() {
    return `$${BillingActuator.pricePerPhoto.toFixed(2)}`;
  }

  constructor(private stripeClient: StripeClient) { }

  public calculatePriceForOrder(order: IOrder): number {
    if (order.pictureUrls.length === 0) {
      return 0;
    }
    return BillingActuator.shippingPrice + order.pictureUrls.length * BillingActuator.pricePerPhoto;
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
