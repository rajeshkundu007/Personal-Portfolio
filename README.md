# 🚀 Rajesh Kundu — Portfolio Website

A complete **Full Stack Portfolio Website** built with:
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js + Express
- **Storage**: JSON file (no database setup needed)

---

## 📧 Email Notifications Setup

Whenever someone submits the contact form, you get an email at **kundurj4359@gmail.com**.

### Step 1 — Generate a Gmail App Password
Google blocks regular password logins from apps. You need a special **App Password**:

1. Go to [myaccount.google.com](https://myaccount.google.com) → **Security**
2. Enable **2-Step Verification** (required)
3. Search for **"App Passwords"** in the search bar
4. Click **App Passwords** → Select app: `Mail` → Device: `Other` → name it `Portfolio`
5. Google shows a **16-character password** (e.g. `abcd efgh ijkl mnop`)

### Step 2 — Add it to `.env`
Open `backend/.env` and paste your App Password:
```
GMAIL_USER=kundurj4359@gmail.com
GMAIL_PASS=abcdefghijklmnop        ← your 16-char App Password (no spaces)
NOTIFY_EMAIL=kundurj4359@gmail.com
```

### Step 3 — Restart the server
```bash
node server.js
```
You'll see: `📧 Email transporter ready — notifications will be sent to: kundurj4359@gmail.com`

### New file added: `backend/config/mailer.js`
- Creates the Gmail SMTP transporter using your `.env` credentials
- Exports `sendNotificationEmail(messageData)` — called by `routes/contact.js` after every form save
- Sends a **beautiful HTML email** with the visitor's name, email, subject, message, and timestamp
- Uses `replyTo` set to the visitor's email so you can **just hit Reply** in Gmail

---

## 📁 Project Structure

```
portfolio/
├── backend/
│   ├── server.js              ← Express server (entry point)
│   ├── package.json           ← Node.js dependencies
│   ├── routes/
│   │   └── contact.js         ← API: POST /api/contact
│   └── data/
│       └── messages.json      ← Stores contact form messages
│
├── frontend/
│   ├── index.html             ← Single-page HTML (all sections)
│   ├── css/
│   │   └── style.css          ← All styles (dark theme, animations)
│   └── js/
│       └── main.js            ← Interactions, animations, form API call
│
└── README.md                  ← This file
```

---

## 📄 File-by-File Explanation

### Backend Files

#### `backend/server.js`
The **main entry point** of the backend server.
- Creates an Express app
- Applies middleware (CORS, JSON body parser)
- **Serves the `frontend/` folder as static files** — so visiting `http://localhost:3000` loads `index.html`
- Mounts the contact API at `/api/contact`
- Starts listening on port **3000**

#### `backend/routes/contact.js`
Handles all requests to `/api/contact`.
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/contact` | Saves a new contact form message |
| `GET`  | `/api/contact` | Returns all saved messages (for debugging) |

- Validates that `name`, `email`, and `message` are present
- Validates email format with a regex
- Appends the new message (with timestamp and ID) to `messages.json`
- Returns a JSON response: `{ success: true, message: "..." }`

#### `backend/data/messages.json`
A simple JSON array that stores all contact form submissions.
```json
[
  {
    "id": 1700000000000,
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Hi, I'd love to work with you!",
    "receivedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

#### `backend/package.json`
Lists the Node.js dependencies:
| Package | Purpose |
|---------|---------|
| `express` | Web server framework |
| `cors` | Allows cross-origin requests during development |
| `body-parser` | Parses JSON and form data from request body |
| `nodemon` (dev) | Auto-restarts server on file changes |

---

### Frontend Files

#### `frontend/index.html`
The **only HTML file** — a single page with all sections:
| Section | Description |
|---------|-------------|
| `#hero` | Animated intro with name and typed title |
| `#about` | Bio, avatar initials, and stats |
| `#skills` | Skill cards with animated progress bars |
| `#projects` | Project showcase cards |
| `#contact` | Form that sends data to the backend |
| Footer | Social links and copyright |

#### `frontend/css/style.css`
All styles for the portfolio, organized into 12 sections:
1. **CSS Variables** — Design tokens (colors, fonts, spacing)
2. **Reset & Base** — Zero default margins/paddings
3. **Utilities** — `.container`, `.btn`, `.fade-in`, etc.
4. **Navbar** — Fixed top bar with scroll-blur effect
5. **Hero** — Full-screen intro with glowing orbs
6. **About** — Two-column grid layout
7. **Skills** — Cards with animated progress bars
8. **Projects** — Responsive card grid
9. **Contact** — Two-column form layout
10. **Footer** — Simple bottom bar
11. **Animations** — `@keyframes` definitions
12. **Responsive** — Mobile breakpoints (≤ 700px, ≤ 900px)

#### `frontend/js/main.js`
All JavaScript is in one file, split into 7 sections:
1. **Navbar** — Adds `.scrolled` class on scroll; hamburger menu toggle
2. **Typed Text** — Cycles through job titles character by character
3. **Scroll Animations** — Uses `IntersectionObserver` to trigger `.fade-in`
4. **Skill Bars** — Animates bar widths when they scroll into view
5. **Active Nav Link** — Highlights the nav link for the visible section
6. **Contact Form** — Validates then calls `POST /api/contact` via `fetch()`
7. **Footer Year** — Sets current year automatically

---

## 🔌 Frontend ↔ Backend Connection

```
Browser (index.html)
       │
       │  User fills Contact Form and clicks Submit
       │
       ▼
frontend/js/main.js
       │
       │  fetch('POST /api/contact', { name, email, message })
       │  ← HTTP Request over localhost ─────────────────────────┐
       │                                                          │
       ▼                                                          │
backend/server.js                                                 │
       │                                                          │
       │  Routes /api/contact → routes/contact.js                │
       ▼                                                          │
backend/routes/contact.js                                         │
       │                                                          │
       │  Validates data                                          │
       │  Reads messages.json                                     │
       │  Appends new message                                     │
       │  Writes back to messages.json                            │
       │                                                          │
       │  Returns { success: true, message: "Thank you!" } ──────┘
       │
       ▼
frontend/js/main.js
       │
       │  Displays success message to user
       │  Resets the form
```

**The key line in `main.js`:**
```javascript
const response = await fetch('/api/contact', {
  method : 'POST',
  headers: { 'Content-Type': 'application/json' },
  body   : JSON.stringify({ name, email, subject, message })
});
```

Because the backend **serves the frontend as static files**, the frontend and backend share the same origin (`http://localhost:3000`). So `/api/contact` resolves to `http://localhost:3000/api/contact` — no CORS issues.

---

## 🚀 How to Run

### Step 1 — Install Dependencies
```bash
cd backend
npm install
```

### Step 2 — Start the Server
```bash
node server.js
```
Or, for auto-restart on file changes (dev mode):
```bash
npm run dev
```

### Step 3 — Open in Browser
```
http://localhost:3000
```

That's it! The server serves both the frontend and the API from a single port.

---

## 🌐 API Reference

### `POST /api/contact`
Submit a contact form message.

**Request Body (JSON):**
```json
{
  "name": "Your Name",
  "email": "your@email.com",
  "subject": "Optional Subject",
  "message": "Your message here."
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Thank you, Your Name! Your message has been received."
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "All fields (name, email, message) are required."
}
```

### `GET /api/contact`
View all stored messages (for debugging/admin purposes).

---

## 🛠️ Customization Guide

| What to Change | Where |
|----------------|-------|
| Your name & bio | `frontend/index.html` → `#about` section |
| Skills & percentages | `frontend/index.html` → `#skills` section + `data-width` attributes |
| Projects | `frontend/index.html` → `#projects` section |
| Color scheme | `frontend/css/style.css` → `:root` CSS variables |
| Typed job titles | `frontend/js/main.js` → `const titles = [...]` array |
| Social links | `frontend/index.html` → `#link-github`, `#link-linkedin`, `#link-twitter` |
| Port number | `backend/server.js` → `const PORT = ...` |

---

## 📦 Dependencies

| Package | Version | Used For |
|---------|---------|----------|
| express | ^4.18.2 | Web server |
| cors | ^2.8.5 | Cross-origin requests |
| body-parser | ^1.20.2 | Parsing request bodies |
| nodemon | ^3.0.1 | Dev auto-restart |

No frontend dependencies — pure HTML, CSS, and JavaScript!

---

*Built with ❤️ by 𝙍𝙖𝙟𝙚𝙨𝙝❤️✨*
