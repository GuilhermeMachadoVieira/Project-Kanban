const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do mecanismo de visualização e pasta de visualizações
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware para parsing de dados do corpo das requisições
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para sessões
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Para HTTPS, mude para true
}));

// Rotas
app.use(routes);

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo deu errado!');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
