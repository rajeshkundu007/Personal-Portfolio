/**
 * routes/contact.js — Contact Form API Route
 * -------------------------------------------
 * This file handles the POST /api/contact endpoint.
 *
 * WHAT IT DOES:
 *   1. Receives the contact form data (name, email, subject, message) from the frontend.
 *   2. Validates that all required fields are present.
 *   3. Reads the existing messages from data/messages.json.
 *   4. Appends the new message (with timestamp) to the array.
 *   5. Writes the updated array back to messages.json.
 *   6. Sends an email notification to kundurj4359@gmail.com via Nodemailer.
 *   7. Returns a JSON response indicating success or failure.
 *
 * HOW THE FRONTEND CONNECTS TO THIS:
 *   - In frontend/js/main.js, the contact form calls:
 *       fetch('/api/contact', { method: 'POST', body: JSON.stringify({...}) })
 *   - Express routes that request to THIS file.
 *   - The response is shown to the user as a success or error message.
 */

// ─── 1. Import Dependencies ───────────────────────────────────────────────────
const express = require('express');
const fs      = require('fs');   // File system module to read/write messages.json
const path    = require('path'); // Helps build the correct file path

// Import the email notification helper from our mailer config
const { sendNotificationEmail } = require('../config/mailer');

const router = express.Router(); // Create a modular router

// Path to the JSON file where messages are stored
const messagesFilePath = path.join(__dirname, '..', 'data', 'messages.json');

// ─── 2. Helper: Read Messages from JSON File ──────────────────────────────────
/**
 * readMessages()
 * Reads the messages.json file and returns the parsed array.
 * Returns an empty array if the file is missing or corrupted.
 */
function readMessages() {
  try {
    const data = fs.readFileSync(messagesFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    // If file doesn't exist or has bad data, start fresh
    return [];
  }
}

// ─── 3. Helper: Write Messages to JSON File ───────────────────────────────────
/**
 * writeMessages(messages)
 * Takes an array of messages and saves it to messages.json.
 * Uses pretty-printing (2 spaces) so the file is human-readable.
 */
function writeMessages(messages) {
  fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2), 'utf-8');
}

// ─── 4. POST /api/contact ─────────────────────────────────────────────────────
/**
 * Handles a new contact form submission.
 * Expects a JSON body with: { name, email, subject, message }
 *
 * The handler is async because sending email is an asynchronous operation.
 */
router.post('/', async (req, res) => {
  // Extract fields from the request body (subject is optional)
  const { name, email, subject, message } = req.body;

  // --- Validation: Make sure all required fields are present ---
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: 'All fields (name, email, message) are required.'
    });
  }

  // --- Validation: Simple email format check ---
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: 'Please provide a valid email address.'
    });
  }

  // --- Build the new message object ---
  const newMessage = {
    id        : Date.now(),                    // Unique ID using current timestamp
    name      : name.trim(),                   // Remove extra spaces
    email     : email.trim().toLowerCase(),
    subject   : subject ? subject.trim() : '', // Optional field
    message   : message.trim(),
    receivedAt: new Date().toISOString()       // ISO timestamp
  };

  // --- Read existing messages, append new one, save to JSON file ---
  const messages = readMessages();
  messages.push(newMessage);
  writeMessages(messages);

  console.log(`📬 New message from: ${newMessage.name} (${newMessage.email})`);

  // --- Send Email Notification (non-blocking) ---
  // We use .catch() instead of await so that a failed email does NOT
  // prevent the user from getting their success response.
  // The message is always saved to JSON regardless of email status.
  sendNotificationEmail(newMessage).catch(err => {
    console.error('⚠️  Email notification failed (message was still saved):', err.message);
  });

  // --- Send success response back to the frontend immediately ---
  return res.status(201).json({
    success: true,
    message: `Thank you, ${newMessage.name}! Your message has been received.`
  });
});

// ─── 5. GET /api/contact ──────────────────────────────────────────────────────
// A simple GET route to view all stored messages (useful for admin/debugging)
router.get('/', (req, res) => {
  const messages = readMessages();
  return res.status(200).json({
    success: true,
    count   : messages.length,
    messages: messages
  });
});

// Export the router so server.js can use it
module.exports = router;
