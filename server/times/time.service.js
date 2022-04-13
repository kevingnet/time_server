const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const jwt = require("jsonwebtoken");

let Time = db.Time;

module.exports = {
    Time,
    getAll,
};

async function getAll() {
    var datetime = new Date();
    console.log(datetime);
    return {"time" : datetime};
}
