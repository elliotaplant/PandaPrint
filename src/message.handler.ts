import * as _ from 'lodash';
import DbClient from './db.client';
import utils from './utils';
import { PpAccount } from './types';

/**
  Handler for recieved messages
 */

interface TwilioBody {
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

class PpTwilioBody {
  constructor(public text: string, public mediaUrls: string[]) { }

  get hasText(): boolean {
    return !!this.text;
  }

  get hasPictures(): boolean {
    return utils.safeGet(() => !!this.mediaUrls.length, false);
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
}

export default class MessageHandler {
  private errorApology = 'Oh no! Something went wrong on our end. In the meantime, you can reach out to Elliot at (510) 917-5552 if you have any questions';

  constructor(private dbClient: DbClient) { }

  // Handle an incoming message and return the response to send to the user
  public handleMessage(phone: string, twilioBody: TwilioBody): Promise<string> {
    const ppTwilioBody = this.convertTwilioBodyToPpTwilioBody(twilioBody);

    // Pull up user account from database
    return this.dbClient.loadAccountByPhone(phone)
      .then(account => {
        if (account) {
          return this.handleMsgForExistingAccount(ppTwilioBody, account);
        } else {
          return this.handleMsgForNonExistantAccount(ppTwilioBody, phone)
        }
      })
      // If there was an uncaught error, send the user an apology
      .catch(error => {
        console.error('Error handling message at ' + new Date().toString());
        console.error(error);
        return this.errorApology;
      });

  }


  // private methods
  private handleMsgForExistingAccount(twilioBody: PpTwilioBody, account: PpAccount): Promise<string> {
    // Save any pictures to user's current order
    return this.dbClient.addPhotosToUsersCurrentOrder(twilioBody.mediaUrls, account.phone)
      .then(account => {
        if (twilioBody.isPricingMessage) {
          return this.handlePricingMessage(account);
        } else if (twilioBody.isSendMessage) {
          return this.handleSendMessage(twilioBody, account);
        } else if (twilioBody.isPictureOnlyMessage) {
          return this.handlePicturesOnlyMessage(twilioBody, account);
        } else {

        }
      });

    //    If message is a "send" message
    //      Handle send message
    //    If message is only a picture message
    //      handle picture only message
    //    If message is a non-send text message
    //      handle unknown text response
  }

  private handleMsgForNonExistantAccount(twilioBody: PpTwilioBody, phone: string): Promise<string> {
    //    Create account with phone number
    //    Save any pictures to user's current order
    //    If is text only message
    //      Send "welcome to panda print" message
    //    If has pictures message
    //      Send welcome and pictures saved message
  }

  private handleSendMessage(twilioBody: PpTwilioBody, account: PpAccount): Promise<string> {
    // Use pwinty client to create and send order
    // Use billing client to charge user
    // Respond with promise of string
    if (twilioBody.hasPictures) {
      return Promise.resolve(this.savedAndSendingMessage(account));
    }
    return Promise.resolve(this.sendingMessage(account));
  }

  private handlePicturesOnlyMessage(twilioBody: PpTwilioBody, account: PpAccount): string {
    // TODO: Add price
    return `We saved your picture${utils.sIfPlural(twilioBody.mediaUrls.length)}! Your order now has ${account.currentOrder.pictureUrls.length} pictures. If you want us to print them, just write "send it!" and we'll send your order.`
  }

  private handlePricingMessage(account: PpAccount) {
    // TODO: Add billing utils to determine order price
    const numPicsInOrder = account.currentOrder.pictureUrls.length;
    return `You have ${numPicsInOrder} picture${utils.sIfPlural(numPicsInOrder)} in your order, which would cost $5 to print.`
  }

  private handleImages(imageUrls: string[]): string | null {
    return 'images handled';
  }

  private handleText(twilioBody: TwilioBody): string | null {
    return 'text handled';
  }

  private convertTwilioBodyToPpTwilioBody(twilioBody: TwilioBody): PpTwilioBody {
    return new PpTwilioBody(twilioBody.Body, this.getMediaUrlsFromTwilioBody(twilioBody));
  }

  private savedAndSendingMessage(account: PpAccount): string {
    // TODO: Add price to response
    return `Thanks ${account.firstName}! We saved the new pictures. We'll print your order and send it to ${account.address.street1}.`
  }

  private sendingMessage(account: PpAccount): string {
    // TODO: Add price to response
    return `Thanks ${account.firstName}! We'll print your order and send it to ${account.address.street1}.`
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
