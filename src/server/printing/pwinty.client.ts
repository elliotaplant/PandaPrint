import { ErrorActuator } from '../error';
import { Order, OrderStatus, Address } from '../db';
import { PwintyOrder, PwintyPhotoOrder, PwintyPhoto, PwintyOrderStatus } from './types';

// Must require pwinty since it doesn't have @types
const pwintyInit = require('pwinty');
/**
  A client to interact with the pwinty API
*/

export class PwintyClient {
  private pwinty: any;

  constructor(private merchantId: string, private apiKey: string, private env: string = 'sandbox') { }

  public init() {
    this.pwinty = pwintyInit(this.merchantId, this.apiKey, `https://${this.env}.pwinty.com/v2.5/`);
  }

  public sendOrderToPwinty(order: Order, address: Address, name: string) {
    // First verify that the order is ready to print
    return new Promise((resolve, reject) => {
      // If order not paid for, throw error
      if (!order.paymentReceipt) {
        return reject('Attempting to print order that has not been paid for');
      }

      // If order has no photos, throw error
      if (!order.pictureUrls.length) {
        return reject('Attempting to print order with no photos');
      }

      return resolve();
    })
      //Create the pwinty order with user's info
      .then(() => this.createPwintyOrder({ ...address, recipientName: name }))
      // Set the pwinty order id on the PpOrder
      .then(pwintyOrder => ({ ...order, pwintyOrderId: pwintyOrder.id }))
      // Add photos from Order to PwintyOrder
      .then(unsubmittedOrder => this.addPhotosToPwintyOrder(unsubmittedOrder))
      // Submit order
      .then(unsubmittedOrder => this.submitPwintyOrder(unsubmittedOrder))
  }

  public getPwintyOrderStatus(orderId: string): Promise<PwintyOrderStatus> {
    return new Promise((resolve, reject) => {
      this.pwinty.getOrderStatus(orderId, (err: any, status: PwintyOrderStatus) => err ? reject(err) : resolve(status))
    });
  }

  /** Should be private members */

  // Visible for testing
  public createPwintyOrder(address: Address): Promise<PwintyOrder> {
    return new Promise((resolve, reject) => {
      this.pwinty.createOrder(address, (err: any, createdOrder: any) => err ? reject(err) : resolve(createdOrder));
    });
  }

  // Visible for testing
  public addPhotosToPwintyOrder(order: Order): Promise<Order> {
    if (!order.pwintyOrderId) {
      throw new Error(`No pwinty order to add photos to`);
    }
    const photos: PwintyPhotoOrder[] = order.pictureUrls.map(url => ({
      // make this depend on the size of the photo, and be 4x4 if square photo
      type: '4x6',

      // All photos are glossy
      attributes: { finish: 'glossy', },

      // Link to photo saved by twilio
      url,

      // Maybe make this possible to augment?
      copies: "1",

      // Ideally this would be no-crop and we would crop the photo on this server
      // Then we woudl send the cropped photo to the user to see if that is what they want.
      sizing: "Crop"
    }));

    const photoAddPromises = photos.map(PwintyPhotoOrder => {
      return new Promise((resolve, reject) => this.pwinty.addPhotoToOrder(order.pwintyOrderId, PwintyPhotoOrder,
        (err: any, photo: PwintyPhoto) => err ? reject(err) : resolve(photo)))
     });

    return Promise.all(photoAddPromises)
      .then(() => order)
      .catch(error => {
        ErrorActuator.handleError(error, `Failed to add all photos to order ${order.pwintyOrderId}`);
        throw new Error(`Failed to add all photos to order ${order.pwintyOrderId}`)
      });
  }

  // Visible for testing
  public submitPwintyOrder(order: Order): Promise<Order> {
    return new Promise((resolve, reject) => {
      this.pwinty.updateOrderStatus({
        id: order.pwintyOrderId,
        status: 'Submitted',
      }, (err: any, submited: any) => err ? reject(err) : resolve(submited));
    })
    .then(() => {
      order.status = OrderStatus.Sending;
      return order;
    });
  }
}
