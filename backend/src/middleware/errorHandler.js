/**
 * 404 Not Found handler
 */
function notFoundHandler(req, res) {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} does not exist`,
  });
}

/**
 * Global error handler middleware
 * Catches all unhandled errors and returns appropriate HTTP responses
 */
function errorHandler(err, req, res, _next) {
  console.error('Unhandled error:', err);

  // JSON parse errors
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Malformed JSON in request body',
    });
  }

  // Custom application errors
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      error: err.name || 'Error',
      message: err.message,
    });
  }

  // Default to 500
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred. Please try again later.',
  });
}

module.exports = { errorHandler, notFoundHandler };
