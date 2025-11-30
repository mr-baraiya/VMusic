# Security Best Practices

## CRITICAL: Never Expose Secrets

### What NOT to do:
```javascript
// WRONG - Never hardcode secrets
const clientSecret = "ac0814caa22742a4bf8074e401bc9f36";
```

### What TO do:
```javascript
// CORRECT - Use environment variables
const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
```

---

## Current Security Status

### Properly Secured:
- [x] All secrets moved to `.env` file
- [x] `.env` file is in `.gitignore`
- [x] `.env.example` uses placeholders only
- [x] Environment variables configured in Vercel/Netlify
- [x] Documentation sanitized (no real secrets)
- [x] Client secrets only used in backend API functions

### Secret Storage Locations:

#### Frontend Environment Variables (Public - Safe to Expose):
- `VITE_SPOTIFY_CLIENT_ID` - Public OAuth client ID
- `VITE_YOUTUBE_API_KEY` - YouTube Data API key (with restrictions)
- `VITE_FIREBASE_API_KEY` - Firebase public API key
- `VITE_JAMENDO_CLIENT_ID` - Jamendo public client ID

#### Backend Environment Variables (Private - NEVER Expose):
- `SPOTIFY_CLIENT_SECRET` - Only in Vercel/Netlify backend
- `MONGODB_URI` - Database connection string
- `GOOGLE_CLIENT_SECRET` - OAuth secret for backend

---

## How Secrets Are Used

### Frontend (.env with VITE_ prefix):
```env
# These are bundled into the app (client-side)
VITE_SPOTIFY_CLIENT_ID=your_client_id
VITE_YOUTUBE_API_KEY=your_api_key
```

### Backend (Vercel/Netlify Environment Variables):
```env
# These stay on the server (never sent to client)
SPOTIFY_CLIENT_SECRET=your_secret
MONGODB_URI=mongodb+srv://...
```

---

## Deployment Checklist

### Before Deploying:

1. **Verify .gitignore**:
   ```bash
   cat .gitignore | grep .env
   # Should show: .env
   ```

2. **Check for exposed secrets**:
   ```bash
   git log -p | grep -i "client_secret\|api_key"
   # Should return nothing
   ```

3. **Set environment variables in hosting platform**:
   - Vercel: Project Settings → Environment Variables
   - Netlify: Site Settings → Environment → Environment Variables

4. **Test with placeholder values**:
   - Use `.env.example` values locally
   - Verify app shows proper error messages

---

## API Key Restrictions

### YouTube API Key:
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Select your API key
3. Add **Application restrictions**:
   - HTTP referrers: `yourdomain.com/*`, `localhost:5173/*`
4. Add **API restrictions**:
   - Only allow: YouTube Data API v3

### Spotify Client ID:
1. Go to [Spotify Dashboard](https://developer.spotify.com/dashboard)
2. Edit Settings
3. Add **Redirect URIs**:
   - `https://yourdomain.com/callback`
   - `http://localhost:5173/callback` (dev only)

---

## What to NEVER Commit:

```bash
# NEVER commit these files:
.env
.env.local
.env.production
secrets.json
firebase-service-account.json
```

```bash
# Always commit these:
.env.example
.gitignore
documentation (without real secrets)
```

---

## How to Check for Leaked Secrets:

### Scan your repository:
```bash
# Check if .env is tracked
git ls-files | grep .env

# Search commit history for secrets
git log -p --all -- .env

# Use git-secrets (recommended)
npm install -g git-secrets
git secrets --scan-history
```

### Remove secrets from git history:
```bash
# If you accidentally committed secrets:
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (CAUTION - this rewrites history)
git push origin --force --all
```

---

## If Secrets Are Exposed:

1. **Immediately rotate all exposed credentials**:
   - Generate new API keys
   - Update Spotify client secret
   - Revoke old tokens

2. **Update everywhere**:
   - Local `.env` file
   - Vercel/Netlify environment variables
   - Team members' local environments

3. **Verify**:
   - Test deployment with new secrets
   - Check all API integrations work

---

## Quick Reference

| Secret Type | Storage Location | Exposed to Client? |
|------------|------------------|-------------------|
| Spotify Client ID | `.env` (VITE_*) | Yes (safe) |
| Spotify Client Secret | Vercel/Netlify | No (backend only) |
| YouTube API Key | `.env` (VITE_*) | Yes (with restrictions) |
| Firebase API Key | `.env` (VITE_*) | Yes (safe with rules) |
| MongoDB URI | Vercel/Netlify | No (backend only) |
| Google OAuth Secret | Vercel/Netlify | No (backend only) |

---

## Additional Resources

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [OWASP Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning/about-secret-scanning)

---

**Remember**: When in doubt, treat it as a secret!
