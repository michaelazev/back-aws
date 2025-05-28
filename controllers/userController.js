const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Rota GET para listar usuários
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, 'username email');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários!' });
  }
});

// Rota GET para buscar um usuário por ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id, 'username email');
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado!' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuário!' });
  }
});

module.exports = router;