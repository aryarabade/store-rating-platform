require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 5002;

async function startServer() {
  try {
    // Test the DB connection
    await sequelize.authenticate();
    console.log(`✅ ${sequelize.getDialect()} database connection established successfully.`);

    // Create missing tables without rebuilding existing SQLite tables.
    await sequelize.sync();
    console.log('✅ All models synced with database.');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
}

startServer();
