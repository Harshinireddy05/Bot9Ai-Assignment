const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Conversation = sequelize.define('Conversation', {
  userId: DataTypes.STRING,
  messages: DataTypes.TEXT
});

module.exports = Conversation;