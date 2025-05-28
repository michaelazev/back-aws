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

// Configuração do CORS - atualize para:
app.use(cors({
  origin: [
    'https://front-aws-psi.vercel.app',
    'https://tecfit-nu.vercel.app',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Adicione OPTIONS
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
}));

// Adicione isto para lidar com requisições OPTIONS
app.options('*', cors());// Adicione esta linha
app.use(cors(corsOptions));

// Adicione este middleware para lidar com requisições OPTIONS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', corsOptions.origin);
  res.header('Access-Control-Allow-Methods', corsOptions.methods.join(','));
  res.header('Access-Control-Allow-Headers', corsOptions.allowedHeaders.join(','));
  next();
});

// Middleware para analisar JSON  
app.use(express.json());

// Conectar ao banco de dados
async function connectToDatabase() {
  try {
    await sql.connect(dbConfig);
    console.log('✅ Conectado ao banco de dados SQL Server');
  } catch (err) {
    console.error('❌ Erro ao conectar ao banco de dados:', err);
    process.exit(1); // Encerra a aplicação em caso de erro crítico
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
