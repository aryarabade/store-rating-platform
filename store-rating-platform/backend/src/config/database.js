require('dotenv').config();
const { Sequelize } = require('sequelize');

const dialect = process.env.DB_DIALECT || 'mysql';

const sequelizeConfig = dialect === 'sqlite'
  ? {
      dialect: 'sqlite',
      storage: process.env.DB_STORAGE || './database.sqlite',
      logging: false
    }
  : {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      dialect: 'mysql',
      logging: false,
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    };

const sequelize = new Sequelize(
  process.env.DB_NAME || 'app_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  sequelizeConfig
);

module.exports = sequelize;
