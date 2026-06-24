const { validateRequestBody, validateEdges } = require('../validators/inputValidator');
const { processEdges } = require('../services/graphService');

/**
 * POST /bfhl
 *
 * Processes hierarchical node relationships and returns structured insights.
 */
async function handleBfhl(req, res, next) {
  try {
    // Validate request body structure
    const bodyValidation = validateRequestBody(req.body);
    if (!bodyValidation.valid) {
      return res.status(400).json({
        error: 'Bad Request',
        message: bodyValidation.error,
      });
    }

    // Validate individual edges
    const { validEdges, invalidEntries } = validateEdges(req.body.data);

    // Process valid edges through the graph pipeline
    const { hierarchies, duplicateEdges, summary } = processEdges(validEdges);

    // Build response with identity fields from environment
    const response = {
      user_id: process.env.USER_ID || 'fullname_ddmmyyyy',
      email_id: process.env.EMAIL_ID || 'college_email',
      college_roll_number: process.env.COLLEGE_ROLL_NUMBER || 'college_roll_number',
      hierarchies,
      invalid_entries: invalidEntries,
      duplicate_edges: duplicateEdges,
      summary,
    };

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

module.exports = { handleBfhl };
