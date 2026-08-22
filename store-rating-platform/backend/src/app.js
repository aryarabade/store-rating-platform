const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check — hit this first to confirm the server is alive
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Route mounting
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/ratings', require('./routes/ratingRoutes'));
app.use('/api/store', require('./routes/storeRoutes'));

// 404 handler — must come after all real routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler — must be the LAST app.use()
app.use(errorHandler);

module.exports = app;
