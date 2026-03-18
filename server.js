require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug endpoint
app.get('/api/debug-files', (req, res) => {
    const fs = require('fs');
    const walk = (dir) => {
        let results = [];
        const list = fs.readdirSync(dir);
        list.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) results = results.concat(walk(filePath));
            else results.push(filePath);
        });
        return results;
    };
    try {
        const files = walk(path.join(__dirname, 'public'));
        res.json({ dirname: __dirname, files });
    } catch (e) {
        res.json({ error: e.message });
    }
});

// Serve static files from /public (React build output)
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
let cachedDb = null;
let cachedClient = null;
const MONGODB_URI = process.env.MONGODB_URI;

async function connectDB() {
    if (cachedDb) return cachedDb;
    if (!MONGODB_URI) {
        const err = new Error('Missing MONGODB_URI');
        err.code = 'MISSING_MONGODB_URI';
        throw err;
    }
    try {
        cachedClient = cachedClient || new MongoClient(MONGODB_URI);
        await cachedClient.connect();
        const db = cachedClient.db('falak_hall');
        cachedDb = db;
        console.log('✅ Connected to MongoDB Atlas');
        return db;
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        throw error;
    }
}

// ─────────────────────────────────────────────
// API: Submit booking
// ─────────────────────────────────────────────
app.post('/api/booking', async (req, res) => {
    try {
        const db = await connectDB();
        const { name, phone, email, eventDate, eventType, hall, guests, message } = req.body;

        if (!name || !phone || !eventDate || !eventType) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all required fields.'
            });
        }

        const booking = {
            name,
            phone,
            email: email || '',
            eventDate,
            eventType,
            hall: hall || 'Any',
            guests: parseInt(guests) || 0,
            message: message || '',
            status: 'pending',
            createdAt: new Date()
        };

        const result = await db.collection('bookings').insertOne(booking);

        res.status(201).json({
            success: true,
            message: 'Booking request submitted successfully! We will contact you shortly.',
            bookingId: result.insertedId
        });
    } catch (error) {
        if (error && error.code === 'MISSING_MONGODB_URI') {
            return res.status(500).json({
                success: false,
                message: 'Server is missing database configuration.'
            });
        }
        console.error('Booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong. Please contact us directly.'
        });
    }
});

// ─────────────────────────────────────────────
// API: Get all bookings (admin use)
// ─────────────────────────────────────────────
app.get('/api/bookings', async (req, res) => {
    try {
        // Minimal protection to avoid exposing customer data publicly.
        // Set `ADMIN_TOKEN` in environment and call with header: `x-admin-token: <token>`.
        const adminToken = process.env.ADMIN_TOKEN;
        if (adminToken) {
            const provided = req.get('x-admin-token');
            if (!provided || provided !== adminToken) {
                return res.status(401).json({ success: false, message: 'Unauthorized.' });
            }
        }

        const db = await connectDB();
        const bookings = await db.collection('bookings')
            .find({})
            .sort({ createdAt: -1 })
            .toArray();
        res.json({ success: true, data: bookings });
    } catch (error) {
        if (error && error.code === 'MISSING_MONGODB_URI') {
            return res.status(500).json({ success: false, message: 'Server is missing database configuration.' });
        }
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});

// ─────────────────────────────────────────────
// SPA Fallback — React Router (must be LAST)
// ─────────────────────────────────────────────
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
if (require.main === module) {
    app.listen(PORT, async () => {
        console.log(`🏛️  Falak Hall & Events server running on http://localhost:${PORT}`);
        if (MONGODB_URI) {
            try { await connectDB(); }
            catch (err) { console.error('Database connection failed on startup'); }
        }
    });
}

module.exports = app;