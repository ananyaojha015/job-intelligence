require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const skillsRouter = require('./routes/skills');
const jobsRouter = require('./routes/jobs');
const insightsRouter = require('./routes/insights');
const resumeRouter = require('./routes/resume');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected ✅'))
  .catch(err => console.error('MongoDB error:', err));

app.use('/api/skills', skillsRouter);
app.use('/api/jobs', jobsRouter);
app.use('/api/insights', insightsRouter);
app.use('/api/resume', resumeRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Job Intelligence API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});