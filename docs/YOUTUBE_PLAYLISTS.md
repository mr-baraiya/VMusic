# 🎵 YouTube Playlists Integration Guide

## Overview

VMusic now supports accessing and playing songs from user's personal YouTube playlists! This feature uses Google OAuth 2.0 to request permission to read YouTube playlists (read-only access).

---

## 🔐 How It Works

### Data Flow

```
User → Sign in with Google
  ↓
Google OAuth → Returns Access Token with YouTube Permission
  ↓
React Frontend → Stores token in AuthContext
  ↓
Backend API → Uses token to call YouTube Data API
  ↓
YouTube API → Returns user's playlists & playlist items
  ↓
VMusic → Display & play using YouTube iframe player
```

---

## ✨ Features Implemented

### 1️⃣ Google OAuth with YouTube Scope
- **File**: `src/config/firebase.js`
- **Scope Added**: `https://www.googleapis.com/auth/youtube.readonly`
- **Parameters**: 
  - `prompt: 'consent'` - Forces consent screen to get refresh token
  - `access_type: 'offline'` - Requests offline access for refresh token

**What this means**: When users sign in with Google, they'll see a permission request asking to allow VMusic to view their YouTube playlists.

### 2️⃣ Access Token Storage
- **File**: `src/contexts/AuthContext.jsx`
- **State**: `googleAccessToken` - Stores the OAuth access token
- **Storage**: Token saved to MongoDB for persistent access across sessions

### 3️⃣ Backend API Endpoint
- **File**: `api/youtube-playlists.js`
- **Endpoints**:
  - `GET /api/youtube-playlists?userId=xxx&accessToken=yyy` - Get user's playlists
  - `GET /api/youtube-playlists?userId=xxx&playlistId=zzz&accessToken=yyy` - Get playlist items

**Features**:
- CORS enabled for frontend access
- Error handling for expired/invalid tokens
- Returns simplified data format
- Supports pagination (50 items per request)

### 4️⃣ Frontend API Client
- **File**: `src/api/youtube.js`
- **Methods**:
  - `getUserPlaylists(userId, accessToken)` - Fetch all playlists
  - `getPlaylistItems(userId, playlistId, accessToken)` - Fetch playlist songs
  - `validateAccessToken(accessToken)` - Check token validity

### 5️⃣ YouTube Playlists Modal
- **File**: `src/components/vibetube/YouTubePlaylists.jsx`
- **UI Features**:
  - Grid view of user's playlists with thumbnails
  - Click playlist to view songs inside
  - Play button on each song
  - Loading states & error handling
  - Beautiful animations with Framer Motion

### 6️⃣ Integration in VibeTube
- **File**: `src/pages/VibeTube.jsx`
- **New State**: `showYouTubePlaylists` - Controls modal visibility
- **Button Location**: Search bar (YouTube icon, only visible when signed in)
- **Functionality**: Clicking button opens modal showing user's playlists

---

## 🚀 Usage Instructions

### For Users:

1. **Sign In with Google**
   - Click "Sign in with Google" button
   - Approve permissions:
     - ✅ View your email
     - ✅ View your YouTube account
     - ✅ View your YouTube playlists (read-only)

2. **Access Your Playlists**
   - Look for the **YouTube icon** (🎬) in the search bar
   - Click to open "My YouTube Playlists" modal

3. **Browse Playlists**
   - See all your YouTube playlists with thumbnails
   - View number of videos in each playlist
   - Click any playlist to see songs inside

4. **Play Songs**
   - Click any song to play immediately
   - Song will load in the VMusic player
   - Playlist continues playing in order

---

## 🔧 Technical Details

### OAuth 2.0 Flow

```javascript
// 1. Configure Google Provider with YouTube scope
googleProvider.addScope('https://www.googleapis.com/auth/youtube.readonly');
googleProvider.setCustomParameters({
  prompt: 'consent',
  access_type: 'offline'
});

// 2. Sign in and capture token
const result = await signInWithPopup(auth, googleProvider);
const accessToken = result._tokenResponse.oauthAccessToken;

// 3. Store token in state and MongoDB
setGoogleAccessToken(accessToken);
await usersAPI.syncUser(userId, { 
  googleAccessToken, 
  googleRefreshToken 
});

// 4. Use token to call YouTube API
const playlists = await youtubeAPI.getUserPlaylists(userId, accessToken);
```

### YouTube Data API Endpoints Used

**1. Get User Playlists**
```
GET https://www.googleapis.com/youtube/v3/playlists
?part=snippet,contentDetails
&mine=true
&maxResults=50
Authorization: Bearer {accessToken}
```

**2. Get Playlist Items**
```
GET https://www.googleapis.com/youtube/v3/playlistItems
?part=snippet,contentDetails
&playlistId={playlistId}
&maxResults=50
Authorization: Bearer {accessToken}
```

### Data Structure

**Playlist Object:**
```javascript
{
  id: "PLxxxxxx",
  title: "My Favorite Songs",
  description: "Collection of my favorites",
  thumbnail: "https://i.ytimg.com/...",
  itemCount: 42,
  publishedAt: "2024-01-01T00:00:00Z"
}
```

**Playlist Item Object:**
```javascript
{
  id: "UExxxxxITE",
  videoId: "kJQP7kiw5Fk",
  title: "Song Title",
  description: "Song description...",
  channelTitle: "Artist Name",
  thumbnail: "https://i.ytimg.com/...",
  publishedAt: "2024-01-01T00:00:00Z",
  position: 0
}
```

---

## 🔒 Security & Privacy

### Permissions Requested
- ✅ **Read-Only Access**: Only viewing playlists, never modifying
- ✅ **No Downloads**: Songs played via YouTube iframe (legal & compliant)
- ✅ **Token Security**: Access tokens stored securely in MongoDB
- ✅ **User Control**: Users can revoke access anytime via Google Account settings

### Token Management
- **Access Token**: Short-lived (1 hour), stored in AuthContext
- **Refresh Token**: Long-lived, stored in MongoDB for re-authentication
- **Expiration Handling**: API returns 401 error if token expired → prompts re-login

---

## 📊 MongoDB Schema Updates

### Users Collection - New Fields

```javascript
{
  userId: "firebase_uid",
  email: "user@example.com",
  displayName: "John Doe",
  photoURL: "https://...",
  provider: "google.com",
  
  // NEW FIELDS
  googleAccessToken: "ya29.a0AfB_byy3...",  // OAuth access token
  googleRefreshToken: "1//xxxxx",            // Refresh token
  googleTokenUpdatedAt: "2024-11-14T10:30:00Z", // Last token update
  
  createdAt: "2024-01-01T00:00:00Z",
  lastLogin: "2024-11-14T10:30:00Z"
}
```

---

## 🧪 Testing

### Test Access Token Storage

1. Sign in with Google
2. Open browser console
3. Check AuthContext:
```javascript
// In browser console
const { googleAccessToken } = useAuth();
console.log('Has token:', !!googleAccessToken); // Check if token exists
```

4. Verify MongoDB:
```bash
# Connect to MongoDB Atlas
# Browse Collections → vmusic → users
# Find your user document
# Check for googleAccessToken field
```

### Test API Endpoints

**Get Playlists:**
```bash
curl "http://localhost:5173/api/youtube-playlists?userId=YOUR_USER_ID&accessToken=YOUR_TOKEN"
```

**Get Playlist Items:**
```bash
curl "http://localhost:5173/api/youtube-playlists?userId=YOUR_USER_ID&playlistId=PLAYLIST_ID&accessToken=YOUR_TOKEN"
```

### Test UI

1. Sign in with Google account that has YouTube playlists
2. Look for YouTube icon (🎬) in search bar
3. Click icon → Modal should open
4. Should see list of your playlists
5. Click playlist → Should see songs
6. Click song → Should play in VMusic player

---

## 🐛 Troubleshooting

### Issue: YouTube button not visible
**Solution**: 
- Make sure you're signed in with Google (not email)
- Check browser console for `googleAccessToken`
- Token should be non-null

### Issue: "Access token expired" error
**Solution**:
- Sign out and sign in again
- This will generate a new access token
- Future: Implement automatic token refresh

### Issue: "No playlists found"
**Solution**:
- Go to YouTube.com
- Create at least one playlist
- Refresh VMusic page

### Issue: CORS error
**Solution**:
- Backend API has CORS enabled
- Check Vercel function logs
- Verify API endpoint is deployed

### Issue: Songs not playing
**Solution**:
- Check if videoId is valid
- YouTube iframe API must be loaded
- Check browser console for errors

---

## 🎯 Future Enhancements

### Planned Features

1. **Token Auto-Refresh**
   - Use refresh token to get new access tokens
   - Avoid requiring re-login every hour

2. **Liked Videos**
   - Fetch user's liked videos from YouTube
   - Display in separate section

3. **Watch Later**
   - Show YouTube "Watch Later" playlist
   - Quick access to saved videos

4. **Playlist Sync**
   - Two-way sync between VMusic and YouTube playlists
   - Add VMusic playlists to YouTube

5. **Search Within Playlists**
   - Filter playlist items by title/artist
   - Quick find in large playlists

6. **Playlist Creation**
   - Create new YouTube playlists from VMusic
   - Add songs to existing playlists

---

## 📝 API Reference

### Backend Endpoint

**GET /api/youtube-playlists**

**Query Parameters:**
- `userId` (required): Firebase user ID
- `accessToken` (required): Google OAuth access token
- `playlistId` (optional): If provided, returns playlist items instead of playlists

**Response - Playlists:**
```json
{
  "playlists": [
    {
      "id": "PLxxxxxx",
      "title": "My Playlist",
      "description": "...",
      "thumbnail": "https://...",
      "itemCount": 42,
      "publishedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 10,
  "nextPageToken": "CAUQAA"
}
```

**Response - Playlist Items:**
```json
{
  "playlistId": "PLxxxxxx",
  "items": [
    {
      "id": "UExxxxxITE",
      "videoId": "kJQP7kiw5Fk",
      "title": "Song Title",
      "description": "...",
      "channelTitle": "Artist Name",
      "thumbnail": "https://...",
      "publishedAt": "2024-01-01T00:00:00Z",
      "position": 0
    }
  ],
  "total": 42,
  "nextPageToken": null
}
```

**Error Responses:**
```json
// 400 - Missing parameters
{ "error": "userId and accessToken are required" }

// 401 - Expired token
{ 
  "error": "Access token expired or invalid. Please sign in again.",
  "code": "TOKEN_EXPIRED"
}

// 403 - API access denied
{ 
  "error": "YouTube API access denied. Check API key and quotas.",
  "code": "API_ACCESS_DENIED"
}

// 500 - Server error
{ 
  "error": "Failed to fetch YouTube playlists",
  "details": "..." 
}
```

---

## 📚 Files Created/Modified

### New Files Created:
1. `api/youtube-playlists.js` - Backend API endpoint
2. `src/api/youtube.js` - Frontend API client
3. `src/components/vibetube/YouTubePlaylists.jsx` - Playlists modal UI
4. `docs/YOUTUBE_PLAYLISTS.md` - This documentation

### Files Modified:
1. `src/config/firebase.js` - Added YouTube scope
2. `src/contexts/AuthContext.jsx` - Added token storage
3. `api/users.js` - Added token fields to schema
4. `src/pages/VibeTube.jsx` - Added playlists modal integration
5. `src/components/vibetube/SearchBar.jsx` - Added YouTube button

---

## ✅ Checklist for Deployment

Before deploying to production:

- [ ] Test Google OAuth flow completely
- [ ] Verify YouTube API quota limits (10,000 units/day)
- [ ] Check CORS configuration on Vercel
- [ ] Ensure environment variables are set:
  - `MONGODB_URI`
  - Firebase config variables
  - YouTube API key (optional, uses OAuth token)
- [ ] Test token expiration handling
- [ ] Verify error messages are user-friendly
- [ ] Test on mobile devices
- [ ] Check loading states work properly
- [ ] Ensure animations are smooth
- [ ] Test with accounts that have 0 playlists
- [ ] Test with accounts that have 50+ playlists

---

## 🎉 Success!

Your users can now:
✅ Sign in with Google
✅ Access their YouTube playlists
✅ Browse all their playlists
✅ View songs in each playlist
✅ Play any song directly in VMusic
✅ Everything is 100% legal and compliant with YouTube TOS

**No downloading, no piracy, just streaming via official YouTube iframe API!**

---

**Happy Coding! 🎵**
