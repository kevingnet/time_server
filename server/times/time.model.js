const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        time: { type: DataTypes.STRING, allowNull: false },
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
    return sequelize.define('Time', attributes, options);
}