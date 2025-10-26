const express = require('express');
const cors = require('cors');

const countryRoutes = require('./routes/countryRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { getStatus } = require('./controllers/countryController');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check route
app.get('/', (req, res) => {
  res.json({
    message: 'Country Currency & Exchange API',
    version: '1.0.0',
    status: 'active',
    endpoints: {
      refresh: 'POST /countries/refresh',
      list: 'GET /countries',
      filters: 'GET /countries?region=Africa&currency=NGN&sort=gdp_desc',
      single: 'GET /countries/:name',
      delete: 'DELETE /countries/:name',
      status: 'GET /status',
      image: 'GET /countries/image'
    }
  });
});

// Status route
app.get('/status', getStatus);

// Country routes
app.use('/countries', countryRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

module.exports = app;
