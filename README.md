
# Tango Private Lessons – Web App (MVP)

Roles: **Admin**, **Instructor**, **Student**.

- Admin approves instructors, sees bookings, marks payments as PAID.
- Instructors apply with photo, tango video, bio, rate, and slots.
- Students book a slot, pay to **admin's PayPal.me**, and admin gets WhatsApp/email.

## Quick Start (local)
1) Install Node.js (LTS) from https://nodejs.org
2) In a terminal:
   ```bash
   npm install
   npm run dev
   ```
3) Open the printed local URL (e.g. http://localhost:5173).

## Deploy on Vercel
1) Push this folder to a GitHub repo
2) Go to https://vercel.com → New Project → Import repo → Deploy
3) Share the URL (e.g. https://your-app.vercel.app)

## Config
Edit `CONFIG` inside `src/App.jsx`:
```js
const CONFIG = {
  ADMIN_WHATSAPP: '+573127276293',
  ADMIN_EMAIL: 'jorgenelgiraldo@gmail.com',
  PAYPAL_LINK: 'https://www.paypal.com/paypalme/mrtango',
}
```

## Notes
- Payment is to the **administrator** via PayPal.me with USD amount (e.g. `/45.00USD`).
- A WhatsApp message and an email to admin are opened with booking details.
- Data persists locally in the browser (localStorage) for quick testing.
