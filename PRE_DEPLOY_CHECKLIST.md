# Pre-Deploy Checklist ✅

Before deploying to production, make sure everything is configured correctly!

## 1. Local Testing

- [ ] Scraper works locally: `npm start`
- [ ] Monitor runs without errors: `npm run monitor:once`
- [ ] MongoDB connection successful
- [ ] WhatsApp notifications received
- [ ] Multiple phone numbers working (if configured)
- [ ] Search filters return apartments

## 2. Environment Variables

- [ ] All variables copied from `.env`
- [ ] MongoDB URI is correct and accessible from internet
- [ ] Twilio credentials are valid
- [ ] Phone numbers in E.164 format: `+5511999999999`
- [ ] All recipients joined Twilio sandbox
- [ ] Monitor schedule makes sense: `*/10 * * * *`

## 3. MongoDB Atlas

- [ ] Cluster created (free tier M0)
- [ ] Database user created
- [ ] Network access configured
  - [ ] Either your IP whitelisted
  - [ ] Or `0.0.0.0/0` for allow all (easier for cloud)
- [ ] Connection string tested

## 4. Twilio

- [ ] Account created and verified
- [ ] Account SID copied
- [ ] Auth Token copied
- [ ] WhatsApp sandbox activated
- [ ] All phone numbers joined sandbox:
  - [ ] Number 1: `+553898644574` ✓
  - [ ] Number 2: `+5531988657473` ✓
  - [ ] (Add more if needed)
- [ ] Sandbox still active (expires after 3 days)

## 5. Code Repository

- [ ] `.env` file is in `.gitignore` (✅ Already done)
- [ ] No sensitive data in code
- [ ] All dependencies in `package.json`
- [ ] Code tested locally
- [ ] Committed to Git
- [ ] Pushed to GitHub

## 6. Render Configuration

Before clicking "Create Service":

- [ ] Repository connected
- [ ] Background Worker selected (not Web Service)
- [ ] Build command: `npm install`
- [ ] Start command: `npm run monitor`
- [ ] Free tier selected
- [ ] All environment variables added
- [ ] Region selected (closest to you)

## 7. Post-Deploy Checks

After deployment:

- [ ] Service status is "Live"
- [ ] Check logs for:
  - [ ] `✅ Connected to MongoDB`
  - [ ] `✅ Twilio client initialized`
  - [ ] `   Recipients: X number(s)`
  - [ ] `🔍 Starting apartment check...`
- [ ] Wait 10 minutes for first check
- [ ] Verify WhatsApp notification received (if apartments found)
- [ ] No error messages in logs

## 8. Final Verification

- [ ] Service running 24/7
- [ ] Checks happening on schedule
- [ ] Notifications arriving
- [ ] No memory/CPU issues
- [ ] Logs look healthy

## Common Issues

### MongoDB Connection Failed
```
❌ Check:
- Network access allows 0.0.0.0/0
- Username/password correct
- Connection string format
```

### Twilio Authentication Failed
```
❌ Check:
- Account SID correct
- Auth Token correct
- No extra spaces in credentials
```

### WhatsApp Not Sending
```
❌ Check:
- Phone numbers joined sandbox
- Numbers in correct format: +5511999999999
- Sandbox not expired (re-join if needed)
```

### Service Crashes
```
❌ Check logs for:
- Missing environment variables
- Puppeteer issues (should work fine)
- Memory limits
```

## Environment Variables Template

Copy this to Render (fill in your values):

```env
# Location
CITY=valencia
PROVINCE=valencia
BASE_URL=https://www.idealista.com

# Filters
MAX_PRICE=1500
BEDROOMS=dos,tres,cuatro-cinco-o-mas
BATHROOMS=dos,tres-o-mas
AIR_CONDITIONING=true
ALLOW_PETS=true
PUBLISHED_FILTER=ultimas-24-horas
RENTAL_TYPE=alquiler-de-larga-temporada
SORT_ORDER=fecha-publicacion-desc

# Scraper
MAX_PAGES=1
REQUEST_DELAY_MIN=3000
REQUEST_DELAY_MAX=5000
OUTPUT_JSON=apartments.json
OUTPUT_CSV=apartments.csv

# MongoDB
MONGODB_URI=mongodb+srv://bhryanperpetuo:rIHoBpV0pUuX9vFj@cluster0.gvhzfkm.mongodb.net/?retryWrites=true&w=majority
MONGODB_DATABASE=idealista_scraper

# Twilio
TWILIO_ACCOUNT_SID=ACbbc64afb15e5dfdd59b95671cbca530e
TWILIO_AUTH_TOKEN=69d6b50b97649d8d3cb4be3876dd9bd4
TWILIO_WHATSAPP_FROM=+14155238886
TWILIO_WHATSAPP_TO=+553898644574,+5531988657473

# Monitor
MONITOR_SCHEDULE=*/10 * * * *
NOTIFICATION_MODE=summary
NODE_ENV=production
```

## Ready to Deploy?

If all checkboxes are ✅, you're ready!

**Follow:** [QUICK_DEPLOY.md](QUICK_DEPLOY.md)

---

Good luck! 🚀
