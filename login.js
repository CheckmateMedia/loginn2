var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var session = require('express-session');
var router = express.Router();

var app = express();
//File system 
var fs = require('fs')
//Password Hash
var passwordHash = require('password-hash')

const { request } = require('http');

console.log('connecting')

//Express Session

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}))



var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodelogin'
});

app.use(express.static('/Users/matt/Desktop/websites/nodelogin/loginPage'))

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true

}))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname + '/Index.html'))
})


app.post('/auth', function (request, response) {
    var username = request.body.username;
    var password = request.body.password;
    if (username && password) {
        connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function (error, results, fields) {
            if (results.length > 0) {
                request.session.loggedin = true;
                request.session.username = username;
                response.redirect('/SuccessfulLogin.html');
            } else {
                response.redirect('FailedLogin.html');
            }

            response.end();
        });
    } else {
        response.sendFile('FailedLogin.html');
        response.end();
    }
});

app.post('/logged', function (request, response) {
    if (request.session.loggedin) {
        response.sendFile('/SuccessfulLogin.html');
    } else {
        response.sendFile('FailedLogin.html');
    }
    response.end();
});

//Not Working

app.disable('view cache');

app.get('/logout', (req, res) => {
    res.clearCookie();
    app.disable('view cache');
    console.log('clear cookies')
    req.session.destroy((err) => {
        if (err) {
            return console.log(err);
        }
        res.redirect('/Index.html');
        console.log('logged out???')
    });
});

app.listen(3000);