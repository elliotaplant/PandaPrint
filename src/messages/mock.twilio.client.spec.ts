import { TwilioClient } from './twilio.client';
import { TwilioBody } from './types';

/**
  A client to interact with the twilio API
*/

export class MockTwilioClient extends TwilioClient {

  constructor() {
    super(null, null);
  }

  // Overrides client init with no-op
  public init() { }


  public sendMessageToNumber(message: string, number: string) {
    throw new Error('Attempting to send message with mock twilio client');
  }

  static justTextExampleBody(): TwilioBody {
    return {
      "ToCountry": "US",
      "ToState": "CA",
      "SmsMessageSid": "SM54fa6226fc3bf1206f2232ca979b8552",
      "NumMedia": "0",
      "ToCity": "SAN RAFAEL",
      "FromZip": "94560",
      "SmsSid": "SM54fa6226fc3bf1206f2232ca979b8552",
      "FromState": "CA",
      "SmsStatus": "received",
      "FromCity": "OAKLAND",
      "Body": "Just the text",
      "FromCountry": "US",
      "To": "+14155793449",
      "ToZip": "94901",
      "NumSegments": "1",
      "MessageSid": "SM54fa6226fc3bf1206f2232ca979b8552",
      "AccountSid": "ACdb81644e6634d5a58f31e01809638331",
      "From": "+15109175552",
      "ApiVersion": "2010-04-01"
    };
  }

  static multiImageNoTextExampleBody(): TwilioBody {
    return {
      "MediaContentType1": "image/jpeg",
      "ToCountry": "US",
      "MediaContentType0": "image/jpeg",
      "ToState": "CA",
      "SmsMessageSid": "MM2424e22d97296f114fd765385bad284d",
      "NumMedia": "2",
      "ToCity": "SAN RAFAEL",
      "FromZip": "94560",
      "SmsSid": "MM2424e22d97296f114fd765385bad284d",
      "FromState": "CA",
      "SmsStatus": "received",
      "FromCity": "OAKLAND",
      "Body": "",
      "FromCountry": "US",
      "To": "+14155793449",
      "MediaUrl1": "https://api.twilio.com/2010-04-01/Accounts/ACdb81644e6634d5a58f31e01809638331/Messages/MM2424e22d97296f114fd765385bad284d/Media/ME687ccbf53346bee61027ede507821b1d",
      "ToZip": "94901",
      "NumSegments": "2",
      "MessageSid": "MM2424e22d97296f114fd765385bad284d",
      "AccountSid": "ACdb81644e6634d5a58f31e01809638331",
      "From": "+15109175552",
      "MediaUrl0": "https://api.twilio.com/2010-04-01/Accounts/ACdb81644e6634d5a58f31e01809638331/Messages/MM2424e22d97296f114fd765385bad284d/Media/ME3e732606cfc242d04fc4ef7222bf85b5",
      "ApiVersion": "2010-04-01"
    };
  }

  static singleImagewithTextExampleBody(): TwilioBody {
    return {
      "ToCountry": "US",
      "MediaContentType0": "image/jpeg",
      "ToState": "CA",
      "SmsMessageSid": "MMddf764cf3645271927a4ebe20e593fa9",
      "NumMedia": "1",
      "ToCity": "SAN RAFAEL",
      "FromZip": "94560",
      "SmsSid": "MMddf764cf3645271927a4ebe20e593fa9",
      "FromState": "CA",
      "SmsStatus": "received",
      "FromCity": "OAKLAND",
      "Body": "Image and text!",
      "FromCountry": "US",
      "To": "+14155793449",
      "ToZip": "94901",
      "NumSegments": "1",
      "MessageSid": "MMddf764cf3645271927a4ebe20e593fa9",
      "AccountSid": "ACdb81644e6634d5a58f31e01809638331",
      "From": "+15109175552",
      "MediaUrl0": "https://api.twilio.com/2010-04-01/Accounts/ACdb81644e6634d5a58f31e01809638331/Messages/MMddf764cf3645271927a4ebe20e593fa9/Media/ME3729df3fee9331533785030593ef46c6",
      "ApiVersion": "2010-04-01"
    };
  }
}
