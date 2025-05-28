require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sql = require('mysql2');
const dbConfig = require('./config/db.config');
const authRoutes = require('./controllers/authController');
const userDataRoutes = require('./controllers/userController');
const gymDataRoutes = require('./controllers/gymController');
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
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Middleware para analisar JSON  
app.use(express.json());

// Conectar ao banco de dados
async function connectToDatabase() {
  try {
    await sql.connect(dbConfig);
    console.log('✅ Conectado ao banco de dados SQL Server');
  } catch (err) {
    console.error('❌ Erro ao conectar ao banco de dados:', err);
    process.exit(1);
  }
}

connectToDatabase();

// Rotas de autenticação
app.use('/auth', authRoutes);

// Rotas de dados (protegidas por autenticação)
app.use('/api/data/users', userDataRoutes);
app.use('/api/data/gym', gymDataRoutes);
app.use('/user', authenticateToken, userDataRoutes);
app.use('/favorite', authenticateToken);

app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
});