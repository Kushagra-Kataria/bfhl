/**
 * Tree Builder Utility
 *
 * Recursively builds a nested JSON tree from an adjacency list.
 */

/**
 * Builds a nested JSON tree starting from the given root node.
 *
 * @param {string} root - The root node
 * @param {Map<string, string[]>} adjacencyList - Map of parent -> children
 * @returns {object} Nested JSON tree
 *
 * @example
 * // adjacencyList: { A: [B, C], B: [D] }
 * // buildTree('A', adjacencyList)
 * // => { A: { B: { D: {} }, C: {} } }
 */
function buildTree(root, adjacencyList) {
  const tree = {};
  const children = adjacencyList.get(root) || [];

  const childObj = {};
  for (const child of children) {
    const subtree = buildTree(child, adjacencyList);
    Object.assign(childObj, subtree);
  }

  tree[root] = childObj;
  return tree;
}

/**
 * Calculates the depth (number of nodes in the longest root-to-leaf path)
 * using DFS.
 *
 * @param {string} root - The root node
 * @param {Map<string, string[]>} adjacencyList - Map of parent -> children
 * @returns {number} Depth of the tree
 */
function calculateDepth(root, adjacencyList) {
  const children = adjacencyList.get(root) || [];

  if (children.length === 0) {
    return 1; // Leaf node
  }

  let maxChildDepth = 0;
  for (const child of children) {
    const childDepth = calculateDepth(child, adjacencyList);
    if (childDepth > maxChildDepth) {
      maxChildDepth = childDepth;
    }
  }

  return 1 + maxChildDepth;
}

module.exports = { buildTree, calculateDepth };
