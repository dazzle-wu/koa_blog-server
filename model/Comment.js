const { DataTypes } = require('sequelize')
const sequelize = require('../database/db')

const Comment = sequelize.define('comment', {
  cmid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  time: {
    type: DataTypes.DATE,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  article_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
})

module.exports = Comment
