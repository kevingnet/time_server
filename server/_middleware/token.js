const jwt = require("jsonwebtoken");
const config = require('config.json');

const api_key = config.api_key;

function createToken(email) {
    // Create token
    const token = jwt.sign(
        {email},
        api_key, // process.env.TOKEN_KEY
        {
            expiresIn: "2h",
        }
    );
    return token;
}

module.exports = createToken;
