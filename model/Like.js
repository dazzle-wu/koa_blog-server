const { DataTypes } = require('sequelize')
const sequelize = require('../database/db')

const Like = sequelize.define('like', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  article_id: {
    type: DataTypes.INTEGER,
  },
  comment_id: {
    type: DataTypes.INTEGER,
  },
  is_delete: {
    type: DataTypes.TINYINT(1),
    allowNull: false,
    defaultValue: 0
  }
})

module.exports = Like
