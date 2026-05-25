/**
 * config/mailer.js — Nodemailer Email Configuration
 * ==================================================
 * This file creates and exports a reusable email "transporter".
 * A transporter is the Nodemailer object responsible for actually
 * connecting to Gmail's SMTP server and sending emails.
 *
 * HOW IT WORKS:
 *  1. dotenv loads the .env file so process.env has GMAIL_USER, GMAIL_PASS etc.
 *  2. We create a transporter using Gmail's SMTP settings.
 *  3. We export two things:
 *       - transporter : the nodemailer transport object
 *       - sendNotificationEmail() : a ready-made function that sends
 *         a formatted notification email to NOTIFY_EMAIL whenever
 *         a contact form is submitted.
 *
 * This file is imported by routes/contact.js.
 */

const nodemailer = require('nodemailer');

// Load environment variables from backend/.env
require('dotenv').config();

// ─── Create Gmail Transporter ────────────────────────────────────────────────
// Nodemailer connects to Gmail's SMTP server using your credentials.
// IMPORTANT: Use a Gmail "App Password", NOT your regular Gmail password.
//            See .env file for instructions on how to generate one.
const transporter = nodemailer.createTransport({
  service: 'gmail',          // Nodemailer knows Gmail's SMTP settings automatically
  auth: {
    user: process.env.GMAIL_USER,  // From .env: your Gmail address
    pass: process.env.GMAIL_PASS   // From .env: your App Password (16 chars)
  }
});

// ─── Verify Connection on Startup (optional but helpful) ─────────────────────
// This checks that the credentials work when the server starts.
// If they don't work, you'll see a clear error message in the console.
transporter.verify((error) => {
  if (error) {
    console.error('❌ Email transporter error:', error.message);
    console.error('   → Make sure GMAIL_USER and GMAIL_PASS are set correctly in .env');
  } else {
    console.log('📧 Email transporter ready — notifications will be sent to:', process.env.NOTIFY_EMAIL);
  }
});

// ─── sendNotificationEmail(messageData) ──────────────────────────────────────
/**
 * Sends an HTML email notification to NOTIFY_EMAIL whenever
 * someone submits the contact form.
 *
 * @param {Object} messageData - The contact form data
 * @param {string} messageData.name    - Sender's name
 * @param {string} messageData.email   - Sender's email
 * @param {string} messageData.subject - Subject (optional)
 * @param {string} messageData.message - The message body
 * @param {string} messageData.receivedAt - ISO timestamp
 *
 * @returns {Promise} Resolves when email is sent, rejects on failure
 */
async function sendNotificationEmail(messageData) {
  const { name, email, subject, message, receivedAt } = messageData;

  // Format the date/time in a human-readable way
  const formattedDate = new Date(receivedAt).toLocaleString('en-IN', {
    timeZone   : 'Asia/Kolkata',
    dateStyle  : 'full',
    timeStyle  : 'short'
  });

  // ─── Email Options ─────────────────────────────────────────────────────────
  const mailOptions = {
    from   : `"Portfolio Contact" <${process.env.GMAIL_USER}>`, // Sender label
    to     : process.env.NOTIFY_EMAIL,                           // Your inbox
    replyTo: email,                                              // Reply goes to the visitor's email
    subject: `📬 New Contact: ${subject || `Message from ${name}`}`,

    // Plain text fallback (for email clients that don't support HTML)
    text: `
New contact form submission on your portfolio!

Name   : ${name}
Email  : ${email}
Subject: ${subject || 'N/A'}
Time   : ${formattedDate}

Message:
${message}

---
Reply directly to this email to respond to ${name}.
    `.trim(),

    // HTML version — nicely formatted email notification
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body        { font-family: 'Segoe UI', Arial, sans-serif; background: #f4f4f8; margin: 0; padding: 20px; }
    .card       { background: #ffffff; border-radius: 12px; max-width: 560px; margin: 0 auto; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .header     { background: linear-gradient(135deg, #7c3aed, #9333ea); padding: 28px 32px; }
    .header h1  { color: #fff; margin: 0; font-size: 22px; font-weight: 700; }
    .header p   { color: rgba(255,255,255,0.75); margin: 4px 0 0; font-size: 13px; }
    .body       { padding: 28px 32px; }
    .field      { margin-bottom: 18px; }
    .label      { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #7c3aed; margin-bottom: 4px; }
    .value      { font-size: 15px; color: #1e1e2e; background: #f8f8fc; padding: 10px 14px; border-radius: 8px; border-left: 3px solid #7c3aed; word-break: break-word; }
    .message    { white-space: pre-wrap; line-height: 1.6; }
    .footer     { background: #f8f8fc; padding: 16px 32px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #eee; }
    a           { color: #7c3aed; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>📬 New Portfolio Message</h1>
      <p>Someone reached out through your contact form</p>
    </div>
    <div class="body">

      <div class="field">
        <div class="label">From</div>
        <div class="value">${name}</div>
      </div>

      <div class="field">
        <div class="label">Email</div>
        <div class="value"><a href="mailto:${email}">${email}</a></div>
      </div>

      <div class="field">
        <div class="label">Subject</div>
        <div class="value">${subject || '(No subject)'}</div>
      </div>

      <div class="field">
        <div class="label">Received At</div>
        <div class="value">${formattedDate} (IST)</div>
      </div>

      <div class="field">
        <div class="label">Message</div>
        <div class="value message">${message}</div>
      </div>

    </div>
    <div class="footer">
      💡 Hit <strong>Reply</strong> to respond directly to ${name} at <a href="mailto:${email}">${email}</a>
    </div>
  </div>
</body>
</html>
    `
  };

  // Send the email using the transporter
  const info = await transporter.sendMail(mailOptions);
  console.log(`📧 Notification email sent! Message ID: ${info.messageId}`);
  return info;
}

// Export both the transporter and the helper function
module.exports = { transporter, sendNotificationEmail };
