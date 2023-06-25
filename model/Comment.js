const { DataTypes } = require('sequelize')
const sequelize = require('../database/db')

const Comment = sequelize.define('comment', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  article_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  is_delete: {
    type: DataTypes.TINYINT(1),
    allowNull: false,
    defaultValue: 0
  }
})

module.exports = Comment
