const { error } = require('../utils/apiResponse');

/**
 * Catches:
 *  - Sequelize validation errors (from model-level validate rules)
 *  - Sequelize unique constraint errors (duplicate email etc.)
 *  - Any other thrown error
 * Mount this LAST, after all routes, in app.js.
 */
function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.name === 'SequelizeValidationError') {
    const messages = err.errors.map((e) => e.message);
    return error(res, 'Validation failed', 400, messages);
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    const messages = err.errors.map((e) => e.message);
    return error(res, 'Duplicate value — already exists', 409, messages);
  }

  return error(res, err.message || 'Internal Server Error', err.status || 500);
}

module.exports = errorHandler;
