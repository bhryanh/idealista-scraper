# Deployment Guide - Free Hosting

This guide will help you deploy your Idealista Monitor to **Render.com** for **FREE**.

## Why Render.com?

- ✅ **Free tier** perfect for this project
- ✅ **Always on** - Runs 24/7
- ✅ **Easy setup** - Connect GitHub and deploy
- ✅ **Auto-deploy** - Updates automatically when you push code
- ✅ **Environment variables** - Secure credential management
- ✅ **Good for Puppeteer** - Works well with browser automation

## Prerequisites

1. **GitHub Account** (free)
2. **Render.com Account** (free)
3. Your code pushed to GitHub

## Step 1: Push to GitHub

### Create Repository

1. Go to https://github.com/new
2. Create a new repository (e.g., `idealista-scraper`)
3. **Do NOT** initialize with README (your code already has one)

### Push Your Code

```bash
# Navigate to your project directory
cd /Users/bhryan.perpetuogmail.com/Documents/Projects/idealista-scraper

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Idealista scraper with monitoring"

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/idealista-scraper.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Important:** Your `.env` file will NOT be pushed (it's in `.gitignore`). This is good for security!

## Step 2: Sign Up for Render

1. Go to https://render.com
2. Click **"Get Started for Free"**
3. Sign up with your **GitHub account** (recommended)
4. Authorize Render to access your repositories

## Step 3: Create New Web Service

1. From Render Dashboard, click **"New +"**
2. Select **"Background Worker"** (not Web Service)
3. Connect your GitHub repository:
   - If asked, grant Render access to your repositories
   - Find and select `idealista-scraper`
4. Click **"Connect"**

## Step 4: Configure the Service

### Basic Settings

- **Name**: `idealista-monitor` (or any name you prefer)
- **Region**: Choose closest to you (e.g., Frankfurt for Europe)
- **Branch**: `main`
- **Root Directory**: (leave blank)

### Build Settings

- **Build Command**: `npm install`
- **Start Command**: `npm run monitor`

### Instance Type

- Select **"Free"** plan ($0/month)

## Step 5: Add Environment Variables

Click **"Advanced"** and add all these environment variables:

### Required Variables

```env
# Search Configuration
BASE_URL=https://www.idealista.com
CITY=valencia
PROVINCE=valencia

# Filters
MAX_PRICE=1500
BEDROOMS=dos,tres,cuatro-cinco-o-mas
BATHROOMS=dos,tres-o-mas
AIR_CONDITIONING=true
ALLOW_PETS=true
PUBLISHED_FILTER=ultimas-24-horas
RENTAL_TYPE=alquiler-de-larga-temporada
SORT_ORDER=fecha-publicacion-desc

# Scraper Settings
MAX_PAGES=1
REQUEST_DELAY_MIN=3000
REQUEST_DELAY_MAX=5000

# Output Files (won't be saved, but required)
OUTPUT_JSON=apartments.json
OUTPUT_CSV=apartments.csv

# MongoDB (REQUIRED - get from MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DATABASE=idealista_scraper

# Twilio WhatsApp (REQUIRED - get from Twilio)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_FROM=+14155238886
TWILIO_WHATSAPP_TO=+5511999999999,+5522988888888

# Monitor Settings
MONITOR_SCHEDULE=*/10 * * * *
NOTIFICATION_MODE=summary

# Node Environment
NODE_ENV=production
```

**Copy the values from your local `.env` file!**

## Step 6: Deploy

1. Click **"Create Background Worker"**
2. Render will start building and deploying
3. Wait 5-10 minutes for initial deployment
4. Check the **Logs** tab to see if it's working

### Expected Logs

You should see:
```
🚀 Starting Idealista Apartment Monitor
✅ Monitor services initialized
✅ Connected to MongoDB
✅ Twilio client initialized
   Recipients: 2 number(s)
⏰ Schedule: */10 * * * *
🏃 Running initial check...
```

## Step 7: Verify It's Working

### Check Logs

- Go to your service's **Logs** tab
- You should see the monitor checking every 10 minutes
- Look for: `📄 Fetching page 1...`

### Test Notification

- Wait for a check cycle
- If new apartments are found, you'll receive WhatsApp notification
- Check logs for: `✅ WhatsApp notification sent`

## Render Free Tier Limitations

### What's Included (Free)

- ✅ 750 hours/month (more than enough for 24/7)
- ✅ Background workers
- ✅ Automatic deploys
- ✅ Environment variables
- ✅ HTTPS/SSL
- ✅ Logs and metrics

### Limitations

- ⚠️ Services spin down after **15 minutes of inactivity**
  - **Important:** Background workers DON'T spin down if actively running
  - Your monitor runs continuously, so this won't affect you
- ⚠️ Limited to 512MB RAM
  - Sufficient for this project
- ⚠️ Shared CPU
  - May be slower, but works fine

## Monitoring Your Deployment

### View Logs

1. Go to your service dashboard
2. Click **"Logs"** tab
3. See real-time monitoring activity

### Manual Deploy

To force a redeploy:
1. Go to **"Manual Deploy"**
2. Click **"Deploy latest commit"**

### Suspend Service

To stop monitoring temporarily:
1. Go to **"Settings"**
2. Click **"Suspend Service"**
3. Click **"Resume Service"** when ready

## Updating Your Code

### Automatic Updates

1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Updated search filters"
   git push
   ```
3. Render will automatically detect and deploy!

### Update Environment Variables

1. Go to your service on Render
2. Click **"Environment"** tab
3. Edit variables
4. Service will restart automatically

## Troubleshooting

### Service Won't Start

**Check Logs for errors:**
- MongoDB connection issues → Verify `MONGODB_URI`
- Twilio errors → Check credentials and phone numbers
- Missing env vars → Add all required variables

### WhatsApp Not Sending

1. Verify Twilio credentials
2. Check phone numbers format: `+5511999999999`
3. Ensure numbers joined Twilio sandbox
4. Check Twilio console for errors

### Service Running but Not Finding Apartments

1. Check logs for scraping activity
2. Verify search filters in environment variables
3. Test locally first: `npm run monitor:once`

### Out of Memory

If you see memory errors:
1. Reduce `MAX_PAGES` to 1
2. Increase `REQUEST_DELAY_MIN`
3. Consider upgrading Render plan

## Alternative Free Hosting Options

### Railway.app

- Similar to Render
- Good Puppeteer support
- Setup: https://railway.app

### Fly.io

- Free tier available
- Requires Dockerfile
- Setup: https://fly.io

### Google Cloud Run

- Free tier: 2 million requests/month
- Requires containerization
- More complex setup

## Cost Comparison

### Current Setup (All Free)

- **Render.com**: $0/month (free tier)
- **MongoDB Atlas**: $0/month (512MB free tier)
- **Twilio Sandbox**: $0/month (with limitations)

**Total: $0/month** 🎉

### If You Outgrow Free Tier

- **Render Starter**: $7/month (more resources)
- **MongoDB M2**: $9/month (2GB)
- **Twilio Production**: ~$0.005 per message

## Security Best Practices

1. ✅ Never commit `.env` file (already in `.gitignore`)
2. ✅ Use environment variables on Render
3. ✅ Rotate Twilio tokens regularly
4. ✅ Use strong MongoDB passwords
5. ✅ Keep dependencies updated

## Monitoring Production

### Health Checks

Check your service is running:
- Render dashboard → Logs
- MongoDB Atlas → Monitor connections
- Twilio Console → Message logs

### Get Notifications About Issues

1. Go to Render → Service → Settings
2. Add notification email
3. Get alerts if service fails

## Support

### Render Issues
- Docs: https://render.com/docs
- Community: https://community.render.com

### Project Issues
- Check logs first
- Test locally: `npm run monitor:once`
- Verify environment variables

## Success Checklist

- [ ] Code pushed to GitHub
- [ ] Render account created
- [ ] Background worker created
- [ ] All environment variables added
- [ ] MongoDB connection working
- [ ] Twilio credentials verified
- [ ] Service deployed successfully
- [ ] Logs show monitoring activity
- [ ] WhatsApp notifications received
- [ ] Running 24/7 automatically

## Next Steps

Once deployed:
1. Monitor logs for first few hours
2. Adjust `MONITOR_SCHEDULE` if needed
3. Customize search filters
4. Enjoy automatic apartment notifications! 🏠📱

---

**Your monitor is now running in the cloud, 24/7, completely FREE!** 🎉
