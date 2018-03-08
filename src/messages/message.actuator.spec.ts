import { expect } from 'chai';
import * as sinon from 'sinon';
import { BillingActuator } from '../billing';
import { MockBillingActuator } from '../billing/index.spec';
import { MessageActuator } from './message.actuator';
import { DbClient, Order, PpAccount } from '../db';
import { PwintyClient } from '../printing';

// Spec file for BillingActuator
describe('Message Actuator', () => {
  let messageActuator: MessageActuator;
  let mockBillingActuator: MockBillingActuator;
  let dbClient: DbClient;
  let pwintyClient: PwintyClient;

  beforeEach(() => {
    dbClient = new DbClient();
    pwintyClient = new PwintyClient('merchantId', 'apiKey');
    mockBillingActuator = new MockBillingActuator();
    messageActuator = new MessageActuator(dbClient, pwintyClient, mockBillingActuator);
  });

  describe('Price Calculation', () => {
    it('should calculate price of order accurately', () => {
      const fourPicOrder = new Order();
      fourPicOrder.pictureUrls.push(...['pic1', 'pic2', 'pic3', 'pic4']);

      const calculatedPrice = mockBillingActuator.calculatePriceForOrder(fourPicOrder);
      // hard code in price calculation. Shouls this test be less brittle?
      expect(calculatedPrice).to.equal(3.49 + 4 * 0.49);
    });
  });
});
