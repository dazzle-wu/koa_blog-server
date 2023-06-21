const { DataTypes } = require('sequelize')
const sequelize = require('../database/db')

const Diary = sequelize.define('diary', {
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
  is_delete: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0
  }
})

module.exports = Diary
