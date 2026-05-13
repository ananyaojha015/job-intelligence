const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
require('dotenv').config();

const client = new MongoClient(process.env.MONGO_URI);
const db = () => client.db('job_intelligence');

// Connect once
client.connect();

// GET /api/skills — all skills sorted by frequency
router.get('/', async (req, res) => {
  try {
    const skills = await db()
      .collection('skills')
      .find({})
      .sort({ frequency: -1 })
      .toArray();
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/skills/top — top 10 skills
router.get('/top', async (req, res) => {
  try {
    const skills = await db()
      .collection('skills')
      .find({})
      .sort({ frequency: -1 })
      .limit(10)
      .toArray();
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;