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
    // Don't actually send messages in dev mode
    if (Utils.isDevEnv()) {
      return Promise.resolve({});
    }

    return new Promise((resolve, reject) => {
      this.twilio.messages
        .create({
          body: message,
          from: Utils.twilioPhoneNum(),
          to: phone,
        })
        .then(resolve)
        .catch(reject);
    });
  }
}
