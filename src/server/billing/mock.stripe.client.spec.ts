// A mock stripe client for use in specs
import { StripeClient } from './stripe.client';

export class MockStripeClient extends StripeClient {

  public chargeCustomer() {
    return Promise.resolve(<any>{});
  }

  public createCustomer() {
    return Promise.resolve(<any>{});
  }
}
