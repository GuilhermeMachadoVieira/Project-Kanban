const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { body } = require('express-validator');
const isAuthenticated = require('../middleware/auth');

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/register', userController.showRegisterPage);

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

router.get('/login', userController.showLoginPage);

router.post('/login', userController.loginUser);

router.get('/createProject', isAuthenticated, (req, res) => {
    res.render('createProject');
});

router.post('/createProject', isAuthenticated, userController.createProject);

router.get('/kanban', isAuthenticated, (req, res) => {
    const projectId = req.query.projectId;
    const projectName = req.query.projectName;
    const teamName = req.query.teamName;
    const teamCode = req.query.teamCode;
    // Lógica para recuperar dados do kanban usando projectId
    res.render('kanban', { projectId, projectName, teamName, teamCode });
});

router.get('/joinProject', (req, res) => {
    res.render('joinProject');
});

router.post('/joinProject', userController.joinProject);

module.exports = router;
