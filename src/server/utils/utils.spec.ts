import { expect } from 'chai';
import { Utils } from './utils';

/** Spec for utils.ts */

describe('Utils', () => {
  describe('SafeGet', () => {
    it('should work like a standard getter if possible', () => {
      const gotten = Utils.safeGet(() => 5, null);
      expect(gotten).to.equal(5);
    });

    it('should be able to access a deep property', () => {
      const dinoTree = { big: { scary: 't-rex', friendly: 'brontosaurus' } };
      const scaryDino = Utils.safeGet(() => dinoTree.big.scary, 'leoplaridon');
      expect(scaryDino).to.equal(dinoTree.big.scary);
    });

    it('should handle errors coming from deep errors', () => {
      const defaultSmallScaryDino = 'velociraptor';
      const dinoTree: any = { big: { scary: 't-rex', friendly: 'brontosaurus' } };
      const smallDino = Utils.safeGet(() => dinoTree.small.scary, defaultSmallScaryDino);
      expect(smallDino).to.equal(defaultSmallScaryDino);
    });
  });
});
