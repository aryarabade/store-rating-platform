/**
 * Field-level validators matching the assessment's exact rules:
 * - Name: 20-60 characters
 * - Address: max 400 characters
 * - Password: 8-16 chars, at least 1 uppercase + 1 special character
 * - Email: standard format
 */

function validateName(name) {
  if (!name || typeof name !== 'string') return 'Name is required';
  const trimmed = name.trim();
  if (trimmed.length < 20 || trimmed.length > 60) {
    return 'Name must be between 20 and 60 characters';
  }
  return null;
}

function validateAddress(address) {
  if (address && address.length > 400) {
    return 'Address must not exceed 400 characters';
  }
  return null;
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return 'A valid email address is required';
  }
  return null;
}

function validatePassword(password) {
  if (!password || password.length < 8 || password.length > 16) {
    return 'Password must be between 8 and 16 characters';
  }
  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_\-+=[\]/\\;'`~]/.test(password);
  if (!hasUppercase) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!hasSpecialChar) {
    return 'Password must contain at least one special character';
  }
  return null;
}

function validateRating(rating) {
  const num = Number(rating);
  if (!Number.isInteger(num) || num < 1 || num > 5) {
    return 'Rating must be an integer between 1 and 5';
  }
  return null;
}

module.exports = {
  validateName,
  validateAddress,
  validateEmail,
  validatePassword,
  validateRating
};
