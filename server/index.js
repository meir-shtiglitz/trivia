const express = require('express');

const axios = require('axios');
const cors = require('cors');

const app = express();

const path = require('path');

const mongoose = require('mongoose');

const bcrypt = require("bcryptjs");

require('dotenv').config();

const jwt = require('jsonwebtoken');
const server = require('http').createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origins: [process.env.API_CLIENT, "http://localhost:3000"],
        methods: ["GET", "POST"]
    }
});


mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("conected to DB"))
    .catch(error => console.log("error", error));




var usersConected = [];
io.on('connection', (socket) => {
    socket.on('join', (room, name) => {
        socket.join(room);
        socket.room = room;
        usersConected.push({ id: socket.id, name: name, room: room })
        const userInRoom = [...usersConected].filter(user => user.room == room);
        io.to(room).emit('getList', userInRoom);
    });

    socket.on('msg', (data) => {
        const { message, room, from } = data;
        console.log(`msg: ${message}, room: ${room}`);
        io.to(room).emit('msg', [message, from]);
    });


    //disconected
    socket.on('disconnect', () => {
        console.log('socket.id: ' + socket.id);
        usersConected = [...usersConected].filter(user => user.id != socket.id);
        const userInRoom = [...usersConected].filter(user => user.room == socket.room);
        io.to(socket.room).emit('getList', userInRoom);
    });

})
const bodyParser = require('body-parser');
app.use(express.static(path.join(__dirname, '../client','build')));

app.use(bodyParser.json())
app.use(cors());

app.get('*', (req, res, next) => {
    console.log('path',req.path);
    if (!req.path.includes('api')){
    console.log('general',path.join(__dirname, '../client','build', 'index.html'))
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
    } else{
        console.log('next')
        next();
    }
  });



const nodemailer = require('nodemailer');
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "http://localhost:3000/contact";
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

app.get('/api/contact', (req, res) => {
    var contact = req.query;
    console.log(contact);
    var text = '<P>מאת: ' + contact.name + '</p><p>email: ' + contact.email + '</p><p>תוכן ההודעה: ' + contact.msg + '</p>';

    var info = transporter.sendMail({
        from: `טריוויה-לי<${process.env.MAIL_USER}>`,
        to: process.env.MAIL_ADMIN,
        subject: contact.subject,
        html: text
    }).then(result => {
        return res.send({ result: result });
    })
})

const user_schema = mongoose.Schema({
    details: {
        name: String,
        email: String,
        phone: String,
        password: String
    },
    games: [
        {
            name: String,
            password: String,
            status: String,
            time: Number,
            live: Boolean,
            questions: [
                {
                    q: String,
                    atrue: String,
                    afalse1: String,
                    afalse2: String,
                    afalse3: String
                }
            ],
            players: [
                {
                    name: String,
                    email: String,
                    q_over: Array,
                    finish: Boolean,
                    points: Number
                }
            ]
        }
    ]
}, { collection: 'users' });

const User = mongoose.model('User', user_schema);
//רישום משתמש
app.get('/api/register', (req, res) => {
    var email = req.query.email;
    console.log(email);
    User.find({ "details.email": email })
        .then(response => {
            if (response.length < 1) {
                bcrypt.hash(req.query.password, 10, function (err, hash) {
                    console.log(hash);
                    const user = new User({
                        details: {
                            name: req.query.name,
                            email: req.query.email,
                            phone: req.query.phone,
                            password: hash
                        }
                    });
                    user.save()
                        .then(function (result) {
                            var token = jwt.sign({ foo: result.details, id: result._id }, process.env.SECRET);
                            console.log(token);
                            return res.send({ response: token });
                        })
                });
            } else {
                return res.send({ response: 3 });
            }
        })

})

//עדכון פרטי משתמש
app.get('/api/user/update', (req, res) => {
    var user = req.query;
    if (user.password.length > 0) {
        bcrypt.hash(user.password, 10, function (err, hash) {
            var update = {
                name: user.name,
                email: user.email,
                phone: user.phone,
                password: hash
            }

            User.updateOne({ '_id': user.id }, {
                $set: {
                    'details': update
                }
            })
                .then(response => {
                    update.id = user.id;
                    console.log(update);
                    var token = jwt.sign({ foo: update, id: user._id }, process.env.SECRET);
                    console.log(token);
                    return res.send({ result: token });
                })

        })
    } else {
        var update = {
            id: user.id,
            name: user.name,
            phone: user.phone,
            email: user.email
        }
        User.updateOne({ '_id': user.id }, {
            $set: {
                'details.name': user.name,
                'details.phone': user.phone,
                'details.email': user.email
            }
        })
            .then(response => {
                var token = jwt.sign({ foo: update, id: user._id }, process.env.SECRET);
                console.log(token);
                return res.send({ result: token });
            })
    }

})

//כניסה למערכת
app.post('/api/login', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    console.log(email + ' ' + password);
    User.find({ "details.email": email })
        .then(response => {
            if (response.length < 1) {
                return res.send({ result: 3 });
            } else {
                bcrypt.compare(password, response[0].details.password, function (err, result) {

                    if (result) {
                        var user = response[0].details;
                        console.log('id:' + response[0]._id);
                        console.log(user);
                        var token = jwt.sign({ foo: user, id: response[0]._id }, process.env.SECRET);
                        console.log(token);
                        return res.send({ result: token });
                    } else {
                        console.log('false');
                        return res.send({ result: 2 });
                    }
                })
            }
        })
})


app.get('/api/find', (req, res) => {
    User.find({ details: { name: 'meir' } })
        .then(function (result) {
            console.log(result);
            return res.send(result);
        })
})
//שאיבת כל המשחקים של המשתמש
app.get('/api/games/get', (req, res) => {
    User.find({ _id: req.query.id }, { games: 1 })
        .then(function (result) {
            console.log(result);
            return res.send(result);
        })
})

//שאיבת כל התוצאות של המשחק
app.get('/api/players/get', (req, res) => {
    console.log(req.query);
    User.findOne({ games: { $elemMatch: { _id: req.query.gameId } } }, { 'games.$.players': 1 })
        .then(function (result) {
            console.log(result);
            return res.send(result);
        })
})

//שאיבת כל השאלות של המשחק
app.get('/api/questions/get', (req, res) => {
    console.log(req.query);
    User.findOne({ games: { $elemMatch: { _id: req.query.gameId } } }, { 'games.$': 1 })
        .then(function (result) {
            return res.send(result);
        })
})

//שאיבת כל המשחקים הממתינים לאישור 
app.get('/api/games/waiting', (req, res) => {
    User.find({ games: { $elemMatch: { status: 'waiting' } } })
        .then(function (result) {
            var all_games = [];
            result.forEach(games => {
                games.games.forEach(game => {
                    game.password = games.details.name;
                    if (game.status == 'waiting') all_games.push(game);
                })
            })
            return res.send(all_games);
        })
})

//שאיבת כל המשחקים הציבוריים 
app.get('/api/games/public', (req, res) => {
    User.find({ games: { $elemMatch: { status: 'public' } } })
        .then(function (result) {
            var all_games = [];
            result.forEach(games => {
                games.games.forEach(game => {
                    game.password = games.details.name;
                    if (game.status == 'public') all_games.push(game);
                })
            })
            return res.send(all_games);
        })
})

//כניסה למשחק עם פרטים
app.get('/api/games/logame', (req, res) => {
    console.log(req.query);
    User.findOne({ games: { $elemMatch: { name: req.query.nameGame, password: req.query.password } } }, { 'games.$': 1 })
        .then(function (result) {
            console.log(result);
            if (result) return res.send(result);
            return res.send({ result: 3 });
        })
})

//הוספת משחק חדש
app.get('/api/game/new', (req, res) => {
    console.log(req.query);
    var status = req.query.status;
    if (status == 'public') status = 'waiting';
    User.findOneAndUpdate({ _id: req.query.id }, {
        $push: {
            games: {
                name: req.query.name,
                password: req.query.password,
                status: status,
                time: req.query.time,
                live: req.query.live

            }
        }
    }, { new: true })
        .then(function (result) {
            console.log(result);
            return res.send(result);
        })
})

//שינוי פרטי משחק
app.get('/api/game/update', (req, res) => {
    console.log("game update query", req.query);
    var status = req.query.status;
    if (status == 'public') status = 'waiting';
    var updateOrReset = {
        'games.$.name': req.query.name,
        'games.$.password': req.query.password,
        'games.$.status': status,
        'games.$.time': req.query.time,
        'games.$.live': req.query.live
    }
    if (req.query.action == 'reset') updateOrReset = { 'games.$.players': [{ name: 'מנהל המשחק', finish: true }] };

    User.updateOne({ 'games._id': req.query.gameId }, { $set: updateOrReset })
        .then(function (result) {
            console.log(result);
            return res.send(result);
        })
})

//ניהול פרסום
app.get('/api/status/admin', (req, res) => {
    console.log(req.query);
    var status = req.query.status;
    User.updateOne({ 'games._id': req.query.gameId }, {
        $set: {
            'games.$.status':
                status
        }
    })
        .then(function (result) {
            console.log(result);
            return res.send(result);
        })
})


//מחיקת משחק
app.get('/api/game/delete', (req, res) => {
    console.log(req.query);
    User.findOneAndUpdate({ 'games._id': req.query.gameId }, { $pull: { 'games': { _id: req.query.gameId } } }, { new: true })
        .then(result => {
            console.log(result);
            return res.send(result);
        })
})


//הוספת שאלה חדשה
app.get('/api/questions/new', (req, res) => {
    console.log(req.query);
    User.findOneAndUpdate({ 'games._id': req.query.gameId }, {
        $push: {
            'games.$.questions': {
                q: req.query.q,
                atrue: req.query.atrue,
                afalse1: req.query.afalse1,
                afalse2: req.query.afalse2,
                afalse3: req.query.afalse3
            }
        }
    }, { new: true })
        .then(result => {
            User.findOne({ games: { $elemMatch: { _id: req.query.gameId } } }, { 'games.$': 1 })
                .then(function (result2) {
                    console.log(result2);
                    return res.send(result2);
                })
            //return res.send({result:result});
        })
})
//הוספת שחקן חדש
app.get('/api/player/new', (req, res) => {
    console.log(req.query);
    User.findOneAndUpdate({ 'games._id': req.query.gameId }, {
        $push: {
            'games.$.players': {
                name: req.query.name
            }
        }
    }, { new: true })
        .then(result => {
            console.log(result)
            User.findOne({ games: { $elemMatch: { _id: req.query.gameId } } }, { 'games.$': 1 })
                .then(function (result2) {
                    console.log(result2);
                    return res.send(result2);
                })
            //return res.send({result:result});
        })
})


//עדכון נקודות
app.get('/api/points/set', (req, res) => {
    console.log(req.query);

    var p_update = req.query;
    User.findOneAndUpdate({ 'games._id': p_update.gameId }, {
        $set: {
            'games.$[game].players.$[player].points': p_update.points,
            'games.$[game].players.$[player].q_over': p_update.q_over
        }
    }, {
        arrayFilters: [{ 'game._id': p_update.gameId }, { 'player.name': p_update.name }],
        new: true
    })
        .then(result => {
            return res.send(result);
        })
})


//קבלת נתוני שחקן
app.get('/api/player/get', (req, res) => {

    var p_update = req.query;
    User.findOne({ games: { $elemMatch: { _id: req.query.gameId, 'games.players': { elemMatch: { name: req.query.name } } } } })
        .then(result => {
            console.log(result);
            return res.send(result);
        })
})


//עדכון סיום משחק
app.get('/api/finish', (req, res) => {
    console.log(req.query);
    User.findOneAndUpdate({ 'games._id': req.query.gameId }, {
        $set: {
            'games.$[game].players.$[player].finish': true
        }
    }, {
        arrayFilters: [{ 'game._id': req.query.gameId }, { 'player.name': req.query.name }],
        new: true
    })
        .then(result => {
            console.log(result);
            return res.send(result);
        })
})


//מחיקת שאלה
app.get('/api/questions/delete', (req, res) => {
    console.log(req.query);
    User.updateOne({ 'games._id': req.query.gameId }, { $pull: { 'games.$.questions': { _id: req.query.qId } } })
        .then(result => {
            console.log(result);
            return res.send(result);
        })
})

//עדכון שאלה
app.get('/api/questions/update', (req, res) => {
    console.log("/questions/update query", req.query);
    var q_update = req.query;
    var position = 'games.$.questions.' + parseInt(q_update.q_num);
    User.updateOne({ 'games._id': q_update.gameId }, {
        $set: {
            [position]: {
                q: q_update.q,
                atrue: q_update.atrue,
                afalse1: q_update.afalse1,
                afalse2: q_update.afalse2,
                afalse3: q_update.afalse3
            }
        }
    })
        .then(result => {
            console.log(result);
            return res.send(result);
        })
})


const port = process.env.PORT || 3030;
server.listen(port, () => {
    console.log('server running ' + port);
})