function factorial(n) {
  if (n === 0 || n === 1) {
    return 1;
  }
  return n * factorial(n - 1);
}

function add(a, b) {
  return a + b;
}
const result = add(5, 3);
console.log(result);
