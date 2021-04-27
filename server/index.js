const User = require("./models/User.js");
require('dotenv').config();
const path = require('path');
const express = require("express");
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const passport = require('passport');
const passportGithub = require('passport-github');
const Sequelize = require('sequelize');
const Model = Sequelize.Model;


const sequelize = new Sequelize(process.env.DATABASE_CONNECTION_URL);
sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });


class UserModel extends Model {}
UserModel.init({
    userName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    avatarUrl: {
        type: Sequelize.STRING
    }
}, {
    sequelize,
    modelName: 'user'
});

const strategy = new passportGithub.Strategy(
    {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL
    },
    (accessToken, refreshToken, profile, done) => {
        const user = User.createFromGitHubProfile(profile);
        UserModel.findOrCreate({
            where: { userName: user.userName },
            defaults: {
                userName: user.userName,
                avatarUrl: user.avatarUrl
            }
        }).then(() => done(null, profile));
    }
);
passport.use(strategy);

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.static(path.resolve(__dirname, '../client/build')));
app.use(express.static(path.resolve(__dirname, '../client/public')));

app.use(cookieParser());
app.use(expressSession({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
passport.serializeUser((profile, done) => {
    done(null, profile);
});
passport.deserializeUser((profile, done) => {
    done(null, profile);
});
app.use(passport.initialize());
app.use(passport.session());

app.get(
    '/login',
    passport.authenticate('github')
);

app.get(
    '/login/return',
    passport.authenticate('github', { failureRedirect: process.env.LOGIN_REDIRECT }),
    (req, res) => res.redirect(process.env.LOGIN_REDIRECT)
);

app.get(
    '/logout',
    (req, res) => {
        req.logout();
        res.redirect('/');
    }
);


app.get(
    '/profile',
    (req, res) => {
        if (!req.user)
            return res.sendStatus(404);
        const userName = req.user['username'];
        UserModel.findOne({ where: { userName: userName } })
            .then( user => res.json(user));
    }
);

app.get(
    '/api/v1/users',
    (req, res) => {
        UserModel.findAll()
            .then(users => res.json({users: users}));
    }
);


app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});
