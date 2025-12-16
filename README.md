# Idealista Scraper

A web scraper for extracting apartment listings from Idealista.com, built with Node.js, Puppeteer, and Cheerio. Includes automated monitoring with WhatsApp notifications.

## Features

- 🏠 Scrapes apartment listings from Idealista.com
- 📄 Supports pagination (multiple pages)
- 💾 Exports data to JSON and CSV formats
- 🤖 Browser automation with anti-detection measures
- 🗄️ MongoDB integration for tracking listings
- 📱 WhatsApp notifications for new apartments
- ⏰ Automated monitoring (checks every 10 minutes)
- 🎯 Highly customizable filters
- 📊 Modular and maintainable code structure

## Project Structure

```
idealista-scraper/
├── index.js                    # One-time scraper entry point
├── monitor.js                  # Continuous monitoring entry point
├── src/
│   ├── config/
│   │   └── constants.js        # Configuration and constants
│   ├── services/
│   │   ├── browser.js          # Browser management (Puppeteer)
│   │   ├── scraper.js          # Scraping logic
│   │   ├── database.js         # MongoDB integration
│   │   ├── notification.js     # WhatsApp notifications (Twilio)
│   │   └── monitor.js          # Monitoring coordinator
│   ├── parsers/
│   │   └── listingParser.js    # HTML parsing logic
│   └── utils/
│       ├── fileWriter.js       # File export utilities
│       └── helpers.js          # Helper functions
├── .env                        # Environment configuration (create from .env.example)
├── package.json
└── README.md
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

Edit the `.env` file to customize your search parameters.

## Configuration

The scraper is configured via environment variables in the `.env` file:

### Search Parameters

- **BASE_URL**: Base URL for Idealista (default: `https://www.idealista.com`)
- **CITY**: City to search in (default: `valencia`)
- **PROVINCE**: Province to search in (default: `valencia`)

### Filters

#### Price
- **MAX_PRICE**: Maximum price in euros (e.g., `1500`)
  - Leave empty to not filter by price

#### Bedrooms
- **BEDROOMS**: Number of bedrooms (comma-separated)
  - Options: `dos`, `tres`, `cuatro-cinco-o-mas`
  - Example: `dos,tres` (for 2 or 3 bedrooms)
  - Leave empty to not filter by bedrooms

#### Bathrooms
- **BATHROOMS**: Number of bathrooms (comma-separated)
  - Options: `dos`, `tres-o-mas`
  - Example: `dos,tres-o-mas` (for 2 or 3+ bathrooms)
  - Leave empty to not filter by bathrooms

#### Amenities
- **AIR_CONDITIONING**: Include only apartments with air conditioning (`true`/`false`)
- **ALLOW_PETS**: Include pet-friendly apartments (`true`/`false`)

#### Publication Date
- **PUBLISHED_FILTER**: Filter by publication date
  - Options: `ultimas-24-horas`, `ultima-semana`, `ultimos-15-dias`
  - Leave empty to not filter by date

#### Rental Type
- **RENTAL_TYPE**: Type of rental
  - Options: `alquiler-de-larga-temporada`, `alquiler-de-temporada`
  - Leave empty to include all rental types

### Sort Order

- **SORT_ORDER**: Sort order for results
  - Options: `fecha-publicacion-desc`, `precios-asc`, `precios-desc`
  - Default: `fecha-publicacion-desc`

### Scraper Settings

- **MAX_PAGES**: Maximum number of pages to scrape (default: `3`)
- **REQUEST_DELAY_MIN**: Minimum delay between requests in ms (default: `3000`)
- **REQUEST_DELAY_MAX**: Maximum delay between requests in ms (default: `5000`)

### Output Files

- **OUTPUT_JSON**: JSON output filename (default: `apartments.json`)
- **OUTPUT_CSV**: CSV output filename (default: `apartments.csv`)

### Monitoring Configuration

#### MongoDB Settings
- **MONGODB_URI**: MongoDB connection string
  - Get from MongoDB Atlas dashboard
  - Format: `mongodb+srv://user:pass@cluster.mongodb.net/`
- **MONGODB_DATABASE**: Database name (default: `idealista_scraper`)

#### Twilio WhatsApp Settings
- **TWILIO_ACCOUNT_SID**: Your Twilio account SID
- **TWILIO_AUTH_TOKEN**: Your Twilio authentication token
- **TWILIO_WHATSAPP_FROM**: Twilio WhatsApp number (sandbox: `+14155238886`)
- **TWILIO_WHATSAPP_TO**: Recipient WhatsApp number(s) in E.164 format
  - Single number: `+5511999999999`
  - Multiple numbers: `+5511999999999,+5521988888888,+34612345678` (comma-separated, no spaces)
  - All numbers must have joined the Twilio sandbox

#### Monitor Settings
- **MONITOR_SCHEDULE**: Cron schedule for automated checks
  - `*/10 * * * *` - Every 10 minutes (default)
  - `*/5 * * * *` - Every 5 minutes
  - `0 * * * *` - Every hour
  - `0 9-18 * * *` - Every hour, 9 AM to 6 PM
- **NOTIFICATION_MODE**: How to send notifications
  - `summary` (default) - One message with all new apartments
  - `individual` - Separate message for each apartment

### Example Configurations

#### Basic search in Barcelona
```env
BASE_URL=https://www.idealista.com
CITY=barcelona
PROVINCE=barcelona
SORT_ORDER=fecha-publicacion-desc
MAX_PAGES=5
```

#### Advanced search with filters
```env
BASE_URL=https://www.idealista.com
CITY=valencia
PROVINCE=valencia
MAX_PRICE=1500
BEDROOMS=dos,tres,cuatro-cinco-o-mas
BATHROOMS=dos,tres-o-mas
AIR_CONDITIONING=true
ALLOW_PETS=true
PUBLISHED_FILTER=ultimas-24-horas
RENTAL_TYPE=alquiler-de-larga-temporada
SORT_ORDER=fecha-publicacion-desc
MAX_PAGES=3
```

#### Budget-friendly search
```env
CITY=madrid
PROVINCE=madrid
MAX_PRICE=800
BEDROOMS=dos
PUBLISHED_FILTER=ultima-semana
SORT_ORDER=precios-asc
MAX_PAGES=10
```

## Quick Start

### One-time Scraping

Run the scraper once:
```bash
npm start
```

The scraper will:
1. Fetch apartment listings from Idealista.com based on your `.env` configuration
2. Parse the HTML content
3. Display the first 3 results in the console
4. Save all results to JSON and CSV files

### Automated Monitoring

Run continuous monitoring with WhatsApp notifications:
```bash
npm run monitor
```

This will:
1. Check for new apartments every 10 minutes (configurable)
2. Save new apartments to MongoDB
3. Send WhatsApp notifications when new listings are found
4. Run continuously until stopped (Ctrl+C)

Run a single check:
```bash
npm run monitor:once
```

## Setup for Monitoring

### 1. MongoDB Atlas Setup (Free)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster (free tier M0)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Update `.env` with your connection string:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
   ```

### 2. Twilio WhatsApp Setup (Free Sandbox)

1. Go to [Twilio](https://www.twilio.com)
2. Sign up for a free account
3. Go to [Console](https://console.twilio.com)
4. Get your **Account SID** and **Auth Token**
5. Go to **Messaging** → **Try it out** → **Send a WhatsApp message**
6. Follow instructions to join the Twilio Sandbox:
   - Send a WhatsApp message to **+1 415 523 8886**
   - Message format: `join <your-sandbox-code>`
7. Update `.env`:
   ```env
   TWILIO_ACCOUNT_SID=your_account_sid_here
   TWILIO_AUTH_TOKEN=your_auth_token_here
   TWILIO_WHATSAPP_FROM=+14155238886
   TWILIO_WHATSAPP_TO=+5511999999999  # Your WhatsApp number in E.164 format
   ```

**Multiple Recipients:** To send notifications to multiple WhatsApp numbers, separate them with commas (no spaces):
```env
TWILIO_WHATSAPP_TO=+5511999999999,+5521988888888,+34612345678
```
**Important:** Each number must join the Twilio sandbox separately by sending the join message.

**Note:** Twilio Sandbox is free but has limitations. For production use, apply for WhatsApp Business API approval.

### 3. Test Your Setup

Run a single check to test everything:
```bash
npm run monitor:once
```

If successful, you should see:
- ✅ MongoDB connection confirmation
- ✅ Twilio client initialization
- 📊 Scraping results
- 📱 WhatsApp notification (if new apartments found)

## Output

The scraper generates two files:

- `apartments.json`: JSON format with all listing data
- `apartments.csv`: CSV format for spreadsheet applications

Each listing includes:
- Title
- URL
- Price
- Number of bedrooms
- Area (square meters)
- Tags (e.g., pets allowed)

## Development

### Adding New Features

- **New parsers**: Add to `src/parsers/`
- **New services**: Add to `src/services/`
- **New utilities**: Add to `src/utils/`
- **Configuration**: Add new variables to `.env` and `.env.example`, then update `src/config/constants.js`

### Code Style

- Use clear, descriptive function and variable names in English
- Add JSDoc comments for functions
- Follow the existing modular structure

## How Monitoring Works

1. **Scheduled Execution**: The monitor runs on a schedule (default: every 10 minutes)
2. **Scraping**: Fetches the first page of apartment listings
3. **Database Check**: Compares each apartment URL with the database
4. **New Detection**: Identifies apartments not yet in the database
5. **Storage**: Saves new apartments to MongoDB with timestamp
6. **Notification**: Sends WhatsApp message(s) for new findings
7. **Tracking**: Marks notified apartments to avoid duplicates

## Tips

### Running in Production

For continuous monitoring, use a process manager:

```bash
# Using PM2
npm install -g pm2
pm2 start monitor.js --name idealista-monitor -- --cron
pm2 save
pm2 startup
```

### WhatsApp Number Format

Always use E.164 format for phone numbers:
- ✅ Correct: `+5511999999999`
- ❌ Wrong: `11999999999`
- ❌ Wrong: `+55 11 99999-9999`

### Monitoring Best Practices

- **Start with 10 minutes**: Don't check too frequently to avoid IP blocks
- **Use summary mode**: Reduces WhatsApp message spam
- **Test first**: Run `npm run monitor:once` before continuous monitoring
- **Monitor logs**: Keep an eye on console output for errors

### Cost Considerations

- **MongoDB Atlas**: Free tier (512MB) is sufficient for thousands of apartments
- **Twilio Sandbox**: Free but limited, requires re-joining every 3 days
- **Twilio Production**: ~$0.005 per WhatsApp message after approval

## Troubleshooting

### MongoDB Connection Error
- Check your connection string format
- Verify network access settings in MongoDB Atlas
- Ensure your IP is whitelisted (or use 0.0.0.0/0 for allow all)

### WhatsApp Not Sending
- Verify you've joined the Twilio sandbox
- Check phone number format (E.164)
- Ensure Twilio credentials are correct
- Check Twilio console for error messages

### No New Apartments Detected
- Verify search filters in `.env`
- Check if apartments exist on Idealista
- Try running the basic scraper first: `npm start`

## Deployment (Free Hosting)

### Deploy to the Cloud

Want to run your monitor 24/7 without keeping your computer on? Deploy it for **FREE** to Render.com!

**Quick Deploy (5 minutes):**
See [QUICK_DEPLOY.md](QUICK_DEPLOY.md)

**Detailed Guide:**
See [DEPLOYMENT.md](DEPLOYMENT.md)

### Why Deploy?

- ✅ Runs 24/7 automatically
- ✅ No need to keep your computer on
- ✅ Free hosting on Render.com
- ✅ Auto-updates when you push code
- ✅ Professional monitoring solution

### Supported Platforms

- **Render.com** (Recommended) - Free tier, easy setup
- **Railway.app** - Good alternative
- **Fly.io** - Free tier available
- **Google Cloud Run** - Free tier with limitations

## Notes

- The scraper includes random delays between requests to avoid overloading the server
- Browser automation is configured with anti-detection measures
- MongoDB stores apartment URLs to prevent duplicate notifications
- Ensure you comply with Idealista's terms of service and robots.txt
- Optimized for deployment on Linux-based cloud platforms

## License

ISC
