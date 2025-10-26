const axios = require('axios');
require('dotenv').config();

const COUNTRIES_API_URL = process.env.COUNTRIES_API_URL || 'https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies';
const EXCHANGE_API_URL = process.env.EXCHANGE_API_URL || 'https://open.er-api.com/v6/latest/USD';

/**
 * Fetch all countries from REST Countries API
 */
async function fetchCountries() {
  try {
    const response = await axios.get(COUNTRIES_API_URL, {
      timeout: 30000, // 30 second timeout
      headers: {
        'Accept': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching countries:', error.message);
    throw new Error(`Could not fetch data from REST Countries API: ${error.message}`);
  }
}

/**
 * Fetch exchange rates from Open Exchange Rates API
 */
async function fetchExchangeRates() {
  try {
    const response = await axios.get(EXCHANGE_API_URL, {
      timeout: 30000, // 30 second timeout
      headers: {
        'Accept': 'application/json'
      }
    });
    return response.data.rates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error.message);
    throw new Error(`Could not fetch data from Exchange Rate API: ${error.message}`);
  }
}

/**
 * Process country data and match with exchange rates
 */
function processCountryData(countries, exchangeRates) {
  return countries.map(country => {
    const currencyCode = country.currencies && country.currencies.length > 0 
      ? country.currencies[0].code 
      : null;

    let exchangeRate = null;
    let estimatedGdp = null;

    if (currencyCode && exchangeRates[currencyCode]) {
      exchangeRate = exchangeRates[currencyCode];
      const randomMultiplier = Math.random() * (2000 - 1000) + 1000;
      estimatedGdp = (country.population * randomMultiplier) / exchangeRate;
    } else if (currencyCode === null) {
      estimatedGdp = 0;
    }

    return {
      name: country.name,
      capital: country.capital || null,
      region: country.region || null,
      population: country.population,
      currency_code: currencyCode,
      exchange_rate: exchangeRate,
      estimated_gdp: estimatedGdp,
      flag_url: country.flag || null
    };
  });
}

module.exports = {
  fetchCountries,
  fetchExchangeRates,
  processCountryData
};
