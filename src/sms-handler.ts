export const moo = 'mooooooooo';

export interface TwilioBody {
  Body: string;
  MediaUrl0: string;
  MediaUrl1: string;
  MediaUrl2: string;
  // ... how to handle this?
}
export class SmsHandler {
  public handleSms(twilioBody: TwilioBody) {

  }
}
