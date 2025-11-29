# 🔐 Environment Variables Guide

## Overview

This document explains how environment variables are managed across different environments (development vs production).

---

## 📁 File Structure

```
VMusic/
├── .env                    # Local development (NEVER commit)
├── .env.example           # Template for new developers (safe to commit)
├── .gitignore             # Ensures .env is never committed
└── api/
    └── spotify-token.js   # Production serverless function (uses Vercel env vars)
```

---

## 🔑 Environment Variables

### **Development (.env file)**

```bash
# Jamendo API
VITE_JAMENDO_CLIENT_ID=83bfb626

# Spotify API (for Vibe Zone)
VITE_SPOTIFY_CLIENT_ID=375b56d194264fd18ddc1e4151bb6c48
VITE_SPOTIFY_CLIENT_SECRET=ac0814caa22742a4bf8074e401bc9f36  # ⚠️ NEVER commit

# Firebase
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
# ... other Firebase configs

# EmailJS
VITE_EMAILJS_USER_ID=...
VITE_EMAILJS_SERVICE_ID=...
VITE_EMAILJS_TEMPLATE_ID=...
```

### **Production (Vercel Dashboard)**

Navigate to: **Vercel Dashboard → Project → Settings → Environment Variables**

Add these variables:

| Variable Name | Value | Environments |
|--------------|-------|--------------|
| `SPOTIFY_CLIENT_SECRET` | `your_spotify_secret` | Production, Preview, Development |
| `VITE_SPOTIFY_CLIENT_ID` | `your_spotify_client_id` | Production, Preview, Development |

**Note:** In production, the backend serverless function uses `SPOTIFY_CLIENT_SECRET` (without VITE_ prefix) from Vercel environment variables.

---

## 🔒 Security Best Practices

### ✅ **Safe to Expose (VITE_ prefix)**
- `VITE_SPOTIFY_CLIENT_ID` - Public client ID
- `VITE_JAMENDO_CLIENT_ID` - Public client ID
- `VITE_FIREBASE_*` - Firebase configs (protected by Firebase rules)
- `VITE_EMAILJS_*` - EmailJS configs (limited by domain restrictions)

### ⚠️ **MUST Keep Secret**
- `VITE_SPOTIFY_CLIENT_SECRET` (development only)
- `SPOTIFY_CLIENT_SECRET` (production - backend only)

---

## 🔄 How It Works

### **Development Mode**

```javascript
// src/pages/VibeZone.jsx
const isDevelopment = import.meta.env.DEV;

if (isDevelopment) {
  // Reads from .env file
  const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
  
  // Calls Spotify API directly
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(clientId + ':' + clientSecret)}`
    },
    body: 'grant_type=client_credentials'
  });
}
```

### **Production Mode**

```javascript
// src/pages/VibeZone.jsx
if (!isDevelopment) {
  // Calls secure backend API
  const response = await fetch('/api/spotify-token');
}

// api/spotify-token.js (Vercel serverless function)
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET; // From Vercel
// Secret never exposed to client
```

---

## 📝 Setup Instructions

### **For New Developers**

1. Clone the repository
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Fill in the values (get them from team lead or project admin)
4. Never commit `.env` file

### **For Deployment**

1. Deploy to Vercel:
   ```bash
   vercel
   ```

2. Add environment variables in Vercel Dashboard:
   - Go to Settings → Environment Variables
   - Add `SPOTIFY_CLIENT_SECRET` (without VITE_ prefix)
   - Apply to all environments (Production, Preview, Development)

3. Redeploy:
   ```bash
   vercel --prod
   ```

---

## 🧪 Testing

### **Local Development**

```bash
# Start dev server
npm run dev

# Visit Vibe Zone
# Open http://localhost:5173/vibe-zone

# Check console for token logs (should see "Token fetched successfully")
```

### **Production**

```bash
# Test backend API
curl https://your-app.vercel.app/api/spotify-token

# Expected response:
{
  "access_token": "BQC...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

---

## ❓ Troubleshooting

### **Error: "VITE_SPOTIFY_CLIENT_SECRET not found"**

**Solution:** Add the variable to your `.env` file:
```bash
VITE_SPOTIFY_CLIENT_SECRET=ac0814caa22742a4bf8074e401bc9f36
```

Then restart the dev server:
```bash
npm run dev
```

### **Error: "Failed to get Spotify token from backend" (Production)**

**Solution:** Add `SPOTIFY_CLIENT_SECRET` to Vercel environment variables:
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Add variable with value
3. Redeploy the application

### **Changes to .env not reflecting**

**Solution:** Vite doesn't hot-reload environment variables. Restart the dev server:
```bash
# Stop the server (Ctrl+C)
npm run dev
```

---

## 🔗 Related Documentation

- [VERCEL_SETUP.md](../VERCEL_SETUP.md) - Vercel deployment guide
- [VIBE_ZONE_DEPLOYMENT.md](../VIBE_ZONE_DEPLOYMENT.md) - Complete Vibe Zone guide
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)

---

**Last Updated:** November 13, 2025  
**Status:** ✅ Secure and production-ready
