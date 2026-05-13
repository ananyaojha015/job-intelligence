const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
require('dotenv').config();

const client = new MongoClient(process.env.MONGO_URI);
const db = () => client.db('job_intelligence');

client.connect();

// GET /api/jobs — all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await db()
      .collection('jobs')
      .find({})
      .project({ title: 1, company: 1, category: 1, extracted_skills: 1, url: 1 })
      .toArray();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/jobs/categories — all unique categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await db()
      .collection('jobs')
      .distinct('category');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;