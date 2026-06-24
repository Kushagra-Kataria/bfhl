/**
 * Input Validator
 *
 * Validates edge strings against the format: X->Y
 * where X and Y are exactly one uppercase letter A-Z,
 * and X !== Y (no self-loops).
 */

const EDGE_REGEX = /^([A-Z])->([A-Z])$/;

/**
 * Validates and classifies a list of raw edge strings.
 *
 * @param {string[]} rawEdges - Array of raw edge strings from the request
 * @returns {{ validEdges: Array<{from: string, to: string, raw: string}>, invalidEntries: string[] }}
 */
function validateEdges(rawEdges) {
  const validEdges = [];
  const invalidEntries = [];

  for (const raw of rawEdges) {
    // Trim whitespace before validation
    const trimmed = typeof raw === 'string' ? raw.trim() : String(raw).trim();

    const match = trimmed.match(EDGE_REGEX);

    if (!match) {
      invalidEntries.push(trimmed);
      continue;
    }

    const [, from, to] = match;

    // Reject self-loops (A->A)
    if (from === to) {
      invalidEntries.push(trimmed);
      continue;
    }

    validEdges.push({ from, to, raw: trimmed });
  }

  return { validEdges, invalidEntries };
}

/**
 * Validates the request body structure.
 *
 * @param {*} body - The request body
 * @returns {{ valid: boolean, error?: string }}
 */
function validateRequestBody(body) {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Request body must be a JSON object' };
  }

  if (!('data' in body)) {
    return { valid: false, error: 'Missing required field: "data"' };
  }

  if (!Array.isArray(body.data)) {
    return { valid: false, error: '"data" must be an array of strings' };
  }

  return { valid: true };
}

module.exports = { validateEdges, validateRequestBody };
