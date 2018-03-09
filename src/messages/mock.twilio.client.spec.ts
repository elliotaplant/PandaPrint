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
}
