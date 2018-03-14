import * as twilioInit from 'twilio';
import { Utils } from '../utils';

/**
 * A client to interact with the twilio API
 */

export class TwilioClient {
  private twilio: any;

  public init() {
    const accountSid = Utils.getKey('TWILIO_ACCOUNT_SID');
    const authToken = Utils.getKey('TWILIO_AUTH_TOKEN');
    this.twilio = twilioInit(accountSid, authToken);
  }

  public sendMessageToPhone(message: string, phone: string) {
    // TODO: this
  }
}
