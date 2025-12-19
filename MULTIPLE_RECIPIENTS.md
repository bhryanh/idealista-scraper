# Multiple Email Recipients Guide

This guide explains how to send apartment notifications to multiple email addresses.

## Quick Setup

### Basic Configuration

Edit your `.env` file and add multiple email addresses separated by **commas** (no spaces):

```env
EMAIL_TO=email1@example.com,email2@example.com,email3@example.com
```

**Important:** Do not add spaces between emails!

✅ **Correct:**
```env
EMAIL_TO=john@gmail.com,mary@yahoo.com,peter@outlook.com
```

❌ **Wrong:**
```env
EMAIL_TO=john@gmail.com, mary@yahoo.com, peter@outlook.com  # Spaces will cause errors!
```

## Complete Example

Here's a complete `.env` configuration for multiple recipients:

```env
# Email Notification Settings
USE_EMAIL_NOTIFICATIONS=true
EMAIL_SERVICE=gmail
EMAIL_USER=idealista-monitor@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
EMAIL_TO=apartment.hunter1@gmail.com,apartment.hunter2@yahoo.com,roommate@outlook.com

# Monitoring Settings
MONITOR_SCHEDULE=*/30 * * * *
MONITOR_MAX_PAGES=1
NOTIFICATION_MODE=summary
```

## How It Works

When new apartments are found, the monitor will:

1. **Detect new listings** (using MongoDB or in-memory cache)
2. **Format the notification** (HTML email with apartment details)
3. **Send to all recipients** sequentially
4. **Report success/failure** for each recipient

## Expected Output

When sending to multiple recipients, you'll see:

```
📤 Sending email notifications for 2 new apartment(s)...
✅ Summary email sent for 2 apartment(s) to 3/3 recipient(s)
✅ Email notifications sent successfully
```

If some emails fail:
```
📤 Sending email notifications for 2 new apartment(s)...
   ❌ Failed to send to invalid-email@example.com: Invalid email address
✅ Summary email sent for 2 apartment(s) to 2/3 recipient(s)
✅ Email notifications sent successfully
```

## Email Format

All recipients receive the same email containing:

### Summary Mode (Default)
One email with all new apartments:
```
🏠 2 New Apartments Found!

1. Beautiful 2-bedroom apartment in Valencia
   💰 €1,200/month
   🔗 [View Apartment] (clickable button)

2. Modern 3-bedroom with terrace
   💰 €1,450/month
   🔗 [View Apartment] (clickable button)
```

### Individual Mode
Separate email for each apartment:
```
🏠 New Apartment Found!

Beautiful 2-bedroom apartment in Valencia

💰 Price: €1,200/month
🛏️ Bedrooms: 2
📏 Area: 85 m²
🏷️ Tags: Air conditioning, Pets allowed

🔗 [View Apartment] (clickable button)
```

To change mode, edit `.env`:
```env
NOTIFICATION_MODE=individual  # Send separate email for each apartment
# or
NOTIFICATION_MODE=summary     # Send one email with all apartments (default)
```

## Use Cases

### Family/Roommates
Share apartment searches with family members or potential roommates:
```env
EMAIL_TO=husband@gmail.com,wife@gmail.com,roommate@yahoo.com
```

### Property Managers
Send to multiple team members:
```env
EMAIL_TO=manager@company.com,assistant@company.com,owner@company.com
```

### Personal + Work Email
Receive on multiple devices:
```env
EMAIL_TO=personal@gmail.com,work@company.com
```

## Troubleshooting

### Some Emails Not Receiving
- **Check spam folders** - First email might be filtered
- **Verify email addresses** - Must be valid and properly formatted
- **Check for spaces** - Remove any spaces between emails
- **Gmail limits** - Gmail allows ~500 emails/day for free accounts

### All Emails Failing
- **Verify App Password** - Must be 16-character App Password (not regular password)
- **Check email service** - Make sure Gmail account is configured correctly
- **Test with single email** - Try with one email first to isolate the issue

### Emails Going to Spam
- **Mark as "Not Spam"** - Do this for the first email
- **Add to contacts** - Add sender email to contacts
- **Check SPF/DKIM** - If using custom SMTP, verify email authentication

## Cost Considerations

### Gmail Free Tier
- **Sending limit**: ~500 emails per day
- **Cost**: Free
- **Recommendations**:
  - Use summary mode to reduce email volume
  - Monitor at 30-60 minute intervals
  - With 3 recipients, you can safely check every 30 minutes

### Calculation Example
```
Recipients: 3
Checks per hour: 2 (every 30 minutes)
Hours per day: 24
Emails per day: 3 × 2 × 24 = 144 emails/day

This is well within Gmail's 500/day limit ✅
```

## Best Practices

1. **Use Summary Mode**: Reduces email volume significantly
2. **Reasonable Schedule**: Don't check more frequently than every 30 minutes
3. **Test First**: Run `npm run monitor:once` before continuous monitoring
4. **Monitor Logs**: Check console for delivery confirmation
5. **Update Recipients**: Easy to add/remove emails by editing `.env`

## Advanced: Custom SMTP for High Volume

If you need to send more than 500 emails/day, use a custom SMTP service:

### SendGrid (Free tier: 100 emails/day)
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=apikey
EMAIL_PASSWORD=your_sendgrid_api_key
EMAIL_TO=recipient1@example.com,recipient2@example.com
```

### Mailgun (Free tier: 5,000 emails/month)
```env
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=postmaster@your-domain.mailgun.org
EMAIL_PASSWORD=your_mailgun_password
EMAIL_TO=recipient1@example.com,recipient2@example.com
```

## FAQ

**Q: Can I add more than 3 recipients?**
A: Yes! You can add as many as you want, separated by commas.

**Q: Do all recipients need to be Gmail addresses?**
A: No! Recipients can use any email provider (Gmail, Outlook, Yahoo, etc.)

**Q: Can I use different email services for sending?**
A: Yes! You can send from Gmail, Outlook, custom SMTP, or any email service.

**Q: How do I remove a recipient?**
A: Simply edit `.env` and remove their email from `EMAIL_TO`, then restart the monitor.

**Q: Can recipients reply to the notifications?**
A: No, these are automated notifications. The sender is specified in `EMAIL_USER`.

## Support

For issues with multiple recipients:
1. Check the console logs for detailed error messages
2. Verify all email addresses are valid
3. Test with a single recipient first
4. Check Gmail's sending limits if using Gmail
