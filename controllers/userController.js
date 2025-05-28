const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Rota GET para listar usuários
router.get('/', async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, username, email FROM users');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários!' });
  }
});

// Rota GET para buscar um usuário por ID
router.get('/:id', async (req, res) => {
  try {
    const [user] = await pool.query('SELECT id, username, email FROM users WHERE id = ?', [req.params.id]);
    
    if (!user.length) {
      return res.status(404).json({ error: 'Usuário não encontrado!' });
    }

    res.json(user[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuário!' });
  }
});

module.exports = router;