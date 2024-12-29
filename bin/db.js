// db.js
const { Sequelize } = require('sequelize');

// Replace the MySQL config with SQLite config
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite', // The path to the SQLite file (relative or absolute)
});

// Test the connection to the database
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

module.exports = { sequelize, testConnection };
