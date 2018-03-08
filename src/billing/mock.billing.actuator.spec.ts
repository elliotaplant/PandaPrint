// A mock billing actuator for use in specs
import { BillingActuator } from './billing.actuator';

export class MockBillingActuator extends BillingActuator {
  constructor() {
    super(null);
  }
}
