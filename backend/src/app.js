const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bfhlRoutes = require('./routes/bfhlRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

// Security & logging middleware
app.use(helmet());
app.use(morgan('dev'));

// Enable CORS globally for all origins (evaluator calls from another origin)
app.use(cors());

// Body parsing
app.use(express.json({ limit: '1mb' }));

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'BFHL Backend API is running',
    endpoint: 'POST /bfhl',
  });
});

// API routes
app.use('/bfhl', bfhlRoutes);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

module.exports = app;
