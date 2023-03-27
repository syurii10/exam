
export function isUndefined (x) {
  return x === undefined
}

export function isAccessorNode (x) {
  return (x && x.isAccessorNode === true && x.constructor.prototype.isNode === true) || false
}

export function isArrayNode (x) {
  return (x && x.isArrayNode === true && x.constructor.prototype.isNode === true) || false
}

export function isAssignmentNode (x) {
  return (x && x.isAssignmentNode === true && x.constructor.prototype.isNode === true) || false
}

export function isBlockNode (x) {
  return (x && x.isBlockNode === true && x.constructor.prototype.isNode === true) || false
}

export function isConditionalNode (x) {
  return (x && x.isConditionalNode === true && x.constructor.prototype.isNode === true) || false
}

export function isConstantNode (x) {
  return (x && x.isConstantNode === true && x.constructor.prototype.isNode === true) || false
}

/* Very specialized: returns true for those nodes which in the numerator of
   a fraction means that the division in that fraction has precedence over implicit
   multiplication, e.g. -2/3 x parses as (-2/3) x and 3/4 x parses as (3/4) x but
   6!/8 x parses as 6! / (8x). It is located here because it is shared between
   parse.js and OperatorNode.js (for parsing and printing, respectively).
   This should *not* be exported from mathjs, unlike most of the tests here.
   Its name does not start with 'is' to prevent utils/snapshot.js from thinking
   it should be exported.
*/
export function rule2Node (node) {
  return isConstantNode(node) ||
    (isOperatorNode(node) &&
      node.args.length === 1 &&
      isConstantNode(node.args[0]) &&
      '-+~'.includes(node.op))
}

export function isFunctionAssignmentNode (x) {
  return (x && x.isFunctionAssignmentNode === true && x.constructor.prototype.isNode === true) || false
}

export function isFunctionNode (x) {
  return (x && x.isFunctionNode === true && x.constructor.prototype.isNode === true) || false
}
