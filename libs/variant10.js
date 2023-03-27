

/**
 * Recursively unsqueeze a multi dimensional array
 * @param {Array} array
 * @param {number} dims Required number of dimensions
 * @param {number} dim  Current dimension
 * @returns {Array | *} Returns the squeezed array
 * @private
 */
function _unsqueeze (array, dims, dim) {
  let i, ii

  if (Array.isArray(array)) {
    const next = dim + 1
    for (i = 0, ii = array.length; i < ii; i++) {
      array[i] = _unsqueeze(array[i], dims, next)
    }
  } else {
    for (let d = dim; d < dims; d++) {
      array = [array]
    }
  }

  return array
}
/**
 * Flatten a multi dimensional array, put all elements in a one dimensional
 * array
 * @param {Array} array   A multi dimensional array
 * @return {Array}        The flattened array (1 dimensional)
 */
export function flatten (array) {
  if (!Array.isArray(array)) {
    // if not an array, return as is
    return array
  }
  const flat = []

  array.forEach(function callback (value) {
    if (Array.isArray(value)) {
      value.forEach(callback) // traverse through sub-arrays recursively
    } else {
      flat.push(value)
    }
  })

  return flat
}

/**
 * A safe map
 * @param {Array} array
 * @param {function} callback
 */
export function map (array, callback) {
  return Array.prototype.map.call(array, callback)
}

/**
 * A safe forEach
 * @param {Array} array
 * @param {function} callback
 */
export function forEach (array, callback) {
  Array.prototype.forEach.call(array, callback)
}

/**
 * A safe filter
 * @param {Array} array
 * @param {function} callback
 */
export function filter (array, callback) {
  if (arraySize(array).length !== 1) {
    throw new Error('Only one dimensional matrices supported')
  }

  return Array.prototype.filter.call(array, callback)
}

/**
 * Filter values in a callback given a regular expression
 * @param {Array} array
 * @param {RegExp} regexp
 * @return {Array} Returns the filtered array
 * @private
 */
export function filterRegExp (array, regexp) {
  if (arraySize(array).length !== 1) {
    throw new Error('Only one dimensional matrices supported')
  }

  return Array.prototype.filter.call(array, (entry) => regexp.test(entry))
}

/**
 * A safe join
 * @param {Array} array
 * @param {string} separator
 */
export function join (array, separator) {
  return Array.prototype.join.call(array, separator)
}

/**
 * Assign a numeric identifier to every element of a sorted array
 * @param {Array} a  An array
 * @return {Array} An array of objects containing the original value and its identifier
 */
export function identify (a) {
  if (!Array.isArray(a)) {
    throw new TypeError('Array input expected')
  }

  if (a.length === 0) {
    return a
  }

  const b = []
  let count = 0
  b[0] = { value: a[0], identifier: 0 }
  for (let i = 1; i < a.length; i++) {
    if (a[i] === a[i - 1]) {
      count++
    } else {
      count = 0
    }
    b.push({ value: a[i], identifier: count })
  }
  return b
}

/**
 * Remove the numeric identifier from the elements
 * @param {array} a  An array
 * @return {array} An array of values without identifiers
 */
export function generalize (a) {
  if (!Array.isArray(a)) {
    throw new TypeError('Array input expected')
  }

  if (a.length === 0) {
    return a
  }

  const b = []
  for (let i = 0; i < a.length; i++) {
    b.push(a[i].value)
  }
  return b
}

/**
 * Check the datatype of a given object
 * This is a low level implementation that should only be used by
 * parent Matrix classes such as SparseMatrix or DenseMatrix
 * This method does not validate Array Matrix shape
 * @param {Array} array
 * @param {function} typeOf   Callback function to use to determine the type of a value
 * @return {string}
 */
export function getArrayDataType (array, typeOf) {
  let type // to hold type info
  let length = 0 // to hold length value to ensure it has consistent sizes

  for (let i = 0; i < array.length; i++) {
    const item = array[i]
    const isArray = Array.isArray(item)

    // Saving the target matrix row size
    if (i === 0 && isArray) {
      length = item.length
    }

    // If the current item is an array but the length does not equal the targetVectorSize
    if (isArray && item.length !== length) {
      return undefined
    }

    const itemType = isArray
      ? getArrayDataType(item, typeOf) // recurse into a nested array
      : typeOf(item)

    if (type === undefined) {
      type = itemType // first item
    } else if (type !== itemType) {
      return 'mixed'
    } else {
      // we're good, everything has the same type so far
    }
  }

  return type
}

/**
 * Return the last item from an array
 * @param array
 * @returns {*}
 */
export function last (array) {
  return array[array.length - 1]
}

/**
 * Get all but the last element of array.
 */
export function initial (array) {
  return array.slice(0, array.length - 1)
}

/**
 * Test whether an array or string contains an item
 * @param {Array | string} array
 * @param {*} item
 * @return {boolean}
 */
export function contains (array, item) {
  return array.indexOf(item) !== -1
}
