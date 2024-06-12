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
    
    const hashDocument = new Promise((resolve, reject) => {
        bcrypt.hash(document, saltRounds, (err, hash) => {
            if (err) return reject(err);
            resolve(hash);
        });
    });

    const hashPassword = new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) return reject(err);
            resolve(hash);
        });
    });

    Promise.all([hashDocument, hashPassword])
        .then(hashes => {
            const [hashedDocument, hashedPassword] = hashes;
            db.run(`INSERT INTO usuarios (name, lastName, document, email, password) VALUES (?, ?, ?, ?, ?)`,
                [name, lastName, hashedDocument, email, hashedPassword],
                (err) => {
                    if (err) {
                        console.error(err.message);
                        return res.status(500).send('Erro ao registrar usuário.');
                    }
                    res.redirect('/login');
                });
        })
        .catch(err => {
            console.error(err.message);
            return res.status(500).send('Erro ao registrar usuário.');
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
                res.redirect('/createProject');
            } else {
                res.redirect('/login?error=invalid_credentials');
            }
        });
    });
};

exports.createProject = (req, res) => {
    const { projectName, teamName } = req.body;
    db.run(`INSERT INTO projects (projectName, teamName) VALUES (?, ?)`, [projectName, teamName], function(err) {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Erro ao criar projeto.');
        }
        const projectId = this.lastID;
        res.redirect(`/kanban?projectId=${projectId}&projectName=${projectName}`);
    });
};

exports.joinProject = (req, res) => {
    const { teamName, teamCode } = req.body;

    // Verificar se o nome e código da equipe existem no banco de dados
    db.get(`SELECT * FROM projects WHERE teamName = ? AND id = ?`, [teamName, teamCode], (err, row) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Erro ao verificar a equipe.');
        }
        if (!row) {
            return res.redirect('/joinProject?error=invalid_team');
        }

        // Redirecionar para a página do kanban com os detalhes do projeto
        res.redirect(`/kanban?projectId=${row.projectId}&projectName=${row.projectName}&teamName=${row.teamName}&teamCode=${row.id}`);
    });
};


