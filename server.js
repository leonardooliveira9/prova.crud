const express = require('express');
const app = express();
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const registroRoutes = require('./routes/registroRoutes');
const path = require('path');

dotenv.config();
app.use(express.json());

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Rota principal - serve o index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rotas da API
app.use('/api', registroRoutes);

// Teste de conexão com o banco
sequelize.authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
    console.log('Tabela "registros" já existe, não será sincronizada.');
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Servidor rodando na porta ${process.env.PORT || 3000}`);
    });
  })
  .catch(err => {
    console.error('Erro ao conectar com o banco de dados:', err);
    process.exit(1);
  });
