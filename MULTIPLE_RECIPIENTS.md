# Multiple WhatsApp Recipients Guide

The Idealista Monitor now supports sending notifications to multiple WhatsApp numbers simultaneously!

## Quick Setup

### 1. Add Multiple Numbers to .env

Edit your `.env` file and add multiple phone numbers separated by commas (no spaces):

```env
TWILIO_WHATSAPP_TO=+5511999999999,+5521988888888,+34612345678
```

### 2. Join Twilio Sandbox

**IMPORTANT:** Each phone number must join the Twilio sandbox individually:

1. From each phone, send a WhatsApp message to: **+1 415 523 8886**
2. Message content: `join <your-code>` (e.g., `join coffee-bicycle`)
3. Wait for confirmation message
4. Repeat for each number

## How It Works

When new apartments are found:
- The system sends the same notification to **all** configured numbers
- Each recipient receives the message independently
- Failed sends to one number don't affect others
- Console logs show success rate (e.g., "3/3 recipients")

## Example Output

With multiple recipients configured:

```
✅ Twilio client initialized
   Recipients: 3 number(s)
🔍 Starting apartment check...
✨ New apartment: Beautiful apartment in Valencia
📤 Sending notifications...
✅ Summary notification sent for 2 apartment(s) to 3/3 recipient(s)
```

If one number fails:

```
✅ Summary notification sent for 2 apartment(s) to 2/3 recipient(s)
   ❌ Failed to send to +34612345678: Invalid phone number
```

## Use Cases

### Family/Roommates
```env
# All family members get notified
TWILIO_WHATSAPP_TO=+5511999999999,+5511988888888,+5511977777777
```

### Multiple Cities/Countries
```env
# Notify people in different countries
TWILIO_WHATSAPP_TO=+5511999999999,+34612345678,+351912345678
```

### Team/Agency
```env
# Real estate team gets simultaneous alerts
TWILIO_WHATSAPP_TO=+5511111111111,+5522222222222,+5533333333333
```

## Important Notes

### Phone Number Format
- ✅ **Correct**: `+5511999999999,+5521988888888` (comma, no spaces)
- ❌ **Wrong**: `+5511999999999, +5521988888888` (has space)
- ❌ **Wrong**: `+5511999999999 +5521988888888` (no comma)

### Sandbox Limitations
- Each number must join sandbox separately
- Sandbox membership expires after 3 days of inactivity
- Re-join by sending the join message again
- For permanent solution, apply for Twilio WhatsApp Business API

### Costs
- **Sandbox**: Free (with limitations)
- **Production**: ~$0.005 per message per recipient
  - Example: 3 recipients × 10 notifications = $0.15

## Testing

Test with a single check:

```bash
npm run monitor:once
```

Look for:
```
✅ Twilio client initialized
   Recipients: X number(s)
```

This confirms how many numbers are configured.

## Troubleshooting

### "Failed to send to +XXX"
- Verify the number joined the sandbox
- Check phone number format (E.164)
- Ensure no spaces in the comma-separated list

### Only some recipients receive messages
- Check each number individually joined the sandbox
- Verify sandbox hasn't expired (3-day limit)
- Check Twilio console for specific error messages

### No recipients configured
```
❌ Error initializing Twilio: No valid WhatsApp recipient numbers found
```
- Check TWILIO_WHATSAPP_TO is not empty
- Verify at least one valid number is present

## Advanced: Different Messages per Recipient

Currently, all recipients receive the same message. If you need different messages for different people (e.g., language preference), you'll need to:

1. Create separate `.env` configurations
2. Run multiple monitor instances
3. Or modify the code to support per-recipient customization

## Support

For issues with multiple recipients:
1. Test with single recipient first
2. Add recipients one by one
3. Check console logs for specific errors
4. Verify each number's sandbox status in Twilio Console
