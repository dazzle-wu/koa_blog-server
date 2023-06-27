const { DataTypes } = require('sequelize')
const sequelize = require('../database/db')

const Article = sequelize.define('article', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  cover_img: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  readings: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  is_publish: {
    type: DataTypes.TINYINT(1),
    allowNull: false,
    defaultValue: 0
  },
  is_recommend: {
    type: DataTypes.TINYINT(1),
    allowNull: false,
    defaultValue: 0
  },
  is_delete: {
    type: DataTypes.TINYINT(1),
    allowNull: false,
    defaultValue: 0
  }
})

module.exports = Article
