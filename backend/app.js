
require('dotenv').config();

const express = require('express');

const bodyParser = require('body-parser');

const path = require('path');

const app = express();

const mongoose = require('mongoose');

const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');


const dotenv = require('dotenv').config()

const bouncer = require ("express-bouncer") (500, 900000, 5)

// Connexion cryptée à la base de données
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/database1?retryWrites=true&w=majority`,
{ useNewUrlParser: true,
  useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

// Cors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
}); 

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

// Middleware bouncer: empêche les attaques brute-force en bloquant le login après avoir entré plusieurs fois un mot de passe incorrect

bouncer.blocked = function (req, res, next, remaining)
{
    res.send (429, "Vous avez effectué trop de tentatives incorrectes, " +
        "Merci d'attendre" + remaining / 1000 + " secondes");
};

app.post ("/login", bouncer.block, function (req, res)
{
    if (LoginFailed)
    {
        // Login failed
    }
 
    else
    {
        bouncer.reset (req);
        // Login succeeded
    }
});

module.exports = app;
