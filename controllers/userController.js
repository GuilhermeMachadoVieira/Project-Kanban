const fetch = require('cross-fetch');

const saltRounds = 10;

exports.showRegisterPage = (req, res) => {
    res.render('register');
};

exports.registerUser = async (req, res) => {
    const { name, lastName, document, email, password } = req.body;
    try {
        const response = await fetch('https://66699c882e964a6dfed5dab5.mockapi.io/api/v1/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, lastName, document, email, password })
        });
        const data = await response.json();
        res.redirect('/login');
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        return res.status(500).send('Erro ao registrar usuário.');
    }
};

exports.showLoginPage = (req, res) => {
    const error = req.query.error;
    res.render('login', { error });
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const response = await fetch(`https://66699c882e964a6dfed5dab5.mockapi.io/api/v1/users?email=${email}&password=${password}`);
        const userData = await response.json();
        if (userData.length > 0) {
            req.session.user = userData[0];
            res.redirect('/createProject');
        } else {
            res.redirect('/login?error=invalid_credentials');
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        return res.status(500).send('Erro ao fazer login.');
    }
};
