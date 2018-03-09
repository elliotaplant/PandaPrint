import * as _ from 'lodash';
import { TwilioBody } from './types';
import { Utils } from '../utils';

/**
  Class to make interacting with twilio messages easier
  */
export class PpTwilioBody {
  text: string;
  mediaUrls: string[];
  phone: string;

  constructor(twilioBody: TwilioBody) {
    this.text = twilioBody.Body;
    this.mediaUrls = this.getMediaUrlsFromTwilioBody(twilioBody);
    this.phone = twilioBody.From;
  }

  get hasText(): boolean {
    return !!this.text;
  }

  get hasPictures(): boolean {
    return Utils.safeGet(() => !!this.mediaUrls.length, false);
  }

  get isPricingMessage(): boolean {
    return this.hasText && this.text.toLowerCase().includes('pric') || this.text.toLowerCase().includes('cost');
  }

  get isSendMessage(): boolean {
    return this.hasText && this.text.toLowerCase().includes('send');
  }

  get isPictureOnlyMessage(): boolean {
    return !this.hasText && this.hasPictures;
  }

  private getMediaUrlsFromTwilioBody(twilioBody: TwilioBody): string[] {
    const mediaUrls: string[] = [];
    for (const anyKey in twilioBody) {
      if (anyKey.startsWith('MediaUrl')) {
        mediaUrls.push(Utils.safeGet(() => (<any>twilioBody)[anyKey], null));
      }
    }

    return _.filter(mediaUrls); // filter out null, empty, or undefined media urls
  }
}
