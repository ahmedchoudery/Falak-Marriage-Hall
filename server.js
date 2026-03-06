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

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
let cachedDb = null;
const MONGODB_URI = process.env.MONGODB_URI;

async function connectDB() {
    if (cachedDb) return cachedDb;

    try {
        const client = new MongoClient(MONGODB_URI);
        await client.connect();
        const db = client.db('falak_hall');
        cachedDb = db;
        console.log('✅ Connected to MongoDB Atlas');
        return db;
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        throw error;
    }
}

// API: Submit booking
app.post('/api/booking', async (req, res) => {
    try {
        const db = await connectDB();

        const { name, phone, email, eventDate, eventType, hall, guests, message } = req.body;

        // Basic validation
        if (!name || !phone || !eventDate || !eventType) {
            return res.status(400).json({ success: false, message: 'Please fill in all required fields.' });
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
        console.error('Booking error:', error);
        res.status(500).json({ success: false, message: 'Something went wrong. Please contact us directly.' });
    }
});

// Fallback: serve index.html for root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server (only if running directly)
if (process.env.NODE_ENV !== 'production' && require.main === module) {
    app.listen(PORT, async () => {
        console.log(`🏛️  Falak Hall & Events server running on http://localhost:${PORT}`);
        try {
            await connectDB();
        } catch (err) {
            console.error('Database connection failed on startup');
        }
    });
}

module.exports = app;
