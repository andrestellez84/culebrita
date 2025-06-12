const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const SCORE_FILE = path.join(__dirname, 'scores.json');

function loadScores() {
  if (!fs.existsSync(SCORE_FILE)) {
    return [];
  }
  const data = fs.readFileSync(SCORE_FILE);
  try {
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function saveScores(scores) {
  fs.writeFileSync(SCORE_FILE, JSON.stringify(scores, null, 2));
}

app.get('/scores', (req, res) => {
  const scores = loadScores().sort((a, b) => b.score - a.score);
  res.json(scores);
});

app.post('/scores', (req, res) => {
  const { name, score } = req.body;
  if (typeof name !== 'string' || typeof score !== 'number') {
    return res.status(400).json({ error: 'Invalid payload' });
  }
  const scores = loadScores();
  scores.push({ name, score });
  saveScores(scores);
  res.status(201).json({ message: 'Score saved' });
});

if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
