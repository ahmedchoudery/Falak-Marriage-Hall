import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { Resend } from 'resend';
import twilio from 'twilio';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'ahmedchoudery30@gmail.com';
const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN; // used as the admin password

if (!JWT_SECRET) {
    console.error('❌ FATAL: JWT_SECRET is not defined in .env');
    process.exit(1);
}

// ── Twilio SMS Client ──
const twilioClient = (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN)
    ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    : null;
const TWILIO_FROM = process.env.TWILIO_PHONE_NUMBER || '';

async function sendSMS(to, message) {
    if (!twilioClient || !TWILIO_FROM) {
        console.log('[SMS] Twilio not configured. Skipping SMS to', to);
        return;
    }
    let phone = to.replace(/[\s-]/g, '');
    if (phone.startsWith('03')) phone = '+92' + phone.slice(1);
    if (!phone.startsWith('+')) phone = '+' + phone;
    try {
        await twilioClient.messages.create({ body: message, from: TWILIO_FROM, to: phone });
        console.log(`[SMS] Sent to ${phone}`);
    } catch (err) {
        console.error('[SMS] Failed:', err.message);
    }
}

const app = express();
const PORT = process.env.PORT || 3000;

// ── SECURITY: Helmet HTTP Headers ──────────────────────
app.use(helmet({
    contentSecurityPolicy: false, // disabled for static HTML serving
    crossOriginEmbedderPolicy: false,
}));

// ── SECURITY: CORS Lockdown ────────────────────────────
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000')
    .split(',')
    .map(o => o.trim());

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (server-to-server, curl, mobile)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
}));

// ── SECURITY: Body Size Limit ──────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ── SECURITY: Input Sanitization Middleware ─────────────
// Strips MongoDB operator keys ($gt, $ne, etc.) from request bodies
function sanitizeInput(req, res, next) {
    if (req.body && typeof req.body === 'object') {
        req.body = stripDollarKeys(req.body);
    }
    next();
}

function stripDollarKeys(obj) {
    if (Array.isArray(obj)) {
        return obj.map(stripDollarKeys);
    }
    if (obj !== null && typeof obj === 'object') {
        const clean = {};
        for (const key of Object.keys(obj)) {
            if (key.startsWith('$')) continue; // strip dangerous keys
            clean[key] = stripDollarKeys(obj[key]);
        }
        return clean;
    }
    return obj;
}

app.use(sanitizeInput);

// Serve static frontend files (Next.js static export build)
app.use(express.static(path.resolve(process.cwd(), 'dist')));

// ── SECURITY: Rate Limiters ────────────────────────────

// Global fallback rate limiter
const globalLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests. Please try again later.' },
});
app.use('/api', globalLimiter);

// Aggressive limiter for login endpoint
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many login attempts. Please try again in 15 minutes.' },
    skipSuccessfulRequests: false,
});

// Limiter for public booking submissions
const bookingLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many booking requests. Please try again later.' },
});

// Limiter for public availability checks
const availabilityLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests. Please try again later.' },
});

// Limiter for authenticated admin routes
const adminLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests. Please slow down.' },
});

// ── Global No-Cache for API ────────────────────────────
function noCache(req, res, next) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
}
app.use('/api', noCache);

// ── MongoDB ────────────────────────────────────────────
let cachedDb = null;
async function connectDB() {
    if (cachedDb) return cachedDb;
    if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI not defined');
    const client = new MongoClient(process.env.MONGODB_URI, {
        serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true }
    });
    await client.connect();
    cachedDb = client.db('falak_hall_db');
    console.log('✅ Connected to MongoDB');
    return cachedDb;
}

// ── SECURITY: JWT-Based Admin Auth Middleware ───────────
function adminAuth(req, res, next) {
    const token = req.headers['x-admin-token'];
    if (!token) {
        return res.status(401).json({ success: false, message: 'Authentication required.' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.adminUser = decoded; // attach user info to request
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: 'Session expired. Please login again.' });
        }
        return res.status(401).json({ success: false, message: 'Invalid authentication token.' });
    }
}

// API Health check endpoint (public — no auth needed)
app.get('/api/health', (req, res) => {
    res.json({ success: true, service: 'Falak Marriage Hall API', status: 'operational' });
});

// ── PUBLIC API (Rate Limited) ──────────────────────────

app.post('/api/booking', bookingLimiter, async (req, res) => {
    try {
        const db = await connectDB();
        const { name, phone, email, eventDate, eventType, hall, guests, message } = req.body;

        // Validate required fields
        if (!name || !phone || !eventDate || !eventType)
            return res.status(400).json({ success: false, message: 'Please fill in all required fields.' });

        // Sanitize string inputs
        const safeName = String(name).slice(0, 100);
        const safePhone = String(phone).slice(0, 20);
        const safeEmail = email ? String(email).slice(0, 100) : '';
        const safeEventDate = String(eventDate).slice(0, 20);
        const safeEventType = String(eventType).slice(0, 50);
        const safeHall = hall ? String(hall).slice(0, 50) : 'Any Available';
        const safeGuests = parseInt(guests) || 0;
        const safeMessage = message ? String(message).slice(0, 500) : '';

        const newBooking = {
            name: safeName,
            phone: safePhone,
            email: safeEmail,
            eventDate: safeEventDate,
            eventType: safeEventType,
            hall: safeHall,
            guests: safeGuests,
            message: safeMessage,
            status: 'pending',
            source: 'online',
            createdAt: new Date(),
        };
        const result = await db.collection('bookings').insertOne(newBooking);

        // Immediate block for public inquiries
        await db.collection('availability').updateOne(
            { date: safeEventDate },
            { $set: { date: safeEventDate, status: 'booked', bookingId: result.insertedId, source: 'online' } },
            { upsert: true }
        );

        // ── Admin Notification: Email via Resend ──
        if (resend) {
            try {
                await resend.emails.send({
                    from: 'Booking Alert <onboarding@resend.dev>',
                    to: [ADMIN_EMAIL],
                    subject: `New Booking: ${safeName} (${safeEventDate})`,
                    html: `
                        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #C6A769; border-radius: 8px;">
                            <h2 style="color: #C6A769; border-bottom: 2px solid #C6A769; padding-bottom: 10px;">New Booking Inquiry</h2>
                            <p><strong>Customer:</strong> ${safeName}</p>
                            <p><strong>Phone:</strong> ${safePhone}</p>
                            <p><strong>Email:</strong> ${safeEmail || 'Not provided'}</p>
                            <p><strong>Event Date:</strong> ${safeEventDate}</p>
                            <p><strong>Event Type:</strong> ${safeEventType}</p>
                            <p><strong>Hall:</strong> ${safeHall}</p>
                            <p><strong>Guests:</strong> ${safeGuests}</p>
                            <p><strong>Message:</strong> ${safeMessage || 'No additional notes.'}</p>
                            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                            <p style="font-size: 12px; color: #888;">This email was automatically generated by the Falak Hall Management System.</p>
                        </div>
                    `,
                });
            } catch (err) { console.error('Email failed to send:', err); }
        }

        res.status(201).json({ success: true, message: 'Booking received!', data: { id: result.insertedId } });
    } catch (error) {
        console.error('Booking error:', error);
        res.status(500).json({ success: false, message: 'Server error. Please contact us directly.' });
    }
});

app.get('/api/availability', availabilityLimiter, async (req, res) => {
    try {
        const db = await connectDB();
        const dates = await db.collection('availability').find({}).toArray();
        res.json({ success: true, data: dates });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});

// ── ADMIN API (JWT Auth + Rate Limited) ────────────────

// Login — validates credentials, returns a signed JWT (never the raw token)
app.post('/api/admin/login', loginLimiter, (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password required.' });
    }
    if (username !== ADMIN_USERNAME || password !== ADMIN_TOKEN) {
        return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }

    // Sign a JWT with 8-hour expiry — the raw ADMIN_TOKEN never leaves the server
    const jwtToken = jwt.sign(
        { username, role: 'admin' },
        JWT_SECRET,
        { expiresIn: '8h' }
    );

    res.json({ success: true, token: jwtToken });
});

// Apply adminLimiter + adminAuth to all /api/admin/* routes (except login above)
app.get('/api/admin/bookings', adminLimiter, adminAuth, async (req, res) => {
    try {
        const db = await connectDB();
        const filter = {};
        if (req.query.status && req.query.status !== 'all') filter.status = req.query.status;
        const bookings = await db.collection('bookings').find(filter).sort({ createdAt: -1 }).toArray();
        res.json({ success: true, data: bookings });
    } catch (error) { res.status(500).json({ success: false, message: 'Server error.' }); }
});

app.post('/api/admin/bookings', adminLimiter, adminAuth, async (req, res) => {
    try {
        const db = await connectDB();
        const { name, phone, email, eventDate, eventType, hall, guests, message, status } = req.body;
        if (!name || !phone || !eventDate || !eventType)
            return res.status(400).json({ success: false, message: 'Name, phone, date, and event type required.' });
        const booking = {
            name, phone,
            email: email || '',
            eventDate, eventType,
            hall: hall || 'Any Available',
            guests: parseInt(guests) || 0,
            message: message || '',
            status: status || 'approved',
            source: 'manual',
            createdAt: new Date(),
        };
        const result = await db.collection('bookings').insertOne(booking);

        if (booking.status === 'approved') {
            await db.collection('availability').updateOne(
                { date: eventDate },
                { $set: { date: eventDate, status: 'booked', bookingId: result.insertedId, source: 'manual-booking' } },
                { upsert: true }
            );
        }
        res.status(201).json({ success: true, message: 'Booking added.', bookingId: result.insertedId });
    } catch (error) { res.status(500).json({ success: false, message: 'Server error.' }); }
});

app.put('/api/admin/bookings/:id', adminLimiter, adminAuth, async (req, res) => {
    try {
        const db = await connectDB();
        const { id } = req.params;
        if (!ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'Invalid ID.' });
        const { name, phone, email, eventDate, eventType, hall, guests, message, status } = req.body;
        const updateData = { updatedAt: new Date() };
        if (name) updateData.name = name;
        if (phone) updateData.phone = phone;
        if (email !== undefined) updateData.email = email;
        if (eventDate) updateData.eventDate = eventDate;
        if (eventType) updateData.eventType = eventType;
        if (hall) updateData.hall = hall;
        if (guests !== undefined) updateData.guests = parseInt(guests) || 0;
        if (message !== undefined) updateData.message = message;
        if (status) updateData.status = status;
        const oldBooking = await db.collection('bookings').findOne({ _id: new ObjectId(id) });
        if (!oldBooking) return res.status(404).json({ success: false, message: 'Booking not found.' });

        const result = await db.collection('bookings').updateOne(
            { _id: new ObjectId(id) }, { $set: updateData }
        );

        // ── Availability Sync Logic ──
        const currentBooking = { ...oldBooking, ...updateData };

        if (oldBooking.status === 'approved' && oldBooking.eventDate !== currentBooking.eventDate) {
            await db.collection('availability').deleteOne({ date: oldBooking.eventDate });
        }

        if (currentBooking.status === 'approved') {
            await db.collection('availability').updateOne(
                { date: currentBooking.eventDate },
                { $set: { date: currentBooking.eventDate, status: 'booked', bookingId: new ObjectId(id) } },
                { upsert: true }
            );
        } else {
            await db.collection('availability').deleteOne({ date: currentBooking.eventDate });
        }

        // ── SMS Notification on status change ──
        if (status && status !== oldBooking.status && currentBooking.phone) {
            if (status === 'approved') {
                sendSMS(currentBooking.phone,
                    `Assalam-o-Alaikum ${currentBooking.name},\n\nYour booking at Falak Marriage Hall has been APPROVED!\n\nEvent: ${currentBooking.eventType}\nDate: ${currentBooking.eventDate}\nHall: ${currentBooking.hall || 'Any Available'}\n\nWe look forward to making your event unforgettable! Contact us at 0308-6891083 for any questions.\n\n— Falak Hall & Events`
                );
            } else if (status === 'rejected') {
                sendSMS(currentBooking.phone,
                    `Dear ${currentBooking.name},\n\nWe regret to inform you that your booking request for ${currentBooking.eventDate} at Falak Marriage Hall could not be accommodated.\n\nPlease contact us at 0308-6891083 to discuss alternative dates.\n\n— Falak Hall & Events`
                );
            }
        }

        res.json({ success: true, message: 'Booking updated.' });
    } catch (error) { console.error(error); res.status(500).json({ success: false, message: 'Server error.' }); }
});

app.delete('/api/admin/bookings/:id', adminLimiter, adminAuth, async (req, res) => {
    try {
        const db = await connectDB();
        const { id } = req.params;
        if (!ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'Invalid ID.' });
        const booking = await db.collection('bookings').findOne({ _id: new ObjectId(id) });
        const result = await db.collection('bookings').deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0)
            return res.status(404).json({ success: false, message: 'Booking not found.' });
        if (booking?.eventDate) await db.collection('availability').deleteOne({ date: booking.eventDate });
        res.json({ success: true, message: 'Booking deleted.' });
    } catch (error) { res.status(500).json({ success: false, message: 'Server error.' }); }
});

app.get('/api/admin/availability', adminLimiter, adminAuth, async (req, res) => {
    try {
        const db = await connectDB();
        const dates = await db.collection('availability').find({}).sort({ date: 1 }).toArray();
        res.json({ success: true, data: dates });
    } catch (error) { res.status(500).json({ success: false, message: 'Server error.' }); }
});

app.post('/api/admin/availability', adminLimiter, adminAuth, async (req, res) => {
    try {
        const db = await connectDB();
        const { date, status } = req.body;
        if (!date || !status)
            return res.status(400).json({ success: false, message: 'Date and status required.' });
        if (status === 'available') {
            await db.collection('availability').deleteOne({ date });
        } else {
            await db.collection('availability').updateOne(
                { date },
                { $set: { date, status: 'booked', source: 'manual-block' } },
                { upsert: true }
            );
        }
        res.json({ success: true, message: `Date marked as ${status}.` });
    } catch (error) { res.status(500).json({ success: false, message: 'Server error.' }); }
});

// Maintenance: Re-sync availability table from approved bookings
app.post('/api/admin/availability/sync', adminLimiter, adminAuth, async (req, res) => {
    try {
        const db = await connectDB();

        const approvedBookings = await db.collection('bookings').find({ status: 'approved' }).toArray();
        const manualBlocks = await db.collection('availability').find({ source: 'manual-block' }).toArray();

        await db.collection('availability').deleteMany({});

        for (const b of approvedBookings) {
            await db.collection('availability').updateOne(
                { date: b.eventDate },
                { $set: { date: b.eventDate, status: 'booked', bookingId: b._id, source: 'sync' } },
                { upsert: true }
            );
        }

        for (const m of manualBlocks) {
            await db.collection('availability').updateOne(
                { date: m.date },
                { $set: { date: m.date, status: 'booked', source: 'manual-block' } },
                { upsert: true }
            );
        }

        res.json({ success: true, message: 'Availability synchronized successfully.' });
    } catch (error) { res.status(500).json({ success: false, message: 'Sync failed.' }); }
});

// Wildcard fallback router
app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ success: false, message: 'Resource not found' });
    }
    res.status(404).sendFile(path.resolve(process.cwd(), 'dist', '404', 'index.html'));
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, async () => {
        console.log(`🏛️  Falak Hall server → http://localhost:${PORT}`);
        console.log(`🔒 Security: CORS locked to ${allowedOrigins.join(', ')}`);
        console.log(`🔒 Security: JWT auth enabled, rate limiting active`);
        try { await connectDB(); } catch (e) { console.error('DB failed:', e.message); }
    });
}

export default app;