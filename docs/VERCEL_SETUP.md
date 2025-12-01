# 🔐 Vercel Environment Variables Setup

## Required Environment Variables for Deployment

After deploying to Vercel, you MUST add the following environment variable:

---

## 📋 Copy This to Vercel Dashboard

Navigate to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

### **Variable Name:**

```
SPOTIFY_CLIENT_SECRET
```

### **Variable Value:**

```
your_spotify_client_secret_here
```

### **Environments to Select:**

- ✅ Production
- ✅ Preview
- ✅ Development

---

## ⚠️ Important Notes

1. **Do NOT commit `.env` to Git** - It's already in `.gitignore`
2. **This is the secret key** - Never share it publicly or expose in client-side code
3. **Development:** Secret is stored in `.env` file (VITE_SPOTIFY_CLIENT_SECRET)
4. **Production:** Secret is stored in Vercel environment variables (SPOTIFY*CLIENT_SECRET - without VITE* prefix)
5. **The Client ID** is already in your `.env` file (safe to use in frontend with VITE\_ prefix)
6. **After adding the variable** - Redeploy your app:
   ```bash
   vercel --prod
   ```

---

## ✅ Verification

After deployment, test the token API:

```bash
curl https://your-app.vercel.app/api/spotify-token
```

Expected response:

```json
{
  "access_token": "BQC...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

If you see this response, your environment variable is configured correctly! 🎉

---

## 🔄 Already Deployed?

If you already deployed without adding this variable:

1. Go to Vercel Dashboard
2. Navigate to Settings → Environment Variables
3. Add `SPOTIFY_CLIENT_SECRET` with the value above
4. Go to Deployments tab
5. Click "Redeploy" on the latest deployment

---

## 📝 Environment Variables Summary

| Variable                     | Where            | Purpose                                       |
| ---------------------------- | ---------------- | --------------------------------------------- |
| `VITE_SPOTIFY_CLIENT_ID`     | `.env` file      | Client ID (public, safe to commit)            |
| `VITE_SPOTIFY_CLIENT_SECRET` | `.env` file      | Secret for development (NEVER commit)         |
| `SPOTIFY_CLIENT_SECRET`      | Vercel Dashboard | Secret for production (without VITE\_ prefix) |

**Note:** In development, use `VITE_SPOTIFY_CLIENT_SECRET` in `.env`. In production (Vercel), use `SPOTIFY_CLIENT_SECRET` without the VITE\_ prefix since it's accessed from the serverless function backend.

---

**Status:** Ready to deploy! 🚀
