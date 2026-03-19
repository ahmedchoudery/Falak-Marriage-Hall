# 🏛️ Falak Hall & Events — MERN Website v2.0

A high-performance, premium wedding venue website built with React, Vite, Node.js, and MongoDB.

## ✨ Features
- **Premium UI**: Three.js particle hero, Anime.js reveals, and custom functional cursors.
- **Admin Dashboard**: Secure management portal (`/admin`) for bookings and hall availability.
- **Seamless Booking**: Interactive calendar with real-time availability synchronization.
- **Notifications**: Automatic Email (Resend) and WhatsApp redirection for every new booking.
- **SEO & Performance**: 100% responsive, optimized caching, Schema.org, and Open Graph meta tags.

## 🚀 Setup

### 1. Environment Variables (`.env`)
Create a `.env` file in the root with:
```env
MONGODB_URI=your_mongodb_atlas_uri
PORT=3000
ADMIN_TOKEN=your_secure_random_string
ADMIN_EMAIL=your_notification_email
RESEND_API_KEY=your_resend_api_key
```

### 2. Install Dependencies
```bash
npm install
cd client && npm install
```

### 3. Build & Run
```bash
# Production Build
cd client && npm run build
cd ..
npm start

# Development (Dual terminal)
# T1 (Server): npm run dev
# T2 (Client): cd client && npm run dev
```

## ☁️ Vercel Deployment

1.  **Push to GitHub**: Connect your repository to Vercel.
2.  **Environment Variables**: Add all variables from your `.env` to the Vercel Dashboard.
3.  **Auto-Deploy**: Vercel will automatically build and deploy based on the `vercel.json` configuration.

## 🎨 Professional Management

-   **Updating Booked Dates**: No code changes needed! Log in to `/admin` to approve bookings or manually block dates on the calendar.
-   **Emails**: Ensure `RESEND_API_KEY` is active to receive booking alerts at your `ADMIN_EMAIL`.
-   **Customization**:
    -   **Colors/Fonts**: Edit `client/src/index.css`.
    -   **Business Info**: Search and update `0308-6891083` for phone and `info@falakhall.com` for email.

## 📞 API Documentation
-   `POST /api/booking`: Submit a new booking inquiry.
-   `GET /api/availability`: Fetch currently booked/blocked dates.
-   `POST /api/admin/bookings`: (Protected) Fetch/Update booking statuses.

---
*Created with care for Falak Marriage Hall, Gujrat.*

