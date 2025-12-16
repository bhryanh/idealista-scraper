# Quick Deploy Guide (5 minutes)

Deploy your monitor to the cloud for **FREE** in 5 simple steps!

## 1. Push to GitHub (2 min)

```bash
# In your project folder
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/idealista-scraper.git
git push -u origin main
```

## 2. Sign Up for Render (1 min)

1. Go to https://render.com
2. Click "Get Started for Free"
3. Sign in with GitHub

## 3. Create Service (1 min)

1. Click **"New +"** → **"Background Worker"**
2. Select your `idealista-scraper` repo
3. Click **"Connect"**

## 4. Configure (1 min)

- **Name**: `idealista-monitor`
- **Build Command**: `npm install`
- **Start Command**: `npm run monitor`
- **Instance Type**: Free

## 5. Add Environment Variables (2 min)

Click **"Advanced"** and copy these from your `.env`:

**Required:**
```
MONGODB_URI=your_mongodb_connection_string
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_FROM=+14155238886
TWILIO_WHATSAPP_TO=+5511999999999,+5522988888888
```

**Search Settings:**
```
CITY=valencia
PROVINCE=valencia
MAX_PRICE=1500
BEDROOMS=dos,tres,cuatro-cinco-o-mas
ALLOW_PETS=true
PUBLISHED_FILTER=ultimas-24-horas
MONITOR_SCHEDULE=*/10 * * * *
```

Copy ALL variables from your `.env` file!

## 6. Deploy! (5-10 min)

Click **"Create Background Worker"**

Wait for deployment, then check **Logs** tab:
```
✅ Connected to MongoDB
✅ Twilio client initialized
🔍 Starting apartment check...
```

## Done! 🎉

Your monitor is now running 24/7 in the cloud!

**Check WhatsApp for notifications when new apartments appear.**

---

**Need help?** See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed guide.
