const { error } = require('../utils/apiResponse');
const {
  validateName,
  validateAddress,
  validateEmail,
  validatePassword
} = require('./fieldValidators');

/**
 * Validates POST /api/auth/signup body
 */
function validateSignup(req, res, next) {
  const { name, email, address, password, role } = req.body;
  const errors = [];

  const nameErr = validateName(name);
  if (nameErr) errors.push(nameErr);

  const emailErr = validateEmail(email);
  if (emailErr) errors.push(emailErr);

  const addressErr = validateAddress(address);
  if (addressErr) errors.push(addressErr);

  const passwordErr = validatePassword(password);
  if (passwordErr) errors.push(passwordErr);

  if (!['user', 'store_owner', 'admin'].includes(role)) {
    errors.push('Please select a valid account type');
  }

  if (errors.length > 0) {
    return error(res, 'Validation failed', 400, errors);
  }
  next();
}

/**
 * Validates POST /api/auth/login body
 */
function validateLogin(req, res, next) {
  const { email, password, selectedRole } = req.body;
  const errors = [];

  if (!email) errors.push('Email is required');
  if (!password) errors.push('Password is required');
  if (!['user', 'store_owner', 'admin'].includes(selectedRole)) {
    errors.push('Please select a valid account type');
  }

  if (errors.length > 0) {
    return error(res, 'Validation failed', 400, errors);
  }
  next();
}

/**
 * Validates PUT /api/auth/update-password body
 */
function validatePasswordUpdate(req, res, next) {
  const { currentPassword, newPassword } = req.body;
  const errors = [];

  if (!currentPassword) errors.push('Current password is required');

  const newPasswordErr = validatePassword(newPassword);
  if (newPasswordErr) errors.push(newPasswordErr);

  if (errors.length > 0) {
    return error(res, 'Validation failed', 400, errors);
  }
  next();
}

module.exports = { validateSignup, validateLogin, validatePasswordUpdate };
