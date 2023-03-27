import {isBigNumber} from "./variant1";

export function isIndexNode (x) {
  return (x && x.isIndexNode === true && x.constructor.prototype.isNode === true) || false
}

export function isNode (x) {
  return (x && x.isNode === true && x.constructor.prototype.isNode === true) || false
}

export function isObjectNode (x) {
  return (x && x.isObjectNode === true && x.constructor.prototype.isNode === true) || false
}

export function isOperatorNode (x) {
  return (x && x.isOperatorNode === true && x.constructor.prototype.isNode === true) || false
}

export function isParenthesisNode (x) {
  return (x && x.isParenthesisNode === true && x.constructor.prototype.isNode === true) || false
}

export function isRangeNode (x) {
  return (x && x.isRangeNode === true && x.constructor.prototype.isNode === true) || false
}

export function isRelationalNode (x) {
  return (x && x.isRelationalNode === true && x.constructor.prototype.isNode === true) || false
}

export function isSymbolNode (x) {
  return (x && x.isSymbolNode === true && x.constructor.prototype.isNode === true) || false
}

export function isChain (x) {
  return (x && x.constructor.prototype.isChain === true) || false
}

export function typeOf (x) {
  const t = typeof x

  if (t === 'object') {
    if (x === null) return 'null'
    if (isBigNumber(x)) return 'BigNumber' // Special: weird mashup with Decimal
    if (x.constructor && x.constructor.name) return x.constructor.name

    return 'Object' // just in case
  }

  return t // can be 'string', 'number', 'boolean', 'function', 'bigint', ...
}
