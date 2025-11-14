# VMusic Backend - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account
- Vercel account (for deployment)

### API Base URLs
```
Production:  https://v-music-gamma.vercel.app/api
Development: http://localhost:5173/api
```

---

## 📦 Installation

```bash
# Clone and install
cd VMusic
npm install

# Install MongoDB driver
npm install mongodb

# Start dev server
npm run dev
```

---

## 🔐 Environment Setup

Edit `.env` file:
```env
# MongoDB (Already configured)
MONGODB_URI=mongodb+srv://i_am_vishal_1014:1014@cluster0.r4bt2.mongodb.net

# Firebase (Already configured)
VITE_FIREBASE_API_KEY=AIzaSyAxRVuhduqnfQF9Vb-Oz7PROv2Vb4zwj9U
VITE_FIREBASE_AUTH_DOMAIN=vmusic-7806a.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=vmusic-7806a

# YouTube (Already configured)
VITE_YOUTUBE_API_KEY=AIzaSyDJXcz-kF17AFmQZ81NpSKf0Q_b7cx5gos
```

---

## 📡 API Endpoints Overview

### 1️⃣ Users API - `/api/users`
```javascript
// Sync user after Firebase login
POST /api/users
{
  "userId": "firebase_uid",
  "email": "user@email.com",
  "displayName": "John Doe",
  "photoURL": "https://...",
  "provider": "google.com"
}

// Get user details
GET /api/users?userId=firebase_uid

// Update profile
PUT /api/users
{
  "userId": "firebase_uid",
  "displayName": "New Name",
  "photoURL": "https://..."
}
```

### 2️⃣ Favorites API - `/api/favorites`
```javascript
// Add favorite song
POST /api/favorites
{
  "userId": "firebase_uid",
  "track": {
    "videoId": "kJQP7kiw5Fk",
    "title": "Despacito",
    "channelTitle": "Luis Fonsi",
    "thumbnail": "https://...",
    "duration": "4:42"
  }
}

// Get all favorites
GET /api/favorites?userId=firebase_uid

// Remove favorite
DELETE /api/favorites
{
  "userId": "firebase_uid",
  "videoId": "kJQP7kiw5Fk"
}
```

### 3️⃣ Search History API - `/api/search-history`
```javascript
// Save search query
POST /api/search-history
{
  "userId": "firebase_uid",
  "query": "romantic songs",
  "results": 24
}

// Get search history
GET /api/search-history?userId=firebase_uid&limit=20

// Clear history
DELETE /api/search-history
{
  "userId": "firebase_uid"
}
```

---

## 🧪 Test the API

### Quick Test with cURL

**1. Test User Sync:**
```bash
curl -X POST http://localhost:5173/api/users \
  -H "Content-Type: application/json" \
  -d '{"userId":"test123","email":"test@test.com","displayName":"Test User","photoURL":"","provider":"email"}'
```

**2. Test Add Favorite:**
```bash
curl -X POST http://localhost:5173/api/favorites \
  -H "Content-Type: application/json" \
  -d '{"userId":"test123","track":{"videoId":"abc123","title":"Test Song","channelTitle":"Artist","thumbnail":"https://...","duration":"3:45"}}'
```

**3. Test Get Favorites:**
```bash
curl http://localhost:5173/api/favorites?userId=test123
```

---

## 🗄️ MongoDB Database Structure

**Database Name:** `vmusic`

**Collections:**
1. **users** - User profiles
2. **favorites** - User's favorite songs  
3. **search_history** - Search queries

### View Your Data
1. Go to: https://cloud.mongodb.com
2. Login: `i_am_vishal_1014` / `1014`
3. Navigate: Cluster0 → Browse Collections
4. Select: `vmusic` database

---

## 💻 Frontend Usage

### Import API Clients
```javascript
import { usersAPI, searchHistoryAPI } from './api/users';
import { favoritesAPI } from './api/favorites';
import { useAuth } from './contexts/AuthContext';
```

### Use in Components
```javascript
const { currentUser } = useAuth();

// Add to favorites
const handleAddFavorite = async (track) => {
  if (!currentUser) {
    alert('Please sign in');
    return;
  }
  
  try {
    await favoritesAPI.addToFavorites(currentUser.uid, track);
    console.log('Added to favorites!');
  } catch (error) {
    console.error('Error:', error);
  }
};

// Get search history
const loadHistory = async () => {
  const history = await searchHistoryAPI.getSearchHistory(currentUser.uid, 20);
  console.log('Search history:', history);
};
```

---

## 🚢 Deployment to Vercel

### Automatic Deployment
1. Push to GitHub
2. Vercel auto-deploys
3. API routes available at: `https://v-music-gamma.vercel.app/api/`

### Manual Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Environment Variables on Vercel
1. Go to: https://vercel.com/your-project/settings/environment-variables
2. Add: `MONGODB_URI=mongodb+srv://i_am_vishal_1014:1014@cluster0.r4bt2.mongodb.net`
3. Redeploy

---

## 🐛 Troubleshooting

### Issue: MongoDB Connection Failed
**Solution:**
1. Check MongoDB Atlas Network Access
2. Whitelist IP: `0.0.0.0/0` (Allow all)
3. Verify credentials: `i_am_vishal_1014` / `1014`

### Issue: CORS Error
**Solution:**
- API routes already have CORS enabled
- Ensure using correct base URL
- Check browser console for exact error

### Issue: API Not Working Locally
**Solution:**
```bash
# Restart dev server
npm run dev

# Test endpoint directly
curl http://localhost:5173/api/users?userId=test
```

### Issue: Data Not Saving
**Solution:**
1. Check browser console for errors
2. Verify user is logged in
3. Test API with cURL
4. Check MongoDB Atlas for data

---

## 📊 Monitoring

### Check API Health
```bash
# Test users endpoint
curl http://localhost:5173/api/users?userId=test

# Test favorites endpoint
curl http://localhost:5173/api/favorites?userId=test

# Test search history endpoint
curl http://localhost:5173/api/search-history?userId=test
```

### View Logs
**Local Development:**
- Check terminal output
- Check browser console

**Production (Vercel):**
1. Go to: https://vercel.com
2. Select project
3. Click "Functions" tab
4. View real-time logs

### MongoDB Metrics
1. Go to: https://cloud.mongodb.com
2. Select: Cluster0
3. View: Metrics tab
4. Monitor: Operations, Connections, Storage

---

## 📝 File Structure

```
VMusic/
├── api/                      # Backend API routes (Serverless)
│   ├── users.js             # User sync & profile
│   ├── favorites.js         # Favorites CRUD
│   └── search-history.js    # Search history
│
├── src/
│   ├── api/                 # Frontend API clients
│   │   ├── users.js         # Users & search API
│   │   └── favorites.js     # Favorites API
│   │
│   ├── contexts/
│   │   └── AuthContext.jsx  # Auth with MongoDB sync
│   │
│   └── components/
│       └── vibetube/
│           └── SearchHistory.jsx  # Search history UI
│
├── docs/
│   ├── BACKEND_API.md       # Full API documentation
│   └── QUICK_START.md       # This file
│
└── .env                     # Environment variables
```

---

## 🎯 Next Steps

### 1. Test Everything Locally
```bash
npm run dev
# Visit: http://localhost:5173
# Sign in with Google
# Add songs to favorites
# Search for music
# Check search history
```

### 2. Verify MongoDB Data
- Login to MongoDB Atlas
- Check `users`, `favorites`, `search_history` collections
- Verify data is being saved

### 3. Deploy to Production
```bash
git push origin main
# Vercel auto-deploys
# Test at: https://v-music-gamma.vercel.app
```

### 4. Monitor Performance
- Check Vercel function logs
- Monitor MongoDB metrics
- Watch for errors in browser console

---

## 📚 Additional Resources

- **Full API Docs**: `docs/BACKEND_API.md`
- **MongoDB Atlas**: https://cloud.mongodb.com
- **Vercel Dashboard**: https://vercel.com
- **Firebase Console**: https://console.firebase.google.com

---

## ✅ Current Status

**✓ Backend Completed:**
- [x] MongoDB connection setup
- [x] Users API (sync, get, update)
- [x] Favorites API (add, get, remove)
- [x] Search History API (add, get, clear)
- [x] CORS configuration
- [x] Error handling
- [x] Frontend API clients
- [x] Auth integration
- [x] UI components

**🚀 Ready to Deploy!**

All backend APIs are implemented and tested. You can now:
1. Run `npm run dev` to test locally
2. Push to GitHub for automatic Vercel deployment
3. Access APIs at production URL

---

**Happy Coding! 🎵**
