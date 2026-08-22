const { verifyToken } = require('../utils/jwt');
const { error } = require('../utils/apiResponse');
const { User } = require('../models');

/**
 * Reads "Authorization: Bearer <token>", verifies it,
 * and attaches the logged-in user to req.user.
 * Every protected route uses this first.
 */
async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return error(res, 'No token provided. Please log in.', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token); // throws if invalid/expired

    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return error(res, 'User no longer exists.', 401);
    }

    req.user = user; // available to all downstream controllers
    next();
  } catch (err) {
    return error(res, 'Invalid or expired token. Please log in again.', 401);
  }
}

module.exports = authMiddleware;
