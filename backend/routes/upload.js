const express = require('express');
const router = express.Router();
const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.post('/resume', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const mimetype = req.file.mimetype;
    let text = '';

    if (mimetype === 'application/pdf') {
      try {
        const pdfParse = require('pdf-parse');
        const data = await pdfParse(req.file.buffer);
        text = data.text;
      } catch (pdfErr) {
        // PDF parsing failed — return error with helpful message
        return res.status(400).json({
          error: 'Could not parse this PDF. Please copy-paste your resume text instead.',
          fallback: true
        });
      }
    } else {
      // For txt files
      text = req.file.buffer.toString('utf-8');
    }

    if (!text || text.trim().length < 50) {
      return res.status(400).json({
        error: 'Could not extract enough text from this file. Please copy-paste your resume text instead.',
        fallback: true
      });
    }

    res.json({ text: text.trim() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;