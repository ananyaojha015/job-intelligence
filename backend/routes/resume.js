const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
const Groq = require('groq-sdk');
require('dotenv').config();

const client = new MongoClient(process.env.MONGO_URI);
const db = () => client.db('job_intelligence');
client.connect();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Skill normalization map
const SKILL_ALIASES = {
  "nodejs": "node.js", "node": "node.js", "reactjs": "react",
  "react.js": "react", "vuejs": "vue", "vue.js": "vue",
  "postgres": "postgresql", "mongo": "mongodb", "k8s": "kubernetes",
  "google cloud": "gcp", "amazon web services": "aws",
  "ml": "machine learning", "restful": "api", "apis": "api",
};

// Technical skills list
const TECHNICAL_SKILLS = [
  "python", "javascript", "typescript", "java", "c++", "c#",
  "ruby", "go", "rust", "php", "swift", "kotlin", "scala",
  "bash", "r", "react", "angular", "vue", "html", "css",
  "redux", "next.js", "tailwind", "node.js", "django", "flask",
  "fastapi", "spring", "express", "graphql", "rest", "api",
  "mongodb", "postgresql", "mysql", "redis", "elasticsearch",
  "firebase", "machine learning", "deep learning", "nlp",
  "computer vision", "tensorflow", "pytorch", "keras",
  "scikit-learn", "pandas", "numpy", "spark", "aws", "azure",
  "gcp", "docker", "kubernetes", "terraform", "jenkins",
  "ci/cd", "linux", "git", "github", "figma", "jira",
];

function normalizeText(text) {
  let lower = text.toLowerCase();
  for (const [alias, canonical] of Object.entries(SKILL_ALIASES)) {
    lower = lower.replace(new RegExp(`\\b${alias}\\b`, 'gi'), canonical);
  }
  return lower;
}

function extractSkillsDeterministic(text) {
  const normalized = normalizeText(text);
  return TECHNICAL_SKILLS.filter(skill => {
    const pattern = new RegExp(`\\b${skill.replace(/[+#.]/g, '\\$&')}\\b`, 'i');
    return pattern.test(normalized);
  });
}

async function enhanceWithAI(resumeText, deterministicSkills) {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: "Look at this resume and find ONLY additional technical skills not in this list: " + 
            JSON.stringify(deterministicSkills) + 
            "\n\nReturn ONLY a JSON array of NEW technical skills found. If none, return [].\n\nResume:\n" + 
            resumeText
        }
      ],
      temperature: 0.1,
      max_tokens: 300,
    });

    const text = completion.choices[0].message.content.trim();
    const clean = text.replace(/[`]{3}(json)?/g, '').trim();
    const aiSkills = JSON.parse(clean);
    
    // Merge and deduplicate
    const combined = [...new Set([...deterministicSkills, ...aiSkills.map(s => s.toLowerCase())])];
    return combined;
  } catch (e) {
    // If AI fails, return deterministic results
    console.log('AI enhancement failed, using deterministic only');
    return deterministicSkills;
  }
}

// POST /api/resume/analyze
router.post('/analyze', async (req, res) => {
  try {
    const { resumeText } = req.body;
    if (!resumeText) return res.status(400).json({ error: 'Resume text required' });

    // Step 1 — Deterministic extraction first
    console.log('Running deterministic skill extraction...');
    const deterministicSkills = extractSkillsDeterministic(resumeText);
    console.log('Deterministic skills:', deterministicSkills);

    // Step 2 — AI enhancement
    console.log('Enhancing with AI...');
    const userSkills = await enhanceWithAI(resumeText, deterministicSkills);
    console.log('Final skills:', userSkills);

    // Step 3 — Get market technical skills only
    const marketSkills = await db()
      .collection('skills')
      .find({})
      .sort({ frequency: -1 })
      .toArray();

    const userSkillSet = new Set(userSkills.map(s => s.toLowerCase()));

    const strongSkills = marketSkills.filter(s => userSkillSet.has(s.skill_name.toLowerCase()));
    const missingSkills = marketSkills.filter(s => !userSkillSet.has(s.skill_name.toLowerCase()));

    // Step 4 — Weighted match score
    const insights = await db()
      .collection('insights')
      .findOne({}, { sort: { generated_at: -1 } });

    const demandMap = {};
    if (insights?.demand_scores) {
      insights.demand_scores.forEach(s => { demandMap[s.skill] = s.demand_score; });
    }

    // Weighted score — skills with higher demand count more
    const totalDemand = marketSkills.reduce((sum, s) => sum + (demandMap[s.skill_name] || 1), 0);
    const matchedDemand = strongSkills.reduce((sum, s) => sum + (demandMap[s.skill_name] || 1), 0);
    const weightedScore = Math.round((matchedDemand / totalDemand) * 100);

    const recommendations = missingSkills
      .map(s => ({
        skill: s.skill_name,
        frequency: s.frequency,
        demand_score: demandMap[s.skill_name] || s.frequency,
      }))
      .sort((a, b) => b.demand_score - a.demand_score)
      .slice(0, 8);

    res.json({
      user_skills: userSkills,
      deterministic_skills: deterministicSkills,
      strong_skills: strongSkills.map(s => s.skill_name),
      missing_skills: recommendations,
      match_score: weightedScore,
      total_market_skills: marketSkills.length,
    });

  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;