import { expect } from 'chai';
import * as sinon from 'sinon';
import { BillingActuator } from '../billing';
import { MockBillingActuator } from '../billing/index.spec';
import { Order, PpAccount } from '../db';
import { MockDbClient } from '../db/index.spec';
import { PwintyClient } from '../printing';
import { MessageActuator } from './message.actuator';
import { MockTwilioClient } from './mock.twilio.client.spec';
import { TwilioBody } from './types';

// Spec file for BillingActuator
describe('Message Actuator', () => {
  let textOnlyMessage: TwilioBody;

  let messageActuator: MessageActuator;
  let mockBillingActuator: MockBillingActuator;
  let mockDbClient: MockDbClient;
  let pwintyClient: PwintyClient;

  beforeEach(() => {
    mockDbClient = new MockDbClient();
    pwintyClient = new PwintyClient('merchantId', 'apiKey');
    mockBillingActuator = new MockBillingActuator();
    messageActuator = new MessageActuator(mockDbClient, pwintyClient, mockBillingActuator);

    textOnlyMessage = MockTwilioClient.justTextExampleBody();
  });

  describe('Handling messages', () => {
    describe('Partially Known Accounts', () => {

      beforeEach((done) => {
        mockDbClient.createAccountFromPhone(textOnlyMessage.From)
          .then(() => done())
          .catch(done);
      });

      it('should be confused about text only messages', (done) => {
        messageActuator.handleMessage(textOnlyMessage)
          .then((confusedResponse) => {
            expect(confusedResponse).to.equal(messageActuator.unknownMessageResponse());
            done();
          })
          .catch(done);
      });
    });

    describe('Unknown Account', () => {
      it('should invite user to try for text only message', (done) => {
        messageActuator.handleMessage(textOnlyMessage)
          .then((inviteResponse) => {
            expect(inviteResponse).to.equal(messageActuator.welcomeNoPictures);
            done();
          })
          .catch(done);
      });

      it('should invite user and notify save for image only message', (done) => {
        const imagesOnlyMessage = MockTwilioClient.multiImageNoTextExampleBody();
        messageActuator.handleMessage(imagesOnlyMessage)
          .then((inviteResponse) => {
            expect(inviteResponse).to.contain(`We'll save them`);
          })
          .then(() => mockDbClient.loadAccountByPhone(imagesOnlyMessage.From))
          .then((loadedAccount) => {
            expect(loadedAccount.phone).to.equal(imagesOnlyMessage.From);
            expect(loadedAccount.currentOrder.pictureUrls)
              .to.contain(imagesOnlyMessage.MediaUrl0)
              .and.contain(imagesOnlyMessage.MediaUrl1)
              .and.to.have.length(2);
          })
          .then(() => done())
          .catch(done);
      });

      it('should invite user and notify save for image and text message', (done) => {
        const imagesOnlyMessage = MockTwilioClient.singleImagewithTextExampleBody();
        messageActuator.handleMessage(imagesOnlyMessage)
          .then((inviteResponse) => {
            expect(inviteResponse).to.contain(`We'll save it`);
          })
          .then(() => mockDbClient.loadAccountByPhone(imagesOnlyMessage.From))
          .then((loadedAccount) => {
            expect(loadedAccount.phone).to.equal(imagesOnlyMessage.From);
            expect(loadedAccount.currentOrder.pictureUrls)
              .to.contain(imagesOnlyMessage.MediaUrl0)
              .and.to.have.length(1);
          })
          .then(() => done())
          .catch(done);
      });
    });
  });
});
