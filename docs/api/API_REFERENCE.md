# 🎵 VMusic API Reference

Quick reference guide for Jamendo API endpoints used in VMusic.

## 🔑 Authentication

Get your free API key at: https://devportal.jamendo.com/

Add to `.env`:
```
VITE_JAMENDO_CLIENT_ID=your_client_id_here
```

## 📡 Base URL

```
https://api.jamendo.com/v3.0
```

## 🎧 Tracks Endpoints

### Search Tracks
```
GET /tracks/?client_id={CLIENT_ID}&search={query}&limit={limit}&format=json&audioformat=mp32
```

**Parameters:**
- `search` — Search term (song name, artist, album)
- `limit` — Number of results (default: 10, max: 200)
- `audioformat` — Audio quality: `mp31` (low), `mp32` (high)

**Example:**
```javascript
const searchSongs = async (query) => {
  const response = await fetch(
    `https://api.jamendo.com/v3.0/tracks/?client_id=${CLIENT_ID}&search=${query}&limit=20&format=json&audioformat=mp32`
  );
  return response.json();
};
```

### Get Tracks by Genre/Tag
```
GET /tracks/?client_id={CLIENT_ID}&tags={genre}&limit={limit}
```

**Popular Tags:**
- `rock`, `pop`, `jazz`, `electronic`, `classical`, `hiphop`, `indie`, `metal`, `folk`, `reggae`
- `chill`, `happy`, `sad`, `energetic`, `relaxing`, `dark`, `uplifting`

**Example:**
```javascript
const getChillSongs = async () => {
  const response = await fetch(
    `https://api.jamendo.com/v3.0/tracks/?client_id=${CLIENT_ID}&tags=chill&limit=30&audioformat=mp32`
  );
  return response.json();
};
```

### Get Popular Tracks
```
GET /tracks/?client_id={CLIENT_ID}&order=popularity_total&limit={limit}
```

**Order Options:**
- `popularity_total` — All-time popular
- `popularity_week` — Popular this week
- `popularity_month` — Popular this month
- `releasedate_desc` — Newest first
- `releasedate_asc` — Oldest first

### Get New Releases
```
GET /tracks/?client_id={CLIENT_ID}&order=releasedate_desc&limit={limit}
```

### Get Track by ID
```
GET /tracks/?client_id={CLIENT_ID}&id={track_id}
```

## 🎤 Artists Endpoints

### Get Artist Info
```
GET /artists/?client_id={CLIENT_ID}&id={artist_id}&format=json
```

**Returns:**
- Artist name
- Bio/description
- Website
- Social links
- Image/avatar

### Get Artist Tracks
```
GET /tracks/?client_id={CLIENT_ID}&artist_id={artist_id}&limit={limit}
```

### Search Artists
```
GET /artists/?client_id={CLIENT_ID}&search={query}&limit={limit}
```

## 💿 Albums Endpoints

### Get Album Info
```
GET /albums/?client_id={CLIENT_ID}&id={album_id}&format=json
```

### Get Album Tracks
```
GET /albums/tracks/?client_id={CLIENT_ID}&id={album_id}
```

### Search Albums
```
GET /albums/?client_id={CLIENT_ID}&search={query}&limit={limit}
```

## 📊 Response Format

### Track Object
```json
{
  "id": "123456",
  "name": "Song Name",
  "artist_name": "Artist Name",
  "artist_id": "78910",
  "album_name": "Album Name",
  "album_id": "111213",
  "duration": 240,
  "releasedate": "2024-01-15",
  "image": "https://usercontent.jamendo.com/?type=album&id=111213&width=300",
  "audio": "https://prod-1.storage.jamendo.com/?trackid=123456&format=mp32",
  "audiodownload": "https://...",
  "prourl": "https://...",
  "shareurl": "https://...",
  "position": 1
}
```

### Artist Object
```json
{
  "id": "78910",
  "name": "Artist Name",
  "website": "https://...",
  "joindate": "2020-05-10",
  "image": "https://...",
  "shorturl": "https://..."
}
```

## 🎯 Common Use Cases

### 1. Build a "Chill Radio"
```javascript
const getChillRadio = async () => {
  const response = await fetch(
    `https://api.jamendo.com/v3.0/tracks/?client_id=${CLIENT_ID}&tags=chill+relaxing&limit=50&order=popularity_week&audioformat=mp32`
  );
  return response.json();
};
```

### 2. Search with Autocomplete
```javascript
const searchWithDebounce = debounce(async (query) => {
  if (query.length < 2) return;
  const response = await fetch(
    `https://api.jamendo.com/v3.0/tracks/?client_id=${CLIENT_ID}&search=${query}&limit=10&audioformat=mp32`
  );
  const data = await response.json();
  return data.results;
}, 300);
```

### 3. Get Artist's Full Discography
```javascript
const getArtistDiscography = async (artistId) => {
  const [tracks, albums] = await Promise.all([
    fetch(`https://api.jamendo.com/v3.0/tracks/?client_id=${CLIENT_ID}&artist_id=${artistId}&limit=100&audioformat=mp32`).then(r => r.json()),
    fetch(`https://api.jamendo.com/v3.0/albums/?client_id=${CLIENT_ID}&artist_id=${artistId}&limit=50`).then(r => r.json())
  ]);
  return { tracks: tracks.results, albums: albums.results };
};
```

### 4. Get Trending This Week
```javascript
const getTrending = async () => {
  const response = await fetch(
    `https://api.jamendo.com/v3.0/tracks/?client_id=${CLIENT_ID}&order=popularity_week&limit=30&audioformat=mp32`
  );
  return response.json();
};
```

## 🔄 Rate Limiting

- **Free Tier:** 10,000 requests/day
- **Rate:** No specific rate limit per second
- **Best Practice:** Cache responses, use debouncing for search

## ⚠️ Error Handling

```javascript
const jamendoFetch = async (endpoint) => {
  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (!data.results || data.results.length === 0) {
      return { results: [], error: 'No results found' };
    }
    return data;
  } catch (error) {
    console.error('Jamendo API Error:', error);
    return { results: [], error: error.message };
  }
};
```

## 🎨 Image Sizes

Jamendo provides dynamic image resizing:
```
https://usercontent.jamendo.com/?type=album&id={album_id}&width={width}
```

**Recommended widths:**
- Thumbnail: `100`
- Card: `300`
- Detail: `500`
- Full: `600`

## 📝 Notes

- All audio files are royalty-free and can be streamed freely
- Attribution is not required but appreciated
- Commercial use allowed with Jamendo Pro license
- Use `audioformat=mp32` for high-quality 320kbps MP3

## 🔗 Useful Links

- [Jamendo Developer Portal](https://devportal.jamendo.com/)
- [API Documentation](https://developer.jamendo.com/v3.0)
- [Terms of Service](https://www.jamendo.com/legal/terms-of-use)

---

**Pro Tip:** Use the `includeFilters` parameter to filter explicit content:
```
&includeFilters=clean
```
