const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
require('dotenv').config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post('/questions', async (req, res) => {
  try {
    const { skill } = req.body;
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{
        role: "user",
        content: "Generate 5 technical interview questions for " + skill + ". Return only a JSON array of question strings. No explanation."
      }],
      temperature: 0.7,
      max_tokens: 500,
    });
    const text = completion.choices[0].message.content.trim();
    const clean = text.replace(/[`]{3}(json)?/g, '').trim();
    res.json({ questions: JSON.parse(clean) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;