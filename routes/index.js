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

module.exports = router;
