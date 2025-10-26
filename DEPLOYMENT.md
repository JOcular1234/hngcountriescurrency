# Deployment Guide

This guide covers deployment to various platforms.

## 🚀 Railway Deployment

Railway provides free MySQL hosting and is easy to deploy.

### Steps

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Install Railway CLI**
```bash
npm install -g @railway/cli
```

3. **Login**
```bash
railway login
```

4. **Initialize Project**
```bash
cd country-currency-exchange-api
railway init
```

5. **Add MySQL Plugin**
   - Go to Railway dashboard
   - Click "+ New" → "Database" → "MySQL"
   - Wait for provisioning

6. **Link Database Variables**
   Railway automatically sets these variables:
   - `MYSQLHOST` → Set as `DB_HOST`
   - `MYSQLUSER` → Set as `DB_USER`
   - `MYSQLPASSWORD` → Set as `DB_PASSWORD`
   - `MYSQLDATABASE` → Set as `DB_NAME`
   - `MYSQLPORT` → Set as `DB_PORT`

7. **Set Additional Variables**
```bash
railway variables set NODE_ENV=production
```

8. **Deploy**
```bash
railway up
```

9. **Generate Domain**
```bash
railway domain
```

10. **Test API**
```bash
curl https://your-app.railway.app/status
```

---

## 🔷 Heroku Deployment

### Prerequisites
- Heroku account
- Heroku CLI installed

### Steps

1. **Login to Heroku**
```bash
heroku login
```

2. **Create App**
```bash
heroku create your-app-name
```

3. **Add MySQL Addon**
```bash
heroku addons:create jawsdb:kitefin
```

4. **Set Environment Variables**
```bash
heroku config:set NODE_ENV=production
```

5. **Create Procfile**
```bash
echo "web: node index.js" > Procfile
```

6. **Deploy**
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

7. **Open App**
```bash
heroku open
```

---

## ☁️ AWS EC2 Deployment

### Prerequisites
- AWS account
- EC2 instance running Ubuntu
- Security group with ports 22, 80, 3000 open

### Steps

1. **Connect to EC2**
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

2. **Install Node.js**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

3. **Install MySQL**
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

4. **Create Database**
```bash
sudo mysql
CREATE DATABASE countries_db;
CREATE USER 'apiuser'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON countries_db.* TO 'apiuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

5. **Clone Repository**
```bash
git clone your-repo-url
cd country-currency-exchange-api
npm install
```

6. **Create .env File**
```bash
nano .env
```
Add your configuration.

7. **Install PM2**
```bash
sudo npm install -g pm2
```

8. **Start Application**
```bash
pm2 start index.js --name country-api
pm2 save
pm2 startup
```

9. **Set Up Nginx (Optional)**
```bash
sudo apt install nginx
sudo nano /etc/nginx/sites-available/default
```

Add:
```nginx
location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

```bash
sudo systemctl restart nginx
```

---

## 🌊 DigitalOcean App Platform

### Steps

1. **Login to DigitalOcean**
   - Go to https://cloud.digitalocean.com

2. **Create New App**
   - Click "Apps" → "Create App"
   - Connect GitHub repository

3. **Add Database**
   - Click "Create/Attach Database"
   - Select "MySQL"
   - Choose plan

4. **Configure Environment Variables**
   - Add environment variables from `.env.example`
   - Database variables are auto-configured

5. **Deploy**
   - Click "Next" → "Create Resources"
   - Wait for build and deployment

---

## 🔄 Environment Variables for Production

Ensure these are set in your production environment:

```bash
# Required
NODE_ENV=production
PORT=3000

# Database (auto-configured on most platforms)
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=countries_db
DB_PORT=3306

# APIs (optional - defaults provided)
COUNTRIES_API_URL=https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies
EXCHANGE_API_URL=https://open.er-api.com/v6/latest/USD
```

---

## ✅ Post-Deployment Checklist

- [ ] API responds at root endpoint
- [ ] Database connection successful
- [ ] `/status` endpoint returns data
- [ ] `POST /countries/refresh` populates database
- [ ] Filtering and sorting work correctly
- [ ] Image generation works
- [ ] Error handling returns proper responses
- [ ] CORS configured for your frontend domain
- [ ] Environment variables properly set
- [ ] Database backups configured
- [ ] Monitoring/logging set up

---

## 🔍 Testing Your Deployed API

Replace `YOUR_DEPLOYED_URL` with your actual URL:

```bash
# Check status
curl https://YOUR_DEPLOYED_URL/status

# Refresh data
curl -X POST https://YOUR_DEPLOYED_URL/countries/refresh

# Get countries
curl https://YOUR_DEPLOYED_URL/countries?region=Africa&sort=gdp_desc

# Get specific country
curl https://YOUR_DEPLOYED_URL/countries/Nigeria

# Download image
curl https://YOUR_DEPLOYED_URL/countries/image -o summary.png
```

---

## 🐛 Common Deployment Issues

### Database Connection Fails
- Check database credentials
- Verify database host is accessible
- Ensure database exists
- Check firewall rules

### Port Already in Use
- Change PORT environment variable
- Kill existing process: `lsof -ti:3000 | xargs kill`

### External API Timeouts
- Check outbound firewall rules
- Verify internet connectivity from server
- Consider implementing retry logic

### Image Generation Fails
- Install system dependencies for canvas
- Ensure write permissions for `cache/` directory
- Check disk space

---

## 📊 Monitoring

### Using PM2 (Node.js)
```bash
pm2 logs country-api
pm2 monit
pm2 restart country-api
```

### Health Check Endpoint
Monitor this URL:
```
https://YOUR_DEPLOYED_URL/status
```

Expected response:
```json
{
  "total_countries": 250,
  "last_refreshed_at": "2025-10-26T14:30:00Z"
}
```

---

## 🔐 Security Recommendations

1. **Use Environment Variables** - Never commit secrets
2. **Enable HTTPS** - Use Let's Encrypt or platform SSL
3. **Rate Limiting** - Consider adding rate limiting middleware
4. **Input Validation** - Already implemented
5. **Database Backups** - Set up automated backups
6. **Update Dependencies** - Regularly run `npm audit`

---

**Need Help?** Open an issue in the repository!
