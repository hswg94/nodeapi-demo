import subtract from '../../utils/subtract.js';

describe('subtract utility', () => {
  test('subtracts two positive numbers correctly', () => {
    expect(subtract(5, 3)).toBe(2);
    expect(subtract(10, 5)).toBe(5);
    expect(subtract(3, 3)).toBe(0);
  });

  test('subtracts with negative numbers correctly', () => {
    expect(subtract(-2, -3)).toBe(1);
    expect(subtract(-5, 3)).toBe(-8);
    expect(subtract(5, -3)).toBe(8);
  });

  test('subtracts decimal numbers correctly', () => {
    expect(subtract(0.3, 0.1)).toBeCloseTo(0.2);
    expect(subtract(5.5, 2.2)).toBeCloseTo(3.3);
  });

  test('throws error for invalid inputs', () => {
    expect(() => subtract('a', 2)).toThrow('Invalid numbers');
    expect(() => subtract(1, 'b')).toThrow('Invalid numbers');
    expect(() => subtract(null, 2)).toThrow('Invalid numbers');
    expect(() => subtract(1, undefined)).toThrow('Invalid numbers');
    expect(() => subtract(NaN, 2)).toThrow('Invalid numbers');
  });
});