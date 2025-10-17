export default function divide(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number' || Number.isNaN(a) || Number.isNaN(b)) {
    throw new Error('Invalid numbers');
  }
  if (b === 0) {
    throw new Error('Division by zero');
  }
  return a / b;
}
