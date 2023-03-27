import {splitNumber} from "./variant5";

/**
 * Format a number in exponential notation. Like '1.23e+5', '2.3e+0', '3.500e-3'
 * @param {number | string} value
 * @param {number} [precision]  Number of digits in formatted output.
 *                              If not provided, the maximum available digits
 *                              is used.
 */
export function toExponential (value, precision) {
  if (isNaN(value) || !isFinite(value)) {
    return String(value)
  }

  // round if needed, else create a clone
  const split = splitNumber(value)
  const rounded = precision ? roundDigits(split, precision) : split
  let c = rounded.coefficients
  const e = rounded.exponent

  // append zeros if needed
  if (c.length < precision) {
    c = c.concat(zeros(precision - c.length))
  }

  // format as `C.CCCe+EEE` or `C.CCCe-EEE`
  const first = c.shift()
  return rounded.sign + first + (c.length > 0 ? ('.' + c.join('')) : '') +
    'e' + (e >= 0 ? '+' : '') + e
}

/**
 * Format a number with a certain precision
 * @param {number | string} value
 * @param {number} [precision=undefined] Optional number of digits.
 * @param {{lowerExp: number | undefined, upperExp: number | undefined}} [options]
 *                                       By default:
 *                                         lowerExp = -3 (incl)
 *                                         upper = +5 (excl)
 * @return {string}
 */
export function toPrecision (value, precision, options) {
  if (isNaN(value) || !isFinite(value)) {
    return String(value)
  }

  // determine lower and upper bound for exponential notation.
  const lowerExp = (options && options.lowerExp !== undefined) ? options.lowerExp : -3
  const upperExp = (options && options.upperExp !== undefined) ? options.upperExp : 5

  const split = splitNumber(value)
  const rounded = precision ? roundDigits(split, precision) : split
  if (rounded.exponent < lowerExp || rounded.exponent >= upperExp) {
    // exponential notation
    return toExponential(value, precision)
  } else {
    let c = rounded.coefficients
    const e = rounded.exponent

    // append trailing zeros
    if (c.length < precision) {
      c = c.concat(zeros(precision - c.length))
    }

    // append trailing zeros
    // TODO: simplify the next statement
    c = c.concat(zeros(e - c.length + 1 +
      (c.length < precision ? precision - c.length : 0)))

    // prepend zeros
    c = zeros(-e).concat(c)

    const dot = e > 0 ? e : 0
    if (dot < c.length - 1) {
      c.splice(dot + 1, 0, '.')
    }

    return rounded.sign + c.join('')
  }
}

/**
 * Round the number of digits of a number *
 * @param {SplitValue} split       A value split with .splitNumber(value)
 * @param {number} precision  A positive integer
 * @return {SplitValue}
 *              Returns an object containing sign, coefficients, and exponent
 *              with rounded digits
 */
export function roundDigits (split, precision) {
  // create a clone
  const rounded = {
    sign: split.sign,
    coefficients: split.coefficients,
    exponent: split.exponent
  }
  const c = rounded.coefficients

  // prepend zeros if needed
  while (precision <= 0) {
    c.unshift(0)
    rounded.exponent++
    precision++
  }

  if (c.length > precision) {
    const removed = c.splice(precision, c.length - precision)

    if (removed[0] >= 5) {
      let i = precision - 1
      c[i]++
      while (c[i] === 10) {
        c.pop()
        if (i === 0) {
          c.unshift(0)
          rounded.exponent++
          i++
        }
        i--
        c[i]++
      }
    }
  }

  return rounded
}

/**
 * Create an array filled with zeros.
 * @param {number} length
 * @return {Array}
 */
function zeros (length) {
  const arr = []
  for (let i = 0; i < length; i++) {
    arr.push(0)
  }
  return arr
}

/**
 * Count the number of significant digits of a number.
 *
 * For example:
 *   2.34 returns 3
 *   0.0034 returns 2
 *   120.5e+30 returns 4
 *
 * @param {number} value
 * @return {number} digits   Number of significant digits
 */
export function digits (value) {
  return value
    .toExponential()
    .replace(/e.*$/, '') // remove exponential notation
    .replace(/^0\.?0*|\./, '') // remove decimal point and leading zeros
    .length
}
