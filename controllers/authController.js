const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Configuração do CORS para rotas específicas
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Rota de Registro
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const [userExists] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (userExists.length > 0) {
      return res.status(409).json({ error: 'Email já cadastrado!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: 'Usuário criado com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro no registro!' });
  }
});

// Rota de Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [user] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (!user.length) {
      return res.status(401).json({ error: 'Credenciais inválidas!' });
    }

    const isPasswordValid = await bcrypt.compare(password, user[0].password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciais inválidas!' });
    }

    const token = jwt.sign(
      { userId: user[0].id, email: user[0].email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, user: { email: user[0].email, username: user[0].username } });
  } catch (error) {
    res.status(500).json({ error: 'Erro no login!' });
  }
});

module.exports = router;