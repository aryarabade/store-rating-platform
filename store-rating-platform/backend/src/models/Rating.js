const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Rating = sequelize.define('Rating', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  store_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'stores', key: 'id' }
  },
  rating: {
    type: DataTypes.TINYINT,
    allowNull: false,
    validate: {
      min: { args: [1], msg: 'Rating must be at least 1' },
      max: { args: [5], msg: 'Rating must be at most 5' }
    }
  }
}, {
  tableName: 'ratings',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'store_id'] // enforces 1 rating per user per store
    }
  ]
});

module.exports = Rating;
