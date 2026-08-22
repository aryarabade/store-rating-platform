const express = require('express');
const router = express.Router();

const {
  getStoreRatings,
  submitRating,
  updateRating
} = require('../controllers/ratingController');
const { validateRatingSubmit } = require('../validators/ratingValidator');
const authMiddleware = require('../middlewares/authMiddleware');
const restrictTo = require('../middlewares/roleMiddleware');

router.use(authMiddleware, restrictTo('user'));

router.get('/store/:storeId', getStoreRatings);
router.post('/', validateRatingSubmit, submitRating);
router.put('/', validateRatingSubmit, updateRating);

module.exports = router;
