

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

// @route POST /api/auth/signup
exports.signup = (req, res, next) => {
bcrypt.hash(req.body.password, 10)
.then(hash => {
    const user = new User ({
        email: req.body.email,
        password: hash
    });
    user.save()
    .then(() => res.status(201).json({message: 'Utilisateur créé !'}))
    .catch(error => res.status(400).json({ error}));
})
.catch(error => res.status(500).json({ error }));
};


// @route POST /api/auth/login
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email})
    .then(user => {
        if (!user) {
            return res.status(401).json({error: 'Utilisateur non trouvé'})
        }
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
                { userId: user._id },
                '8c1a23d4e1e5263dad0135c8aa32e95b4f8c8f7c7a9af0b5557f521f3de97ae1',
                { expiresIn: '24h' }
              )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({error}))
};