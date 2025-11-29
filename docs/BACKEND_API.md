# VMusic Backend API Documentation

## Overview
VMusic uses MongoDB Atlas for storing user data, favorites, and search history. The backend is serverless using Vercel API routes.

## Base URLs
- **Production**: `https://v-music-gamma.vercel.app/api`
- **Development**: `http://localhost:5173/api`

## Database Configuration

### MongoDB Connection
```
MONGODB_URI=mongodb+srv://i_am_vishal_1014:1014@cluster0.r4bt2.mongodb.net
Database Name: vmusic
```

### Collections
1. **users** - User profiles synced from Firebase
2. **favorites** - User's favorite music tracks
3. **search_history** - User's search queries

---

## API Endpoints

### 1. Users API (`/api/users`)

#### POST - Create/Update User
Syncs user data from Firebase to MongoDB after authentication.

**Endpoint**: `POST /api/users`

**Request Body**:
```json
{
  "userId": "firebase_user_uid",
  "email": "user@example.com",
  "displayName": "John Doe",
  "photoURL": "https://...",
  "provider": "google.com"
}
```

**Response** (200):
```json
{
  "message": "User created" | "User updated",
  "user": {
    "userId": "firebase_user_uid",
    "email": "user@example.com",
    "displayName": "John Doe",
    "photoURL": "https://...",
    "provider": "google.com",
    "createdAt": "2025-11-14T10:30:00.000Z",
    "lastLogin": "2025-11-14T10:30:00.000Z",
    "searchHistory": []
  },
  "success": true
}
```

#### GET - Get User Details
Fetches user profile from MongoDB.

**Endpoint**: `GET /api/users?userId=firebase_user_uid`

**Response** (200):
```json
{
  "user": {
    "userId": "firebase_user_uid",
    "email": "user@example.com",
    "displayName": "John Doe",
    "photoURL": "https://...",
    "provider": "google.com",
    "createdAt": "2025-11-14T10:30:00.000Z",
    "lastLogin": "2025-11-14T10:30:00.000Z"
  }
}
```

#### PUT - Update User Profile
Updates user display name and photo.

**Endpoint**: `PUT /api/users`

**Request Body**:
```json
{
  "userId": "firebase_user_uid",
  "displayName": "New Name",
  "photoURL": "https://new-photo.jpg"
}
```

**Response** (200):
```json
{
  "message": "Profile updated",
  "success": true
}
```

---

### 2. Favorites API (`/api/favorites`)

#### POST - Add to Favorites
Adds a music track to user's favorites list.

**Endpoint**: `POST /api/favorites`

**Request Body**:
```json
{
  "userId": "firebase_user_uid",
  "track": {
    "videoId": "kJQP7kiw5Fk",
    "title": "Despacito",
    "channelTitle": "Luis Fonsi",
    "thumbnail": "https://i.ytimg.com/vi/kJQP7kiw5Fk/mqdefault.jpg",
    "duration": "4:42"
  }
}
```

**Response** (200):
```json
{
  "message": "Track added to favorites",
  "success": true,
  "alreadyExists": false
}
```

If track already exists:
```json
{
  "message": "Track already in favorites",
  "alreadyExists": true
}
```

#### GET - Get Favorites
Retrieves all favorite tracks for a user.

**Endpoint**: `GET /api/favorites?userId=firebase_user_uid`

**Response** (200):
```json
{
  "favorites": [
    {
      "videoId": "kJQP7kiw5Fk",
      "title": "Despacito",
      "channelTitle": "Luis Fonsi",
      "thumbnail": "https://i.ytimg.com/vi/kJQP7kiw5Fk/mqdefault.jpg",
      "duration": "4:42",
      "addedAt": "2025-11-14T10:30:00.000Z"
    }
  ]
}
```

#### DELETE - Remove from Favorites
Removes a track from user's favorites.

**Endpoint**: `DELETE /api/favorites`

**Request Body**:
```json
{
  "userId": "firebase_user_uid",
  "videoId": "kJQP7kiw5Fk"
}
```

**Response** (200):
```json
{
  "message": "Track removed from favorites",
  "success": true
}
```

---

### 3. Search History API (`/api/search-history`)

#### POST - Add Search Query
Saves a search query to user's history.

**Endpoint**: `POST /api/search-history`

**Request Body**:
```json
{
  "userId": "firebase_user_uid",
  "query": "romantic songs",
  "results": 24
}
```

**Response** (200):
```json
{
  "message": "Search query added to history",
  "success": true
}
```

**Features**:
- Prevents duplicate searches within 1 hour (updates timestamp instead)
- Auto-limits to last 100 searches per user
- Stores both lowercase query (for searching) and original query (for display)

#### GET - Get Search History
Retrieves user's search history.

**Endpoint**: `GET /api/search-history?userId=firebase_user_uid&limit=20`

**Query Parameters**:
- `userId` (required): Firebase user UID
- `limit` (optional): Number of results (default: 20, max: 100)

**Response** (200):
```json
{
  "history": [
    {
      "_id": "mongodb_object_id",
      "userId": "firebase_user_uid",
      "query": "romantic songs",
      "originalQuery": "Romantic Songs",
      "resultsCount": 24,
      "timestamp": "2025-11-14T10:30:00.000Z"
    }
  ]
}
```

#### DELETE - Clear Search History
Clears all search history for a user.

**Endpoint**: `DELETE /api/search-history`

**Request Body**:
```json
{
  "userId": "firebase_user_uid"
}
```

**Response** (200):
```json
{
  "message": "Search history cleared",
  "success": true
}
```

---

### 4. YouTube Playlists API (`/api/youtube-playlists`) 🆕

Fetches user's YouTube playlists and playlist items using Google OAuth access token. Requires user to sign in with Google and grant YouTube readonly permission.

#### GET - Get User's Playlists
Returns all playlists for the authenticated user.

**Endpoint**: `GET /api/youtube-playlists?userId={userId}&accessToken={accessToken}`

**Query Parameters**:
- `userId` (required): Firebase user ID
- `accessToken` (required): Google OAuth access token

**Response** (200):
```json
{
  "playlists": [
    {
      "id": "PLxxxxxx",
      "title": "My Favorite Songs",
      "description": "Collection of favorites",
      "thumbnail": "https://i.ytimg.com/vi/...",
      "itemCount": 42,
      "publishedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 10,
  "nextPageToken": "CAUQAA"
}
```

#### GET - Get Playlist Items
Returns all videos/songs in a specific playlist.

**Endpoint**: `GET /api/youtube-playlists?userId={userId}&playlistId={playlistId}&accessToken={accessToken}`

**Query Parameters**:
- `userId` (required): Firebase user ID
- `playlistId` (required): YouTube playlist ID
- `accessToken` (required): Google OAuth access token

**Response** (200):
```json
{
  "playlistId": "PLxxxxxx",
  "items": [
    {
      "id": "UExxxxxITE",
      "videoId": "kJQP7kiw5Fk",
      "title": "Despacito - Luis Fonsi",
      "description": "Song description...",
      "channelTitle": "Luis Fonsi",
      "thumbnail": "https://i.ytimg.com/vi/...",
      "publishedAt": "2024-01-01T00:00:00Z",
      "position": 0
    }
  ],
  "total": 42,
  "nextPageToken": null
}
```

**Error Responses**:

**401 Unauthorized** - Token expired or invalid:
```json
{
  "error": "Access token expired or invalid. Please sign in again.",
  "code": "TOKEN_EXPIRED"
}
```

**403 Forbidden** - API access denied:
```json
{
  "error": "YouTube API access denied. Check API key and quotas.",
  "code": "API_ACCESS_DENIED"
}
```

---

## Error Responses

All endpoints return consistent error responses:

**400 Bad Request** - Missing required parameters:
```json
{
  "error": "User ID is required"
}
```

**403 Forbidden** - YouTube API quota exceeded:
```json
{
  "error": "YouTube API quota exceeded. Please try again later."
}
```

**405 Method Not Allowed**:
```json
{
  "error": "Method not allowed"
}
```

**500 Internal Server Error**:
```json
{
  "error": "Internal server error",
  "details": "Error message details"
}
```

---

## Frontend API Utilities

### Import Statements
```javascript
import { usersAPI, searchHistoryAPI } from '../api/users';
import { favoritesAPI } from '../api/favorites';
import { youtubeAPI } from '../api/youtube'; // NEW!
```

### Users API Client
```javascript
// Sync user after Firebase auth
await usersAPI.syncUser(userId, userData);

// Get user details
const user = await usersAPI.getUser(userId);

// Update profile
await usersAPI.updateProfile(userId, { displayName, photoURL });
```

### Favorites API Client
```javascript
// Add to favorites
await favoritesAPI.addToFavorites(userId, track);

// Get favorites
const favorites = await favoritesAPI.getFavorites(userId);

// Remove from favorites
await favoritesAPI.removeFromFavorites(userId, videoId);

// Check if in favorites
const inFavorites = await favoritesAPI.isInFavorites(userId, videoId);
```

### Search History API Client
```javascript
// Get search history
const history = await searchHistoryAPI.getSearchHistory(userId, limit);

// Add to history
await searchHistoryAPI.addToHistory(userId, query, resultsCount);

// Clear history
await searchHistoryAPI.clearHistory(userId);
```

### YouTube Playlists API Client (NEW!)
```javascript
// Get user's playlists
const { playlists, total } = await youtubeAPI.getUserPlaylists(userId, accessToken);

// Get playlist items
const { items, total } = await youtubeAPI.getPlaylistItems(userId, playlistId, accessToken);

// Validate access token
const isValid = await youtubeAPI.validateAccessToken(accessToken);
```

---

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  userId: String,           // Firebase UID (indexed, unique)
  email: String,
  displayName: String,
  photoURL: String,
  provider: String,         // "email", "google.com", etc.
  googleAccessToken: String, // NEW! OAuth token for YouTube API
  googleRefreshToken: String, // NEW! Refresh token for re-auth
  googleTokenUpdatedAt: ISODate, // NEW! Last token update timestamp
  createdAt: ISODate,
  lastLogin: ISODate,
  updatedAt: ISODate,
  searchHistory: []         // Legacy field (not used, kept for compatibility)
}
```

**Indexes**:
- `userId`: unique index for fast lookups

### Favorites Collection
```javascript
{
  _id: ObjectId,
  userId: String,           // Firebase UID (indexed)
  tracks: [
    {
      videoId: String,
      title: String,
      channelTitle: String,
      thumbnail: String,
      duration: String,
      addedAt: ISODate
    }
  ],
  createdAt: ISODate
}
```

**Indexes**:
- `userId`: index for user lookups
- `tracks.videoId`: index for checking duplicates

### Search History Collection
```javascript
{
  _id: ObjectId,
  userId: String,           // Firebase UID (indexed)
  query: String,            // Lowercase for searching
  originalQuery: String,    // Original case for display
  resultsCount: Number,
  timestamp: ISODate
}
```

**Indexes**:
- `userId`: index for user lookups
- `timestamp`: index for sorting by date
- `userId + query + timestamp`: compound index for duplicate detection

---

## Authentication Flow

1. User signs in via Firebase (Google/Email)
2. Firebase returns user object with `uid`, `email`, `displayName`, `photoURL`
3. Frontend calls `usersAPI.syncUser()` with Firebase user data
4. Backend creates/updates user in MongoDB
5. User data is now available in both Firebase and MongoDB

### Example Auth Integration
```javascript
// In AuthContext.jsx
import { usersAPI } from '../api/users';

const createUserDocument = async (user) => {
  // ... Firebase Firestore logic ...
  
  // Sync to MongoDB
  try {
    await usersAPI.syncUser(user.uid, {
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      providerData: user.providerData
    });
    console.log('✅ User synced to MongoDB');
  } catch (error) {
    console.error('MongoDB sync error:', error);
  }
};
```

---

## CORS Configuration

All API routes have CORS enabled:
```javascript
res.setHeader('Access-Control-Allow-Credentials', true);
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
```

---

## Testing the API

### Using cURL

**Test User Sync**:
```bash
curl -X POST https://v-music-gamma.vercel.app/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test_user_123",
    "email": "test@example.com",
    "displayName": "Test User",
    "photoURL": "https://example.com/photo.jpg",
    "provider": "email"
  }'
```

**Test Add to Favorites**:
```bash
curl -X POST https://v-music-gamma.vercel.app/api/favorites \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test_user_123",
    "track": {
      "videoId": "kJQP7kiw5Fk",
      "title": "Despacito",
      "channelTitle": "Luis Fonsi",
      "thumbnail": "https://i.ytimg.com/vi/kJQP7kiw5Fk/mqdefault.jpg",
      "duration": "4:42"
    }
  }'
```

**Test Get Favorites**:
```bash
curl -X GET "https://v-music-gamma.vercel.app/api/favorites?userId=test_user_123"
```

**Test Search History**:
```bash
curl -X POST https://v-music-gamma.vercel.app/api/search-history \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test_user_123",
    "query": "romantic songs",
    "results": 24
  }'
```

---

## File Structure

```
VMusic/
├── api/
│   ├── favorites.js          # Favorites CRUD operations
│   ├── users.js              # User sync & profile management
│   ├── search-history.js     # Search history tracking
│   └── spotify-token.js      # Existing Spotify token endpoint
├── src/
│   ├── api/
│   │   ├── favorites.js      # Frontend favorites API client
│   │   └── users.js          # Frontend users & search API client
│   ├── contexts/
│   │   └── AuthContext.jsx   # Auth with MongoDB sync
│   ├── components/
│   │   └── vibetube/
│   │       └── SearchHistory.jsx  # Search history modal
│   └── pages/
│       └── VibeTube.jsx      # Main music player page
└── .env                      # Environment variables
```

---

## Environment Variables

Required in `.env` file:
```env
# MongoDB
MONGODB_URI=mongodb+srv://i_am_vishal_1014:1014@cluster0.r4bt2.mongodb.net

# Firebase
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=vmusic-7806a.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=vmusic-7806a

# YouTube
VITE_YOUTUBE_API_KEY=your_youtube_api_key_here
```

---

## Deployment

### Vercel Configuration

The API routes are automatically deployed to Vercel serverless functions.

**vercel.json**:
```json
{
  "functions": {
    "api/**/*.js": {
      "memory": 1024,
      "maxDuration": 10
    }
  }
}
```

### MongoDB Atlas Setup

1. Go to https://cloud.mongodb.com
2. Log in with credentials: `i_am_vishal_1014` / `1014`
3. Navigate to Cluster0 → Database Access → Verify user exists
4. Navigate to Network Access → Add IP: `0.0.0.0/0` (Allow all)
5. Get connection string from "Connect" button

---

## Rate Limits & Quotas

### YouTube API
- **Quota**: 10,000 units/day
- **search.list**: 100 units per call
- **videos.list**: 1 unit per call
- **Optimization**: Using hardcoded popular video IDs saves 99 units on initial load

### MongoDB Atlas
- **Free Tier**: 512 MB storage
- **Max Connections**: 500 concurrent
- **Current Usage**: Check at https://cloud.mongodb.com

---

## Troubleshooting

### Common Issues

**1. CORS Errors**
- Ensure API routes include CORS headers
- Check that requests use correct base URL

**2. MongoDB Connection Failed**
- Verify `MONGODB_URI` in environment variables
- Check Network Access whitelist in MongoDB Atlas
- Verify user credentials are correct

**3. User Not Syncing**
- Check browser console for errors
- Verify Firebase authentication is working
- Test API endpoint directly with cURL

**4. Search History Not Saving**
- Ensure user is logged in (`currentUser` exists)
- Check that query is not "top music 2024" (excluded)
- Verify API endpoint is responding

---

## Next Steps

### Backend Development Tasks

1. **Create Indexes** (Performance Optimization)
```javascript
// In MongoDB shell or via API
db.users.createIndex({ userId: 1 }, { unique: true });
db.favorites.createIndex({ userId: 1 });
db.favorites.createIndex({ "tracks.videoId": 1 });
db.search_history.createIndex({ userId: 1 });
db.search_history.createIndex({ timestamp: -1 });
db.search_history.createIndex({ userId: 1, query: 1, timestamp: -1 });
```

2. **Add Analytics Endpoints**
- Track most searched queries
- Track most favorited songs
- User engagement metrics

3. **Add Playlist Sync** (Future)
- Store playlists in MongoDB instead of localStorage
- Sync playlists across devices

4. **Add Social Features** (Future)
- Share playlists with other users
- Follow users
- Public/private playlists

---

## Support

For issues or questions:
- Check browser console for errors
- Test API endpoints with cURL
- Verify MongoDB Atlas connection
- Review Vercel deployment logs

---

**Documentation Last Updated**: November 14, 2025
**API Version**: 1.0.0
**Database Version**: MongoDB 6.0+
