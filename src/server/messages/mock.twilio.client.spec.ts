import { TwilioClient } from './twilio.client';
import { ITwilioBody } from './types';

/**
 * A client to interact with the twilio API
 */

export class MockTwilioClient extends TwilioClient {

  // Static methods
  public static justTextExampleBody(): ITwilioBody {
    return {
      AccountSid: 'ACACCOUNTIDACCOUNTIDACCOUNTID',
      ApiVersion: '2010-04-01',
      Body: 'Just the text',
      From: '+15109175552',
      FromCity: 'OAKLAND',
      FromCountry: 'US',
      FromState: 'CA',
      FromZip: '94560',
      MessageSid: 'SM5MESSAGEIDMESSAGEIDMESSAGEID',
      NumMedia: '0',
      NumSegments: '1',
      SmsMessageSid: 'SM5MESSAGEIDMESSAGEIDMESSAGEID',
      SmsSid: 'SM5FROMMESSAGIDMESSAGIDMESSAGID',
      SmsStatus: 'received',
      To: '+14155793449',
      ToCity: 'SAN RAFAEL',
      ToCountry: 'US',
      ToState: 'CA',
      ToZip: '94901',
    };
  }

  public static multiImageNoTextExampleBody(): ITwilioBody {
    return {
      AccountSid: 'ACACCOUNTIDACCOUNTIDACCOUNTID',
      ApiVersion: '2010-04-01',
      Body: '',
      From: '+15109175552',
      FromCity: 'OAKLAND',
      FromCountry: 'US',
      FromState: 'CA',
      FromZip: '94560',
      MediaContentType0: 'image/jpeg',
      MediaContentType1: 'image/jpeg',
      MediaUrl0: 'https://api.twilio.com/2010-04-01/Accounts/ACdb81644e6634d5a58f31e01809638331/Messages/MM2424e22d97296f114fd765385bad284d/Media/ME3e732606cfc242d04fc4ef7222bf85b5',
      MediaUrl1: 'https://api.twilio.com/2010-04-01/Accounts/ACdb81644e6634d5a58f31e01809638331/Messages/MM2424e22d97296f114fd765385bad284d/Media/ME687ccbf53346bee61027ede507821b1d',
      MessageSid: 'SM5MESSAGEIDMESSAGEIDMESSAGEID',
      NumMedia: '2',
      NumSegments: '2',
      SmsMessageSid: 'SM5MESSAGEIDMESSAGEIDMESSAGEID2',
      SmsSid: 'SM5FROMMESSAGIDMESSAGIDMESSAGID2',
      SmsStatus: 'received',
      To: '+14155793449',
      ToCity: 'SAN RAFAEL',
      ToCountry: 'US',
      ToState: 'CA',
      ToZip: '94901',
    };
  }

  public static singleImagewithTextExampleBody(): ITwilioBody {
    return {
      AccountSid: 'ACACCOUNTIDACCOUNTIDACCOUNTID',
      ApiVersion: '2010-04-01',
      Body: 'Image and text!',
      From: '+15109175552',
      FromCity: 'OAKLAND',
      FromCountry: 'US',
      FromState: 'CA',
      FromZip: '94560',
      MediaContentType0: 'image/jpeg',
      MediaUrl0: 'https://api.twilio.com/2010-04-01/Accounts/ACdb81644e6634d5a58f31e01809638331/Messages/MMddf764cf3645271927a4ebe20e593fa9/Media/ME3729df3fee9331533785030593ef46c6',
      MessageSid: 'SM5MESSAGEIDMESSAGEIDMESSAGEID',
      NumMedia: '1',
      NumSegments: '1',
      SmsMessageSid: 'SM5MESSAGEIDMESSAGEIDMESSAGEID',
      SmsSid: 'SM5FROMMESSAGIDMESSAGIDMESSAGID2',
      SmsStatus: 'received',
      To: '+14155793449',
      ToCity: 'SAN RAFAEL',
      ToCountry: 'US',
      ToState: 'CA',
      ToZip: '94901',
    };
  }

  // Overrides client init with no-op
  public init() { }

  public sendMessageToPhone(message: string, phone: string) {
    throw new Error('Attempting to send message with mock twilio client');
  }

}
