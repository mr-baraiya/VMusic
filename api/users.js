import { MongoClient } from 'mongodb';

// MongoDB connection
const uri = process.env.MONGODB_URI;
let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  cachedClient = client;
  return client;
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const client = await connectToDatabase();
    const db = client.db('vmusic');
    const usersCollection = db.collection('users');

    // GET - Fetch user details
    if (req.method === 'GET') {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      const user = await usersCollection.findOne({ userId });
      
      return res.status(200).json({
        user: user || null
      });
    }

    // POST - Create/Update user after Firebase authentication
    if (req.method === 'POST') {
      const { userId, email, displayName, photoURL, provider, googleAccessToken, googleRefreshToken } = req.body;

      if (!userId || !email) {
        return res.status(400).json({ error: 'User ID and email are required' });
      }

      const now = new Date().toISOString();

      // Prepare update object
      const updateFields = {
        email,
        displayName: displayName || null,
        photoURL: photoURL || null,
        provider: provider || 'email',
        lastLogin: now,
        updatedAt: now
      };

      // Add Google tokens if provided
      if (googleAccessToken) {
        updateFields.googleAccessToken = googleAccessToken;
        updateFields.googleTokenUpdatedAt = now;
      }
      if (googleRefreshToken) {
        updateFields.googleRefreshToken = googleRefreshToken;
      }

      // Upsert user document
      const result = await usersCollection.updateOne(
        { userId },
        {
          $set: updateFields,
          $setOnInsert: {
            userId,
            createdAt: now,
            searchHistory: []
          }
        },
        { upsert: true }
      );

      const user = await usersCollection.findOne({ userId });

      return res.status(200).json({
        message: result.upsertedCount ? 'User created' : 'User updated',
        user,
        success: true
      });
    }

    // PUT - Update user profile
    if (req.method === 'PUT') {
      const { userId, displayName, photoURL } = req.body;

      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      const result = await usersCollection.updateOne(
        { userId },
        {
          $set: {
            displayName,
            photoURL,
            updatedAt: new Date().toISOString()
          }
        }
      );

      return res.status(200).json({
        message: 'Profile updated',
        success: true
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
