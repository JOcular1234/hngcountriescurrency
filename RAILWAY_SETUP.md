# 🚂 Railway Deployment Guide

## Quick Fix for Database Connection Issues

Your app is now configured to automatically read Railway's MySQL environment variables. Follow these steps:

---

## Step 1: Add MySQL Database to Railway

1. **Open your Railway project**
2. **Click "New" → "Database" → "Add MySQL"**
3. **Wait for MySQL to provision** (2-3 minutes)
4. Railway automatically creates these environment variables:
   - `MYSQLHOST`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`
   - `MYSQLDATABASE`
   - `MYSQLPORT`

---

## Step 2: Link Database to Your App

Railway should automatically link the MySQL service to your app service. Verify this:

1. Click on your **app service** (not the MySQL database)
2. Go to **Variables** tab
3. You should see MySQL variables listed under "Service Variables"

If you don't see them:
1. Go to your app service settings
2. Click **"Variables"**
3. Click **"Add Reference"**
4. Select your MySQL database
5. Check all MySQL variables
6. Click **"Add"**

---

## Step 3: Verify Environment Variables

Your app service should have these variables (automatically set by Railway):

### From MySQL Database:
- ✅ `MYSQLHOST` → Database host (e.g., `containers-us-west-123.railway.app`)
- ✅ `MYSQLUSER` → Database user (e.g., `root`)
- ✅ `MYSQLPASSWORD` → Database password (auto-generated)
- ✅ `MYSQLDATABASE` → Database name (e.g., `railway`)
- ✅ `MYSQLPORT` → Database port (e.g., `3306`)

### Optional (App-specific):
- `PORT` → Usually auto-set by Railway
- `NODE_ENV=production` → Recommended

---

## Step 4: Redeploy

After adding the MySQL database:

1. **Railway will automatically redeploy** your app
2. **Check the logs** - you should now see:
   ```
   📊 Database Configuration:
      Host: containers-us-west-123.railway.app
      User: root
      Database: railway
      Port: 3306
   ✅ Database connection established
   ✅ Database schema initialized successfully
   🚀 Server is running on port 3000
   ```

---

## Step 5: Test Your API

Once deployed successfully:

### Get your Railway URL:
```bash
# It should look like: https://your-app-name.up.railway.app
```

### Test endpoints:
```bash
# Check status (should return 0 countries initially)
curl https://your-app-name.up.railway.app/status

# Refresh data (this will populate the database)
curl -X POST https://your-app-name.up.railway.app/countries/refresh

# Check status again (should show ~250 countries)
curl https://your-app-name.up.railway.app/status

# Get countries
curl https://your-app-name.up.railway.app/countries?region=Africa
```

---

## Troubleshooting

### Issue: "Database connection failed"

**Check 1: MySQL Database Exists**
- Go to Railway dashboard
- You should see TWO services: your app + MySQL database
- If you only see your app, add MySQL database (Step 1)

**Check 2: Variables are Linked**
- Click your app service → Variables tab
- Look for `MYSQLHOST`, `MYSQLUSER`, etc.
- If missing, link the database (Step 2)

**Check 3: MySQL is Running**
- Click your MySQL database service
- Check status is "Active" (green)
- If not, wait for it to start or restart it

**Check 4: Network/Firewall**
- Railway MySQL should be accessible internally by default
- No additional firewall rules needed

---

### Issue: "injecting env (0) from .env"

This is normal! Railway doesn't use `.env` files. The message means:
- ✅ No `.env` file found (correct for production)
- ✅ App reads from Railway's environment variables instead

Your app now supports BOTH:
- **Local:** Reads from `.env` file (DB_HOST, DB_USER, etc.)
- **Railway:** Reads from Railway variables (MYSQLHOST, MYSQLUSER, etc.)

---

### Issue: App crashes immediately

**Check logs for specific error:**

1. **"Cannot find module"** → Missing dependency
   ```bash
   # Make sure package.json includes all dependencies
   npm install
   git add package.json package-lock.json
   git commit -m "Update dependencies"
   git push
   ```

2. **"Port already in use"** → Don't set PORT manually
   - Remove `PORT` from environment variables
   - Railway sets it automatically

3. **"ECONNREFUSED"** → Database not linked
   - Follow Step 2 to link MySQL database

---

## Environment Variable Mapping

Your app now automatically maps Railway's variables:

| Railway Variable | App Uses | Fallback |
|-----------------|----------|----------|
| `MYSQLHOST` | Database host | `DB_HOST` or `localhost` |
| `MYSQLUSER` | Database user | `DB_USER` or `root` |
| `MYSQLPASSWORD` | Database password | `DB_PASSWORD` or empty |
| `MYSQLDATABASE` | Database name | `DB_NAME` or `countries_db` |
| `MYSQLPORT` | Database port | `DB_PORT` or `3306` |

---

## Complete Deployment Checklist

- [ ] MySQL database added to Railway project
- [ ] MySQL service is Active (green status)
- [ ] App service shows MySQL environment variables
- [ ] Latest code pushed to GitHub
- [ ] Railway successfully deployed
- [ ] Logs show "Database connection established"
- [ ] Status endpoint works
- [ ] Refresh endpoint works
- [ ] Domain/URL is accessible

---

## Next Steps After Successful Deployment

1. **Test all endpoints** using the API_TESTING.md guide
2. **Copy your Railway URL** (e.g., `https://your-app.up.railway.app`)
3. **Update README.md** with your live URL
4. **Submit to Slack bot** with:
   - GitHub repo URL
   - Railway deployment URL
   - Your name and email

---

## Cost & Limits

Railway Free Tier:
- ✅ $5 free credit per month
- ✅ Enough for development and testing
- ✅ Automatic sleep after inactivity (free tier)

To prevent unexpected charges:
- Set spending limits in Railway settings
- Monitor usage in Railway dashboard

---

## Need Help?

**Railway Logs:**
- Click your app service → "Deployments"
- Click latest deployment → "View Logs"
- Look for specific error messages

**Common Commands:**
```bash
# View Railway logs locally
railway logs

# Force redeploy
git commit --allow-empty -m "Redeploy"
git push

# Check Railway status
railway status
```

---

**Your API is now ready for Railway deployment! 🚀**
