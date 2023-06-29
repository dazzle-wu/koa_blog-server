const { DataTypes } = require('sequelize')
const sequelize = require('../database/db')

const Collect = sequelize.define('collect', {
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
    allowNull: false
  },
  is_delete: {
    type: DataTypes.TINYINT(1),
    allowNull: false,
    defaultValue: 0
  }
})

Collect.sync()

module.exports = Collect
