# Firebase Authentication Errors - Complete Fix Guide

## Error Details
```
identitytoolkit.googleapis.com/v1/accounts:signInWithPassword - 400 error
FirebaseError: Firebase: Error (auth/invalid-credential)
```

This happens when **Identity Toolkit API is NOT enabled** in your Google Cloud project.

## ⚠️ CRITICAL: Follow These Steps EXACTLY

### Step 1: Enable Identity Toolkit API (MUST DO)
1. Go to **[Google Cloud Console](https://console.cloud.google.com)**
2. Make sure **vmusic-478107** project is selected (top left dropdown)
3. Click **☰ Menu** → **APIs & Services** → **Enabled APIs & services**
4. Click **+ ENABLE APIS AND SERVICES** button (top)
5. Search box: type `"Identity Toolkit"`
6. Click on **"Google Identity Toolkit API"**
7. Click **ENABLE** button
8. **⏳ Wait 2-3 minutes** for activation to complete
9. You should see a green checkmark

### Step 2: Enable Email/Password Sign-in in Firebase
1. Go to **[Firebase Console](https://console.firebase.google.com)**
2. Select **vmusic-478107** project
3. Left sidebar: **Build** → **Authentication**
4. Click **Sign-in method** tab
5. Look for **Email/Password** provider
6. Click on it
7. Toggle **Enable** to ON (should be blue)
8. Click **Save**

### Step 3: Configure API Key Restrictions (IMPORTANT)
1. Go back to **[Google Cloud Console](https://console.cloud.google.com)**
2. **APIs & Services** → **Credentials**
3. Under "API Keys", find your **Web API Key** (or create one)
   - Key name should contain "web" or similar
4. Click on it to edit
5. Under **API Restrictions**:
   - Select **Restrict key**
   - Check: ✅ **Google Identity Toolkit API**
   - Add other APIs if needed: Firestore, Storage, Analytics
6. Under **Application Restrictions**:
   - Select **HTTP referrers (web sites)**
   - Add these:
     ```
     localhost:*
     localhost:3000
     localhost:5173
     127.0.0.1:*
     ```
   - If you have a production domain, add: `yourdomain.com/*`
7. Click **Save** at bottom

### Step 4: Verify Firebase Config in Your Project
Check that your `.env.local` has the correct values for **vmusic-478107**:

```env
VITE_FIREBASE_API_KEY=AIzaSyAxRVuhduqnfQF9Vb-Oz7PROv2Vb4zwj9U
VITE_FIREBASE_AUTH_DOMAIN=vmusic-478107.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=vmusic-478107
VITE_FIREBASE_STORAGE_BUCKET=vmusic-478107.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
VITE_FIREBASE_APP_ID=xxx
```

You can get these from Firebase Console:
- **Project Settings** (⚙️ icon) → **General** tab
- Copy "Web" configuration

### Step 5: Test & Verify
1. **Hard refresh browser**: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Clear browser cookies/cache if needed
3. Try **Sign Up** with a new email first
4. Then try **Sign In** with that email

## Troubleshooting

### Still Getting 400 Error?
- [ ] Verify Identity Toolkit API shows "Enabled" (with green checkmark)
- [ ] Wait another 5 minutes (sometimes slow to activate)
- [ ] Try opening in an **Incognito/Private window**
- [ ] Check that Email/Password is enabled in Firebase Authentication

### Getting "auth/unauthorized-domain"?
- Go to Firebase Console → Authentication → Settings
- Scroll to "Authorized domains"
- Add your domain: `localhost`, `127.0.0.1`, and any production domains

### Still Not Working?
1. Try completely clearing browser storage:
   - F12 → Application → Clear site data
2. Close and reopen browser
3. Try from a different browser
4. Check Google Cloud Console shows API is "Enabled" (not "Enabling")

## Quick Checklist
- [ ] Identity Toolkit API is **ENABLED** in Google Cloud
- [ ] Email/Password is **ENABLED** in Firebase Authentication
- [ ] API Key has correct restrictions set
- [ ] Browser cache cleared
- [ ] Correct Firebase config in `.env.local`
- [ ] Waited 2-3 minutes after enabling API
