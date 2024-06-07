const bcrypt = require('bcrypt');
const db = require('../db');
const { validationResult } = require('express-validator');
const saltRounds = 10;

exports.showRegisterPage = (req, res) => {
    res.render('register');
};

exports.registerUser = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { name, lastName, document, email, password } = req.body;
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Erro ao registrar usuário.');
        }
        db.run(`INSERT INTO usuarios (name, lastName, document, email, password) VALUES (?, ?, ?, ?, ?)`,
            [name, lastName, document, email, hash],
            (err) => {
                if (err) {
                    console.error(err.message);
                    return res.status(500).send('Erro ao registrar usuário.');
                }
                res.redirect('/login');
            });
    });
};

exports.showLoginPage = (req, res) => {
    const error = req.query.error;
    res.render('login', { error });
};

exports.loginUser = (req, res) => {
    const { email, password } = req.body;
    db.get(`SELECT * FROM usuarios WHERE email = ?`, [email], (err, row) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Erro ao fazer login.');
        }
        if (!row) {
            return res.redirect('/login?error=invalid_credentials');
        }
        bcrypt.compare(password, row.password, (err, result) => {
            if (result) {
                req.session.user = row;
                res.redirect('/');
            } else {
                res.redirect('/login?error=invalid_credentials');
            }
        });
    });
};
