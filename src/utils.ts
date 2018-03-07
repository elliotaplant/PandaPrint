// Utility methods that aren't in lodash

export default class Utils {

  // Safe getter utility for uncertain property lookups
  static safeGet<T>(getFn: () => T, defaultValue: T): T {
    let foundValue;
    try {
      foundValue = getFn();
    } catch(e) {
      foundValue = undefined;
    }

    if (foundValue === undefined) {
      return defaultValue;
    }
  }
}
