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
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const client = await connectToDatabase();
    const db = client.db('vmusic');
    const favoritesCollection = db.collection('favorites');

    // GET - Fetch user's favorites
    if (req.method === 'GET') {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      const userFavorites = await favoritesCollection.findOne({ userId });

      return res.status(200).json({
        favorites: userFavorites?.tracks || [],
      });
    }

    // POST - Add to favorites
    if (req.method === 'POST') {
      const { userId, track } = req.body;

      if (!userId || !track) {
        return res.status(400).json({ error: 'User ID and track are required' });
      }

      // Check if track already exists in favorites
      const existingFavorite = await favoritesCollection.findOne({
        userId,
        'tracks.videoId': track.videoId,
      });

      if (existingFavorite) {
        return res.status(200).json({
          message: 'Track already in favorites',
          alreadyExists: true,
        });
      }

      // Add track to favorites
      const result = await favoritesCollection.updateOne(
        { userId },
        {
          $push: {
            tracks: {
              ...track,
              addedAt: new Date().toISOString(),
            },
          },
          $setOnInsert: {
            userId,
            createdAt: new Date().toISOString(),
          },
        },
        { upsert: true }
      );

      return res.status(200).json({
        message: 'Track added to favorites',
        success: true,
      });
    }

    // DELETE - Remove from favorites
    if (req.method === 'DELETE') {
      const { userId, videoId } = req.body;

      if (!userId || !videoId) {
        return res.status(400).json({ error: 'User ID and video ID are required' });
      }

      const result = await favoritesCollection.updateOne(
        { userId },
        {
          $pull: {
            tracks: { videoId },
          },
        }
      );

      return res.status(200).json({
        message: 'Track removed from favorites',
        success: true,
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
