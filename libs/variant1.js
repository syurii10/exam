
export function isNumber (x) {
  return typeof x === 'number'
}

export function isBigNumber (x) {
  if (
    !x || typeof x !== 'object' ||
    typeof x.constructor !== 'function'
  ) {
    return false
  }

  if (
    x.isBigNumber === true &&
    typeof x.constructor.prototype === 'object' &&
    x.constructor.prototype.isBigNumber === true
  ) {
    return true
  }

  if (
    typeof x.constructor.isDecimal === 'function' &&
    x.constructor.isDecimal(x) === true
  ) {
    return true
  }

  return false
}

export function isComplex (x) {
  return (x && typeof x === 'object' && Object.getPrototypeOf(x).isComplex === true) || false
}

export function isFraction (x) {
  return (x && typeof x === 'object' && Object.getPrototypeOf(x).isFraction === true) || false
}

export function isUnit (x) {
  return (x && x.constructor.prototype.isUnit === true) || false
}

export function isString (x) {
  return typeof x === 'string'
}

export const isArray = Array.isArray

export function isMatrix (x) {
  return (x && x.constructor.prototype.isMatrix === true) || false
}

/**
 * Test whether a value is a collection: an Array or Matrix
 * @param {*} x
 * @returns {boolean} isCollection
 */
export function isCollection (x) {
  return Array.isArray(x) || isMatrix(x)
}

export function isDenseMatrix (x) {
  return (x && x.isDenseMatrix && x.constructor.prototype.isMatrix === true) || false
}

export function isSparseMatrix (x) {
  return (x && x.isSparseMatrix && x.constructor.prototype.isMatrix === true) || false
}
