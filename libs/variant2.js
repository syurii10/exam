import {isComplex, isFraction} from "./variant1";

export function isRange (x) {
  return (x && x.constructor.prototype.isRange === true) || false
}

export function isIndex (x) {
  return (x && x.constructor.prototype.isIndex === true) || false
}

export function isBoolean (x) {
  return typeof x === 'boolean'
}

export function isResultSet (x) {
  return (x && x.constructor.prototype.isResultSet === true) || false
}

export function isHelp (x) {
  return (x && x.constructor.prototype.isHelp === true) || false
}

export function isFunction (x) {
  return typeof x === 'function'
}

export function isDate (x) {
  return x instanceof Date
}

export function isRegExp (x) {
  return x instanceof RegExp
}

export function isObject (x) {
  return !!(x &&
    typeof x === 'object' &&
    x.constructor === Object &&
    !isComplex(x) &&
    !isFraction(x))
}

export function isNull (x) {
  return x === null
}
