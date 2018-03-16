import { ApiKey, Env } from './types';
const keys = require('../../../keys.json');
// Utility methods that aren't in lodash

export class Utils {

  // Safe getter utility for uncertain property lookups
  public static safeGet<T>(getFn: () => T, defaultValue: T): T {
    let foundValue;
    try {
      foundValue = getFn();
    } catch (e) {
      foundValue = undefined;
    }

    if (foundValue === undefined) {
      return defaultValue;
    }
    return foundValue;
  }

  // Utility to return the 's' character if the number is not === 1
  public static sIfPlural(ammount: number): string {
    return ammount === 1 ? '' : 's';
  }

  // Get key from environment or keys file
  public static getKey(key: ApiKey): string {
    const prodKey = Utils.safeGet(() => process.env[key], null);

    if (!prodKey) {
      const devKey = Utils.safeGet(() => {
        const allKeys = require('../../../keys.json');
        switch (key) {
          case 'TWILIO_ACCOUNT_SID': {
            return allKeys.twilio.accountSid;
          }
          case 'TWILIO_AUTH_TOKEN': {
            return allKeys.twilio.authToken;
          }
          case 'PWINTY_MERCHANT_ID': {
            return allKeys.pwinty.merchantId;
          }
          case 'PWINTY_API_KEY': {
            return allKeys.pwinty.apiKey;
          }
          case 'PWINTY_ENV': {
            return allKeys.pwinty.env;
          }
          case 'STRIPE_PUBLISHABLE_KEY': {
            return allKeys.stripe.publishableKey;
          }
          case 'STRIPE_SECRET_KEY': {
            return allKeys.stripe.secretKey;
          }
        }
      }, null);

      return prodKey || devKey;
    }
  }

  public static toUsd(price: number) {
    return `$${price.toFixed(2)}`;
  }

  public static isDevEnv() {
    return process.env.BUILD_ENV !== Env.PROD;
  }

  public static isProdEnv() {
    return process.env.BUILD_ENV === Env.PROD;
  }

  public static origin() {
    return Utils.isDevEnv() ? `http://localhost:8080` : `https://www.pandaprint.co`;
  }

  public static twilioPhoneNum() {
    return '+14155793449';
  }
}
