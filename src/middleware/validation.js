/**
 * Validation middleware for country data
 */
function validateCountryData(data) {
  const errors = {};

  if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
    errors.name = 'is required and must be a non-empty string';
  }

  if (data.population === undefined || data.population === null) {
    errors.population = 'is required';
  } else if (typeof data.population !== 'number' || data.population < 0) {
    errors.population = 'must be a non-negative number';
  }

  if (data.currency_code !== null && data.currency_code !== undefined) {
    if (typeof data.currency_code !== 'string' || data.currency_code.trim() === '') {
      errors.currency_code = 'must be a valid string when provided';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Error response formatter
 */
function formatErrorResponse(statusCode, message, details = null) {
  const response = { error: message };
  if (details) {
    response.details = details;
  }
  return { statusCode, response };
}

module.exports = {
  validateCountryData,
  formatErrorResponse
};
