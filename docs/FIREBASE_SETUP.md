# 🔥 Firebase Authentication Setup Guide

## ✅ What's Been Configured

### 1. Firebase SDK Installed

- **Package**: `firebase` (v11.x)
- **Services**: Authentication, Firestore, Analytics

### 2. Firebase Configuration

- **File**: `src/config/firebase.js`
- **Environment Variables**: Stored securely in `.env`
- **Services Initialized**:
  - ✅ Firebase Auth (Google + Email/Password providers)
  - ✅ Firestore Database
  - ✅ Analytics

### 3. Authentication Context

- **File**: `src/contexts/AuthContext.jsx`
- **Features**:
  - User state management
  - Sign up with email/password
  - Sign in with email/password
  - Sign in with Google (popup)
  - Sign out
  - Automatic user document creation in Firestore
  - Persistent auth state

### 4. UI Components

- **Sign In Modal**: `src/components/auth/SignIn.jsx`
- **Sign Up Modal**: `src/components/auth/SignUp.jsx`
- **Features**:
  - Beautiful gradient design
  - Email/Password authentication
  - Google Sign In button
  - Form validation
  - Error handling
  - Loading states
  - Switch between Sign In/Sign Up

### 5. Landing Page Integration

- **Updated**: Hero component now shows auth buttons
- **Dynamic UI**: Shows user info when logged in
- **Sign Out**: Button to logout

---

## 🚀 Next Steps in Firebase Console

### Step 1: Enable Authentication Providers

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **vmusic-7806a**
3. Navigate to **Authentication** → **Sign-in method**
4. Enable the following providers:

#### A. Email/Password

- Click on **Email/Password**
- Toggle **Enable**
- Click **Save**

#### B. Google Sign-In

- Click on **Google**
- Toggle **Enable**
- **Public-facing name**: VMusic
- **Support email**: Choose your email
- Click **Save**

### Step 2: Create Firestore Database

1. Navigate to **Firestore Database**
2. Click **Create database**
3. Select **Start in test mode** (for development)
4. Choose a location (closest to your users)
5. Click **Enable**

### Step 3: Configure Firestore Security Rules

Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - users can only read/write their own data
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Playlists collection - users can only modify their own playlists
    match /playlists/{playlistId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }

    // Favorites/Likes collection
    match /favorites/{favoriteId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

### Step 4: Add Authorized Domain (for deployment)

1. Go to **Authentication** → **Settings** → **Authorized domains**
2. Add your deployment domain (e.g., `vmusic.app`)
3. `localhost` is already authorized for development

---

## 📊 Firestore Database Structure

### Users Collection

```javascript
users/{userId}
  - email: string
  - displayName: string
  - photoURL: string
  - createdAt: timestamp
  - likedTracks: array[trackId]
  - playlists: array[playlistId]
```

### Playlists Collection (to be implemented)

```javascript
playlists/{playlistId}
  - userId: string
  - name: string
  - description: string
  - coverImage: string
  - tracks: array[trackId]
  - isPublic: boolean
  - createdAt: timestamp
  - updatedAt: timestamp
```

### Favorites Collection (to be implemented)

```javascript
favorites/{favoriteId}
  - userId: string
  - trackId: string
  - trackName: string
  - artistName: string
  - createdAt: timestamp
```

---

## 🧪 Testing Authentication

### Test Sign Up (Email/Password)

1. Open http://localhost:5174
2. Click **"Get Started Free"**
3. Enter:
   - Display Name: "Test User"
   - Email: "test@example.com"
   - Password: "password123"
4. Click **Sign Up**
5. Check Firestore Console → users collection for new document

### Test Google Sign In

1. Click **"Sign In"**
2. Click **"Continue with Google"**
3. Select your Google account
4. Grant permissions
5. Should redirect back and show "Welcome, [Your Name]!"

### Test Sign Out

1. When logged in, click **"Sign Out"**
2. Should return to landing page with Sign In/Sign Up buttons

---

## 🔐 Security Best Practices

### Environment Variables

✅ **Already Configured**: Firebase keys stored in `.env`
⚠️ **Never commit** `.env` to Git (already in `.gitignore`)
✅ **Use** `.env.example` as template for team members

### Firebase Security

1. ✅ Use Firestore Security Rules (see Step 3)
2. ✅ Validate user input on client-side
3. 🔜 Add rate limiting for authentication
4. 🔜 Implement email verification
5. 🔜 Add password reset functionality

---

## 📱 Current Authentication Flow

```
User visits site
    ↓
Landing Page (Hero)
    ↓
Click "Get Started Free" or "Sign In"
    ↓
Modal appears (SignUp or SignIn)
    ↓
User enters credentials OR clicks "Continue with Google"
    ↓
AuthContext handles authentication
    ↓
Create/Retrieve user document in Firestore
    ↓
Update currentUser state
    ↓
Landing page shows "Welcome, [Name]!" + Sign Out button
    ↓
User can now access protected features (favorites, playlists)
```

---

## 🎯 Phase 3 Progress (Personalization)

### ✅ Completed

- [x] Firebase SDK installation
- [x] Firebase configuration
- [x] Authentication Context with hooks
- [x] Sign Up component (Email/Password + Google)
- [x] Sign In component (Email/Password + Google)
- [x] Landing page integration
- [x] User document creation in Firestore
- [x] Auth state persistence

### 🚧 Next Tasks

- [ ] Enable authentication providers in Firebase Console (YOU NEED TO DO THIS!)
- [ ] Create Firestore database (YOU NEED TO DO THIS!)
- [ ] Add user profile page
- [ ] Implement favorites/liked songs functionality
- [ ] Create playlist management system
- [ ] Add "My Library" page
- [ ] Email verification
- [ ] Password reset flow
- [ ] User settings page

---

## 🐛 Troubleshooting

### Error: "Firebase: Error (auth/unauthorized-domain)"

**Solution**: Add your domain to authorized domains in Firebase Console

### Error: "Missing or insufficient permissions"

**Solution**: Configure Firestore Security Rules (see Step 3)

### Error: "Firebase: Error (auth/popup-blocked)"

**Solution**: Allow popups for localhost in browser settings

### Error: "Firebase config is undefined"

**Solution**: Make sure `.env` file exists with all Firebase variables

---

## 📚 Useful Resources

- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [React Firebase Hooks](https://github.com/CSFrequency/react-firebase-hooks)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

---

## 🎉 What You Can Do Now

1. **Sign Up**: Create a new account with email/password
2. **Sign In**: Login with existing account or Google
3. **Sign Out**: Logout from your account
4. **See User Info**: Welcome message with your name on landing page

**Next Phase**: Once you enable providers in Firebase Console, we'll implement:

- Saving favorite tracks to Firestore
- Creating and managing playlists
- User profile page
- My Library section
