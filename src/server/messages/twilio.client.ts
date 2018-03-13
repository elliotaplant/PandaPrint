import * as twilio from 'twilio';
import { Utils } from '../utils';

/**
  A client to interact with the twilio API
*/

export class TwilioClient {
  private twilio: any;

  public init() {
    const accountSid = Utils.getKey('TWILIO_ACCOUNT_SID');
    const authToken = Utils.getKey('TWILIO_AUTH_TOKEN');
    this.twilio = new twilio.RestClient(accountSid, authToken);
  }

  public sendMessageToNumber(message: string, number: string) {
    // TODO: this
  }
}
