# Quick Setup Guide - Idealista Monitor

## Step-by-Step Setup

### 1. Configure Email Notifications (5 minutes)

#### Using Gmail (Recommended):

1. **Enable 2-Step Verification:**
   - Visit https://myaccount.google.com/security
   - Enable "2-Step Verification" if not already enabled

2. **Generate App Password:**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Click "Generate"
   - Copy the 16-character password (spaces can be removed)

3. **Update `.env`:**
   ```env
   USE_EMAIL_NOTIFICATIONS=true
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=abcd efgh ijkl mnop
   EMAIL_TO=recipient@example.com
   ```

**Multiple Recipients (Optional):**
To receive notifications on multiple emails, separate them with commas (no spaces):
```env
EMAIL_TO=email1@gmail.com,email2@gmail.com,email3@example.com
```

#### Using Other Email Providers:
```env
EMAIL_HOST=smtp.your-provider.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@provider.com
EMAIL_PASSWORD=your-password
EMAIL_TO=recipient@example.com
```

### 2. Configure MongoDB Atlas (Optional - 5 minutes)

MongoDB is optional. You can disable it to use in-memory cache instead.

**To enable MongoDB:**

1. Visit https://www.mongodb.com/cloud/atlas
2. Click "Try Free" and create an account
3. Create a cluster:
   - Choose **M0 FREE** tier
   - Select a region close to you
   - Click "Create Cluster"
4. Wait for cluster creation (~3 minutes)
5. Click "Connect":
   - Add your IP address (or use `0.0.0.0/0` to allow all)
   - Create a database user (username + password)
   - Choose "Connect your application"
   - Copy the connection string
6. Update `.env`:
   ```env
   USE_DATABASE=true
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
   ```
   Replace `username` and `password` with your credentials

**To disable MongoDB:**
```env
USE_DATABASE=false
```

When disabled, the monitor uses in-memory cache for duplicate detection during the session.

### 3. Configure Search Filters

Edit `.env` to customize your search:

```env
# Location
CITY=valencia
PROVINCE=valencia

# Filters
MAX_PRICE=1500
BEDROOMS=dos,tres
BATHROOMS=dos,tres-o-mas
AIR_CONDITIONING=true
ALLOW_PETS=true
PUBLISHED_FILTER=ultimas-24-horas
RENTAL_TYPE=alquiler-de-larga-temporada

# Monitoring
MONITOR_SCHEDULE=*/30 * * * *  # Every 30 minutes
MONITOR_MAX_PAGES=1  # Number of pages to check
NOTIFICATION_MODE=summary  # or 'individual'
```

### 4. Test Setup

Run a single check to verify everything works:

```bash
npm run monitor:once
```

**Expected output (with email and MongoDB enabled):**
```
🔧 Initializing monitor service...
   Database: enabled
   Email Notifications: enabled
Connecting to MongoDB...
✅ Connected to MongoDB
✅ Email service initialized
   Recipients: 1 email(s)
✅ Monitor service initialized

============================================================
🔍 Starting apartment check at 12/19/2025, 4:30:00 PM
============================================================

📄 Scraping 1 page(s)...
✅ Found X apartments on page 1

📊 Found X apartments total
✨ New apartment: [apartment name]

📤 Sending email notifications for 1 new apartment(s)...
✅ Summary email sent for 1 apartment(s) to 1/1 recipient(s)
✅ Email notifications sent successfully

📈 Database Statistics:
   Total apartments: 1
   Notified: 1
   Not notified: 0

⏱️  Check completed in 5.43 seconds
============================================================
```

**Expected output (without MongoDB, only email):**
```
🔧 Initializing monitor service...
   Database: disabled
   Email Notifications: enabled
ℹ️  Using in-memory cache for duplicate detection
✅ Email service initialized
   Recipients: 2 email(s)
✅ Monitor service initialized

============================================================
🔍 Starting apartment check at 12/19/2025, 4:30:00 PM
============================================================

📄 Scraping 1 page(s)...
✅ Found X apartments on page 1

📊 Found X apartments total
✨ New apartment: [apartment name]

📤 Sending email notifications for 1 new apartment(s)...
✅ Summary email sent for 1 apartment(s) to 2/2 recipient(s)
✅ Email notifications sent successfully

📈 Cache Statistics:
   Total seen apartments: 10

⏱️  Check completed in 3.21 seconds
============================================================
```

### 5. Start Continuous Monitoring

Once everything is working, start continuous monitoring:

```bash
npm run monitor
```

The monitor will:
- Run automatically on your configured schedule
- Check for new apartments
- Send email notifications
- Store apartments in MongoDB (if enabled)
- Keep running until you stop it (Ctrl+C)

## Configuration Examples

### Minimal Setup (No MongoDB):
```env
USE_DATABASE=false
USE_EMAIL_NOTIFICATIONS=true

EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_TO=recipient@example.com

MONITOR_SCHEDULE=*/30 * * * *
MONITOR_MAX_PAGES=1
```

### Full Setup (MongoDB + Email):
```env
USE_DATABASE=true
USE_EMAIL_NOTIFICATIONS=true

MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DATABASE=idealista_scraper

EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_TO=email1@example.com,email2@example.com

MONITOR_SCHEDULE=*/30 * * * *
MONITOR_MAX_PAGES=1
NOTIFICATION_MODE=summary
```

## Troubleshooting

### Email Not Sending
- Check that 2-Step Verification is enabled
- Verify App Password is correct
- Check spam folder for first email
- Make sure `USE_EMAIL_NOTIFICATIONS=true`

### MongoDB Connection Issues
- Verify connection string format
- Check IP whitelist in MongoDB Atlas
- Try disabling MongoDB: `USE_DATABASE=false`

### No Apartments Found
- Verify your search filters
- Check if apartments exist on Idealista
- Try running: `npm start` first

## Next Steps

- Configure deployment (see DEPLOYMENT.md)
- Set up process manager (PM2)
- Monitor logs for errors
- Adjust schedule based on your needs
