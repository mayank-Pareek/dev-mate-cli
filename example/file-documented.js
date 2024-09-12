function factorial(n) {
  // Base case: factorial of 0 or 1 is 1
  if (n === 0 || n === 1) {
    return 1;
  }
  // Recursive case: multiply n by factorial of (n-1)
  return n * factorial(n - 1);
}

function add(a, b) {
  // Return the sum of a and b
  return a + b;
}
const result = add(5, 3);
console.log(result);
