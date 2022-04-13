const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const jwt = require("jsonwebtoken");

let User = db.User;

module.exports = {
    User,
    getAll,
    findAndCountAll,
    getById,
    getByEmail,
    create,
    update,
    delete: _delete
};

async function getAll(pageSize = 4, pageOffset = 0 ) {
    return await db.User.findAll({
        offset: pageOffset, limit: pageSize});
}

async function findAndCountAll(condition = '', pageSize = 4, pageOffset = 0 ) {
    return await db.User.findAndCountAll({
        where: condition, offset: pageOffset, limit: pageSize});
}

async function getById(id) {
    return await getUser(id);
}

async function getByEmail(email) {
    return await getUserFromEmail(email);
}

async function getByName(name) {
    return await getUserFromName(name);
}

async function BcryptHashAsync([password], callback) {
    let hash = 'hashhashhash'
    await bcrypt.hash(password, 10, function(err, hash) {
        if (err) { throw (err); }
        return callback(hash);
    });
}

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

async function create(params) {
    // validate
    if (await db.User.findOne({ where: { email: params.email } })) {
        return 'error Email is already registered';
    }

    let encryptedPassword;
    const user = new db.User(params);
    // hash password
    await BcryptHashAsync([params.password], function (result, err, callback) {
        if (err) {
            console.log("create BcryptHashAsync err ", err);
        } else {
            let string = JSON.stringify(result);
            let json =  JSON.parse(string);
            if(json){
                encryptedPassword = json
            } else {
                encryptedPassword = 'invalid hash'
            }
            user.password = encryptedPassword;
        }
    });

    const token = createToken(email);
    user.token = token

    // save user
    await user.save();
}

async function update(id, params) {
    const user = await getUser(id);

    // validate
    const emailChanged = params.email && user.email !== params.email;
    if (emailChanged && await db.User.findOne({ where: { email: params.email } })) {
        throw 'Email "' + params.email + '" is already registered';
    }

    // hash password if it was entered
    if (params.password) {
        params.password = await bcrypt.hash(params.password, 10);
    }

    // copy params to user and save
    Object.assign(user, params);
    await user.save();
}

async function _delete(id) {
    const user = await getUser(id);
    await user.destroy();
}

// helper functions

async function getUser(id) {
    const user = await db.User.findByPk(id);
    if (!user) throw 'User not found';
    return user;
}

async function getUserFromName(name) {
    const user = await db.User.findOne({ where: { name: name } });
    if (!user) throw 'User not found';
    return user;
}

async function getUserFromEmail(emailaddr) {
    let myEmail = { emailaddr };
    const user = await db.User.findOne({ where: emailaddr });
    if (user === null) {
        return;
    }
    return user;
}
