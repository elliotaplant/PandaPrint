import { Utils } from './utils';
import { expect } from 'chai';

/** Spec for utils.ts */

describe('Utils', () => {
  describe('SafeGet', () => {
    it('should work like a standard getter if possible', () => {
      const gotten = Utils.safeGet(() => 5, null);
      expect(gotten).to.equal(5);
    });
  });
});
