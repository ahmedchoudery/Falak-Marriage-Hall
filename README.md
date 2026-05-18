# Falak Hall & Events

A production-grade web application and booking management system for Falak Marriage Hall & Events, a premium wedding and event venue located on GT Road, Gujrat, Pakistan. 

The system is architected as a decoupled application with a modern Next.js 15 frontend and an Express.js API backend integrating MongoDB for persistence, Twilio for client SMS updates, and Resend for administrative email notifications.

---

## Architectural Overview

The application consists of two main components:
1. **Frontend (`client/`)**: A Next.js 15 (React 19) App Router web app. It utilizes GSAP, Framer Motion, and Three.js for interactive experiences like the interactive Menu Price Builder and live Availability Calendar.
2. **Backend (`server.js`)**: An Express.js REST API operating as a headless backend. It handles booking validation, updates MongoDB, caches database connections, and dispatches automated notifications.

### Data Flow & Request Lifecycle

```
[Client App] ──(Book Event)──> [Express API] ──(Write)──> [MongoDB]
     │                                │
     │ (Approve Booking)              ├──(Email Alert)──> [Resend] (Admin)
     v                                v
[Admin HUD] ───────────────────> [Express API] ──(Send SMS)──> [Twilio] (Customer)
```

1. **Inquiry Phase**: A visitor submits a booking inquiry form on the website.
2. **Ingestion**: The Next.js frontend sends a POST request to `/api/booking`. The Express API processes and inserts the booking into the `bookings` collection with a status of `pending`. A temporary block is simultaneously written to the `availability` collection for the requested date.
3. **Admin Alert**: An email is dispatched instantly to the administrator via Resend to notify them of the new booking request.
4. **Processing**: The administrator logs into the secure admin dashboard (`/admin`) using credential-less session validation verified via `x-admin-token`.
5. **Confirmation**: When the admin approves the booking:
   - The status updates to `approved` in MongoDB.
   - The event date status is solidified in the `availability` collection.
   - An automated SMS confirmation containing event details is dispatched directly to the customer's phone number using Twilio.

---

## Workspace Layout

```
├── client/                     # Next.js 15 Application
│   ├── app/                    # Next.js App Router structure (pages & routes)
│   │   ├── admin/              # Administrative dashboard pages
│   │   ├── blog/               # Event tips & venue blog pages
│   │   ├── booking/            # Public online booking page
│   │   ├── contact/            # Venue contact details and form
│   │   ├── globals.css         # Foundational CSS styling
│   │   ├── layout.tsx          # Root Next.js layout structure
│   │   └── page.tsx            # Home page composition
│   ├── components/             # Reusable UI modules (Three.js Hero, MenuBuilder, Stats, etc.)
│   ├── context/                # React context providers (Admin Authentication)
│   ├── hooks/                  # Custom hooks (e.g. scroll reveal triggers)
│   ├── public/                 # Static assets (images, logos, icons)
│   └── tsconfig.json           # TypeScript configuration
├── server.js                   # Express.js entry point and REST API
├── vercel.json                 # Vercel deployment overrides (serverless function router)
├── package.json                # Root package configuration (backend scripts)
└── .env                        # Local configuration (excluded from version control)
```

---

## Database Schemas

The MongoDB database (`falak_hall_db`) utilizes two primary collections:

### 1. `bookings`
Records detail-specific booking reservations and public inquiries.
```javascript
{
  _id: ObjectId,
  name: String,
  phone: String,
  email: String,
  eventDate: String,    // Format: YYYY-MM-DD
  eventType: String,    // e.g., 'Wedding', 'Mehndi', 'Walima'
  hall: String,         // e.g., 'Executive', 'Premium'
  guests: Number,
  message: String,
  status: String,       // 'pending' | 'approved' | 'rejected'
  source: String,       // 'online' | 'manual'
  createdAt: Date,
  updatedAt: Date
}
```

### 2. `availability`
Maintains high-performance query indexes for calendar event dates.
```javascript
{
  _id: ObjectId,
  date: String,         // Indexed unique string: YYYY-MM-DD
  status: String,       // 'booked'
  bookingId: ObjectId,  // Reference to associated document in bookings
  source: String        // 'sync' | 'manual-block'
}
```

---

## REST API Reference

All backend API routes are prefixed with `/api`. Unmatched routes will resolve to `404 Not Found`.

### Public Endpoints

* **`POST /api/booking`**
  Submits an event booking inquiry. 
  *Payload:* `{ name, phone, email, eventDate, eventType, hall, guests, message }`

* **`GET /api/availability`**
  Retrieves booked dates to populate the frontend calendar.
  *Response:* `Array<{ date: string, status: string }>`

### Administrative Endpoints
*All requests require the `x-admin-token` header matching the server's `ADMIN_TOKEN`.*

* **`POST /api/admin/login`**
  Validates credentials for the administration session.
  *Payload:* `{ username, password }`
  *Note:* The username is configured as `ahmedchoudery1`.

* **`GET /api/admin/bookings`**
  Returns all registered bookings sorted chronologically by creation date.

* **`POST /api/admin/bookings/approve`**
  Approves a booking and triggers confirmation SMS.
  *Payload:* `{ id }`

* **`POST /api/admin/bookings/reject`**
  Rejects a booking, releasing the temporary calendar hold.
  *Payload:* `{ id }`

* **`POST /api/admin/bookings/delete`**
  Deletes a booking record permanently.
  *Payload:* `{ id }`

* **`POST /api/admin/bookings/sync-dates`**
  Synchronizes all approved bookings and manual date locks with the availability calendar.

---

## Environment Setup

Create a `.env` file in the root workspace directory:

```env
# Server Configuration
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/falak_hall_db

# Administrative Credentials
ADMIN_TOKEN=your_secure_random_string_here
ADMIN_EMAIL=recipient_admin_email@domain.com

# Email Dispatcher (Resend)
RESEND_API_KEY=re_1234567890abcdef

# SMS Dispatcher (Twilio)
TWILIO_ACCOUNT_SID=ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

---

## Local Development

### 1. Clone & Bootstrap
Install dependencies across both the backend server and frontend client:
```bash
git clone <repository-url>
cd Falak-Marriage-Hall
npm run install:all
```

### 2. Execution
Run the services concurrently in separate terminals:

**Terminal 1: Express REST API Backend**
```bash
npm run dev
```
*API runs at [http://localhost:3000](http://localhost:3000).*

**Terminal 2: Next.js Frontend**
```bash
cd client
npm run dev
```
*Frontend runs at [http://localhost:3001](http://localhost:3001).*

---

## Build and Deployment

The project is structured for native deployment to **Vercel** as a monorepo setup:

### Vercel Integration
1. Connect the repository to Vercel.
2. In your Vercel project settings, register all keys from your local `.env` file.
3. Vercel automatically detects:
   - The `client/` subdirectory as a Next.js application, compiling it using the `next build` framework profile.
   - The root directory's `server.js` file as a serverless Node.js function routing through the overrides in root `/vercel.json`.

---

## Operational Troubleshooting

### 1. MongoDB Connection
If the server reports database timeout errors:
* Verify that the database connection string in `.env` matches your cluster details exactly.
* Ensure your current development machine's public IP address is white-listed in MongoDB Atlas (Network Security tab).

### 2. Verification of Twilio SMS
If client notifications fail to send when a booking is approved:
* Check application logs for message warnings. If variables are missing, the server outputs `[SMS] Twilio not configured. Skipping SMS`.
* Verify that the destination number is registered in the "Verified Caller IDs" list if you are operating on a Twilio trial account.

### 3. Build Compilation Failures
If the frontend production build fails:
* Clear compile caches by deleting `client/.next/` and `client/node_modules/`.
* Run `cd client && npm install && npm run build` to execute a isolated, clean build run.
