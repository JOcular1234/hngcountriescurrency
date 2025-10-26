const { pool } = require('../config/database');
const { fetchCountries, fetchExchangeRates, processCountryData } = require('../services/externalApi');
const { generateSummaryImage } = require('../services/imageGenerator');
const { validateCountryData, formatErrorResponse } = require('../middleware/validation');

/**
 * POST /countries/refresh
 * Fetch and cache country data with exchange rates
 */
async function refreshCountries(req, res, next) {
  let connection;
  try {
    console.log('🔄 Starting country data refresh...');

    // Fetch external data
    const [countries, exchangeRates] = await Promise.all([
      fetchCountries(),
      fetchExchangeRates()
    ]);

    console.log(`📊 Fetched ${countries.length} countries and exchange rates`);

    // Process country data
    const processedCountries = processCountryData(countries, exchangeRates);

    // Get database connection
    connection = await pool.getConnection();
    await connection.beginTransaction();

    let insertedCount = 0;
    let updatedCount = 0;

    // Upsert each country
    for (const country of processedCountries) {
      // Validate data
      const validation = validateCountryData(country);
      if (!validation.isValid) {
        console.warn(`⚠️ Skipping invalid country: ${country.name}`, validation.errors);
        continue;
      }

      // Check if country exists (case-insensitive)
      const [existing] = await connection.query(
        'SELECT id FROM countries WHERE LOWER(name) = LOWER(?)',
        [country.name]
      );

      if (existing.length > 0) {
        // Update existing country
        await connection.query(
          `UPDATE countries 
           SET capital = ?, region = ?, population = ?, currency_code = ?, 
               exchange_rate = ?, estimated_gdp = ?, flag_url = ?, 
               last_refreshed_at = NOW()
           WHERE id = ?`,
          [
            country.capital,
            country.region,
            country.population,
            country.currency_code,
            country.exchange_rate,
            country.estimated_gdp,
            country.flag_url,
            existing[0].id
          ]
        );
        updatedCount++;
      } else {
        // Insert new country
        await connection.query(
          `INSERT INTO countries 
           (name, capital, region, population, currency_code, exchange_rate, estimated_gdp, flag_url)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            country.name,
            country.capital,
            country.region,
            country.population,
            country.currency_code,
            country.exchange_rate,
            country.estimated_gdp,
            country.flag_url
          ]
        );
        insertedCount++;
      }
    }

    // Update metadata
    const [countResult] = await connection.query('SELECT COUNT(*) as total FROM countries');
    const totalCountries = countResult[0].total;

    await connection.query(
      'UPDATE refresh_metadata SET last_refreshed_at = NOW(), total_countries = ? WHERE id = 1',
      [totalCountries]
    );

    await connection.commit();

    console.log(`✅ Refresh complete: ${insertedCount} inserted, ${updatedCount} updated`);

    // Get top 5 countries for image
    const [topCountries] = await connection.query(
      'SELECT name, estimated_gdp FROM countries WHERE estimated_gdp IS NOT NULL ORDER BY estimated_gdp DESC LIMIT 5'
    );

    const [metadata] = await connection.query('SELECT last_refreshed_at FROM refresh_metadata WHERE id = 1');

    // Generate summary image
    try {
      await generateSummaryImage(totalCountries, topCountries, metadata[0].last_refreshed_at);
    } catch (imageError) {
      console.error('⚠️ Failed to generate image:', imageError.message);
    }

    res.status(200).json({
      message: 'Countries refreshed successfully',
      total_countries: totalCountries,
      inserted: insertedCount,
      updated: updatedCount,
      last_refreshed_at: metadata[0].last_refreshed_at
    });

  } catch (error) {
    if (connection) {
      await connection.rollback();
    }

    // Check if it's an external API error
    if (error.message.includes('Could not fetch data')) {
      return res.status(503).json({
        error: 'External data source unavailable',
        details: error.message
      });
    }

    next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

/**
 * GET /countries
 * Get all countries with optional filtering and sorting
 */
async function getCountries(req, res, next) {
  try {
    const { region, currency, sort } = req.query;

    let query = 'SELECT * FROM countries WHERE 1=1';
    const params = [];

    // Apply filters
    if (region) {
      query += ' AND LOWER(region) = LOWER(?)';
      params.push(region);
    }

    if (currency) {
      query += ' AND LOWER(currency_code) = LOWER(?)';
      params.push(currency);
    }

    // Apply sorting
    if (sort === 'gdp_desc') {
      query += ' ORDER BY estimated_gdp DESC';
    } else if (sort === 'gdp_asc') {
      query += ' ORDER BY estimated_gdp ASC';
    } else if (sort === 'population_desc') {
      query += ' ORDER BY population DESC';
    } else if (sort === 'population_asc') {
      query += ' ORDER BY population ASC';
    } else if (sort === 'name_asc') {
      query += ' ORDER BY name ASC';
    } else if (sort === 'name_desc') {
      query += ' ORDER BY name DESC';
    } else {
      query += ' ORDER BY name ASC'; // Default sorting
    }

    const [countries] = await pool.query(query, params);

    res.status(200).json(countries);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /countries/:name
 * Get a single country by name
 */
async function getCountryByName(req, res, next) {
  try {
    const { name } = req.params;

    const [countries] = await pool.query(
      'SELECT * FROM countries WHERE LOWER(name) = LOWER(?)',
      [name]
    );

    if (countries.length === 0) {
      return res.status(404).json({
        error: 'Country not found'
      });
    }

    res.status(200).json(countries[0]);
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /countries/:name
 * Delete a country by name
 */
async function deleteCountry(req, res, next) {
  try {
    const { name } = req.params;

    const [result] = await pool.query(
      'DELETE FROM countries WHERE LOWER(name) = LOWER(?)',
      [name]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: 'Country not found'
      });
    }

    // Update metadata
    const [countResult] = await pool.query('SELECT COUNT(*) as total FROM countries');
    await pool.query(
      'UPDATE refresh_metadata SET total_countries = ? WHERE id = 1',
      [countResult[0].total]
    );

    res.status(200).json({
      message: 'Country deleted successfully',
      name: name
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /status
 * Get API status and statistics
 */
async function getStatus(req, res, next) {
  try {
    const [metadata] = await pool.query(
      'SELECT total_countries, last_refreshed_at FROM refresh_metadata WHERE id = 1'
    );

    if (metadata.length === 0) {
      return res.status(200).json({
        total_countries: 0,
        last_refreshed_at: null
      });
    }

    res.status(200).json({
      total_countries: metadata[0].total_countries,
      last_refreshed_at: metadata[0].last_refreshed_at
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /countries/image
 * Serve the generated summary image
 */
async function getSummaryImage(req, res, next) {
  try {
    const path = require('path');
    const fs = require('fs');
    
    const imagePath = path.join(process.cwd(), 'cache', 'summary.png');

    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({
        error: 'Summary image not found'
      });
    }

    res.sendFile(imagePath);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  refreshCountries,
  getCountries,
  getCountryByName,
  deleteCountry,
  getStatus,
  getSummaryImage
};
