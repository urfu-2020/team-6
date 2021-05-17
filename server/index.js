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
const bodyParser = require('body-parser');
const {Op} = require("sequelize");
const ws = require("ws");


const sequelize = new Sequelize(process.env.DATABASE_CONNECTION_URL);
sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });


class UserModel extends Model {
}

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

class ChatRoomModel extends Model {
}

ChatRoomModel.init({}, {
    sequelize,
    modelName: 'chatRoom'
});

class ChatMessageModel extends Model {
}

ChatMessageModel.init({
    chatRoomId: {
        type: Sequelize.INTEGER
    },
    userId: {
        type: Sequelize.INTEGER
    },
    text: {
        type: Sequelize.TEXT
    },
    date: {
        type: Sequelize.DATE
    }
}, {
    sequelize,
    modelName: 'chatMessage'
});


ChatRoomModel.belongsToMany(UserModel, {through: 'userChats'});
UserModel.belongsToMany(ChatRoomModel, {through: 'userChats'});

ChatRoomModel.hasMany(ChatMessageModel, {
    foreignKey: 'chatRoomId',
    targetKey: 'id'
});
ChatMessageModel.belongsTo(ChatRoomModel);
UserModel.hasMany(ChatMessageModel, {
    foreignKey: 'userId',
    targetKey: 'id'
});
ChatMessageModel.belongsTo(UserModel);

const strategy = new passportGithub.Strategy(
    {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL
    },
    (accessToken, refreshToken, profile, done) => {
        const user = User.createFromGitHubProfile(profile);
        UserModel.findOrCreate({
            where: {userName: user.userName},
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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(express.urlencoded());

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
    passport.authenticate('github', {failureRedirect: process.env.LOGIN_REDIRECT}),
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
        UserModel.findOne({where: {userName: userName}})
            .then(user => res.json(user));
    }
);


app.get(
    '/api/v1/users',
    async (req, res) => {
        const users = await UserModel.findAll();
        const userName = req.user['username'];
        const chatsWithCurrentUser = await ChatRoomModel.findAll({
            include: [{
                model: UserModel,
                where: {
                    userName: userName
                }
            }]
        });
        const chatsIds = chatsWithCurrentUser.map(c => c.id);

        const chats = await ChatRoomModel.findAll({
            where: {
                id: {
                    [Op.or]: [chatsIds]
                }
            },
            include: [{
                model: UserModel
            }]
        });

        const usersWithChats = {};
        for (let chat of chats) {
            for (let user of chat.users) {
                if (user.userName === userName)
                    continue;

                usersWithChats[user.id] = chat;
            }
        }

        return res.json({users: users, usersWithChats: usersWithChats});
    }
);


app.post(
    '/api/v1/chats',
    async (req, res) => {

        try {
            const userIds = req.body['users'];

            const chat = await ChatRoomModel.create();

            const users = await UserModel.findAll({
                where: {
                    id: {
                        [Op.or]: [userIds]
                    }
                }
            });

            await chat.setUsers(users);

            return res.json({id: chat.id});
        } catch (error) {
            console.log(error);
        }
    }
);

app.post('/api/v1/chats/:id/messages',
    async (req, res) => {
        const userName = req.user['username'];
        const user = await UserModel.findOne({
            where: {
                userName: userName
            }
        });
        const userId = user.id;

        const text = req.body['text'];
        const date = Date.parse(req.body['date']);

        const chatId = req.params.id;
        try {
            const message = await ChatMessageModel.create({
                text: text,
                chatRoomId: chatId,
                userId: userId,
                date: date
            });
            return res.json(message);
        } catch (e) {
            console.log(e);
        }
    }
);

app.get(
    '/api/v1/chats/:id/messages',
    async (req, res) => {
        const userName = req.user['username'];
        const user = await UserModel.findOne({
            where: {
                userName: userName
            }
        });
        const userId = user.id;

        const chatId = req.params.id;
        const messages = await ChatMessageModel.findAll({
            include: [
                {
                    model: ChatRoomModel,
                    where: {
                        id: chatId
                    }
                },
                {
                    model: UserModel
                }],
            order: [
                ['date']
            ]
        });
        const result = messages.map((message) => {
            return {
                isYou: message.userId === userId,
                id: message.id,
                text: message.text,
                date: message.date,
                avatarUrl: message.user.avatarUrl
            };
        });
        return res.json({messages: result});
    }
);

const server = app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});


const connections = {};

const wsServer = new ws.Server({noServer: true});

wsServer.on('connection', (socket, req) => {
    const userId = parseInt(req.url.substr(1), 10);
    connections[userId] = socket;


    socket.on('message', function incoming(message) {
        const data = JSON.parse(message);

        if (data.type === 'sendMessage')
            handleSendMessageEventAsync(data);
    });
});


async function handleSendMessageEventAsync(data) {

    const userId = data.userId;
    const text = data.text;
    const date = Date.parse(data.date);

    const chatId = data.chatId;
    try {
        const message = await ChatMessageModel.create({
            text: text,
            chatRoomId: chatId,
            userId: userId,
            date: date
        });

        const chat = await ChatRoomModel.findOne({
            where: {
                id: chatId
            },
            include: [{
                model: UserModel
            }]
        });

        for (let user of chat.users) {
            if (user.id in connections) {
                const connection = connections[user.id];
                connection.send(JSON.stringify(message));
            }
        }
    } catch (e) {
        console.log(e);
    }
}


server.on('upgrade', (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, socket => {
        wsServer.emit('connection', socket, request);
    });
});

//ChatMessageModel.sync({force: true});
//sequelize.sync();
