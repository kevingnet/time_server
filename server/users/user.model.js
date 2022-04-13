const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        name: { type: DataTypes.STRING, allowNull: false },
        username: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false },
        password: { type: DataTypes.STRING, allowNull: false },
        token: { type: DataTypes.STRING, allowNull: false },
    };

    const options = {
        defaultScope: {
            // exclude password hash by default
            // attributes: { exclude: ['Password'] }
        },
        scopes: {
            // include hash with this scope
            withHash: { attributes: {}, }
        }
    };
    return sequelize.define('User', attributes, options);
}