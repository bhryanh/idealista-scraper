# Quick Setup Guide - Idealista Monitor

## Step-by-Step Setup

### 1. Configure MongoDB Atlas (5 minutes)

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
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
   ```
   Replace `username` and `password` with your credentials

### 2. Configure Twilio WhatsApp (10 minutes)

1. Visit https://www.twilio.com
2. Click "Sign up" and create a free account
3. Verify your email and phone
4. Go to https://console.twilio.com
5. Find your **Account SID** and **Auth Token** on the dashboard
6. Go to **Messaging** → **Try it out** → **Send a WhatsApp message**
7. You'll see your sandbox number and join code
8. From your phone:
   - Send a WhatsApp message to: **+1 415 523 8886**
   - Message content: `join <your-code>` (e.g., `join coffee-bicycle`)
   - You'll receive confirmation
9. Update `.env`:
   ```env
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_auth_token_here
   TWILIO_WHATSAPP_FROM=+14155238886
   TWILIO_WHATSAPP_TO=+5511999999999
   ```
   Replace `+5511999999999` with your WhatsApp number in E.164 format

**Multiple Recipients (Optional):**
To receive notifications on multiple WhatsApp numbers:
1. Each person sends the join message to **+1 415 523 8886**
2. Update `.env` with all numbers separated by commas (no spaces):
   ```env
   TWILIO_WHATSAPP_TO=+5511999999999,+5521988888888,+34612345678
   ```

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
```

### 4. Test Setup

Run a single check to verify everything works:

```bash
npm run monitor:once
```

Expected output:
```
✅ Connected to MongoDB
✅ Twilio client initialized
   Recipients: 1 number(s)
🔍 Starting apartment check...
📄 Fetching page 1...
✅ Found X apartments on page 1
✨ New apartment: [apartment name]
📤 Sending notifications...
✅ WhatsApp notification sent (1/1 recipients)
```

With multiple recipients:
```
✅ Twilio client initialized
   Recipients: 3 number(s)
...
✅ Summary notification sent for 2 apartment(s) to 3/3 recipient(s)
```

### 5. Start Monitoring

Start continuous monitoring:

```bash
npm run monitor
```

The monitor will:
- Run immediately
- Check every 10 minutes
- Send WhatsApp notifications for new apartments
- Run continuously until you stop it (Ctrl+C)

## Common Issues

### "MONGODB_URI is not defined"
- Make sure you copied `.env.example` to `.env`
- Verify the MongoDB URI is correctly set in `.env`

### "Error connecting to MongoDB"
- Check your IP is whitelisted in MongoDB Atlas
- Verify username and password in connection string
- Try using `0.0.0.0/0` to allow all IPs (for testing)

### WhatsApp messages not sending
- Verify you joined the Twilio sandbox
- Check your phone number format: `+5511999999999`
- Ensure Account SID and Auth Token are correct
- The sandbox number only works after joining

### "No apartments found"
- Verify your search filters in `.env`
- Try broader filters (remove some restrictions)
- Check if apartments exist on Idealista with these filters

## Phone Number Format

Your WhatsApp number must be in **E.164 format**:

- ✅ **Correct**: `+5511999999999` (country code + number)
- ❌ **Wrong**: `11999999999` (missing +55)
- ❌ **Wrong**: `+55 11 99999-9999` (has spaces/dashes)

Examples:
- Brazil: `+5511999999999`
- Spain: `+34612345678`
- Portugal: `+351912345678`

## Next Steps

Once everything is working:

1. **Adjust schedule**: Change `MONITOR_SCHEDULE` in `.env`
2. **Run in background**: Use PM2 for production (see README.md)
3. **Customize filters**: Adjust search parameters in `.env`
4. **Monitor logs**: Keep an eye on output for any issues

## Support

For issues, check:
1. README.md - Full documentation
2. .env.example - Configuration reference
3. Console output - Error messages
