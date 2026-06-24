/**
 * API Service
 *
 * Handles communication with the BFHL backend API.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * Sends edge data to the POST /bfhl endpoint.
 *
 * @param {string[]} data - Array of edge strings (e.g., ["A->B", "A->C"])
 * @returns {Promise<object>} The API response
 */
export async function processEdges(data) {
  const response = await fetch(`${API_BASE_URL}/bfhl`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || `Server error: ${response.status}`);
  }

  return response.json();
}
