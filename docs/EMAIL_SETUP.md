# Setting Up Email Notifications for Contact Form

The contact form includes an email notification feature that can send you an email whenever someone submits the form. Follow these steps to enable and configure it.

## Step 1: Update Environment Variables

Edit the `.env.local` file in the root of your project and locate the Email Notification Configuration section:

```
# Email Notification Configuration
EMAIL_ENABLED=false
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your.email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_RECIPIENT=your.email@gmail.com
```

## Step 2: Set Up a Mail Provider

You need an SMTP mail provider. This guide uses Gmail as an example, but you can use any provider that offers SMTP services (SendGrid, Mailgun, etc.).

### Using Gmail:

1. **Create App Password** (recommended instead of your main password):
   - Go to your Google Account settings: https://myaccount.google.com/
   - Go to "Security" → "2-Step Verification" (must be enabled)
   - At the bottom, click "App passwords"
   - Select "Other" as the app, give it a name like "Portfolio Contact Form"
   - Copy the generated 16-character password

2. **Update Environment Variables**:
   - Set `EMAIL_ENABLED=true`
   - Set `EMAIL_USER` to your Gmail address
   - Set `EMAIL_PASS` to the app password you generated
   - Set `EMAIL_RECIPIENT` to the email where you want to receive notifications

### Using Other Providers:

1. Get the SMTP details from your provider
2. Update the environment variables accordingly:
   - `EMAIL_HOST`: Your provider's SMTP server (e.g., smtp.sendgrid.net)
   - `EMAIL_PORT`: SMTP port (usually 587 or 465)
   - `EMAIL_SECURE`: Set to "true" if using port 465, otherwise "false"
   - `EMAIL_USER`: Your SMTP username
   - `EMAIL_PASS`: Your SMTP password
   - `EMAIL_RECIPIENT`: Where to send notifications

## Step 3: Test the Setup

1. Deploy your changes or restart your development server
2. Submit a test message through the contact form
3. Check your recipient email to see if you received the notification
4. If it failed, check the server logs for error messages

## Troubleshooting

- **Emails not sending**: Check server logs for error messages
- **Gmail authentication issues**: Make sure you're using an App Password, not your account password
- **"Less secure app" warnings**: App Passwords bypass this restriction
- **Rate limiting**: Some providers limit how many emails you can send in a period

## Security Notes

- Never commit your email password to a public repository
- Consider using environment variables in your hosting platform rather than in files
- For production, services like SendGrid or Mailgun are recommended over personal Gmail accounts

## Advanced Configuration

For advanced configuration or custom templates, you can modify the `sendContactNotification` function in `src/lib/emailService.ts`. 