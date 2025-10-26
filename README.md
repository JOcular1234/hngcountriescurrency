# Country Currency & Exchange API

A RESTful API that fetches country data from external sources, enriches it with currency exchange rates, calculates estimated GDP, stores everything in MySQL, and provides comprehensive CRUD operations with filtering and sorting capabilities.

## 🚀 Features

- **Data Integration**: Fetches real-time country data and exchange rates from external APIs
- **Smart Caching**: Stores and updates country data in MySQL database
- **GDP Estimation**: Calculates estimated GDP using population and exchange rates
- **Advanced Filtering**: Filter by region, currency, and sort by multiple fields
- **Image Generation**: Automatically generates visual summaries with top countries
- **Error Handling**: Comprehensive validation and error responses
- **Production Ready**: Built with best practices and deployment in mind

## 📋 Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running Locally](#running-locally)
- [API Endpoints](#api-endpoints)
- [Response Examples](#response-examples)
- [Error Handling](#error-handling)
- [Deployment](#deployment)
- [Technologies Used](#technologies-used)

## 🛠 Installation

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Steps

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd country-currency-exchange-api
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=countries_db
DB_PORT=3306

# API Configuration
COUNTRIES_API_URL=https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies
EXCHANGE_API_URL=https://open.er-api.com/v6/latest/USD

# Cache Configuration
IMAGE_CACHE_PATH=cache/summary.png
```

## 💾 Database Setup

### Option 1: Automatic Setup
The application will automatically create the database schema on first run.

### Option 2: Manual Setup
Connect to MySQL and run:

```sql
CREATE DATABASE countries_db;
USE countries_db;

-- The tables will be created automatically by the application
```

The application creates two tables:
- `countries` - Stores all country data
- `refresh_metadata` - Tracks refresh timestamps

## 🏃‍♂️ Running Locally

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000` (or your configured PORT).

You should see:
```
✅ Database connection established
✅ Database schema initialized successfully

🚀 Server is running on port 3000
📍 API URL: http://localhost:3000
📖 Documentation: http://localhost:3000/

✨ Ready to accept requests!
```

## 📚 API Endpoints

### Base URL
```
http://localhost:3000
```

### Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API documentation and status |
| POST | `/countries/refresh` | Fetch and cache country data |
| GET | `/countries` | Get all countries (with filters) |
| GET | `/countries/:name` | Get single country by name |
| DELETE | `/countries/:name` | Delete a country record |
| GET | `/status` | Get API statistics |
| GET | `/countries/image` | Get generated summary image |

### Detailed Endpoint Documentation

#### 1. Refresh Countries Data
```http
POST /countries/refresh
```

**Description**: Fetches country data and exchange rates from external APIs, processes the data, and stores it in the database. Also generates a summary image.

**Response**:
```json
{
  "message": "Countries refreshed successfully",
  "total_countries": 250,
  "inserted": 50,
  "updated": 200,
  "last_refreshed_at": "2025-10-26T14:30:00Z"
}
```

**Error Responses**:
- `503 Service Unavailable` - External API failure
```json
{
  "error": "External data source unavailable",
  "details": "Could not fetch data from REST Countries API"
}
```

---

#### 2. Get All Countries
```http
GET /countries
```

**Query Parameters**:
- `region` (optional) - Filter by region (e.g., `Africa`, `Europe`, `Asia`)
- `currency` (optional) - Filter by currency code (e.g., `NGN`, `USD`, `EUR`)
- `sort` (optional) - Sort results:
  - `gdp_desc` - Sort by GDP (highest first)
  - `gdp_asc` - Sort by GDP (lowest first)
  - `population_desc` - Sort by population (highest first)
  - `population_asc` - Sort by population (lowest first)
  - `name_asc` - Sort alphabetically (A-Z)
  - `name_desc` - Sort alphabetically (Z-A)

**Examples**:

Get all African countries:
```http
GET /countries?region=Africa
```

Get countries using Nigerian Naira:
```http
GET /countries?currency=NGN
```

Get African countries sorted by GDP:
```http
GET /countries?region=Africa&sort=gdp_desc
```

**Response**:
```json
[
  {
    "id": 1,
    "name": "Nigeria",
    "capital": "Abuja",
    "region": "Africa",
    "population": 206139589,
    "currency_code": "NGN",
    "exchange_rate": 1600.23,
    "estimated_gdp": 25767448125.2,
    "flag_url": "https://flagcdn.com/ng.svg",
    "last_refreshed_at": "2025-10-26T14:30:00Z",
    "created_at": "2025-10-26T12:00:00Z"
  }
]
```

---

#### 3. Get Single Country
```http
GET /countries/:name
```

**Example**:
```http
GET /countries/Nigeria
```

**Response**:
```json
{
  "id": 1,
  "name": "Nigeria",
  "capital": "Abuja",
  "region": "Africa",
  "population": 206139589,
  "currency_code": "NGN",
  "exchange_rate": 1600.23,
  "estimated_gdp": 25767448125.2,
  "flag_url": "https://flagcdn.com/ng.svg",
  "last_refreshed_at": "2025-10-26T14:30:00Z",
  "created_at": "2025-10-26T12:00:00Z"
}
```

**Error Response**:
```json
{
  "error": "Country not found"
}
```

---

#### 4. Delete Country
```http
DELETE /countries/:name
```

**Example**:
```http
DELETE /countries/Nigeria
```

**Response**:
```json
{
  "message": "Country deleted successfully",
  "name": "Nigeria"
}
```

**Error Response**:
```json
{
  "error": "Country not found"
}
```

---

#### 5. Get API Status
```http
GET /status
```

**Response**:
```json
{
  "total_countries": 250,
  "last_refreshed_at": "2025-10-26T14:30:00Z"
}
```

---

#### 6. Get Summary Image
```http
GET /countries/image
```

**Description**: Returns a PNG image with statistics about countries and top 5 by GDP.

**Response**: Image file (`image/png`)

**Error Response**:
```json
{
  "error": "Summary image not found"
}
```

## 📦 Response Examples

### Successful Country Data
```json
{
  "id": 1,
  "name": "Nigeria",
  "capital": "Abuja",
  "region": "Africa",
  "population": 206139589,
  "currency_code": "NGN",
  "exchange_rate": 1600.23,
  "estimated_gdp": 25767448125.2,
  "flag_url": "https://flagcdn.com/ng.svg",
  "last_refreshed_at": "2025-10-26T14:30:00Z",
  "created_at": "2025-10-26T12:00:00Z"
}
```

### Country Without Currency
```json
{
  "id": 45,
  "name": "Antarctica",
  "capital": null,
  "region": "Polar",
  "population": 1000,
  "currency_code": null,
  "exchange_rate": null,
  "estimated_gdp": 0,
  "flag_url": "https://flagcdn.com/aq.svg",
  "last_refreshed_at": "2025-10-26T14:30:00Z",
  "created_at": "2025-10-26T12:00:00Z"
}
```

## ❌ Error Handling

The API returns consistent JSON error responses:

### 400 Bad Request
```json
{
  "error": "Validation failed",
  "details": {
    "currency_code": "is required"
  }
}
```

### 404 Not Found
```json
{
  "error": "Country not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

### 503 Service Unavailable
```json
{
  "error": "External data source unavailable",
  "details": "Could not fetch data from Exchange Rate API"
}
```

## 🚢 Deployment

### Supported Platforms
- Railway ⭐ **Recommended** - [See RAILWAY_SETUP.md for detailed guide](./RAILWAY_SETUP.md)
- Heroku
- AWS (EC2, Elastic Beanstalk, Lambda)
- DigitalOcean
- Any platform supporting Node.js and MySQL

> **📘 Quick Start:** For Railway deployment, see [RAILWAY_SETUP.md](./RAILWAY_SETUP.md) for a complete step-by-step guide with troubleshooting.

### Deployment Steps (Railway Example)

1. **Install Railway CLI**
```bash
npm install -g @railway/cli
```

2. **Login to Railway**
```bash
railway login
```

3. **Initialize project**
```bash
railway init
```

4. **Add MySQL database**
```bash
railway add mysql
```

5. **Set environment variables**
```bash
railway variables set PORT=3000
railway variables set NODE_ENV=production
# Database variables will be automatically set by Railway
```

6. **Deploy**
```bash
railway up
```

7. **Get your deployment URL**
```bash
railway domain
```

### Environment Variables for Deployment

**Railway (Automatic):**
Railway automatically sets these when you add a MySQL database:
- `MYSQLHOST`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`, `MYSQLPORT`
- App automatically detects and uses Railway's variables ✅

**Other Platforms (Manual):**
Set these environment variables:
- `PORT` - Server port (usually set automatically)
- `NODE_ENV` - Set to `production`
- `DB_HOST` - Database host
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name
- `DB_PORT` - Database port (usually 3306)

## 🔧 Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL2** - Database driver
- **Axios** - HTTP client for external APIs
- **Canvas** - Image generation
- **dotenv** - Environment variable management
- **CORS** - Cross-origin resource sharing

## 📝 Data Sources

- **Countries Data**: [REST Countries API](https://restcountries.com/)
- **Exchange Rates**: [Open Exchange Rates API](https://open.er-api.com/)

## 🧪 Testing the API

### Using cURL

**Refresh data**:
```bash
curl -X POST http://localhost:3000/countries/refresh
```

**Get all countries**:
```bash
curl http://localhost:3000/countries
```

**Filter by region**:
```bash
curl http://localhost:3000/countries?region=Africa
```

**Get single country**:
```bash
curl http://localhost:3000/countries/Nigeria
```

**Get status**:
```bash
curl http://localhost:3000/status
```

**Download summary image**:
```bash
curl http://localhost:3000/countries/image -o summary.png
```

### Using Postman

1. Import the endpoints listed above
2. Start with `POST /countries/refresh` to populate the database
3. Test other endpoints with various query parameters

## 📁 Project Structure

```
country-currency-exchange-api/
├── src/
│   ├── config/
│   │   └── database.js          # Database configuration and initialization
│   ├── controllers/
│   │   └── countryController.js # Route handlers
│   ├── middleware/
│   │   ├── errorHandler.js      # Error handling middleware
│   │   └── validation.js        # Validation utilities
│   ├── routes/
│   │   └── countryRoutes.js     # API routes
│   ├── services/
│   │   ├── externalApi.js       # External API integration
│   │   └── imageGenerator.js    # Image generation service
│   └── app.js                    # Express application setup
├── cache/                         # Generated images
├── .env                          # Environment variables (not in git)
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore rules
├── index.js                      # Application entry point
├── package.json                  # Dependencies and scripts
└── README.md                     # This file
```

## 🐛 Troubleshooting

### Database Connection Issues
- Verify MySQL is running: `mysql -u root -p`
- Check credentials in `.env` file
- Ensure database user has proper permissions

### External API Failures
- Check internet connection
- Verify API URLs are accessible
- Check for rate limiting on external APIs

### Image Generation Issues
- Ensure `cache/` directory has write permissions
- Verify canvas package is properly installed
- Check system has required image processing libraries

## 📄 License

ISC

## 👥 Contributing

Feel free to submit issues and enhancement requests!

## 📧 Support

For questions or support, please open an issue in the repository.

---

**Built with ❤️ for the Backend Development Challenge**
