import divide from '../../utils/divide.js';

describe('divide utility', () => {
  test('divides two positive numbers correctly', () => {
    expect(divide(6, 2)).toBe(3);
    expect(divide(10, 5)).toBe(2);
    expect(divide(0, 5)).toBe(0);
  });

  test('divides with negative numbers correctly', () => {
    expect(divide(-6, -2)).toBe(3);
    expect(divide(-10, 2)).toBe(-5);
    expect(divide(15, -3)).toBe(-5);
  });

  test('divides decimal numbers correctly', () => {
    expect(divide(0.4, 0.2)).toBeCloseTo(2);
    expect(divide(5.5, 2)).toBeCloseTo(2.75);
  });

  test('throws error for division by zero', () => {
    expect(() => divide(5, 0)).toThrow('Division by zero');
  });

  test('throws error for invalid inputs', () => {
    expect(() => divide('a', 2)).toThrow('Invalid numbers');
    expect(() => divide(1, 'b')).toThrow('Invalid numbers');
    expect(() => divide(null, 2)).toThrow('Invalid numbers');
    expect(() => divide(1, undefined)).toThrow('Invalid numbers');
    expect(() => divide(NaN, 2)).toThrow('Invalid numbers');
  });
});