import nodemailer from 'nodemailer';

type ContactFormData = {
  name: string;
  email: string;
  message: string;
  submittedAt: Date;
};

/**
 * Configuration for email sending
 */
interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  }
}

/**
 * Get email configuration from environment variables
 */
function getEmailConfig(): EmailConfig | null {
  const {
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_SECURE,
    EMAIL_USER,
    EMAIL_PASS,
    EMAIL_ENABLED
  } = process.env;

  // Skip if email is not enabled
  if (EMAIL_ENABLED !== 'true') {
    console.log('Email notifications are disabled (EMAIL_ENABLED is not set to true)');
    return null;
  }

  // Check if all required configs are present
  if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASS) {
    console.error('Missing email configuration. Check EMAIL_* environment variables');
    return null;
  }

  return {
    host: EMAIL_HOST,
    port: parseInt(EMAIL_PORT || '587', 10),
    secure: EMAIL_SECURE === 'true',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS
    }
  };
}

/**
 * Sends an email notification when a new contact form is submitted
 */
export async function sendContactNotification(
  formData: ContactFormData,
  recipientEmail: string = process.env.EMAIL_RECIPIENT || ''
): Promise<boolean> {
  try {
    // Get email configuration
    const config = getEmailConfig();
    
    // If email is not configured, skip sending but don't error
    if (!config || !recipientEmail) {
      console.log('Email not sent: configuration missing');
      return false;
    }

    // Create transporter
    const transporter = nodemailer.createTransport(config);

    // Format date for email
    const formattedDate = formData.submittedAt.toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });

    // Setup email data
    const mailOptions = {
      from: `"Portfolio Contact" <${config.auth.user}>`,
      to: recipientEmail,
      subject: `New Contact Form Submission: ${formData.name}`,
      text: 
`You have received a new contact form submission:

Name: ${formData.name}
Email: ${formData.email}
Submitted: ${formattedDate}

Message:
${formData.message}

---
This is an automated notification from your portfolio website.
`,
      html: 
`<h2>New Contact Form Submission</h2>
<p>You have received a new contact from your portfolio website.</p>

<table style="border-collapse: collapse; width: 100%; max-width: 500px;">
  <tr>
    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Name:</strong></td>
    <td style="padding: 8px; border: 1px solid #ddd;">${formData.name}</td>
  </tr>
  <tr>
    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Email:</strong></td>
    <td style="padding: 8px; border: 1px solid #ddd;">
      <a href="mailto:${formData.email}">${formData.email}</a>
    </td>
  </tr>
  <tr>
    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Submitted:</strong></td>
    <td style="padding: 8px; border: 1px solid #ddd;">${formattedDate}</td>
  </tr>
</table>

<h3>Message:</h3>
<div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px;">
  <p style="white-space: pre-wrap;">${formData.message}</p>
</div>

<p style="color: #777; margin-top: 20px; font-size: 12px;">
  This is an automated notification from your portfolio website.
</p>`
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log(`Contact notification email sent to ${recipientEmail}`);
    return true;
  } catch (error) {
    console.error('Failed to send email notification:', error);
    return false;
  }
} 