require('rootpath')();
require("dotenv").config();
const bodyParser = require('body-parser'); // middleware
const express = require('express');
var Promise = require('bluebird');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require('cors');
const errorHandler = require('_middleware/error-handler');
let connection = require("./connection.js");
const userService = require('./users/user.service');

const User = require("./users/user.model");
const auth = require("./_middleware/auth");
const config = require('config.json');
console.log("config ", config);

const api_key = config.api_key;
process.env.TOKEN_KEY = api_key
console.log("api_key ", api_key);

function createToken(email) {
    console.log("createToken email ", email);
    // Create token
    const token = jwt.sign(
        {email},
        api_key, // process.env.TOKEN_KEY
        {
            expiresIn: "2h",
        }
    );
    console.log("createToken token ", token);
    return token;
}

var queryAsync = Promise.promisify(connection.query.bind(connection));

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// global error handler
app.use(errorHandler);

// api routes
app.use('/logon', require('./logon/logons.controller'));
app.use('/users', require('./users/users.controller'));

async function BcryptCompareAsync([email, password, pwd], callback) {
    let restoken = 'token password did not match'
    await bcrypt.hash(password, 10, function(err, hash) {
        if (err) { throw (err); }

        bcrypt.compare(pwd , hash, function(err, res) {
        if (err){
            // handle error
            console.log("BcryptCompareAsync err ", err);
        }
        if (res) {
            // Create token
            const token = createToken(email);
            restoken = token
            return callback(restoken);
        }
        });
    });
}

async function BcryptHashAsync([password], callback) {
    let hash = 'hashhashhash'
    await bcrypt.hash(password, 10, function(err, hash) {
        if (err) { throw (err); }
        return callback(hash);
    });
}

function registerCreate(email, req, res, params, callback) {
    console.log("registerCreate user", params);
    const user = userService.create(params);

    console.log("registerCreate user", user);
    if (user === 'error Email is already registered') {
        let jsres = JSON.stringify({ email: email, error: 1, message: user });
        res.status(400).send(jsres);
        return;
    }
    // Create token
    const token = createToken(email);
    // save user token
    user.token = token;
    user.password = req.body.password;

    // return new user
    let userresult = {
        "id": user.id,
        "name": user.name,
        "username": user.username,
        "email": email,
        "password": user.password,
        "token": user.token,
    }
    res.status(200).send(userresult);
}

function register(email, req, res, callback) {
    let userNameFound = null;
    find_user(email, function(result) {
        console.log("INSIDE register result ", result);

        if(result && result[0]) {
            userNameFound = result[0];
        }
        if (userNameFound === null) {
            console.log("OK registered user not found adding new user");
        } else {
            console.log("register user found");
            let jsres = JSON.stringify({ email: email, error: 2, message: 'register validation: user already registered ' + userNameFound });
            res.status(409).send(jsres);
            return;
        }

        let params = {
            name: req.body.name,
            username: req.body.username,
            email: email,
            password: req.body.password,
        }
        registerCreate(email, req, res, params, function(result) {
        });

        callback(result);
    });
}

// Register
app.post("/register", (req, res) => {
    let encryptedPassword;
    try {
        // Get user input
        const {name, username, email, password} = req.body;

        // Validate user input
        if (!(email && password && name && username)) {
            let jsres = JSON.stringify({ email: email, error: 1, message: 'register validation: all input is required' });
            res.status(400).send(jsres);
            return;
        }

        let userNameFound = null;
        register(email, req, res, function(result) {
        });
        //res.status(200).json(req.body);
        return;
    } catch (err) {
        console.log("register exception ", err);
        let jsres = JSON.stringify({ email: email, error: 11, message: 'register exception' + err });
        res.status(400).send(jsres);
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate user input
        if (!(email && password)) {
            res.status(400).send("All input is required");
            return;
        }
        // Validate if user exist in our database
        userName = '';
        pwd = '';
        user_name_vars(email, function(result) {
            if(!result || !result[0] || !result[1] || !result[2]) {
                let jsres = JSON.stringify({ email: email, error: 3, message: 'login validation: bad result ' + result });
                res.status(400).send(jsres);
                return;
            }
            console.log("login validation:  result ", result);

            id = result[0];
            name = result[1];
            username = result[2];
            // email = result[3];
            pwd = result[4];

            // Create token
            const token = createToken(email);

            //token = result[5];
            if(username === 'error') {
                let jsres = JSON.stringify({ email: email, error: 1, message: 'login validation: user not found ' + email });
                res.status(404).send(jsres);
                return;
            }
            if(password != pwd) {
                let jsres = JSON.stringify({ name: username, error: 2, message: 'login validation: password did not match' });
                res.status(401).send(jsres);
                return;
            } else {
                 let tokenres = 'Unknown error'
                if (username) {
                    BcryptCompareAsync([email, password, pwd], function (result, err, callback) {
                        if (err) {
                            console.log("BcryptCompareAsync err ", err);
                        } else {
                            let string = JSON.stringify(result);
                            let json =  JSON.parse(string);
                            if(json){
                                //tokenres = json;
                                tokenres = token;
                                //process.env.TOKEN_KEY = tokenres;
                                let userresult = {
                                    "id": id,
                                    "name": name,
                                    "username": username,
                                    "email": email,
                                    "password": password,
                                    "token": tokenres,
                                }
                                //res.send(userresult);
                                res.status(200).send(userresult);
                                return;
                            } else {
                                let jsres = JSON.stringify({ name: username, error: 4, message: 'login validation: token not found' });
                                res.status(404).send(jsres);
                                return;
                            }
                        }
                    });
                }
                return;
            }
            let jsres = JSON.stringify({ name: username, error: 5, message: 'login validation: Server Error' });
            res.status(400).send(jsres);

        });

    } catch (err) {
        console.log("login exception ", err);
        let jsres = JSON.stringify({ email: email, error: 11, message: 'login exception' + err });
        res.status(400).send(jsres);
    }
});

// Route to Homepage
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/static/index.html');
});

function executeQuery([query, param], callback) {
    connection.query(query, param, function (err, rows, fields) {
        if (err) {
            console.log(err);
            throw err;
        }
        return callback(rows);
    });
}

var user_name_vars = function (email, callback) {
    dbname =  '';
    dbpwd =  '';
    let sql = "SELECT id, name, username, email, password, token FROM time_server.Users WHERE email = ?";

    executeQuery([sql, email], function (rows, err) {
        if (err) {
            console.log("user vars err ", err);
            callback([email, "server error", err]);
        } else {
            let string = JSON.stringify(rows);
            let json =  JSON.parse(string);
            if(json && json[0] && 'name' in json[0]){
                let id = json[0].id;
                let dbname = json[0].name;
                let dbusername = json[0].username;
                let dbemail = json[0].email;
                let dbpwd = json[0].password;
                let dbtoken = json[0].token;
                callback([id, dbname, dbusername, dbemail, dbpwd, dbtoken]);
            } else {
                callback([email, json, 'error']);
            }
        }
    });
}

var find_user = function (email, callback) {
    let dbname =  '';
    let sql = "SELECT name FROM time_server.Users WHERE email = ?";

    executeQuery([sql, email], function (rows, err) {
        if (err) {
            console.log("find_user err ", err);
            callback(['']);
        } else {
            let string = JSON.stringify(rows);
            let json =  JSON.parse(string);
            if(json && json[0] && 'name' in json[0]) {
                dbname = json[0].name;
            }
            callback([dbname]);
        }
    });
}

app.post("/welcome", auth, (req, res) => {
    res.status(200).send("Welcome");
});

app.post("/current_time2", auth, (req, res) => {
    var datetime = new Date();
    console.log(datetime);
    res.status(200).send({"time" : datetime});
});

app.get("/current_time", (req, res) => {
    var datetime = new Date();
    console.log({"time" : datetime});
    var times = [];
    times[0] = {"time" : datetime}
    res.status(200).send(times);
});


app.use("*", (req, res) => {
    res.status(404).json({
        success: "false",
        message: "Page not found",
        error: {
            statusCode: 404,
            message: "You reached a route that is not defined on this server",
        },
    });
});

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
console.log(port);
app.listen(port, () => {
    console.log('Time Server Demo App is up and listening on port: ${port}');
})

process.stdin.resume();//so the program will not close instantly

function exitHandler(options, exitCode) {
    console.log("Disconnected!");
    if (options.cleanup) console.log('clean');
    if (exitCode || exitCode === 0) console.log(exitCode);
    if (options.exit) process.exit();
    console.log('Goodbye!');
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
