import { expect } from 'chai';
import * as sinon from 'sinon';
import { BillingActuator } from '../billing';
import { MockBillingActuator } from '../billing/index.spec';
import { MessageActuator } from './message.actuator';
import { TwilioBody } from './types';
import { DbClient, Order, PpAccount } from '../db';
import { PwintyClient } from '../printing';
import { MockTwilioClient } from './mock.twilio.client.spec';

// Spec file for BillingActuator
describe('Message Actuator', () => {
  let textOnlyMessage: TwilioBody;

  let messageActuator: MessageActuator;
  let mockBillingActuator: MockBillingActuator;
  let dbClient: DbClient;
  let pwintyClient: PwintyClient;

  beforeEach(() => {
    dbClient = new DbClient();
    pwintyClient = new PwintyClient('merchantId', 'apiKey');
    mockBillingActuator = new MockBillingActuator();
    messageActuator = new MessageActuator(dbClient, pwintyClient, mockBillingActuator);

    textOnlyMessage = MockTwilioClient.justTextExampleBody();
  });

  describe('Handling messages', () => {
    describe('Partially Known Accounts', () => {

      beforeEach((done) => {
        dbClient.createAccountFromPhone(textOnlyMessage.From)
          .then(() => done())
          .catch(done);
      });

      it('should be confused about text only messages', (done) => {
        messageActuator.handleMessage(textOnlyMessage)
          .then(confusedResponse => {
            expect(confusedResponse).to.equal(messageActuator.unknownMessageResponse())
            done();
          })
          .catch(done);
      });
    });

    describe('Unknown Account', () => {

      it('should invite user to try for text only message', (done) => {
        messageActuator.handleMessage(textOnlyMessage)
          .then(inviteResponse => {
            expect(inviteResponse).to.equal(messageActuator.welcomeNoPictures)
            done();
          })
          .catch(done);
      });
    });
  });
});
