const express = require('express');
const router = express.Router();

const { listStoresForUser, submitOrUpdateRating } = require('../controllers/userController');
const { validateRatingSubmit } = require('../validators/ratingValidator');
const authMiddleware = require('../middlewares/authMiddleware');
const restrictTo = require('../middlewares/roleMiddleware');

// Every route here requires: logged in AND role === user
router.use(authMiddleware, restrictTo('user'));

router.get('/stores', listStoresForUser);
router.post('/ratings', validateRatingSubmit, submitOrUpdateRating);

module.exports = router;
