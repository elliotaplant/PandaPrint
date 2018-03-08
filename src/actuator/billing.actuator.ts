import { Order, PpAccount } from '../type';
import { StripeClient } from '../client';
/**
  Actuator for billing
 */

export class BillingActuator {
  private readonly shippingPrice = 3.49; // USD price of shipping
  private readonly pricePerPhoto = 0.49; // USD price per photo

  constructor(private stripeClient: StripeClient) { }

  public calculatePriceForOrder(order: Order): number {
    if (order.pictureUrls.length === 0) {
      return 0;
    }
    return this.shippingPrice + order.pictureUrls.length * this.pricePerPhoto;
  }

  public chargeCustomerForOrder(account: PpAccount, order: Order) {
    return this.stripeClient.chargeCustomer(account.stripeCustId, this.calculatePriceForOrder(order));
  }
}
