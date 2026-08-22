const { error } = require('../utils/apiResponse');
const { validateName, validateAddress, validateEmail } = require('./fieldValidators');

/**
 * Validates POST /api/admin/stores body (Admin adding a new store)
 */
function validateStoreCreate(req, res, next) {
  const { name, email, address, ownerId } = req.body;
  const errors = [];

  if (!name || name.trim().length === 0) {
    errors.push('Store name is required');
  } else if (name.length > 60) {
    errors.push('Store name must not exceed 60 characters');
  }

  const emailErr = validateEmail(email);
  if (emailErr) errors.push(emailErr);

  const addressErr = validateAddress(address);
  if (addressErr) errors.push(addressErr);
  if (!ownerId || !Number.isInteger(Number(ownerId))) errors.push('A Store Owner must be selected');

  if (errors.length > 0) {
    return error(res, 'Validation failed', 400, errors);
  }
  next();
}

function validateStoreUpdate(req, res, next) {
  return validateStoreCreate(req, res, next);
}

module.exports = { validateStoreCreate, validateStoreUpdate };
