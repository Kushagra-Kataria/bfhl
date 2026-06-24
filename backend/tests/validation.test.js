const { validateEdges, validateRequestBody } = require('../src/validators/inputValidator');

describe('Input Validator', () => {
  describe('validateRequestBody', () => {
    test('rejects missing body', () => {
      expect(validateRequestBody(null).valid).toBe(false);
      expect(validateRequestBody(undefined).valid).toBe(false);
    });

    test('rejects non-object body', () => {
      expect(validateRequestBody('string').valid).toBe(false);
    });

    test('rejects missing data field', () => {
      expect(validateRequestBody({}).valid).toBe(false);
    });

    test('rejects non-array data', () => {
      expect(validateRequestBody({ data: 'abc' }).valid).toBe(false);
      expect(validateRequestBody({ data: 123 }).valid).toBe(false);
    });

    test('accepts valid body with array data', () => {
      expect(validateRequestBody({ data: [] }).valid).toBe(true);
      expect(validateRequestBody({ data: ['A->B'] }).valid).toBe(true);
    });
  });

  describe('validateEdges', () => {
    test('accepts valid edges', () => {
      const { validEdges, invalidEntries } = validateEdges(['A->B', 'C->D', 'Z->Q']);
      expect(validEdges).toHaveLength(3);
      expect(invalidEntries).toHaveLength(0);
      expect(validEdges[0]).toEqual({ from: 'A', to: 'B', raw: 'A->B' });
    });

    test('rejects invalid formats', () => {
      const inputs = ['hello', '1->2', 'AB->C', 'A-B', 'A->', ''];
      const { validEdges, invalidEntries } = validateEdges(inputs);
      expect(validEdges).toHaveLength(0);
      expect(invalidEntries).toHaveLength(6);
    });

    test('rejects self-loops', () => {
      const { validEdges, invalidEntries } = validateEdges(['A->A', 'B->B']);
      expect(validEdges).toHaveLength(0);
      expect(invalidEntries).toHaveLength(2);
    });

    test('trims whitespace', () => {
      const { validEdges } = validateEdges([' A->B ', '  C->D  ']);
      expect(validEdges).toHaveLength(2);
      expect(validEdges[0].raw).toBe('A->B');
      expect(validEdges[1].raw).toBe('C->D');
    });

    test('rejects lowercase letters', () => {
      const { invalidEntries } = validateEdges(['a->b', 'a->B']);
      expect(invalidEntries).toHaveLength(2);
    });

    test('rejects multi-character nodes', () => {
      const { invalidEntries } = validateEdges(['AB->C', 'A->CD']);
      expect(invalidEntries).toHaveLength(2);
    });

    test('handles mixed valid and invalid', () => {
      const { validEdges, invalidEntries } = validateEdges(['A->B', 'hello', 'C->D', '1->2']);
      expect(validEdges).toHaveLength(2);
      expect(invalidEntries).toHaveLength(2);
    });
  });
});
