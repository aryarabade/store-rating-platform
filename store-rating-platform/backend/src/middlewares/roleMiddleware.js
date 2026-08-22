const { error } = require('../utils/apiResponse');

/**
 * Usage: router.get('/dashboard', authMiddleware, restrictTo('admin'), handler)
 * Must run AFTER authMiddleware, since it reads req.user.role.
 */
function restrictTo(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return error(res, 'Not authenticated.', 401);
    }
    if (!allowedRoles.includes(req.user.role)) {
      return error(res, 'You do not have permission to perform this action.', 403);
    }
    next();
  };
}

module.exports = restrictTo;
