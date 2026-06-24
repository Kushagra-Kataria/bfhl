/**
 * Graph Service
 *
 * Core algorithm pipeline for processing hierarchical node relationships.
 * All operations target O(V + E) complexity.
 *
 * Pipeline:
 * 1. Deduplicate edges (first occurrence wins)
 * 2. Resolve multi-parent conflicts (first parent wins)
 * 3. Build adjacency list
 * 4. Detect connected components
 * 5. Identify roots (or pick lex-smallest for pure cycles)
 * 6. Detect cycles via DFS recursion stack
 * 7. Generate trees for non-cyclic components
 * 8. Calculate depth for non-cyclic trees
 * 9. Build summary statistics
 */

const { buildTree, calculateDepth } = require('../utils/treeBuilder');

/**
 * Processes validated edges and produces the full response payload.
 *
 * @param {Array<{from: string, to: string, raw: string}>} validEdges
 * @returns {{ hierarchies: object[], duplicateEdges: string[], summary: object }}
 */
function processEdges(validEdges) {
  // Step 1: Deduplicate edges
  const { uniqueEdges, duplicateEdges } = deduplicateEdges(validEdges);

  // Step 2: Resolve multi-parent conflicts (first parent wins, rest silently ignored)
  const resolvedEdges = resolveMultiParent(uniqueEdges);

  // Step 3: Build adjacency list
  const { adjacencyList, allNodes, childNodes } = buildAdjacencyList(resolvedEdges);

  // Step 4: Find connected components
  const components = findComponents(allNodes, adjacencyList, resolvedEdges);

  // Step 5 & 6 & 7: Process each component
  const hierarchies = [];
  let totalTrees = 0;
  let totalCycles = 0;
  let largestTreeRoot = '';
  let largestTreeDepth = 0;

  for (const component of components) {
    // Find root: node that never appears as a child within this component
    const componentChildNodes = new Set();
    for (const node of component) {
      const children = adjacencyList.get(node) || [];
      for (const child of children) {
        if (component.has(child)) {
          componentChildNodes.add(child);
        }
      }
    }

    let root = null;
    const potentialRoots = [];
    for (const node of component) {
      if (!componentChildNodes.has(node)) {
        potentialRoots.push(node);
      }
    }

    if (potentialRoots.length > 0) {
      // Pick lexicographically smallest root
      potentialRoots.sort();
      root = potentialRoots[0];
    } else {
      // Pure cycle: no node qualifies as root, pick lex smallest
      const sorted = [...component].sort();
      root = sorted[0];
    }

    // Cycle detection via DFS recursion stack
    const hasCycle = detectCycle(root, adjacencyList, component);

    if (hasCycle) {
      totalCycles++;
      hierarchies.push({
        root,
        tree: {},
        has_cycle: true,
      });
    } else {
      totalTrees++;
      const tree = buildTree(root, adjacencyList);
      const depth = calculateDepth(root, adjacencyList);

      const entry = {
        root,
        tree,
        depth,
      };

      hierarchies.push(entry);

      // Track largest tree (deepest; lex tiebreak)
      if (
        depth > largestTreeDepth ||
        (depth === largestTreeDepth && root < largestTreeRoot)
      ) {
        largestTreeDepth = depth;
        largestTreeRoot = root;
      }
    }
  }

  // Preserve input order of components (do not sort alphabetically)

  const summary = {
    total_trees: totalTrees,
    total_cycles: totalCycles,
    largest_tree_root: largestTreeRoot,
  };

  return { hierarchies, duplicateEdges, summary };
}

/**
 * Deduplicates edges. First occurrence wins.
 * Duplicates are recorded once regardless of repetition count.
 */
function deduplicateEdges(validEdges) {
  const seen = new Set();
  const duplicateSet = new Set();
  const uniqueEdges = [];

  for (const edge of validEdges) {
    const key = `${edge.from}->${edge.to}`;

    if (seen.has(key)) {
      duplicateSet.add(key);
    } else {
      seen.add(key);
      uniqueEdges.push(edge);
    }
  }

  return {
    uniqueEdges,
    duplicateEdges: [...duplicateSet].sort(),
  };
}

/**
 * Resolves multi-parent conflicts.
 * First parent wins; subsequent parents for the same child are silently ignored.
 */
function resolveMultiParent(edges) {
  const childParentMap = new Map(); // child -> first parent
  const resolved = [];

  for (const edge of edges) {
    if (childParentMap.has(edge.to)) {
      // This child already has a parent — silently ignore
      continue;
    }
    childParentMap.set(edge.to, edge.from);
    resolved.push(edge);
  }

  return resolved;
}

/**
 * Builds an adjacency list from resolved edges.
 */
function buildAdjacencyList(edges) {
  const adjacencyList = new Map();
  const allNodesSet = new Set();
  const allNodesOrdered = []; // Preserves first-seen input order
  const childNodes = new Set();

  for (const edge of edges) {
    if (!allNodesSet.has(edge.from)) {
      allNodesSet.add(edge.from);
      allNodesOrdered.push(edge.from);
    }
    if (!allNodesSet.has(edge.to)) {
      allNodesSet.add(edge.to);
      allNodesOrdered.push(edge.to);
    }
    childNodes.add(edge.to);

    if (!adjacencyList.has(edge.from)) {
      adjacencyList.set(edge.from, []);
    }
    adjacencyList.get(edge.from).push(edge.to);
  }

  return { adjacencyList, allNodes: allNodesOrdered, childNodes };
}

/**
 * Finds connected components using BFS on undirected version of the graph.
 */
function findComponents(allNodes, adjacencyList, edges) {
  // Build undirected adjacency for component detection
  const undirected = new Map();

  for (const node of allNodes) {
    if (!undirected.has(node)) {
      undirected.set(node, new Set());
    }
  }

  for (const edge of edges) {
    undirected.get(edge.from).add(edge.to);
    if (!undirected.has(edge.to)) {
      undirected.set(edge.to, new Set());
    }
    undirected.get(edge.to).add(edge.from);
  }

  const visited = new Set();
  const components = [];

  for (const node of allNodes) { // allNodes is ordered by first appearance in input
    if (visited.has(node)) continue;

    // BFS to find all nodes in this component
    const component = new Set();
    const queue = [node];
    visited.add(node);

    while (queue.length > 0) {
      const current = queue.shift();
      component.add(current);

      for (const neighbor of (undirected.get(current) || [])) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }

    components.push(component);
  }

  return components;
}

/**
 * Detects cycles using DFS with a recursion stack (3-color algorithm).
 *
 * WHITE (0) = unvisited
 * GRAY  (1) = in current recursion stack
 * BLACK (2) = fully processed
 *
 * @param {string} root - Starting node
 * @param {Map<string, string[]>} adjacencyList - Directed adjacency list
 * @param {Set<string>} component - Set of nodes in this component
 * @returns {boolean} True if a cycle is detected
 */
function detectCycle(root, adjacencyList, component) {
  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color = new Map();

  for (const node of component) {
    color.set(node, WHITE);
  }

  function dfs(node) {
    color.set(node, GRAY);

    const children = adjacencyList.get(node) || [];
    for (const child of children) {
      if (!component.has(child)) continue;

      if (color.get(child) === GRAY) {
        return true; // Back edge → cycle
      }

      if (color.get(child) === WHITE) {
        if (dfs(child)) return true;
      }
    }

    color.set(node, BLACK);
    return false;
  }

  // Start DFS from all unvisited nodes in the component (handles disconnected subgraphs within component)
  for (const node of component) {
    if (color.get(node) === WHITE) {
      if (dfs(node)) return true;
    }
  }

  return false;
}

module.exports = {
  processEdges,
  deduplicateEdges,
  resolveMultiParent,
  buildAdjacencyList,
  findComponents,
  detectCycle,
};
