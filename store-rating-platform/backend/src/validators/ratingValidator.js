const { error } = require('../utils/apiResponse');
const { validateRating } = require('./fieldValidators');

/**
 * Validates POST /api/user/ratings body (submit or modify rating)
 */
function validateRatingSubmit(req, res, next) {
  const { storeId, rating } = req.body;
  const errors = [];

  if (!storeId) errors.push('storeId is required');

  const ratingErr = validateRating(rating);
  if (ratingErr) errors.push(ratingErr);

  if (errors.length > 0) {
    return error(res, 'Validation failed', 400, errors);
  }
  next();
}

module.exports = { validateRatingSubmit };
