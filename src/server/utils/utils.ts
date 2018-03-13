import { ApiKey } from './types'
const keys = require('../../../keys.json');
// Utility methods that aren't in lodash

export class Utils {

  // Safe getter utility for uncertain property lookups
  static safeGet<T>(getFn: () => T, defaultValue: T): T {
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
  static sIfPlural(ammount: number): string {
    return ammount === 1 ? '' : 's';
  }

  // Get key from environment or keys file
  static getKey(key: ApiKey): string {
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
}
