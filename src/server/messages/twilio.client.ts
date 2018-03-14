import * as twilioInit from 'twilio';
import { RestClient } from 'twilio';
import { Utils } from '../utils';

/**
 * A client to interact with the twilio API
 */

export class TwilioClient {
  private twilio: RestClient;

  public init() {
    const accountSid = Utils.getKey('TWILIO_ACCOUNT_SID');
    const authToken = Utils.getKey('TWILIO_AUTH_TOKEN');
    this.twilio = twilioInit(accountSid, authToken);
  }

  public sendMessageToPhone(message: string, phone: string) {
    return new Promise((resolve, reject) => {
      this.twilio.messages
      .create({
        body: message,
        from: '+14155793449', // Put this in an env variable
        to: phone,
      })
      .then(resolve)
      .catch(reject);
    });
  }
}
