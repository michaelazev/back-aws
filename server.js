require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise'); // Usando promises

// Importação das rotas
const authRoutes = require('./controllers/authController');
const userRoutes = require('./controllers/userController');
const gymRoutes = require('./controllers/gymController');
const authenticateToken = require('./middleware/authMiddleware');

const app = express();
const port = process.env.PORT || 8080;

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

// Conexão com o banco de dados (opcional, pode ser feito nos controllers)
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Rotas públicas (login/register)
app.use('/auth', authRoutes);

// Rotas protegidas por autenticação JWT
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/gym', authenticateToken, gymRoutes);

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