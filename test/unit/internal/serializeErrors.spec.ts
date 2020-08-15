import { serializeError } from '../../../src/internal';

describe('serializeError', () => {
  it('should convert an error object into a plain object', () => {
    expect(serializeError(new TypeError('test'))).toEqual({
      name: 'TypeError',
      message: 'test',
    });
  });

  it('should create an object from a nil error', () => {
    expect(serializeError(null)).toEqual({
      name: undefined,
      message: undefined,
    });
  });
});
