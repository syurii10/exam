import {flatten} from "./variant10";

/**
 * Re-shape a multi dimensional array to fit the specified dimensions
 * @param {Array} array           Array to be reshaped
 * @param {Array.<number>} sizes  List of sizes for each dimension
 * @returns {Array}               Array whose data has been formatted to fit the
 *                                specified dimensions
 *
 * @throws {DimensionError}       If the product of the new dimension sizes does
 *                                not equal that of the old ones
 */
export function reshape (array, sizes) {
  const flatArray = flatten(array)
  const currentLength = flatArray.length

  if (!Array.isArray(array) || !Array.isArray(sizes)) {
    throw new TypeError('Array expected')
  }

  if (sizes.length === 0) {
    throw new DimensionError(0, currentLength, '!=')
  }

  sizes = processSizesWildcard(sizes, currentLength)
  const newLength = product(sizes)
  if (currentLength !== newLength) {
    throw new DimensionError(
      newLength,
      currentLength,
      '!='
    )
  }

  try {
    return _reshape(flatArray, sizes)
  } catch (e) {
    if (e instanceof DimensionError) {
      throw new DimensionError(
        newLength,
        currentLength,
        '!='
      )
    }
    throw e
  }
}

/**
 * Replaces the wildcard -1 in the sizes array.
 * @param {Array.<number>} sizes  List of sizes for each dimension. At most on wildcard.
 * @param {number} currentLength  Number of elements in the array.
 * @throws {Error}                If more than one wildcard or unable to replace it.
 * @returns {Array.<number>}      The sizes array with wildcard replaced.
 */
export function processSizesWildcard (sizes, currentLength) {
  const newLength = product(sizes)
  const processedSizes = sizes.slice()
  const WILDCARD = -1
  const wildCardIndex = sizes.indexOf(WILDCARD)

  const isMoreThanOneWildcard = sizes.indexOf(WILDCARD, wildCardIndex + 1) >= 0
  if (isMoreThanOneWildcard) {
    throw new Error('More than one wildcard in sizes')
  }

  const hasWildcard = wildCardIndex >= 0
  const canReplaceWildcard = currentLength % newLength === 0

  if (hasWildcard) {
    if (canReplaceWildcard) {
      processedSizes[wildCardIndex] = -currentLength / newLength
    } else {
      throw new Error('Could not replace wildcard, since ' + currentLength + ' is no multiple of ' + (-newLength))
    }
  }
  return processedSizes
}

/**
 * Computes the product of all array elements.
 * @param {Array<number>} array Array of factors
 * @returns {number}            Product of all elements
 */
function product (array) {
  return array.reduce((prev, curr) => prev * curr, 1)
}

/**
 * Iteratively re-shape a multi dimensional array to fit the specified dimensions
 * @param {Array} array           Array to be reshaped
 * @param {Array.<number>} sizes  List of sizes for each dimension
 * @returns {Array}               Array whose data has been formatted to fit the
 *                                specified dimensions
 */

function _reshape (array, sizes) {
  // testing if there are enough elements for the requested shape
  let tmpArray = array
  let tmpArray2
  // for each dimensions starting by the last one and ignoring the first one
  for (let sizeIndex = sizes.length - 1; sizeIndex > 0; sizeIndex--) {
    const size = sizes[sizeIndex]
    tmpArray2 = []

    // aggregate the elements of the current tmpArray in elements of the requested size
    const length = tmpArray.length / size
    for (let i = 0; i < length; i++) {
      tmpArray2.push(tmpArray.slice(i * size, (i + 1) * size))
    }
    // set it as the new tmpArray for the next loop turn or for return
    tmpArray = tmpArray2
  }

  return tmpArray
}

/**
 * Squeeze a multi dimensional array
 * @param {Array} array
 * @param {Array} [size]
 * @returns {Array} returns the array itself
 */
export function squeeze (array, size) {
  const s = size || arraySize(array)

  // squeeze outer dimensions
  while (Array.isArray(array) && array.length === 1) {
    array = array[0]
    s.shift()
  }

  // find the first dimension to be squeezed
  let dims = s.length
  while (s[dims - 1] === 1) {
    dims--
  }

  // squeeze inner dimensions
  if (dims < s.length) {
    array = _squeeze(array, dims, 0)
    s.length = dims
  }

  return array
}

/**
 * Recursively squeeze a multi dimensional array
 * @param {Array} array
 * @param {number} dims Required number of dimensions
 * @param {number} dim  Current dimension
 * @returns {Array | *} Returns the squeezed array
 * @private
 */
function _squeeze (array, dims, dim) {
  let i, ii

  if (dim < dims) {
    const next = dim + 1
    for (i = 0, ii = array.length; i < ii; i++) {
      array[i] = _squeeze(array[i], dims, next)
    }
  } else {
    while (Array.isArray(array)) {
      array = array[0]
    }
  }

  return array
}

/**
 * Unsqueeze a multi dimensional array: add dimensions when missing
 *
 * Paramter `size` will be mutated to match the new, unqueezed matrix size.
 *
 * @param {Array} array
 * @param {number} dims       Desired number of dimensions of the array
 * @param {number} [outer]    Number of outer dimensions to be added
 * @param {Array} [size] Current size of array.
 * @returns {Array} returns the array itself
 * @private
 */
export function unsqueeze (array, dims, outer, size) {
  const s = size || arraySize(array)

  // unsqueeze outer dimensions
  if (outer) {
    for (let i = 0; i < outer; i++) {
      array = [array]
      s.unshift(1)
    }
  }

  // unsqueeze inner dimensions
  array = _unsqueeze(array, dims, 0)
  while (s.length < dims) {
    s.push(1)
  }

  return array
}
