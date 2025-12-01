# 🚀 Secure Deployment Guide

## ⚠️ CRITICAL: Environment Variables Setup

### 🔐 Backend-Only Secrets (Vercel/Netlify Dashboard)

**These should NEVER have `VITE_` prefix and NEVER be in `.env` file:**

```bash
# Spotify Backend Secret (backend-only)
SPOTIFY_CLIENT_SECRET=get_from_spotify_dashboard

# MongoDB Connection (backend-only)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vmusic

# Google OAuth Secret (backend-only)
GOOGLE_CLIENT_SECRET=get_from_google_cloud_console
```

### 🌐 Frontend Public Variables (Can use `VITE_` prefix)

**These are bundled into the app and safe to expose (with restrictions):**

```bash
# Spotify Public Client ID
VITE_SPOTIFY_CLIENT_ID=your_client_id

# YouTube API Key (with HTTP referrer restrictions)
VITE_YOUTUBE_API_KEY=your_youtube_key

# Firebase Config (public by design, secured via Firebase rules)
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# EmailJS (public client keys)
VITE_EMAILJS_USER_ID=your_emailjs_user_id
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id

# Jamendo API (public)
VITE_JAMENDO_CLIENT_ID=your_jamendo_id

# Backend API endpoint
VITE_API_BASE_URL=https://your-app.vercel.app/api
```

---

## 📋 Netlify Deployment Steps

### 1. Set Environment Variables in Netlify Dashboard

Go to: **Site Settings → Environment → Environment Variables**

Add these **backend secrets** (without `VITE_` prefix):

| Variable Name           | Value                | Scopes                   |
| ----------------------- | -------------------- | ------------------------ |
| `SPOTIFY_CLIENT_SECRET` | `your_secret`        | Production, Preview, Dev |
| `MONGODB_URI`           | `mongodb+srv://...`  | Production, Preview, Dev |
| `GOOGLE_CLIENT_SECRET`  | `your_google_secret` | Production, Preview, Dev |

Add these **frontend variables** (with `VITE_` prefix):

| Variable Name            | Value                              | Scopes |
| ------------------------ | ---------------------------------- | ------ |
| `VITE_SPOTIFY_CLIENT_ID` | `your_client_id`                   | All    |
| `VITE_YOUTUBE_API_KEY`   | `your_youtube_key`                 | All    |
| `VITE_FIREBASE_API_KEY`  | `your_firebase_key`                | All    |
| `VITE_API_BASE_URL`      | `https://your-app.netlify.app/api` | All    |

### 2. Disable Secret Scanning (After Cleaning Docs)

Add to Netlify Environment Variables:

```bash
SECRETS_SCAN_ENABLED=false
SECRETS_SCAN_OMIT_PATHS=docs/**,*.md
```

⚠️ **Only do this AFTER removing all real secrets from documentation!**

### 3. Deploy

```bash
git add .
git commit -m "Security: Remove secrets from frontend, use backend API"
git push origin main
```

---

## 🔐 Vercel Deployment Steps

### 1. Set Environment Variables

Go to: **Project Settings → Environment Variables**

**Backend Secrets** (no `VITE_` prefix):

- `SPOTIFY_CLIENT_SECRET`
- `MONGODB_URI`
- `GOOGLE_CLIENT_SECRET`

**Frontend Variables** (with `VITE_` prefix):

- All the same as Netlify above

### 2. Deploy

```bash
vercel --prod
```

Or push to GitHub and let auto-deployment handle it.

---

## ✅ Verification Checklist

### Before Deploying:

- [ ] `.env` file has NO secrets (only in `.gitignore`)
- [ ] `.env.example` uses placeholders only
- [ ] No `VITE_SPOTIFY_CLIENT_SECRET` anywhere in code
- [ ] No `MONGODB_URI` in `.env` file
- [ ] Backend functions use `process.env` (not `import.meta.env.VITE_*`)
- [ ] Frontend calls backend API for tokens (not direct Spotify API)
- [ ] All documentation sanitized (no real keys)

### After Deploying:

- [ ] Check browser console: No secrets visible in network tab
- [ ] Test Spotify token generation: `/api/spotify-token` works
- [ ] Test VibeTube: Videos load correctly
- [ ] Test VibeZone: Music plays correctly
- [ ] Check build logs: No secret scanning warnings

---

## 🚨 If Build Fails with Secret Scanning Errors:

### Quick Fix (Temporary):

1. Go to Netlify dashboard
2. Environment Variables
3. Add: `SECRETS_SCAN_ENABLED=false`
4. Redeploy

### Proper Fix (Recommended):

1. Remove all real secrets from `docs/**` files
2. Use placeholders: `your_key_here` instead of real values
3. Keep `.env` in `.gitignore`
4. Set secrets in Netlify/Vercel dashboard only
5. Re-enable secret scanning for security

---

## 🔥 Emergency: Secrets Already Exposed?

If you accidentally committed secrets:

### 1. Rotate All Credentials Immediately

- **Spotify**: Dashboard → Settings → "Show Client Secret" → "Reset"
- **YouTube**: Google Cloud Console → Create new API key, delete old one
- **MongoDB**: Atlas → Database Access → Reset password

### 2. Remove from Git History

```bash
# Remove .env from git history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (WARNING: Rewrites history)
git push origin --force --all
```

### 3. Update Everywhere

- Local `.env` files
- Netlify/Vercel environment variables
- Tell team members to pull latest changes

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────┐
│         Browser (Frontend)                  │
│  ❌ NO SECRETS HERE                         │
│  ✅ Only public VITE_* variables            │
└───────────────┬─────────────────────────────┘
                │
                │ fetch('/api/spotify-token')
                │
                ▼
┌─────────────────────────────────────────────┐
│    Netlify/Vercel Functions (Backend)       │
│  ✅ SPOTIFY_CLIENT_SECRET available here    │
│  ✅ MONGODB_URI available here              │
│  ✅ Secrets never sent to browser           │
└───────────────┬─────────────────────────────┘
                │
                │ Call Spotify API with secret
                │
                ▼
┌─────────────────────────────────────────────┐
│         Spotify/MongoDB APIs                │
└─────────────────────────────────────────────┘
```

---

## 🎯 Summary

| Action                                          | Status         |
| ----------------------------------------------- | -------------- |
| Remove `VITE_SPOTIFY_CLIENT_SECRET` from `.env` | ✅ Done        |
| Remove `MONGODB_URI` from `.env`                | ✅ Done        |
| Use backend API for Spotify tokens              | ✅ Done        |
| Sanitize all documentation                      | ✅ Done        |
| Update `.env.example`                           | ✅ Done        |
| Add backend-only secrets to Netlify/Vercel      | 🔄 You must do |
| Deploy and test                                 | 🔄 You must do |

**Your app is now secure!** 🔒
