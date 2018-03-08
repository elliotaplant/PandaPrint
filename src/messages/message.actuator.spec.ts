import { expect } from 'chai';
import * as sinon from 'sinon';
import { BillingActuator } from '../billing';
import { MockBillingActuator } from '../billing/index.spec';
import { MessageActuator } from './message.actuator';
import { DbClient, Order, PpAccount } from '../db';
import { PwintyClient } from '../printing';

// Spec file for BillingActuator
describe('Message Actuator', () => {
  const examplePhone = '+12813308004';

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

  describe('Handling messages', () => {
    describe('Known Account', () => {

      beforeEach((done) => {
        dbClient.createAccountFromPhone(examplePhone)
          .then(() => done())
          .catch(done);
      });

      it('should be confused about text only messages', (done) => {
        messageActuator.handleMessage(examplePhone, { Body: 'Hi' })
          .then(confusedResponse => {
            expect(confusedResponse).to.equal(messageActuator.unknownMessageResponse())
            done();
          })
          .catch(done);
      });
    });
  });
});
