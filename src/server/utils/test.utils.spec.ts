import { ApiKey } from './types';
import { Utils } from './utils';
const keys = require('../../../keys.json');
// Utility methods that aren't in lodash

export class TestUtils {

  // Safe getter utility for uncertain property lookups
  public static ifApiTests(test: () => void) {
    if (Utils.safeGet(() => process.argv.indexOf('--api') > -1, false)) {
      return test();
    }
  }
}
