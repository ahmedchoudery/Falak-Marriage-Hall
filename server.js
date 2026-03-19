import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cors from 'cors';
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Manual Asset Routing
app.get('/assets/:file', (req, res, next) => {
    const filePath = path.join(process.cwd(), 'dist', 'assets', req.params.file);
    if (fs.existsSync(filePath)) {
        if (req.params.file.endsWith('.js')) res.setHeader('Content-Type', 'application/javascript');
        if (req.params.file.endsWith('.css')) res.setHeader('Content-Type', 'text/css');
        // Assets with hashes can be cached!
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        res.sendFile(filePath);
    } else { next(); }
});
// Static assets — disable default index serving to prevent cache interception
app.use(express.static(path.resolve(process.cwd(), 'dist'), { index: false }));

// MongoDB
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

// Admin auth middleware — checks x-admin-token header
function adminAuth(req, res, next) {
    const token = req.headers['x-admin-token'];
    if (!token || token !== process.env.ADMIN_TOKEN) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    next();
}

// ── PUBLIC API ─────────────────────────────────────────

app.post('/api/booking', async (req, res) => {
    try {
        const db = await connectDB();
        const { name, phone, email, eventDate, eventType, hall, guests, message } = req.body;
        if (!name || !phone || !eventDate || !eventType)
            return res.status(400).json({ success: false, message: 'Please fill in all required fields.' });
        const booking = {
            name, phone,
            email: email || '',
            eventDate, eventType,
            hall: hall || 'Any Available',
            guests: parseInt(guests) || 0,
            message: message || '',
            status: 'pending',
            source: 'online',
            createdAt: new Date(),
        };
        const result = await db.collection('bookings').insertOne(booking);
        await db.collection('availability').updateOne(
            { date: eventDate },
            { $set: { date: eventDate, status: 'booked', bookingId: result.insertedId } },
            { upsert: true }
        );
        res.status(201).json({ success: true, message: 'Booking request submitted! We will contact you within 24 hours.', bookingId: result.insertedId });
    } catch (error) {
        console.error('Booking error:', error);
        res.status(500).json({ success: false, message: 'Server error. Please contact us directly.' });
    }
});

app.get('/api/availability', async (req, res) => {
    try {
        const db = await connectDB();
        const dates = await db.collection('availability').find({}).toArray();
        res.json({ success: true, data: dates });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});

// ── ADMIN API ──────────────────────────────────────────

// Login — checks username AND token (password)
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    const validUsername = 'ahmedchoudery1';
    const validToken = process.env.ADMIN_TOKEN;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password required.' });
    }
    if (username !== validUsername || password !== validToken) {
        return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }
    res.json({ success: true, token: validToken });
});

app.get('/api/admin/bookings', adminAuth, async (req, res) => {
    try {
        const db = await connectDB();
        const filter = {};
        if (req.query.status && req.query.status !== 'all') filter.status = req.query.status;
        const bookings = await db.collection('bookings').find(filter).sort({ createdAt: -1 }).toArray();
        res.json({ success: true, data: bookings });
    } catch (error) { res.status(500).json({ success: false, message: 'Server error.' }); }
});

app.post('/api/admin/bookings', adminAuth, async (req, res) => {
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
        await db.collection('availability').updateOne(
            { date: eventDate },
            { $set: { date: eventDate, status: 'booked', bookingId: result.insertedId } },
            { upsert: true }
        );
        res.status(201).json({ success: true, message: 'Booking added.', bookingId: result.insertedId });
    } catch (error) { res.status(500).json({ success: false, message: 'Server error.' }); }
});

app.put('/api/admin/bookings/:id', adminAuth, async (req, res) => {
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
        const result = await db.collection('bookings').updateOne(
            { _id: new ObjectId(id) }, { $set: updateData }
        );
        if (result.matchedCount === 0)
            return res.status(404).json({ success: false, message: 'Booking not found.' });
        if (status === 'approved' && eventDate) {
            await db.collection('availability').updateOne(
                { date: eventDate },
                { $set: { date: eventDate, status: 'booked', bookingId: new ObjectId(id) } },
                { upsert: true }
            );
        } else if (status === 'rejected') {
            const booking = await db.collection('bookings').findOne({ _id: new ObjectId(id) });
            if (booking?.eventDate) await db.collection('availability').deleteOne({ date: booking.eventDate });
        }
        res.json({ success: true, message: 'Booking updated.' });
    } catch (error) { console.error(error); res.status(500).json({ success: false, message: 'Server error.' }); }
});

app.delete('/api/admin/bookings/:id', adminAuth, async (req, res) => {
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

app.get('/api/admin/availability', adminAuth, async (req, res) => {
    try {
        const db = await connectDB();
        const dates = await db.collection('availability').find({}).sort({ date: 1 }).toArray();
        res.json({ success: true, data: dates });
    } catch (error) { res.status(500).json({ success: false, message: 'Server error.' }); }
});

app.post('/api/admin/availability', adminAuth, async (req, res) => {
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
                { $set: { date, status: 'booked', source: 'manual' } },
                { upsert: true }
            );
        }
        res.json({ success: true, message: `Date marked as ${status}.` });
    } catch (error) { res.status(500).json({ success: false, message: 'Server error.' }); }
});

// SPA fallback — disable caching and ETags for index.html to force 200 OK
app.get('*', (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'), { etag: false, lastModified: false });
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, async () => {
        console.log(`🏛️  Falak Hall server → http://localhost:${PORT}`);
        try { await connectDB(); } catch (e) { console.error('DB failed:', e.message); }
    });
}

export default app;