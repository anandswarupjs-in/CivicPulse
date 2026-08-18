const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const { execFile } = require('child_process');

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./civicpulse.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS citizens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password_hash TEXT,
    city TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS grievances (
    id TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    status TEXT DEFAULT 'Pending',
    date TEXT,
    department TEXT DEFAULT 'Unassigned',
    location TEXT,
    city TEXT,
    author_id INTEGER,
    image TEXT
  )`);
});

const generateId = () => `GRV-2026-${Math.floor(100 + Math.random() * 900)}`;

// Auth Routes
app.post('/auth/register', async (req, res) => {
  const { name, email, password, city } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    db.run(
      `INSERT INTO citizens (name, email, password_hash, city) VALUES (?, ?, ?, ?)`,
      [name, email, hash, city],
      function (err) {
        if (err) return res.status(400).json({ error: 'Email already exists' });
        res.json({ id: this.lastID, name, email, city });
      }
    );
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  db.get(`SELECT * FROM citizens WHERE email = ?`, [email], async (err, user) => {
    if (err || !user) return res.status(401).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ id: user.id, name: user.name, email: user.email, city: user.city });
  });
});

app.put('/auth/update/:id', async (req, res) => {
  const { id } = req.params;
  const { name, city, password } = req.body;
  
  db.get(`SELECT * FROM citizens WHERE id = ?`, [id], async (err, user) => {
    if (err || !user) return res.status(404).json({ error: 'User not found' });
    
    let newName = name || user.name;
    let newCity = city || user.city;
    let newHash = user.password_hash;
    
    if (password) {
      newHash = await bcrypt.hash(password, 10);
    }
    
    db.run(
      `UPDATE citizens SET name = ?, city = ?, password_hash = ? WHERE id = ?`,
      [newName, newCity, newHash, id],
      (err) => {
        if (err) return res.status(500).json({ error: 'Update failed' });
        res.json({ id: user.id, name: newName, email: user.email, city: newCity });
      }
    );
  });
});

// Grievance Routes
app.post('/grievances/:author_id', (req, res) => {
  const { author_id } = req.params;
  const { title, description, location, image } = req.body;
  
  db.get(`SELECT city FROM citizens WHERE id = ?`, [author_id], (err, user) => {
    if (err || !user) return res.status(404).json({ error: 'User not found' });
    
    const id = generateId();
    const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    db.run(
      `INSERT INTO grievances (id, title, description, date, location, city, author_id, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, title, description, date, location, user.city, author_id, image || null],
      (err) => {
        if (err) return res.status(500).json({ error: 'Submission failed' });
        res.json({ id, title, description, status: 'Pending', date, department: 'Unassigned', location, city: user.city, author_id, image });
      }
    );
  });
});

app.get('/grievances', (req, res) => {
  db.all(`SELECT * FROM grievances ORDER BY date DESC`, [], (err, rows) => {
    res.json(rows || []);
  });
});

app.get('/grievances/city/:city', (req, res) => {
  db.all(`SELECT * FROM grievances WHERE city = ? ORDER BY date DESC`, [req.params.city], (err, rows) => {
    res.json(rows || []);
  });
});

app.get('/grievances/me/:author_id', (req, res) => {
  db.all(`SELECT * FROM grievances WHERE author_id = ? ORDER BY date DESC`, [req.params.author_id], (err, rows) => {
    res.json(rows || []);
  });
});

app.put('/grievances/:id/verify', (req, res) => {
  const { id } = req.params;
  const { is_fixed, author_id } = req.query;
  
  db.get(`SELECT * FROM grievances WHERE id = ?`, [id], (err, row) => {
    if (err || !row) return res.status(404).json({ error: 'Not found' });
    if (row.author_id != author_id) return res.status(403).json({ error: 'Unauthorized' });
    
    const status = is_fixed === 'true' ? 'Verified Closed' : 'Escalated';
    db.run(`UPDATE grievances SET status = ? WHERE id = ?`, [status, id], (err) => {
      res.json({ ...row, status });
    });
  });
});

app.post('/api/ai/enhance', (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required' });

  execFile('python', ['ai_agent.py', text], (error, stdout, stderr) => {
    try {
      const result = JSON.parse(stdout);
      if (result.success) {
        res.json({ enhancedText: result.text.trim() });
      } else {
        console.error("AI Error:", result.error);
        res.status(500).json({ error: 'Failed to enhance text.' });
      }
    } catch (e) {
      console.error("Exec Error:", error, stderr);
      res.status(500).json({ error: 'Failed to execute AI agent.' });
    }
  });
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
