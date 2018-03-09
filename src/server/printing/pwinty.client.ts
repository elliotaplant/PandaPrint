import { Order } from '../db';

// Must require pwinty since it doesn't have @types
const pwintyInit = require('pwinty');
/**
  A client to interact with the pwinty API
*/

export class PwintyClient {
  private pwinty: any;
  private currentOrder: any;

  constructor(private merchantId: string, private apiKey: string, private env: string = 'sandbox') { }

  public init() {
    this.pwinty = pwintyInit(this.merchantId, this.apiKey, `https://${this.env}.pwinty.com/v2.5/`);
  }

  public sendOrderToPwinty(order: Order) {
    return Promise.resolve(true);
  }

  public createPwintyOrderIfNecessary() {
    return new Promise((resolve, reject) => {
      if (this.currentOrder) {
        resolve(this.currentOrder);
      } else {
        this.pwinty.createOrder(this.defaultMailingAddress(), (err: any, order: any) => {
          if (err) {
            reject(err);
          } else {
            this.currentOrder = order;
            resolve(this.currentOrder);
          }
        });
      }
    });
  }

  public addPhotoToPwintyOrder(photoUrl: string) {
    if (!this.currentOrder) {
      throw new Error('No order exists to add photo');
    }
    const photo = Object.assign({ type: "4x6", url: photoUrl, copies: "1", sizing: "Crop" });

    return new Promise((resolve, reject) => {
      this.pwinty.addPhotoToOrder(this.currentOrder.id, photo, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(photo)
        }
      });
    });
  }

  public getPwintyOrderStatus(orderId: string) {
    return new Promise((resolve, reject) => {
      this.pwinty.getOrderStatus(orderId, (err: any, status: any) => {
        if (err || !status.isValid) {
          reject(err);
        } else {
          resolve(orderId);
        }
      })
    });
  }

  public updatePwintyOrderStatus(orderId: string) {
    return new Promise((resolve, reject) => {
      this.pwinty.updateOrderStatus({
        id: orderId,
        status: 'Submitted',
      }, (err: any, status: any) => {
        if (err) {
          reject(err);
        } else {
          this.currentOrder = null;
          resolve(status);
        }
      })
    });
  }

  // Private methods
  private defaultMailingAddress() {
    return {
      countryCode: 'US',
      qualityLevel: 'Standard',
      attributes: {
        finish: 'glossy',
      },
      recipientName: 'Amber Fearon',
      address1: '3705 Florida Ct. Unit E',
      addressTownOrCity: 'North Chicago',
      stateOrCounty: 'IL',
      postalOrZipCode: '60088'
    }
  }
}
