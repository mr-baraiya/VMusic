# 🚀 Quick Deployment Guide - Fix API Issues

## ✅ Changes Made

### Files Modified:
1. `vercel.json` - Added all API endpoints
2. `src/api/users.js` - Point to production API
3. `src/api/favorites.js` - Point to production API
4. `src/api/youtube.js` - Point to production API
5. `vite.config.js` - Added API proxy (optional)

---

## 🔧 Current Issue

The API endpoints are returning HTML instead of JSON because:
- ❌ Local Vite server doesn't serve `/api` folder
- ❌ Need to deploy to Vercel for APIs to work

---

## 📤 Deploy to Vercel

### Option 1: GitHub Auto-Deploy (Recommended)

If your repo is connected to Vercel:

1. **Push changes to GitHub**:
   ```bash
   git add .
   git commit -m "fix: Add YouTube playlists API and fix CORS"
   git push origin main
   ```

2. **Vercel auto-deploys** - Wait 2-3 minutes

3. **Test at**: `https://v-music-gamma.vercel.app`

---

### Option 2: Manual Deploy via Vercel Dashboard

1. **Go to**: https://vercel.com/dashboard
2. **Select Project**: `v-music-gamma`
3. **Click**: "Redeploy" button
4. **Wait**: 2-3 minutes for deployment

---

### Option 3: Deploy via Vercel CLI

1. **Authenticate** (if not done):
   ```bash
   npx vercel login
   ```

2. **Deploy**:
   ```bash
   npx vercel --prod
   ```

---

## 🧪 Test After Deployment

### 1. Test API Endpoints

```bash
# Test Users API
curl https://v-music-gamma.vercel.app/api/users?userId=test

# Test YouTube Playlists API (needs real token)
curl "https://v-music-gamma.vercel.app/api/youtube-playlists?userId=test&accessToken=test"
```

### 2. Test Frontend

1. Go to: `https://v-music-gamma.vercel.app/vibetube`
2. Sign in with Google
3. Click YouTube icon
4. Check browser console - should see data, not HTML errors

---

## 🔍 Troubleshooting

### If API Still Returns HTML:

1. **Check Vercel Functions Tab**:
   - Go to Vercel dashboard
   - Click "Functions" tab
   - Verify all 4 API endpoints are listed:
     - `/api/users`
     - `/api/favorites`
     - `/api/search-history`
     - `/api/youtube-playlists`

2. **Check Vercel Logs**:
   - Go to "Deployments" tab
   - Click latest deployment
   - Check "Build Logs" for errors

3. **Verify Environment Variables**:
   - Go to "Settings" → "Environment Variables"
   - Ensure `MONGODB_URI` is set

---

## 📝 Local Development (Optional)

For local API testing, use Vercel CLI:

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Run dev server with API support
vercel dev
```

Or keep using `npm run dev` and point to production API (current setup).

---

## ✅ Expected Result After Deploy

1. ✅ APIs return JSON (not HTML)
2. ✅ User sync works
3. ✅ Favorites save to MongoDB
4. ✅ YouTube playlists load
5. ✅ No CORS errors

---

## 🎯 Next Steps

1. **Deploy to Vercel** (any method above)
2. **Wait 2-3 minutes** for deployment
3. **Clear browser cache**: Ctrl+Shift+R
4. **Test sign in** with Google
5. **Click YouTube icon** - should show playlists!

---

## 📞 If Still Not Working

Check these:

1. **Vercel Dashboard** → Build logs
2. **Browser Console** → Network tab → Check API responses
3. **MongoDB Atlas** → Check connection (IP whitelist: 0.0.0.0/0)
4. **Firebase Console** → Check authorized domains

---

**Current Status**: ✅ Code is ready, just needs deployment!
