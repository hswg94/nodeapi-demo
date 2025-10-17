import multiply from '../../utils/multiply.js';

describe('multiply utility', () => {
  test('multiplies two positive numbers correctly', () => {
    expect(multiply(2, 3)).toBe(6);
    expect(multiply(0, 5)).toBe(0);
    expect(multiply(10, 20)).toBe(200);
  });

  test('multiplies with negative numbers correctly', () => {
    expect(multiply(-2, -3)).toBe(6);
    expect(multiply(-5, 3)).toBe(-15);
    expect(multiply(5, -3)).toBe(-15);
  });

  test('multiplies decimal numbers correctly', () => {
    expect(multiply(0.1, 0.2)).toBeCloseTo(0.02);
    expect(multiply(1.5, 2)).toBe(3);
  });

  test('throws error for invalid inputs', () => {
    expect(() => multiply('a', 2)).toThrow('Invalid numbers');
    expect(() => multiply(1, 'b')).toThrow('Invalid numbers');
    expect(() => multiply(null, 2)).toThrow('Invalid numbers');
    expect(() => multiply(1, undefined)).toThrow('Invalid numbers');
    expect(() => multiply(NaN, 2)).toThrow('Invalid numbers');
  });
});