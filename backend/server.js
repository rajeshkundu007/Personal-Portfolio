/**
 * server.js — Main entry point for the Portfolio Backend
 * -------------------------------------------------------
 * This file sets up the Express web server.
 * It does the following:
 *   1. Imports required packages (express, cors, body-parser, path)
 *   2. Configures middleware (CORS, JSON body parsing)
 *   3. Serves the frontend HTML/CSS/JS files as static assets
 *   4. Connects API routes (e.g., /api/contact)
 *   5. Starts listening on a port (default: 3000)
 *
 * HOW FRONTEND AND BACKEND ARE CONNECTED:
 *   - The backend serves the frontend files directly from the /frontend folder.
 *   - When you visit http://localhost:3000, Express sends index.html.
 *   - The JavaScript in index.html calls /api/contact using fetch() to submit the form.
 *   - The backend handles that API request and saves the message to messages.json.
 */

// ─── 0. Load Environment Variables (.env) ────────────────────────────────────
// MUST be the very first thing — loads GMAIL_USER, GMAIL_PASS, PORT etc.
// into process.env before any other module reads them.
require('dotenv').config();

// ─── 1. Import Dependencies ───────────────────────────────────────────────────
const express    = require('express');   // Web framework for creating the server
const cors       = require('cors');      // Allows cross-origin requests (useful during dev)
const bodyParser = require('body-parser'); // Parses incoming JSON request bodies
const path       = require('path');      // Helps build file paths (built into Node.js)

// ─── 2. Import Custom Routes ──────────────────────────────────────────────────
const contactRoute = require('./routes/contact'); // Handles /api/contact

// ─── 3. Initialize Express App ────────────────────────────────────────────────
const app  = express();
const PORT = process.env.PORT || 3000; // Use environment variable or default to 3000

// ─── 4. Apply Middleware ──────────────────────────────────────────────────────
app.use(cors());                          // Enable CORS for all origins
app.use(bodyParser.json());               // Parse JSON bodies from incoming requests
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded form data

// ─── 5. Serve Frontend Static Files ──────────────────────────────────────────
// This tells Express to serve all files in the /frontend folder.
// When user opens http://localhost:3000, Express automatically sends frontend/index.html
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

// ─── 6. Register API Routes ───────────────────────────────────────────────────
// Any request to /api/contact will be handled by routes/contact.js
app.use('/api/contact', contactRoute);

// ─── 7. Fallback Route ────────────────────────────────────────────────────────
// If the user navigates to any unknown URL, serve index.html (for single-page behavior)
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// ─── 8. Start the Server ──────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Portfolio server running at http://localhost:${PORT}`);
  console.log(`📂 Serving frontend from: ${frontendPath}`);
  console.log(`📬 Contact API available at: http://localhost:${PORT}/api/contact`);
});
