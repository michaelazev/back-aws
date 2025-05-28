const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    console.log('Tentando conectar ao MongoDB...');
    console.log('String de conexão:', process.env.MONGODB_URI?.substring(0, 30) + '...'); // Log parcial por segurança

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 30000
    });

    console.log('✅ Conectado ao MongoDB Atlas com sucesso!');
    
    mongoose.connection.on('connected', () => {
      console.log('Mongoose - Conexão estabelecida');
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('Mongoose - Erro de conexão:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('Mongoose - Conexão encerrada');
    });

  } catch (err) {
    console.error('❌ Falha na conexão com MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = { connectDB, mongoose };