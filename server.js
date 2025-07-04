
// C42 OS Backend Server
// This server securely connects to your MongoDB database and exposes an API for the frontend.

// Use require for Node.js backend
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config(); // Loads .env file variables into process.env

const app = express();
const port = process.env.PORT || 3001;

// Securely use the MongoDB connection string from environment variables
const mongoUri = process.env.MONGODB_URI;

// --- Pre-flight Checks ---
if (!mongoUri) {
  console.error("\nFATAL ERROR: MONGODB_URI is not defined in your .env file.");
  console.error("Please create a .env file in the project root and add your MongoDB connection string.");
  console.error("Example: MONGODB_URI=\"mongodb+srv://user:pass@cluster.mongodb.net/dbname\"\n");
  process.exit(1); // Exit if the database connection string is missing
}

// --- Middleware ---
// Enable Cross-Origin Resource Sharing (CORS) for your frontend to access the API
app.use(cors());
// Parse incoming JSON requests
app.use(express.json({ limit: '50mb' })); // Increase limit for potentially large conversation files

// --- Database Connection ---
let db;
// The MongoClient will parse the URI and determine the database name.
// We don't need to manually specify it in client.db() if it's in the URI.
MongoClient.connect(mongoUri)
  .then(client => {
    console.log('✅ Successfully connected to MongoDB Atlas.');
    // The client is connected to the database specified in the URI.
    // client.db() with no arguments will use the database from the connection string.
    db = client.db(); 
    console.log(`✅ Database "${db.databaseName}" selected.`);

    // --- Start Server ---
    app.listen(port, () => {
      console.log(`🚀 C42 OS Backend Server listening on http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error("❌ Failed to connect to MongoDB. Please check your MONGODB_URI in the .env file.", err);
    process.exit(1);
  });

// --- API Endpoints ---

// A simple health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Endpoint to get all conversations from the Knowledge Base, with search and filtering
app.get('/api/conversations', async (req, res) => {
  if (!db) {
    return res.status(503).json({ error: 'Database not available' });
  }
  try {
    const { q, category, source, type, platform } = req.query;
    let mongoQuery = {};
    
    // --- MongoDB Index Recommendation ---
    // For optimal performance, create the following indexes on your 'conversations' collection:
    // 1. Text index for search: 
    //    db.collection('conversations').createIndex({ title: "text", "messages.content": "text" })
    // 2. Indexes for filters:
    //    db.collection('conversations').createIndex({ platform: 1 })
    //    db.collection('conversations').createIndex({ "metadata.category": 1 })
    //    db.collection('conversations').createIndex({ "metadata.source": 1 })
    //    db.collection('conversations').createIndex({ "metadata.type": 1 })

    if (q) {
      mongoQuery.$text = { $search: q };
    }
    
    const filters = {};
    if (category && category !== 'all') filters['metadata.category'] = category;
    if (source && source !== 'all') filters['metadata.source'] = source;
    if (type && type !== 'all') filters['metadata.type'] = type;
    if (platform && platform !== 'all') filters.platform = platform;
    
    if (Object.keys(filters).length > 0) {
        mongoQuery = { ...mongoQuery, ...filters };
    }

    const conversations = await db.collection('conversations').find(mongoQuery).toArray();
    res.json(conversations);
  } catch (e) {
    console.error('Failed to fetch conversations:', e);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// Endpoint to add new conversations from file uploads
app.post('/api/conversations', async (req, res) => {
  if (!db) {
    return res.status(503).json({ error: 'Database not available' });
  }
  try {
    const newConversations = req.body;
    if (!Array.isArray(newConversations) || newConversations.length === 0) {
      return res.status(400).json({ error: 'Invalid payload. Expected an array of conversations.' });
    }

    // Optional: Add a 'createdAt' timestamp to new records
    const conversationsToInsert = newConversations.map(c => ({...c, createdAt: new Date()}));
    
    const result = await db.collection('conversations').insertMany(conversationsToInsert);
    res.status(201).json({ success: true, insertedCount: result.insertedCount });
  } catch (e) {
    console.error('Failed to insert conversations:', e);
    res.status(500).json({ error: 'Failed to insert conversations' });
  }
});

// Endpoint to delete all conversations
app.delete('/api/conversations', async (req, res) => {
    if (!db) {
        return res.status(503).json({ error: 'Database not available' });
    }
    try {
        const result = await db.collection('conversations').deleteMany({});
        res.status(200).json({ success: true, deletedCount: result.deletedCount });
    } catch (e) {
        console.error('Failed to delete conversations:', e);
        res.status(500).json({ error: 'Failed to delete conversations' });
    }
});
