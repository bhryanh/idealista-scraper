# Idealista Scraper

A web scraper for extracting apartment listings from Idealista.com, built with Node.js, Puppeteer, and Cheerio. Includes automated monitoring with email notifications.

## Features

- 🏠 Scrapes apartment listings from Idealista.com
- 📄 Supports pagination (multiple pages)
- 🤖 Browser automation with anti-detection measures
- 🗄️ Optional MongoDB integration for tracking listings
- 📧 Email notifications for new apartments
- ⏰ Automated monitoring (customizable schedule)
- 🎯 Highly customizable filters
- 📊 Modular and maintainable code structure
- ⚙️ Flexible configuration (enable/disable features as needed)

## Project Structure

```
idealista-scraper/
├── index.js                    # One-time scraper entry point
├── monitor.js                  # Continuous monitoring entry point
├── src/
│   ├── config/
│   │   └── constants.js        # Configuration and constants
│   ├── services/
│   │   ├── scraper.js          # Scraping logic
│   │   ├── httpClient.js       # HTTP client with Scrape.do integration
│   │   ├── database.js         # MongoDB integration (optional)
│   │   ├── email.js            # Email notifications (nodemailer)
│   │   └── monitor.js          # Monitoring coordinator
│   ├── parsers/
│   │   └── listingParser.js    # HTML parsing logic
│   └── utils/
│       ├── fileWriter.js       # Display utilities
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

- **MAX_PAGES**: Maximum number of pages to scrape for one-time runs (default: `3`)
- **REQUEST_DELAY_MIN**: Minimum delay between requests in ms (default: `3000`)
- **REQUEST_DELAY_MAX**: Maximum delay between requests in ms (default: `5000`)

### Monitoring Configuration

#### Feature Toggles
- **USE_DATABASE**: Enable/disable MongoDB integration (`true`/`false`, default: `true`)
  - When `false`, uses in-memory cache for duplicate detection
- **USE_EMAIL_NOTIFICATIONS**: Enable/disable email notifications (`true`/`false`, default: `true`)

#### MongoDB Settings (Optional)
- **MONGODB_URI**: MongoDB connection string
  - Get from MongoDB Atlas dashboard
  - Format: `mongodb+srv://user:pass@cluster.mongodb.net/`
  - Required only if `USE_DATABASE=true`
- **MONGODB_DATABASE**: Database name (default: `idealista_scraper`)

#### Email Notification Settings
- **EMAIL_SERVICE**: Email service provider (default: `gmail`)
- **EMAIL_USER**: Sender email address (e.g., `your-email@gmail.com`)
- **EMAIL_PASSWORD**: Email password or app password
  - For Gmail: Use App Password (not regular password)
  - Generate at: Google Account → Security → 2-Step Verification → App passwords
- **EMAIL_TO**: Recipient email address(es)
  - Single email: `recipient@example.com`
  - Multiple emails: `email1@example.com,email2@example.com,email3@example.com` (comma-separated, no spaces)

#### Optional: Custom SMTP Settings
- **EMAIL_HOST**: SMTP server host (e.g., `smtp.example.com`)
- **EMAIL_PORT**: SMTP port (default: `587`)
- **EMAIL_SECURE**: Use secure connection (`true`/`false`)

#### Monitor Settings
- **MONITOR_SCHEDULE**: Cron schedule for automated checks
  - `*/30 * * * *` - Every 30 minutes (default)
  - `*/10 * * * *` - Every 10 minutes
  - `*/5 * * * *` - Every 5 minutes
  - `0 * * * *` - Every hour
  - `0 9-18 * * *` - Every hour, 9 AM to 6 PM
- **MONITOR_MAX_PAGES**: Number of pages to scrape during monitoring (default: `1`)
- **NOTIFICATION_MODE**: How to send notifications
  - `summary` (default) - One email with all new apartments
  - `individual` - Separate email for each apartment

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

### Automated Monitoring

Run continuous monitoring with email notifications:
```bash
npm run monitor
```

This will:
1. Check for new apartments on your configured schedule (default: every 30 minutes)
2. Save new apartments to MongoDB (if enabled)
3. Send email notifications when new listings are found
4. Run continuously until stopped (Ctrl+C)

Run a single check:
```bash
npm run monitor:once
```

## Setup for Monitoring

### 1. Email Setup (Gmail Recommended)

#### Using Gmail (Free):

1. **Enable 2-Step Verification:**
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable 2-Step Verification if not already enabled

2. **Generate App Password:**
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and your device
   - Click "Generate"
   - Copy the 16-character password

3. **Update `.env`:**
   ```env
   USE_EMAIL_NOTIFICATIONS=true
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-char-app-password
   EMAIL_TO=recipient@example.com
   ```

#### Multiple Recipients:
To send notifications to multiple emails, separate them with commas (no spaces):
```env
EMAIL_TO=email1@gmail.com,email2@gmail.com,email3@example.com
```

#### Using Other Email Providers:
For custom SMTP settings:
```env
EMAIL_HOST=smtp.your-provider.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@provider.com
EMAIL_PASSWORD=your-password
EMAIL_TO=recipient@example.com
```

### 2. MongoDB Atlas Setup (Optional - Free)

MongoDB is optional. If disabled, the monitor uses in-memory cache for duplicate detection.

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster (free tier M0)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Update `.env`:
   ```env
   USE_DATABASE=true
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
   ```

**To disable MongoDB:**
```env
USE_DATABASE=false
```

### 3. Test Your Setup

Run a single check to test everything:
```bash
npm run monitor:once
```

If successful, you should see:
- ✅ Monitor service initialization
- ✅ Email service initialized (if enabled)
- ✅ MongoDB connection (if enabled)
- 📊 Scraping results
- 📧 Email notification (if new apartments found)

## Output

The scraper displays results in the console with details including:
- Title
- URL
- Price
- Number of bedrooms
- Area (square meters)
- Tags (e.g., pets allowed)

When monitoring is enabled with email notifications, you'll receive beautifully formatted HTML emails with clickable links to view apartments directly.

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

1. **Scheduled Execution**: The monitor runs on a schedule (default: every 30 minutes, configurable)
2. **Scraping**: Fetches apartment listings from configured number of pages (default: 1 page)
3. **Duplicate Detection**:
   - If MongoDB enabled: Compares each apartment URL with the database
   - If MongoDB disabled: Uses in-memory cache for session-based duplicate detection
4. **New Detection**: Identifies apartments not yet seen
5. **Storage**: If MongoDB enabled, saves new apartments with timestamp
6. **Notification**: Sends email(s) for new findings (if email enabled)
7. **Tracking**: Marks notified apartments to avoid duplicates (if MongoDB enabled)

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

### Email Best Practices

- **Use App Passwords**: Never use your regular Gmail password
- **Multiple Recipients**: Add all interested parties to `EMAIL_TO`
- **Check Spam**: First email might land in spam folder
- **Summary Mode**: Recommended to reduce email volume

### Monitoring Best Practices

- **Start with 30 minutes**: Don't check too frequently to avoid IP blocks
- **Use summary mode**: Reduces email volume
- **Test first**: Run `npm run monitor:once` before continuous monitoring
- **Monitor logs**: Keep an eye on console output for errors
- **Adjust pages**: Use `MONITOR_MAX_PAGES=1` for frequent checks, higher for less frequent

### Cost Considerations

- **Email**: Completely free with Gmail
- **MongoDB Atlas**: Free tier (512MB) is sufficient for thousands of apartments
- **Scrape.do**: Free tier available, or use your own proxy
- **Total Cost**: $0 for basic setup!

## Troubleshooting

### Email Not Sending
- Verify App Password is correct (not regular password)
- Check that 2-Step Verification is enabled
- Ensure email service and credentials are correct
- Check spam folder for first email
- Verify `USE_EMAIL_NOTIFICATIONS=true`

### MongoDB Connection Error (If Enabled)
- Check your connection string format
- Verify network access settings in MongoDB Atlas
- Ensure your IP is whitelisted (or use 0.0.0.0/0 for allow all)
- Try disabling MongoDB: Set `USE_DATABASE=false`

### No New Apartments Detected
- Verify search filters in `.env`
- Check if apartments exist on Idealista
- Try running the basic scraper first: `npm start`
- Increase `MONITOR_MAX_PAGES` to check more listings

### Service Initialization Errors
- Ensure required environment variables are set
- If not using a service, set its flag to `false`:
  - `USE_DATABASE=false` to skip MongoDB
  - `USE_EMAIL_NOTIFICATIONS=false` to skip emails

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
- Uses Scrape.do API to bypass blocking and CAPTCHAs
- MongoDB is optional - you can use in-memory cache instead
- Email notifications are free and unlimited with Gmail
- Flexible configuration allows enabling/disabling features as needed
- Ensure you comply with Idealista's terms of service and robots.txt
- Optimized for deployment on Linux-based cloud platforms

## License

ISC
