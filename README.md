# Share Instead

A full-stack rental marketplace built with React, Vite, TypeScript, Tailwind CSS, Node.js, Express, MongoDB, Mongoose, JWT auth, image uploads, cart checkout, rental requests, and an admin dashboard.

## Quick Start

1. Install dependencies:
   ```bash
   npm run install:all
   ```

2. Create environment files:
   ```bash
   copy server\.env.example server\.env
   copy client\.env.example client\.env
   ```

3. Start MongoDB locally, or set `MONGO_URI` in `server/.env`.

   For email OTP during registration, configure SMTP in `server/.env`.
   Gmail requires an app password:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=465
   SMTP_SECURE=true
   SMTP_USER=husseinite98@gmail.com
   SMTP_PASS=your-gmail-app-password
   MAIL_FROM="Share Instead <husseinite98@gmail.com>"
   ```

4. Seed demo data:
   ```bash
   npm run seed
   ```

5. Run the app:
   ```bash
   npm run dev
   ```

Frontend: `http://localhost:5173`  
Backend API: `http://localhost:5000`

## Demo Accounts

- Admin: `admin@shareinstead.com` / `password123`
- User: `maya@example.com` / `password123`
- User: `omar@example.com` / `password123`

## Notes

- Uploaded files are stored in `server/src/uploads`.
- Checkout uses a mock payment form and creates rental requests from cart items.
- New user-listed items are created as `pending`; admin can approve or reject them.
