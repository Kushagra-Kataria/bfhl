const {
  processEdges,
  deduplicateEdges,
  resolveMultiParent,
  detectCycle,
  buildAdjacencyList,
  findComponents,
} = require('../src/services/graphService');

describe('Graph Service', () => {
  describe('deduplicateEdges', () => {
    test('removes duplicate edges, keeps first occurrence', () => {
      const edges = [
        { from: 'A', to: 'B', raw: 'A->B' },
        { from: 'A', to: 'B', raw: 'A->B' },
        { from: 'A', to: 'B', raw: 'A->B' },
      ];
      const { uniqueEdges, duplicateEdges } = deduplicateEdges(edges);
      expect(uniqueEdges).toHaveLength(1);
      expect(duplicateEdges).toEqual(['A->B']);
    });

    test('handles no duplicates', () => {
      const edges = [
        { from: 'A', to: 'B', raw: 'A->B' },
        { from: 'C', to: 'D', raw: 'C->D' },
      ];
      const { uniqueEdges, duplicateEdges } = deduplicateEdges(edges);
      expect(uniqueEdges).toHaveLength(2);
      expect(duplicateEdges).toHaveLength(0);
    });

    test('records duplicate edge only once even if repeated many times', () => {
      const edges = Array(10).fill({ from: 'A', to: 'B', raw: 'A->B' });
      const { duplicateEdges } = deduplicateEdges(edges);
      expect(duplicateEdges).toEqual(['A->B']);
    });
  });

  describe('resolveMultiParent', () => {
    test('first parent wins for diamond pattern', () => {
      const edges = [
        { from: 'A', to: 'D', raw: 'A->D' },
        { from: 'B', to: 'D', raw: 'B->D' },
      ];
      const resolved = resolveMultiParent(edges);
      expect(resolved).toHaveLength(1);
      expect(resolved[0].from).toBe('A');
    });

    test('handles no conflicts', () => {
      const edges = [
        { from: 'A', to: 'B', raw: 'A->B' },
        { from: 'A', to: 'C', raw: 'A->C' },
      ];
      const resolved = resolveMultiParent(edges);
      expect(resolved).toHaveLength(2);
    });
  });

  describe('detectCycle', () => {
    test('detects simple cycle A->B->C->A', () => {
      const adj = new Map([
        ['A', ['B']],
        ['B', ['C']],
        ['C', ['A']],
      ]);
      const component = new Set(['A', 'B', 'C']);
      expect(detectCycle('A', adj, component)).toBe(true);
    });

    test('returns false for acyclic tree', () => {
      const adj = new Map([
        ['A', ['B', 'C']],
        ['B', ['D']],
      ]);
      const component = new Set(['A', 'B', 'C', 'D']);
      expect(detectCycle('A', adj, component)).toBe(false);
    });

    test('detects self-referencing cycle in component', () => {
      const adj = new Map([
        ['A', ['B']],
        ['B', ['A']],
      ]);
      const component = new Set(['A', 'B']);
      expect(detectCycle('A', adj, component)).toBe(true);
    });
  });

  describe('processEdges - full pipeline', () => {
    test('simple tree: A->B, A->C, B->D', () => {
      const edges = [
        { from: 'A', to: 'B', raw: 'A->B' },
        { from: 'A', to: 'C', raw: 'A->C' },
        { from: 'B', to: 'D', raw: 'B->D' },
      ];
      const result = processEdges(edges);

      expect(result.hierarchies).toHaveLength(1);
      expect(result.hierarchies[0].root).toBe('A');
      expect(result.hierarchies[0].tree).toEqual({
        A: { B: { D: {} }, C: {} },
      });
      expect(result.hierarchies[0].depth).toBe(3);
      expect(result.hierarchies[0].has_cycle).toBeUndefined();
      expect(result.summary.total_trees).toBe(1);
      expect(result.summary.total_cycles).toBe(0);
      expect(result.summary.largest_tree_root).toBe('A');
    });

    test('cycle: A->B, B->C, C->A', () => {
      const edges = [
        { from: 'A', to: 'B', raw: 'A->B' },
        { from: 'B', to: 'C', raw: 'B->C' },
        { from: 'C', to: 'A', raw: 'C->A' },
      ];
      const result = processEdges(edges);

      expect(result.hierarchies).toHaveLength(1);
      expect(result.hierarchies[0].has_cycle).toBe(true);
      expect(result.hierarchies[0].root).toBe('A');
      expect(result.summary.total_cycles).toBe(1);
      expect(result.summary.total_trees).toBe(0);
    });

    test('forest: two independent trees', () => {
      const edges = [
        { from: 'A', to: 'B', raw: 'A->B' },
        { from: 'C', to: 'D', raw: 'C->D' },
      ];
      const result = processEdges(edges);

      expect(result.hierarchies).toHaveLength(2);
      expect(result.summary.total_trees).toBe(2);
    });

    test('empty edges produces empty result', () => {
      const result = processEdges([]);
      expect(result.hierarchies).toHaveLength(0);
      expect(result.duplicateEdges).toHaveLength(0);
      expect(result.summary.total_trees).toBe(0);
      expect(result.summary.total_cycles).toBe(0);
      expect(result.summary.largest_tree_root).toBe('');
    });

    test('duplicate edges handled correctly', () => {
      const edges = [
        { from: 'A', to: 'B', raw: 'A->B' },
        { from: 'A', to: 'B', raw: 'A->B' },
        { from: 'A', to: 'C', raw: 'A->C' },
      ];
      const result = processEdges(edges);

      expect(result.duplicateEdges).toEqual(['A->B']);
      expect(result.hierarchies).toHaveLength(1);
    });

    test('diamond pattern: multi-parent resolution', () => {
      const edges = [
        { from: 'A', to: 'B', raw: 'A->B' },
        { from: 'A', to: 'C', raw: 'A->C' },
        { from: 'B', to: 'D', raw: 'B->D' },
        { from: 'C', to: 'D', raw: 'C->D' },
      ];
      const result = processEdges(edges);

      // D should only have one parent (B, the first one)
      expect(result.hierarchies).toHaveLength(1);
      expect(result.hierarchies[0].tree).toEqual({
        A: { B: { D: {} }, C: {} },
      });
    });

    test('largest tree root uses lexicographic tiebreak', () => {
      const edges = [
        { from: 'B', to: 'C', raw: 'B->C' },
        { from: 'A', to: 'D', raw: 'A->D' },
      ];
      const result = processEdges(edges);

      // Both trees have depth 2, A < B lexicographically
      expect(result.summary.largest_tree_root).toBe('A');
    });

    test('hierarchies preserve input order of components', () => {
      const edges = [
        { from: 'C', to: 'D', raw: 'C->D' },
        { from: 'A', to: 'B', raw: 'A->B' },
      ];
      const result = processEdges(edges);

      // C->D appears first in input, so component C should be first
      expect(result.hierarchies[0].root).toBe('C');
      expect(result.hierarchies[1].root).toBe('A');
    });

    test('full challenge test case matches expected output', () => {
      const edges = [
        { from: 'A', to: 'B', raw: 'A->B' },
        { from: 'A', to: 'C', raw: 'A->C' },
        { from: 'B', to: 'D', raw: 'B->D' },
        { from: 'C', to: 'E', raw: 'C->E' },
        { from: 'E', to: 'F', raw: 'E->F' },
        { from: 'X', to: 'Y', raw: 'X->Y' },
        { from: 'Y', to: 'Z', raw: 'Y->Z' },
        { from: 'Z', to: 'X', raw: 'Z->X' },
        { from: 'P', to: 'Q', raw: 'P->Q' },
        { from: 'Q', to: 'R', raw: 'Q->R' },
        { from: 'G', to: 'H', raw: 'G->H' },
        { from: 'G', to: 'H', raw: 'G->H' },
        { from: 'G', to: 'I', raw: 'G->I' },
      ];
      const result = processEdges(edges);

      // Verify input-order: A, X, P, G
      expect(result.hierarchies).toHaveLength(4);
      expect(result.hierarchies[0].root).toBe('A');
      expect(result.hierarchies[0].depth).toBe(4);
      expect(result.hierarchies[0].tree).toEqual({ A: { B: { D: {} }, C: { E: { F: {} } } } });

      expect(result.hierarchies[1].root).toBe('X');
      expect(result.hierarchies[1].has_cycle).toBe(true);

      expect(result.hierarchies[2].root).toBe('P');
      expect(result.hierarchies[2].depth).toBe(3);
      expect(result.hierarchies[2].tree).toEqual({ P: { Q: { R: {} } } });

      expect(result.hierarchies[3].root).toBe('G');
      expect(result.hierarchies[3].depth).toBe(2);
      expect(result.hierarchies[3].tree).toEqual({ G: { H: {}, I: {} } });

      expect(result.duplicateEdges).toEqual(['G->H']);
      expect(result.summary).toEqual({
        total_trees: 3,
        total_cycles: 1,
        largest_tree_root: 'A',
      });
    });
  });
});
