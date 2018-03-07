import utils from './utils';
import * as _ from 'lodash';

/**
  Handler for recieved messages
 */

export interface TwilioBody {
  Body: string;
  MediaUrl0: string;
  MediaUrl1: string;
  MediaUrl2: string;
  MediaUrl3: string;
  MediaUrl4: string;
  MediaUrl5: string;
  MediaUrl6: string;
  MediaUrl7: string;
  MediaUrl8: string;
  MediaUrl9: string;
}

export interface PpTwilioBody {
  text: string;
  mediaUrls: string[];
}

export class MessageHandler {
  public handleMessage(twilioBody: TwilioBody) {
    // Convert twilioBody into usable format
    const ppTwilioBody = this.convertTwilioBodyToPpTwilioBody(twilioBody);

    const imageResponse = this.handleImages(ppTwilioBody.mediaUrls);
  }


  // private methods
  private handleImages(imageUrls: string[]): string | null {
    return 'images handled';
  }

  private handleText(twilioBody: TwilioBody): string | null {
    return 'text handled';
  }

  private convertTwilioBodyToPpTwilioBody(twilioBody: TwilioBody): PpTwilioBody {
    return {
      text: twilioBody.Body,
      mediaUrls: this.getMediaUrlsFromTwilioBody(twilioBody)
    }
  }

  private getMediaUrlsFromTwilioBody(twilioBody: TwilioBody): string[] {
    const mediaUrls: string[] = [];
    for (const anyKey in twilioBody) {
      if (anyKey.startsWith('MediaUrl')) {
        mediaUrls.push(utils.safeGet(() => (<any>twilioBody)[anyKey], null));
      }
    }

    return _.filter(mediaUrls); // filter out null, empty, or undefined media urls
  }
}
