const { DataTypes } = require('sequelize')
const sequelize = require('../database/db')

const Article = sequelize.define('article', {
  aid: {
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
  pub_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false
  },
  is_delete: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0
  },
  cate_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  author_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
})

module.exports = Article
