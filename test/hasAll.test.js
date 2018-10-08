import {hasAll} from "../src/shared/common";

const anObject = {foo: 'bar', fizz: 'bazz'};

describe('hasAll', () => {
  it('should return true if all properties are present', async () => {
    expect(hasAll(anObject, ['foo', 'fizz'])).toBe(true);
  });
  it('should return true if all properties are present', async () => {
    expect(hasAll(anObject, ['foo', 'pipo'])).toBe(false);
  });
});
