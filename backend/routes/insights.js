const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
require('dotenv').config();

const client = new MongoClient(process.env.MONGO_URI);
const db = () => client.db('job_intelligence');

client.connect();

// GET /api/insights — latest insights
router.get('/', async (req, res) => {
  try {
    const insight = await db()
      .collection('insights')
      .findOne({}, { sort: { generated_at: -1 } });
    res.json(insight);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 