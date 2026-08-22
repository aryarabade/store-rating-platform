const jwt = require('jsonwebtoken');

/**
 * Signs a JWT containing the user's id and role.
 * Role is embedded so authorization middleware doesn't need
 * a DB lookup on every request.
 */
function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
}

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { signToken, verifyToken };
