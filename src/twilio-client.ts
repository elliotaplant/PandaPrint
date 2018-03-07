import * as twilio from 'twilio';

/**
  A client to interact with the twilio API
*/

export default class TwilioClient {
  private twilio: any;
  private currentOrder: any;

  constructor(private accountSid: string, private authToken: string) { }

  public init() {
    this.twilio = new twilio.RestClient(this.accountSid, this.authToken);
  }

  public sendMessageToNumber(message: string, number: string) {

  }
}
