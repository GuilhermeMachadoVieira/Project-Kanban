const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const projectController = require('../controllers/projectController');
const { body } = require('express-validator');
const isAuthenticated = require('../middleware/auth');

// Página inicial
router.get('/', (req, res) => {
    res.render('index');
});

// Página de registro
router.get('/register', userController.showRegisterPage);

// Registro de usuário
router.post('/register', 
    [
        body('name').notEmpty().withMessage('Nome é obrigatório'),
        body('lastName').notEmpty().withMessage('Sobrenome é obrigatório'),
        body('document').notEmpty().withMessage('Documento é obrigatório'),
        body('email').isEmail().withMessage('Email inválido'),
        body('password').isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres')
    ],
    userController.registerUser
);

// Página de login
router.get('/login', userController.showLoginPage);

// Login de usuário
router.post('/login', userController.loginUser);

// Página de criação de projeto
router.get('/createProject', isAuthenticated, (req, res) => {
    res.render('createProject');
});

// Criação de projeto
router.post('/createProject', isAuthenticated, projectController.createProject);

// Página do kanban
router.get('/kanban', isAuthenticated, (req, res) => {
    const projectId = req.query.projectId;
    const projectName = req.query.projectName;
    const teamName = req.query.teamName;
    const teamCode = req.query.teamCode;
    // Lógica para recuperar dados do kanban usando projectId
    res.render('kanban', { projectId, projectName, teamName, teamCode });
});

// Página de adesão ao projeto
router.get('/joinProject', (req, res) => {
    res.render('joinProject');
});

// Adesão ao projeto
router.post('/joinProject', projectController.joinProject);

module.exports = router;
