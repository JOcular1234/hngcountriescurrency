# API Testing Guide

Complete guide for testing all API endpoints.

## 🧪 Testing Tools

- **cURL** - Command line
- **Postman** - GUI application
- **Insomnia** - Alternative to Postman
- **HTTPie** - Modern command line HTTP client

---

## 📝 Test Sequence

Follow this sequence to fully test the API:

### 1. Check API is Running

**cURL:**
```bash
curl http://localhost:3000
```

**Expected Response:**
```json
{
  "message": "Country Currency & Exchange API",
  "version": "1.0.0",
  "status": "active",
  "endpoints": {
    "refresh": "POST /countries/refresh",
    "list": "GET /countries",
    "filters": "GET /countries?region=Africa&currency=NGN&sort=gdp_desc",
    "single": "GET /countries/:name",
    "delete": "DELETE /countries/:name",
    "status": "GET /status",
    "image": "GET /countries/image"
  }
}
```

---

### 2. Check Initial Status

**cURL:**
```bash
curl http://localhost:3000/status
```

**Expected Response (before first refresh):**
```json
{
  "total_countries": 0,
  "last_refreshed_at": null
}
```

---

### 3. Refresh Country Data

**cURL:**
```bash
curl -X POST http://localhost:3000/countries/refresh
```

**HTTPie:**
```bash
http POST http://localhost:3000/countries/refresh
```

**Expected Response:**
```json
{
  "message": "Countries refreshed successfully",
  "total_countries": 250,
  "inserted": 250,
  "updated": 0,
  "last_refreshed_at": "2025-10-26T14:30:00.000Z"
}
```

⏱️ **Note:** This may take 10-30 seconds depending on API response times.

---

### 4. Get All Countries

**cURL:**
```bash
curl http://localhost:3000/countries
```

**Expected Response:**
```json
[
  {
    "id": 1,
    "name": "Afghanistan",
    "capital": "Kabul",
    "region": "Asia",
    "population": 27657145,
    "currency_code": "AFN",
    "exchange_rate": 89.5,
    "estimated_gdp": 463248901.12,
    "flag_url": "https://flagcdn.com/af.svg",
    "last_refreshed_at": "2025-10-26T14:30:00.000Z",
    "created_at": "2025-10-26T14:30:00.000Z"
  },
  // ... more countries
]
```

---

### 5. Filter by Region

**Test African Countries:**
```bash
curl "http://localhost:3000/countries?region=Africa"
```

**Test European Countries:**
```bash
curl "http://localhost:3000/countries?region=Europe"
```

**Test Asian Countries:**
```bash
curl "http://localhost:3000/countries?region=Asia"
```

**Other Regions:**
- Americas
- Oceania
- Polar

---

### 6. Filter by Currency

**Test NGN (Nigerian Naira):**
```bash
curl "http://localhost:3000/countries?currency=NGN"
```

**Test USD (US Dollar):**
```bash
curl "http://localhost:3000/countries?currency=USD"
```

**Test EUR (Euro):**
```bash
curl "http://localhost:3000/countries?currency=EUR"
```

---

### 7. Sort Results

**Highest GDP First:**
```bash
curl "http://localhost:3000/countries?sort=gdp_desc"
```

**Lowest GDP First:**
```bash
curl "http://localhost:3000/countries?sort=gdp_asc"
```

**Largest Population:**
```bash
curl "http://localhost:3000/countries?sort=population_desc"
```

**Alphabetical:**
```bash
curl "http://localhost:3000/countries?sort=name_asc"
```

---

### 8. Combined Filters

**African Countries by GDP:**
```bash
curl "http://localhost:3000/countries?region=Africa&sort=gdp_desc"
```

**European Countries Using Euro:**
```bash
curl "http://localhost:3000/countries?region=Europe&currency=EUR"
```

**Asian Countries by Population:**
```bash
curl "http://localhost:3000/countries?region=Asia&sort=population_desc"
```

---

### 9. Get Specific Country

**cURL:**
```bash
curl http://localhost:3000/countries/Nigeria
```

**Expected Response:**
```json
{
  "id": 156,
  "name": "Nigeria",
  "capital": "Abuja",
  "region": "Africa",
  "population": 206139589,
  "currency_code": "NGN",
  "exchange_rate": 1600.23,
  "estimated_gdp": 25767448125.20,
  "flag_url": "https://flagcdn.com/ng.svg",
  "last_refreshed_at": "2025-10-26T14:30:00.000Z",
  "created_at": "2025-10-26T14:30:00.000Z"
}
```

**Test More Countries:**
```bash
curl http://localhost:3000/countries/Ghana
curl http://localhost:3000/countries/Kenya
curl http://localhost:3000/countries/Germany
curl http://localhost:3000/countries/Japan
```

---

### 10. Test Not Found Error

**cURL:**
```bash
curl http://localhost:3000/countries/FakeCountry
```

**Expected Response:**
```json
{
  "error": "Country not found"
}
```

---

### 11. Get Summary Image

**cURL (save to file):**
```bash
curl http://localhost:3000/countries/image -o summary.png
```

**Open the image to verify it contains:**
- Total country count
- Top 5 countries by GDP
- Last refresh timestamp

---

### 12. Delete a Country

**cURL:**
```bash
curl -X DELETE http://localhost:3000/countries/TestCountry
```

**HTTPie:**
```bash
http DELETE http://localhost:3000/countries/TestCountry
```

**Expected Response (if exists):**
```json
{
  "message": "Country deleted successfully",
  "name": "TestCountry"
}
```

**Expected Response (if not found):**
```json
{
  "error": "Country not found"
}
```

---

### 13. Re-check Status

**cURL:**
```bash
curl http://localhost:3000/status
```

**Expected Response (after refresh):**
```json
{
  "total_countries": 250,
  "last_refreshed_at": "2025-10-26T14:30:00.000Z"
}
```

---

## 🎯 Postman Collection

### Import to Postman

1. Create a new collection: "Country API"
2. Add these requests:

#### 1. Health Check
- Method: GET
- URL: `{{baseUrl}}/`

#### 2. Get Status
- Method: GET
- URL: `{{baseUrl}}/status`

#### 3. Refresh Countries
- Method: POST
- URL: `{{baseUrl}}/countries/refresh`

#### 4. Get All Countries
- Method: GET
- URL: `{{baseUrl}}/countries`

#### 5. Filter by Region
- Method: GET
- URL: `{{baseUrl}}/countries?region=Africa`

#### 6. Filter by Currency
- Method: GET
- URL: `{{baseUrl}}/countries?currency=NGN`

#### 7. Sort by GDP
- Method: GET
- URL: `{{baseUrl}}/countries?sort=gdp_desc`

#### 8. Get Single Country
- Method: GET
- URL: `{{baseUrl}}/countries/Nigeria`

#### 9. Delete Country
- Method: DELETE
- URL: `{{baseUrl}}/countries/Nigeria`

#### 10. Get Image
- Method: GET
- URL: `{{baseUrl}}/countries/image`

### Environment Variables
Create environment with:
- `baseUrl`: `http://localhost:3000`

---

## 🔄 Test External API Error Handling

To test external API failure handling:

### 1. Disconnect Internet
```bash
# Disconnect network and try refresh
curl -X POST http://localhost:3000/countries/refresh
```

**Expected Response:**
```json
{
  "error": "External data source unavailable",
  "details": "Could not fetch data from REST Countries API: ..."
}
```

### 2. Invalid API URL
Temporarily modify `.env`:
```env
COUNTRIES_API_URL=https://invalid-url.com
```

Restart server and try refresh.

---

## 📊 Performance Testing

### Test Response Time

**Using cURL with timing:**
```bash
curl -w "\nTime: %{time_total}s\n" http://localhost:3000/countries
```

**Using Apache Bench:**
```bash
ab -n 100 -c 10 http://localhost:3000/countries
```

**Expected:**
- `/countries` - < 100ms
- `/countries/refresh` - 10-30 seconds (external API calls)
- `/countries/:name` - < 50ms
- `/status` - < 20ms

---

## ✅ Test Checklist

- [ ] API root endpoint returns documentation
- [ ] `/status` shows correct count and timestamp
- [ ] `POST /countries/refresh` populates database
- [ ] Refresh creates summary image
- [ ] `GET /countries` returns all countries
- [ ] Filter by region works (Africa, Europe, Asia, Americas, Oceania)
- [ ] Filter by currency works (NGN, USD, EUR, GBP, etc.)
- [ ] Sort by GDP (asc/desc) works
- [ ] Sort by population (asc/desc) works
- [ ] Sort by name (asc/desc) works
- [ ] Combined filters work (region + currency)
- [ ] Combined filters with sort work
- [ ] `GET /countries/:name` returns single country
- [ ] Country name search is case-insensitive
- [ ] Non-existent country returns 404
- [ ] `DELETE /countries/:name` removes country
- [ ] Delete non-existent country returns 404
- [ ] `GET /countries/image` returns PNG image
- [ ] Image not found returns proper error
- [ ] External API failure returns 503
- [ ] Invalid routes return 404
- [ ] Database errors handled gracefully

---

## 🐛 Common Test Issues

### "Country not found" for valid country
- Ensure you ran `POST /countries/refresh` first
- Check country name spelling (case-insensitive but spelling matters)

### Empty array from GET /countries
- Run refresh endpoint first
- Check database connection
- Verify data was inserted

### Image not found
- Ensure refresh completed successfully
- Check `cache/` directory exists
- Verify write permissions

### Refresh takes too long
- Normal for first run (250+ countries)
- External APIs may be slow
- Check network connection

---

## 📈 Expected Data Ranges

After a successful refresh:

- **Total Countries:** ~250
- **Regions:** 6 (Africa, Americas, Asia, Europe, Oceania, Polar)
- **Currencies:** ~170 different currency codes
- **Population Range:** 1,000 to 1,400,000,000
- **GDP Range:** Varies widely based on calculations

---

## 💡 Tips

1. **Run refresh first** before testing other endpoints
2. **Use Postman Collections** for organized testing
3. **Test edge cases** like countries without currencies
4. **Verify image** after each refresh
5. **Check logs** for detailed error information
6. **Test filters** with various combinations
7. **Verify timestamps** update correctly

---

**Happy Testing! 🚀**
