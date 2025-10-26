const express = require('express');
const router = express.Router();
const {
  refreshCountries,
  getCountries,
  getCountryByName,
  deleteCountry,
  getStatus,
  getSummaryImage
} = require('../controllers/countryController');

// Refresh countries data
router.post('/refresh', refreshCountries);

// Get all countries (with optional filters and sorting)
router.get('/', getCountries);

// Get summary image
router.get('/image', getSummaryImage);

// Get single country by name
router.get('/:name', getCountryByName);

// Delete country by name
router.delete('/:name', deleteCountry);

module.exports = router;
