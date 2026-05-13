const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
require('dotenv').config();
 
const client = new MongoClient(process.env.MONGO_URI);
const db = () => client.db('job_intelligence');
client.connect();
 
const PROFESSION_SKILLS = {
  "software-development": [
    "javascript", "python", "react", "node.js", "typescript",
    "git", "docker", "api", "postgresql", "mongodb", "aws",
    "css", "html", "express", "github", "agile", "scrum"
  ],
  "ai-ml": [
    "python", "machine learning", "deep learning", "tensorflow",
    "pytorch", "nlp", "scikit-learn", "pandas", "numpy",
    "computer vision", "keras", "spark", "r"
  ],
  "data-science": [
    "python", "pandas", "numpy", "matplotlib", "sql",
    "tableau", "power bi", "spark", "r", "excel",
    "machine learning", "data analysis"
  ],
  "cloud-devops": [
    "aws", "azure", "gcp", "docker", "kubernetes",
    "terraform", "ci/cd", "linux", "jenkins", "git", "bash"
  ],
  "uiux-design": [
    "figma", "css", "html", "user research", "prototyping",
    "wireframing", "adobe xd", "sketch", "typography",
    "accessibility", "usability testing", "javascript"
  ],
  "finance-fintech": [
    "excel", "financial modeling", "accounting", "bloomberg",
    "sql", "python", "power bi", "tableau", "risk management",
    "valuation", "investment analysis", "financial reporting", "quickbooks"
  ],
  "digital-marketing": [
    "google analytics", "seo", "sem", "social media marketing",
    "content marketing", "email marketing", "copywriting",
    "facebook ads", "google ads", "hubspot", "salesforce",
    "canva", "excel", "crm"
  ],
  "cybersecurity": [
    "linux", "python", "networking", "firewalls", "penetration testing",
    "ethical hacking", "cryptography", "siem", "vulnerability assessment",
    "incident response", "bash", "cloud security", "compliance"
  ],
  "mobile-development": [
    "swift", "kotlin", "react native", "flutter", "javascript",
    "typescript", "firebase", "git", "api", "android studio"
  ],
  "healthcare-tech": [
    "hl7", "fhir", "python", "sql", "electronic health records",
    "medical coding", "hipaa compliance", "data analysis",
    "clinical informatics", "excel", "healthcare analytics", "tableau"
  ],
  "teaching-edtech": [
    "curriculum development", "instructional design", "lms",
    "google classroom", "microsoft teams", "zoom", "canva",
    "assessment design", "e-learning", "content creation",
    "communication", "excel", "moodle"
  ],
  "banking-finance": [
    "excel", "financial analysis", "accounting", "bloomberg terminal",
    "risk management", "credit analysis", "loan processing",
    "financial reporting", "auditing", "taxation", "quickbooks",
    "sap", "power bi", "regulatory compliance", "kyc", "aml"
  ],
  "marketing": [
    "social media marketing", "content marketing", "seo",
    "google analytics", "email marketing", "canva", "copywriting",
    "brand management", "market research", "crm", "hubspot",
    "facebook ads", "excel"
  ],
};
 
// GET /api/profession/:id/skills
router.get('/:id/skills', async (req, res) => {
  try {
    const professionId = req.params.id;
    const relevantSkills = PROFESSION_SKILLS[professionId] || PROFESSION_SKILLS["software-development"];
 
    // Find skills that exist in DB
    const dbSkills = await db()
      .collection('skills')
      .find({ skill_name: { $in: relevantSkills } })
      .sort({ frequency: -1 })
      .toArray();
 
    // For skills not in DB, create placeholder entries
    const dbSkillNames = new Set(dbSkills.map(s => s.skill_name));
    const missingSkills = relevantSkills
      .filter(s => !dbSkillNames.has(s))
      .map((s, i) => ({
        skill_name: s,
        frequency: Math.max(1, 5 - i),
        first_seen: new Date(),
        last_updated: new Date(),
        trend_data: []
      }));
 
    // Combine DB skills + profession-specific placeholders
    const allSkills = [...dbSkills, ...missingSkills];
 
    res.json({ profession: professionId, skills: allSkills, relevant_skills: relevantSkills });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
 
// GET /api/profession/:id/jobs
router.get('/:id/jobs', async (req, res) => {
  try {
    const professionId = req.params.id;
    const relevantSkills = PROFESSION_SKILLS[professionId] || [];
 
    // Try to find jobs matching profession skills
    let jobs = await db()
      .collection('jobs')
      .find({ extracted_skills: { $in: relevantSkills } })
      .toArray();
 
    // If no matches, return all jobs as fallback
    if (jobs.length === 0) {
      jobs = await db()
        .collection('jobs')
        .find({})
        .toArray();
    }
 
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
 
module.exports = router;