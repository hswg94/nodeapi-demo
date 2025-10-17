import add from '../../utils/add.js';

describe('add utility', () => {
  test('adds two positive numbers correctly', () => {
    expect(add(2, 3)).toBe(5);
    expect(add(0, 5)).toBe(5);
    expect(add(10, 20)).toBe(30);
  });

  test('adds negative numbers correctly', () => {
    expect(add(-2, -3)).toBe(-5);
    expect(add(-5, 3)).toBe(-2);
    expect(add(5, -3)).toBe(2);
  });

  test('adds decimal numbers correctly', () => {
    expect(add(0.1, 0.2)).toBeCloseTo(0.3);
    expect(add(1.5, 2.7)).toBeCloseTo(4.2);
  });

  test('throws error for invalid inputs', () => {
    expect(() => add('a', 2)).toThrow('Invalid numbers');
    expect(() => add(1, 'b')).toThrow('Invalid numbers');
    expect(() => add(null, 2)).toThrow('Invalid numbers');
    expect(() => add(1, undefined)).toThrow('Invalid numbers');
    expect(() => add(NaN, 2)).toThrow('Invalid numbers');
  });
});