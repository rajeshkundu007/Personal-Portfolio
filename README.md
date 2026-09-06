# ⚡ RJ_GRID — Electrical Engineering Portfolio

A highly immersive, **Full Stack SCADA / Substation Themed Portfolio Website** built for an electrical engineering student. 

This project transforms a standard web portfolio into an interactive high-voltage power grid.

## 🚀 Technologies
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Graphics Engine**: HTML5 Canvas (Lightning generator) & Inline SVGs
- **Backend**: Node.js + Express
- **Storage**: JSON file (no database setup needed)

---

## 🔌 Core Features & Aesthetics

### 1. The Substation SCADA Interface
The entire UI is modeled after an industrial SCADA system. It features CRT screen effects, glowing neon cyan and high-voltage amber accents, and technical typography.

### 2. High-Fidelity Inline SVGs
- **The Transformer**: The hero section features a responsive, CSS-styled power transformer with cooling radiators, high-voltage bushings, and ribbed insulators.
- **Transmission Towers**: SVG transmission towers act as section dividers, stringing the layout together.

### 3. Interactive Power Line System
- **3-Phase Power**: A 3-phase (Red, Yellow, Blue) transmission wire system runs the entire length of the page.
- **Energy Flow**: Asynchronous glowing pulses travel down the R-Y-B phases to mimic alternating current offsets.
- **Electric Cursor**: A custom mouse follower that emits electrical sparks and jitters when interacting with buttons.

### 4. 120 FPS Lightning Engine
The background is powered by an HTML5 `<canvas>` that randomly generates bold, GPU-accelerated lightning strikes to give the site an incredibly alive and dangerous feel.

### 5. 100% Mobile Responsive
The grid auto-scales for mobile devices. The transformer tank tucks in its cooling fins, the transmission towers shift safely to the margins, and the typography shrinks to maintain a clean reading experience without horizontal scrollbars.

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
│   ├── Rajesh_Kundu_CV.pdf    ← Downloadable Resume
│   ├── css/
│   │   └── style.css          ← Substation SCADA styles & animations
│   └── js/
│       └── main.js            ← Lightning engine, typing effect, APIs
│
└── README.md                  ← This file
```

---

## 🚀 How to Run

### Step 1 — Install Dependencies
```bash
cd backend
npm install
```

### Step 2 — Start the Server
```bash
npm start
```
*(The server is currently running on `node server.js`)*

### Step 3 — Open in Browser
Visit `http://localhost:3000`

---

## 🛠️ Customization Guide

| What to Change | Where |
|----------------|-------|
| Your name & bio | `frontend/index.html` → `#about` section |
| Skills & percentages | `frontend/index.html` → `#skills` section + `data-width` attributes |
| Github Projects | `frontend/index.html` → `#projects` section |
| Color scheme | `frontend/css/style.css` → `:root` CSS variables |
| Typed job titles | `frontend/js/main.js` → `const titles = [...]` array |
| Lightning Speed | `frontend/js/main.js` → Adjust `Math.random() > 0.975` in the draw loop |

---

*Built with ❤️ by 𝙍𝙖𝙟𝙚𝙨𝙝❤️✨*
