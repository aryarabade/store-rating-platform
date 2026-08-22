const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(60),
    allowNull: false,
    validate: {
      len: {
        args: [20, 60],
        msg: 'Name must be between 20 and 60 characters'
      }
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: { msg: 'Must be a valid email address' }
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
    // NOTE: this stores the bcrypt HASH, never plain text.
    // Hashing happens in the controller/service layer before save.
  },
  address: {
    type: DataTypes.STRING(400),
    allowNull: true
  },
  role: {
    type: DataTypes.ENUM('admin', 'user', 'store_owner'),
    allowNull: false,
    defaultValue: 'user'
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = User;
