/**
 * Converts a number to engineering notation.
 * @param {number} value - The number to format.
 * @param {number} [precision] - Optional precision (number of significant figures).
 * @returns {string} - The number in engineering notation.
 */
export function toEngineering(value, precision) {
  if (isNaN(value) || !isFinite(value)) {
    return String(value); // Handle NaN, Infinity, and -Infinity
  }

  if (value === 0) {
    return '0e+0'; // Special case for zero
  }

  // Determine the exponent and normalize the number
  const sign = value < 0 ? '-' : '';
  const absValue = Math.abs(value);
  const exponent = Math.floor(Math.log10(absValue));
  const normalizedExponent = exponent - (exponent % 3); // Align to nearest multiple of 3
  const coefficient = absValue / Math.pow(10, normalizedExponent);

  // Format the coefficient with precision
  const formattedCoefficient = precision
    ? coefficient.toFixed(precision - 1) // Adjust for 1 significant figure in the integer part
    : coefficient.toString();

  // Return the formatted string
  return `${sign}${formattedCoefficient}e${normalizedExponent >= 0 ? '+' : ''}${normalizedExponent}`;
}


/**
 * Splits a number into coefficients and exponent in scientific notation.
 * @param {number} value - The number to split.
 * @returns {{ coefficients: number[], exponent: number, sign: string }}
 */
export function splitNumber(value) {
  const sign = value < 0 ? '-' : '';
  const absValue = Math.abs(value);

  if (absValue === 0) {
    return { coefficients: [0], exponent: 0, sign };
  }

  const exponent = Math.floor(Math.log10(absValue));
  const normalizedValue = absValue / Math.pow(10, exponent);

  const significantString = normalizedValue.toPrecision(15);
  const coefficients = significantString.replace('.', '').replace(/0+$/, '').split('').map(Number);

  return { coefficients, exponent, sign };
}

/**
 * Check if a value is a number
 * @param {*} value - The value to check
 * @returns {boolean}
 */
export function isNumber(value) {
  return typeof value === 'number' && isFinite(value);
}

/**
 * Round a number to a specific number of digits.
 * @param {number | string} value - The number to round.
 * @param {number} precision - The number of digits after the decimal point.
 * @returns {string} - The rounded number as a string in the desired format.
 */
export function roundDigits(value, precision) {
  if (isNaN(value) || !isFinite(value)) {
    return String(value);
  }

  const num = parseFloat(value);
  const rounded = num.toFixed(precision);
  return rounded;
}

/**
 * Calculate the hyperbolic arccos of a number
 * @param {number} x
 * @return {number}
 */
export const acosh = Math.acosh || function (x) {
  return Math.log(Math.sqrt(x * x - 1) + x)
}

export const asinh = Math.asinh || function (x) {
  return Math.log(Math.sqrt(x * x + 1) + x)
}

/**
 * Calculate the hyperbolic arctangent of a number
 * @param {number} x
 * @return {number}
 */
export const atanh = Math.atanh || function (x) {
  if (x <= -1 || x >= 1) {
    throw new RangeError('atanh() input must be in the range (-1, 1)');
  }
  return Math.log((1 + x) / (1 - x)) / 2;
};


/**
 * Calculate the hyperbolic cosine of a number
 * @param {number} x
 * @returns {number}
 */
export const cosh = Math.cosh || function (x) {
  return (Math.exp(x) + Math.exp(-x)) / 2
}

/**
 * Calculate the hyperbolic sine of a number
 * @param {number} x
 * @returns {number}
 */
export const sinh = Math.sinh || function (x) {
  return (Math.exp(x) - Math.exp(-x)) / 2
}

/**
 * Calculate the hyperbolic tangent of a number
 * @param {number} x
 * @returns {number}
 */
export const tanh = Math.tanh || function (x) {
  const e = Math.exp(2 * x)
  return (e - 1) / (e + 1)
}


/**
 * Returns a value with the magnitude of x and the sign of y.
 * @param {number} x
 * @param {number} y
 * @returns {number}
 */
export function copysign(x, y) {
  const signx = x > 0 ? true : x < 0 ? false : 1 / x === Infinity
  const signy = y > 0 ? true : y < 0 ? false : 1 / y === Infinity
  return signx ^ signy ? -x : x
}