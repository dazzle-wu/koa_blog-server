const { DataTypes } = require('sequelize')
const sequelize = require('../database/db')

const Category = sequelize.define('category', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  is_delete: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0
  }
})

module.exports = Category
