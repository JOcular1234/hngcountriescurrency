# ⚡ Quick Start Guide

Get the API running in 5 minutes!

## 📋 Prerequisites

- ✅ Node.js (v14+) installed
- ✅ MySQL (v8.0+) installed and running
- ✅ npm or yarn installed

## 🚀 Setup Steps

### 1. Configure Environment

Create a `.env` file in the root directory:

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` with your MySQL credentials:

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=countries_db
DB_PORT=3306
```

### 2. Create Database

Open MySQL and run:

```sql
CREATE DATABASE countries_db;
```

**Note:** Tables will be created automatically when you start the server.

### 3. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

You should see:
```
✅ Database connection established
✅ Database schema initialized successfully

🚀 Server is running on port 3000
📍 API URL: http://localhost:3000
📖 Documentation: http://localhost:3000/

✨ Ready to accept requests!
```

### 4. Populate Database

**Fetch and cache country data:**
```bash
curl -X POST http://localhost:3000/countries/refresh
```

⏱️ This takes 10-30 seconds. You'll see:
```json
{
  "message": "Countries refreshed successfully",
  "total_countries": 250,
  "inserted": 250,
  "updated": 0,
  "last_refreshed_at": "2025-10-26T14:30:00.000Z"
}
```

### 5. Test the API

**Get all countries:**
```bash
curl http://localhost:3000/countries
```

**Get African countries:**
```bash
curl "http://localhost:3000/countries?region=Africa"
```

**Get Nigeria:**
```bash
curl http://localhost:3000/countries/Nigeria
```

**Get API status:**
```bash
curl http://localhost:3000/status
```

**Download summary image:**
```bash
curl http://localhost:3000/countries/image -o summary.png
```

## 🎯 Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/countries/refresh` | Fetch & cache data |
| GET | `/countries` | List all countries |
| GET | `/countries?region=Africa` | Filter by region |
| GET | `/countries?currency=NGN` | Filter by currency |
| GET | `/countries?sort=gdp_desc` | Sort by GDP |
| GET | `/countries/:name` | Get single country |
| DELETE | `/countries/:name` | Delete country |
| GET | `/status` | API statistics |
| GET | `/countries/image` | Summary image |

## 📊 Query Parameters

### Filters
- `region` - Africa, Americas, Asia, Europe, Oceania, Polar
- `currency` - NGN, USD, EUR, GBP, etc.

### Sorting
- `gdp_desc` - Highest GDP first
- `gdp_asc` - Lowest GDP first
- `population_desc` - Largest population first
- `population_asc` - Smallest population first
- `name_asc` - Alphabetical A-Z
- `name_desc` - Alphabetical Z-A

### Examples

**African countries by GDP:**
```bash
curl "http://localhost:3000/countries?region=Africa&sort=gdp_desc"
```

**European countries using EUR:**
```bash
curl "http://localhost:3000/countries?region=Europe&currency=EUR"
```

## 🛠️ Troubleshooting

### Database Connection Failed

**Error:** `❌ Database connection failed`

**Solutions:**
1. Check MySQL is running: `mysql -u root -p`
2. Verify credentials in `.env`
3. Ensure database `countries_db` exists
4. Check port 3306 is not blocked

### Port Already in Use

**Error:** `Port 3000 is already in use`

**Solutions:**
1. Change PORT in `.env` to another number (e.g., 3001)
2. Kill existing process:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   
   # Mac/Linux
   lsof -ti:3000 | xargs kill
   ```

### External API Timeout

**Error:** `External data source unavailable`

**Solutions:**
1. Check internet connection
2. Wait a moment and try again
3. Verify API URLs are accessible:
   - https://restcountries.com/v2/all
   - https://open.er-api.com/v6/latest/USD

### Image Generation Fails

**Error:** `Failed to generate image`

**Solutions:**
1. Ensure `cache/` directory exists (created automatically)
2. Check write permissions
3. Verify canvas package installed: `npm list canvas`

## 📁 Project Structure

```
country-currency-exchange-api/
├── src/
│   ├── config/
│   │   └── database.js           # DB setup
│   ├── controllers/
│   │   └── countryController.js  # Route handlers
│   ├── middleware/
│   │   ├── errorHandler.js       # Error handling
│   │   └── validation.js         # Validation
│   ├── routes/
│   │   └── countryRoutes.js      # API routes
│   ├── services/
│   │   ├── externalApi.js        # API integration
│   │   └── imageGenerator.js     # Image generation
│   └── app.js                    # Express app
├── cache/                         # Generated images
│   └── summary.png
├── database/
│   └── schema.sql                # DB schema reference
├── .env                          # Your config (create this)
├── .env.example                  # Config template
├── .gitignore
├── index.js                      # Entry point
├── package.json
├── README.md                     # Full documentation
├── DEPLOYMENT.md                 # Deploy guide
├── API_TESTING.md                # Testing guide
└── QUICKSTART.md                 # This file
```

## 📚 Next Steps

1. **Read Full Documentation:** `README.md`
2. **Test All Endpoints:** `API_TESTING.md`
3. **Deploy to Production:** `DEPLOYMENT.md`

## 💡 Pro Tips

1. **Use Postman** for easier testing with GUI
2. **Enable nodemon** for development (`npm run dev`)
3. **Check logs** for detailed error information
4. **Refresh periodically** to update exchange rates
5. **Backup database** before making changes

## 🆘 Need Help?

- Check `README.md` for detailed documentation
- Review `API_TESTING.md` for testing examples
- See `DEPLOYMENT.md` for deployment options
- Open an issue in the repository

## ✅ Success Checklist

- [ ] Server starts without errors
- [ ] Database connection successful
- [ ] Refresh endpoint populates data
- [ ] Summary image generated
- [ ] All CRUD operations work
- [ ] Filtering and sorting work
- [ ] Error handling works properly

---

**You're all set! 🎉**

Start building awesome applications with country data!
