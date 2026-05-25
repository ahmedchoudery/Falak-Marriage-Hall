# Falak Hall & Events — Management & Booking System

The official website and booking management system for **Falak Marriage Hall & Events**, a premium wedding and event venue located on G.T. Road, Gujrat, Pakistan.

This platform consists of a highly animated Next.js 15 client dashboard coupled with an Express.js REST API backend. It handles real-time calendar reservations, menu cost calculations, administrative reviews, and notification dispatches via Telegram and email.

---

## Technical Features

### 1. Interactive Menu Price Builder
* **Dynamic Budget Calculator**: Users choose custom options across 5 categories: Starters, Mains, Rice & Bread, Desserts, and Beverages.
* **Instant PKR Estimation**: Computes per-head rates and grand totals in real-time as users adjust the interactive guest slider (ranging from 50 to 1,500 guests).
* **Included defaults**: Pre-populates traditional Pakistani menu elements (Chicken Qorma, Zeera Rice, Naan, Gulab Jamun, Tea) with a base rate of PKR 1,200/head.
* **Sticky Mobile Summary**: Displays a responsive bottom bar summarizing the current estimate and offering a direct call-to-action button for booking.

### 2. Live Availability Calendar
* **Client Date Inquiries**: Renders a custom calendar grid showing dates that are booked, available, or past.
* **Instant Status Updates**: Fetches confirmed bookings from the database to mark unavailable dates on the fly.
* **Month Navigation**: Allows clients to scroll through upcoming months to find open dates for their events.

### 3. Integrated Notification Dispatch
* **Real-time Telegram Alerts**: Sends instant booking notifications directly to the administrator's Telegram account via a custom bot (`@FalakHall_bot`).
* **Resend Email Integrations**: 
  * Administrative notifications detailing client requirements (name, phone, guest counts, requested hall, custom message).
  * Automated confirmation emails sent directly to the client acknowledging their submission.

### 4. Admin Management HUD (Dashboard)
* **JWT-based Security**: Protects administrative endpoints using JSON Web Tokens (8-hour expiry) rather than sharing permanent tokens in headers.
* **Booking Approval Flow**: Admins review incoming requests, change dates, edit details, approve bookings, or reject them.
* **Manual Date Controls**: Allows administrators to lock specific dates for maintenance, private events, or walk-in reservations, and sync the availability calendar.

---

## Directory Organization

```
├── client/                     # Next.js 15 Frontend
│   ├── app/                    # Next.js App Router
│   │   ├── admin/              # Admin login & dashboard interface
│   │   ├── blog/               # Event planning guides and blog pages
│   │   ├── booking/            # Public reservation inquiry form
│   │   ├── contact/            # Venue address, directions, and inquiry form
│   │   ├── globals.css         # Custom styling sheet (Ken Burns, gold gradients)
│   │   └── page.tsx            # Main landing page composition
│   ├── components/             # Reusable UI Components
│   │   ├── About.jsx           # Venue story section
│   │   ├── AvailabilityCalendar.jsx # Live calendar component
│   │   ├── ClientHero.tsx      # Dynamic browser-only loader for Hero
│   │   ├── Hero.jsx            # Entry banner with animations
│   │   ├── Location.jsx        # Google Maps integration and contact cards
│   │   ├── MenuBuilder.jsx     # Interactive price builder
│   │   └── Navbar.jsx          # Responsive header navigation
│   ├── context/                # Auth context (manages admin session tokens)
│   ├── hooks/                  # Scroll trigger and reveal utilities
│   └── tsconfig.json           # Frontend TypeScript parameters
├── server.js                   # Node.js Express Backend & API
├── vercel.json                 # Vercel routing configs (Express serverless routing)
└── package.json                # Project script definitions
```

---

## Tech Stack

* **Frontend**: Next.js 15.5 (React 19, TypeScript)
* **Styling**: Custom CSS variables, responsive layout design, custom scroll reveals, gold color accents (`#C6A769`)
* **Animations**: GSAP, Framer Motion, Anime.js, Swiper (sliders)
* **Backend**: Node.js, Express.js (ES Modules syntax)
* **Database**: MongoDB (Client Driver)
* **Authentication**: JWT (`jsonwebtoken`)
* **Security**: Helmet, Express Rate Limit (multi-tiered rate limiting), input sanitization
* **Communications**: Resend API (Emails), Telegram Bot API (Instant Alerts)
* **Hosting**: Vercel (Monorepo integration with frontend static exports served by serverless Express router)

---

## Security Configurations

The Express backend implements several security layers to protect the system and resources:
1. **MongoDB Operator Sanitization**: Intercepts request payloads and strips keys beginning with `$` to block query injection.
2. **CORS Whitelisting**: Limits access to recognized production and local development origins.
3. **Contextual Rate Limiting**:
   * **Global Limit**: Max 100 requests/minute for general API routes.
   * **Login Limit**: Strict lock out (max 5 attempts every 15 minutes) to mitigate brute-force entries.
   * **Booking Limit**: Max 10 submissions per 15 minutes to prevent spam inquiries.
   * **Availability Limit**: Max 30 calendar checks per minute.
4. **Header Lockdowns**: Uses Helmet to structure security headers and restrict resource caching on administrative API calls.

---

## REST API Reference

All routes are prefixed with `/api`. Unmatched endpoints return a `404 Resource not found` status.

### Public Routes

#### `GET /api/health`
Returns the status of the Express server.
* **Response**: `200 OK`
```json
{
  "success": true,
  "service": "Falak Marriage Hall API",
  "status": "operational"
}
```

#### `POST /api/booking`
Submits a public booking inquiry.
* **Payload**:
```json
{
  "name": "Ahmed",
  "phone": "03001234567",
  "email": "ahmed@example.com",
  "eventDate": "2026-10-15",
  "eventType": "Barat",
  "hall": "Executive",
  "guests": 300,
  "message": "Custom menu required."
}
```
* **Response**: `201 Created`
```json
{
  "success": true,
  "message": "Booking received!",
  "data": { "id": "60d5ec40..." }
}
```

#### `GET /api/availability`
Retrieves all booked dates.
* **Response**: `200 OK`
```json
{
  "success": true,
  "data": [
    { "_id": "60d5ec...", "date": "2026-10-15", "status": "booked", "bookingId": "..." }
  ]
}
```

---

### Administrative Routes
*All requests require the `x-admin-token` header containing a valid JWT.*

#### `POST /api/admin/login`
Validates admin credentials and generates a signed session token.
* **Payload**:
```json
{
  "username": "ahmedchoudery1",
  "password": "<ADMIN_TOKEN_VALUE>"
}
```
* **Response**: `200 OK`
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsIn..."
}
```

#### `GET /api/admin/bookings`
Lists bookings. Can filter by status (`pending`, `approved`, `rejected`).
* **Query Parameters**: `status` (optional)
* **Response**: `200 OK`

#### `POST /api/admin/bookings`
Manually enters a booking from walk-in clients.
* **Payload**: Similar to `/api/booking`, allows custom `status`.
* **Response**: `201 Created`

#### `PUT /api/admin/bookings/:id`
Updates booking parameters (e.g. shifts dates, changes guest count, changes status).
* **Response**: `200 OK`

#### `DELETE /api/admin/bookings/:id`
Permanently purges a record and frees the associated date in the calendar.
* **Response**: `200 OK`

#### `POST /api/admin/availability`
Manually blocks or frees dates on the calendar.
* **Payload**:
```json
{
  "date": "2026-12-25",
  "status": "booked" // 'available' to free the date
}
```
* **Response**: `200 OK`

#### `POST /api/admin/availability/sync`
Synchronizes the availability table by scanning all approved bookings and manual date locks.
* **Response**: `200 OK`

---

## Environment Variables

Configure a `.env` file in the root directory:

```env
# Server
PORT=3000

# Security
JWT_SECRET=your_jwt_signing_key_here
CORS_ORIGIN=https://falak-marriage-hall.vercel.app,http://localhost:3000,http://localhost:3001

# MongoDB Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/falak_hall_db

# Administrative Credentials
ADMIN_USERNAME=ahmedchoudery1
ADMIN_TOKEN=your_secure_admin_password_here
ADMIN_EMAIL=admin_notifications_recipient@domain.com

# Email (Resend Integration)
RESEND_API_KEY=re_1234567890abcdef

# Admin Alerts (Telegram Integration)
TELEGRAM_BOT_TOKEN=123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ
TELEGRAM_CHAT_ID=987654321
```

---

## Local Development Setup

### 1. Installation
Install all backend and frontend dependencies in one step:
```bash
npm run install:all
```

### 2. Configure Environment
Create your local `.env` configuration file in the root folder, ensuring variables match your local database and credentials.

### 3. Launching
Start the backend and frontend servers in separate terminal sessions:

* **Terminal 1 (Backend API)**:
  ```bash
  npm run dev
  ```
  Runs at [http://localhost:3000](http://localhost:3000).

* **Terminal 2 (Next.js Client)**:
  ```bash
  cd client
  npm run dev
  ```
  Runs at [http://localhost:3001](http://localhost:3001).

---

## Vercel Deployment

The application is configured to run as a single Vercel deployment:
1. Vercel builds the Next.js application inside `client/` and exports static assets to the `dist` directory.
2. The root `server.js` functions as a serverless router based on the `vercel.json` rewrite overrides:
   * Public asset directories and Next.js routes serve static HTML from `/dist`.
   * `/api/*` endpoints are routed directly to the Express app.
3. Configure all local `.env` variables under the Vercel project Settings tab prior to deployment.
