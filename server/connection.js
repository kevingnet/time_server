var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    database: "time_server",
    user: "root",
    password: "ChoosePassword"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

module.exports = mysql;
module.exports = connection;

