const { DataTypes } = require('sequelize')
const sequelize = require('../database/db')

const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  avatar: DataTypes.TEXT,
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  username: {
    type: DataTypes.STRING,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  is_admin: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0
  },
  is_delete: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0
  }
})

module.exports = User
