const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Rota de Registro
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Verifica se o usuário já existe
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({ 
        error: existingUser.email === email ? 'Email já cadastrado!' : 'Nome de usuário já existe!'
      });
    }

    // Cria o novo usuário (a senha é hasheada automaticamente pelo pre-save hook)
    const user = await User.create({ username, email, password });
    
    res.status(201).json({ 
      message: 'Usuário criado com sucesso!',
      userId: user._id 
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro no registro!' });
  }
});

// Rota de Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas!' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciais inválidas!' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ 
      token,
      user: { 
        id: user._id,
        email: user.email, 
        username: user.username 
      } 
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro no login!' });
  }
});

module.exports = router;