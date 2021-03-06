import * as _ from 'lodash';
import { BillingActuator } from '../billing';
import { DbClient, IPpAccount } from '../db';
import { PwintyClient } from '../printing';
import { Utils } from '../utils';
import { PpTwilioBody } from './pp-twilio-body.class';
import { ITwilioBody } from './types';

/**
 * Actuator for recieved messages
 */

export class MessageActuator {
  public readonly errorApology = 'Oh no! Something went wrong on our end. In the meantime, you can reach out to Elliot at (510) 917-5552 if you have any questions';

  public readonly unknownAddressMessage = `Unfortunately we can't send your order until we have your address. Could you go to www.PandaPrint.co to sign up? Thanks!`;

  constructor(private dbClient: DbClient, private pwintyClient: PwintyClient,
    private billingActuator: BillingActuator) { }

  // Handle an incoming message and return the response to send to the user
  public handleMessage(twilioBody: ITwilioBody): Promise<string> {
    // convert twilioBody into something usable
    const ppTwilioBody = new PpTwilioBody(twilioBody);

    // Pull up user account from database
    return this.dbClient.loadAccountByPhone(ppTwilioBody.phone)
      .then((account) => {
        if (account && account.email && account.stripeCustId) {
          return this.handleMsgForExistingAccount(ppTwilioBody, account);
        } else {
          return this.handleMsgForNonExistantAccount(ppTwilioBody, ppTwilioBody.phone);
        }
      })
      // If there was an uncaught error, send the user an apology
      .catch((error) => {
        console.error('Error handling message at ' + new Date().toString());
        console.error(error);
        return this.errorApology;
      });
  }

  public handlePicturesOnlyMessage(twilioBody: PpTwilioBody, account: IPpAccount): string {
    const numPicsInOrder = account.currentOrder.pictureUrls.length;
    const currentOrderCost = this.billingActuator.calculatePriceForOrder(account.currentOrder);

    return `We saved your picture${Utils.sIfPlural(twilioBody.mediaUrls.length)}! Your order now has ${numPicsInOrder} picture${Utils.sIfPlural(numPicsInOrder)}, which will cost ${Utils.toUsd(currentOrderCost)} to print. If you want us to print them, just write "Send it!" and we'll send your order.`;
  }

  public handlePricingMessage(account: IPpAccount) {
    const preamble = `Our prints costs $0.49 per photo and $3.49 for shipping.`;
    const numPicsInOrder = account.currentOrder.pictureUrls.length;
    const currentOrderCost = this.billingActuator.calculatePriceForOrder(account.currentOrder);
    const currentOrder = `You have ${numPicsInOrder || 'no'} picture${Utils.sIfPlural(numPicsInOrder)} in your order, which will cost $${currentOrderCost} to print.`;

    return `${preamble} ${currentOrder}`;
  }

  public unknownMessageResponse() {
    return `Sorry, I'm a robot and I can't understand everything right now. If you want to print your order, write "Send it!" If you want to know our prices and the price of your order, write "Pricing". For anything else, send an email to support@pandaprint.co or write a message to Elliot at (510) 917-5552 and he'll get back to you as soon as possible.`;
  }

  public savedAndSendingMessage(twilioBody: PpTwilioBody, account: IPpAccount): string {
    const orderPrice = this.billingActuator.calculatePriceForOrder(account.currentOrder);
    const orderSize = account.currentOrder.pictureUrls.length;

    return `Thanks ${account.firstName}! We saved your new picture${Utils.sIfPlural(twilioBody.mediaUrls.length)}. We'll print the ${orderSize} photos in your order, send it to ${account.address.address1}, and charge your card ${orderPrice}`;
  }

  public sendingMessage(account: IPpAccount): string {
    const orderPrice = this.billingActuator.calculatePriceForOrder(account.currentOrder);
    const orderSize = account.currentOrder.pictureUrls.length;

    return `Thanks ${account.firstName}! We'll print the ${orderSize} photos in your order, send it to ${account.address.address1}, and charge your card ${orderPrice}`;
  }

  public savedAndUnknownAddressMessage(twilioBody: PpTwilioBody): string {
    return `We saved the new picture${Utils.sIfPlural(twilioBody.mediaUrls.length)}, but we can't send your order until we have your address to send it to. Could you go to www.PandaPrint.co to sign up? Thanks!`;
  }

  public welcomeWithPicturesMessage(twilioBody: PpTwilioBody): string {
    const optionalS = Utils.sIfPlural(twilioBody.mediaUrls.length);
    const itThem = twilioBody.mediaUrls.length === 1 ? 'it' : 'them';
    const preamble = `Thanks for sending your picture${optionalS} to Panda Print! We'll save ${itThem} until you're ready to print.`;
    const postamble = this.noAccountPostAmble(twilioBody);
    return `${preamble} ${postamble}`;
  }

  public welcomeNoPicturesMessage(twilioBody: PpTwilioBody): string {
    const postamble = this.noAccountPostAmble(twilioBody);
    const preamble = `You've reached Panda Print! If you send us pictures, we'll print them out and mail them to you.`;
    return `${preamble} ${postamble}`;
  }

  // private methods
  private handleMsgForExistingAccount(twilioBody: PpTwilioBody, account: IPpAccount): Promise<string> {
    // First, save any pictures to the user's current order
    return this.dbClient.addPhotosToUsersCurrentOrder(twilioBody.mediaUrls, account.phone)
      .then((accountWithPhotos) => {
        // Handle the message as depending on the text content (or lack thereof)
        if (twilioBody.isPricingMessage) {
          // Note that pricing comes before send messages, just in case the user does both but is confused about price
          return this.handlePricingMessage(accountWithPhotos);
        } else if (twilioBody.isSendMessage) {
          return this.handleSendMessage(twilioBody, accountWithPhotos);
        } else if (twilioBody.isPictureOnlyMessage) {
          return this.handlePicturesOnlyMessage(twilioBody, accountWithPhotos);
        } else {
          return this.unknownMessageResponse();
        }
      });
  }

  private handleMsgForNonExistantAccount(twilioBody: PpTwilioBody, phone: string): Promise<string> {
    // Create account with phone number
    return this.dbClient.createAccountFromPhone(phone)
      // Save any pictures to newly created account
      .then((createdAccount) => this.dbClient.addPhotosToUsersCurrentOrder(twilioBody.mediaUrls, createdAccount.phone))
      // If has pictures message
      .then(() => {
        if (twilioBody.hasPictures) {
          return this.welcomeWithPicturesMessage(twilioBody);
        } else {
          return this.welcomeNoPicturesMessage(twilioBody);
        }
      });
  }

  private handleSendMessage(twilioBody: PpTwilioBody, account: IPpAccount): Promise<string> {
    if (this.isFullAccount(account)) {
      // Use pwinty client to create and send order
      this.pwintyClient.sendOrderToPwinty(account.currentOrder, account.address,
        `${account.firstName} ${account.lastName}`)
        // Use billing client to charge user
        .then(() => this.billingActuator.chargeCustomerForOrder(account, account.currentOrder))
        .then(() => {
          // Respond with promise of string
          if (twilioBody.hasPictures) {
            return Promise.resolve(this.savedAndSendingMessage(twilioBody, account));
          } else {
            return Promise.resolve(this.sendingMessage(account));
          }
        })
        .catch((error) => 'Hmm, something went wrong when we tried to send your order. We\'ll look into it and get back to you. If you have any questions, reach out to Elliot at (510) 917-5552');
    } else {
      if (twilioBody.hasPictures) {
        return Promise.resolve(this.savedAndUnknownAddressMessage(twilioBody));
      } else {
        return Promise.resolve(this.unknownAddressMessage);
      }
    }
  }

  private noAccountPostAmble(twilioBody: PpTwilioBody) {
    return `When you have a chance, head over to www.pandaprint.co/#${twilioBody.phone} to easily add your info, then write us a message that includes "Send it" and your pictures will be printed and on their way!`;
  }

  private isFullAccount(account: IPpAccount) {
    return !!(account.phone &&
      account.address &&
      account.stripeCustId &&
      account.email &&
      account.firstName &&
      account.lastName);
  }
}
