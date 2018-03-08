import { Order, PpAccount } from '../type';
/**
  Actuator for billing
 */

 export class BillingActuator {
   private shippingPrice = 3.49; // USD price of shipping
   private pricePerPhoto = 0.49; // USD price per photo

   public calculatePriceForOrder(order: Order): number {
     return this.shippingPrice + order.pictureUrls.length * this.pricePerPhoto;
   }

   public chargeCustomerForOrder(order: Order) {
     // return stripeClient.chargeCustomer(account.stripeCustId, this.calculatePriceForOrder(order));
     return Promise.resolve(true);
   }
 }