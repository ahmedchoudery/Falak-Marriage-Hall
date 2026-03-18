# 🏛️ Falak Hall & Events — MERN Website v2.0

React + Vite + Node.js + MongoDB — complete production-grade wedding venue website.

## ✨ Features
- Three.js gold particle hero with mouse parallax
- Anime.js character text reveals + staggered entrances
- Custom gold spring-follow cursor
- Dual infinite scrolling gallery with lightbox
- Swiper testimonial carousel
- Interactive availability calendar
- Booking form → MongoDB with validation
- SEO: Schema.org, Open Graph, semantic HTML
- Mobile responsive with slide-out menu
- Code split chunks (vendor/three/swiper/anime)

## 🚀 Setup

### 1. Create .env in project root
```
MONGODB_URI=your_mongodb_atlas_connection_string
PORT=3000
```

### 2. Copy your images to client/public too
```bash
mkdir -p public/client/public/images
cp public/images/* public/client/public/images/
cp public/favicon_new.png public/client/public/
```

### 3. Install everything
```bash
npm install
cd public/client && npm install && cd ../..
```

### 4. Build React → /public
```bash
cd public/client && npm run build && cd ../..
```

### 5. Start
```bash
npm start
# → http://localhost:3000
```

## 💻 Dev Mode (hot reload)
```bash
# Terminal 1:
npm run dev          # backend on :3000

# Terminal 2:
cd public/client && npm run dev   # frontend on :5173 (proxies API to :3000)
```

## ☁️ Vercel Deploy
1. Push to GitHub
2. Connect to Vercel
3. Add env var: MONGODB_URI
4. Push → auto deploys

## 🎨 Customize
- **Colors:** `public/client/src/index.css` → `:root` variables
- **Phone/Email:** Search `0308-6891083` across all files
- **Booked dates:** `public/client/src/components/AvailabilityCalendar.jsx` → `BOOKED_DAYS` Set
- **Social links:** `public/client/src/components/Footer.jsx` → social icon hrefs
- **Maps link:** `public/client/src/pages/ContactPage.jsx` → "Get Directions" href

## 📞 API
- `POST /api/booking` — submit booking (saved to MongoDB)
- `GET  /api/bookings` — get all bookings

