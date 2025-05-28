require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');// Usando promises

// Importação das rotas
const authRoutes = require('./controllers/authController');
const userRoutes = require('./controllers/userController');
const gymRoutes = require('./controllers/gymController');
const authenticateToken = require('./middleware/authMiddleware');

const app = express();
const port = process.env.PORT || 8080;

// Teste imediato
console.log('Variáveis de ambiente carregadas:');
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI?.substring(0, 30) + '...'); // Mostra só o início por segurança

// Configuração do CORS
const corsOptions = {
  origin: [
    'https://front-aws-psi.vercel.app',
    'https://tecfit-nu.vercel.app',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Rotas públicas (login/register)
app.use('/auth', authRoutes);

// Rotas protegidas por autenticação JWT
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/gym', authenticateToken, gymRoutes);

// Conecte ao MongoDB
connectDB();

// Rota de teste para verificar se o servidor está rodando
app.get('/', (req, res) => {
  res.send('Backend TecFit está funcionando! 🚀');
});

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno no servidor!' });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});