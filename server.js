import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cors from 'cors';
import { MongoClient, ServerApiVersion } from 'mongodb';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Manual Asset Routing (for debugging and robustness)
app.get('/assets/:file', (req, res, next) => {
    const filePath = path.join(process.cwd(), 'dist', 'assets', req.params.file);
    if (fs.existsSync(filePath)) {
        // Set correct MIME type
        if (req.params.file.endsWith('.js')) res.setHeader('Content-Type', 'application/javascript');
        if (req.params.file.endsWith('.css')) res.setHeader('Content-Type', 'text/css');
        res.sendFile(filePath);
    } else {
        console.error(`[ASSET 404] ${req.params.file} not found at ${filePath}`);
        next(); // fall through to catch-all (which serves index.html)
    }
});

// Serve static files from /dist (React build output)
const distPath = path.resolve(process.cwd(), 'dist');
console.log(`Static root: ${distPath}`);
app.use(express.static(distPath));

// MongoDB connection
let cachedDb = null;

async function connectToDatabase() {
    if (cachedDb) return cachedDb;
    
    if (!process.env.MONGODB_URI) {
        throw new Error('Please define the MONGODB_URI environment variable');
    }

    const client = new MongoClient(process.env.MONGODB_URI, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    try {
        await client.connect();
        console.log("Successfully connected to MongoDB");
        cachedDb = client.db('falak_hall_db'); // Replace with your DB name
        return cachedDb;
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
    }
}

// API Routes
app.post('/api/booking', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const bookings = db.collection('bookings');
        
        const bookingData = {
            ...req.body,
            createdAt: new Date(),
            status: 'pending'
        };

        const result = await bookings.insertOne(bookingData);
        res.status(201).json({ success: true, message: 'Booking inquiry received!', id: result.insertedId });
    } catch (error) {
        console.error('Booking submission error:', error);
        res.status(500).json({ success: false, message: 'Internal server error. Please try again later.' });
    }
});

// SPA Fallback — React Router (must be LAST)
// ─────────────────────────────────────────────
app.get('*', (req, res) => {
    res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
});

// Start server
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`);
    });
}

export default app;