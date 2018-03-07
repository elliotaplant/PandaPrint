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
  }

  // Utility to return the 's' character if the number is not === 1
  static sIfPlural(ammount: number): string {
    return ammount === 1 ? '' : 's';
  }
}
