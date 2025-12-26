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
    const searchHistoryCollection = db.collection('search_history');

    // GET - Fetch user's search history
    if (req.method === 'GET') {
      const { userId, limit = 20, type } = req.query;

      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      // Build query filter
      const filter = { userId };
      if (type) {
        filter.type = type;
      }

      const history = await searchHistoryCollection
        .find(filter)
        .sort({ timestamp: -1 })
        .limit(parseInt(limit))
        .toArray();

      return res.status(200).json({
        history,
      });
    }

    // POST - Add search query to history
    if (req.method === 'POST') {
      const { userId, query, results, type = 'jamendo' } = req.body;

      if (!userId || !query) {
        return res.status(400).json({ error: 'User ID and query are required' });
      }

      // Check if query already exists recently (within last hour)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const existingQuery = await searchHistoryCollection.findOne({
        userId,
        query: query.toLowerCase().trim(),
        type: type,
        timestamp: { $gte: oneHourAgo },
      });

      if (existingQuery) {
        // Update timestamp if query exists recently
        await searchHistoryCollection.updateOne(
          { _id: existingQuery._id },
          {
            $set: {
              timestamp: new Date().toISOString(),
              resultsCount: results || 0,
            },
          }
        );

        return res.status(200).json({
          message: 'Search history updated',
          success: true,
        });
      }

      // Add new search query
      const result = await searchHistoryCollection.insertOne({
        userId,
        query: query.toLowerCase().trim(),
        originalQuery: query,
        type: type,
        resultsCount: results || 0,
        timestamp: new Date().toISOString(),
      });

      // Keep only last 100 searches per user
      const allSearches = await searchHistoryCollection
        .find({ userId })
        .sort({ timestamp: -1 })
        .toArray();

      if (allSearches.length > 100) {
        const oldSearchIds = allSearches.slice(100).map((s) => s._id);
        await searchHistoryCollection.deleteMany({
          _id: { $in: oldSearchIds },
        });
      }

      return res.status(200).json({
        message: 'Search query added to history',
        success: true,
      });
    }

    // DELETE - Clear search history
    if (req.method === 'DELETE') {
      const { userId, type } = req.body;

      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      // Build delete filter
      const filter = { userId };
      if (type) {
        filter.type = type;
      }

      await searchHistoryCollection.deleteMany(filter);

      return res.status(200).json({
        message: 'Search history cleared',
        success: true,
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
