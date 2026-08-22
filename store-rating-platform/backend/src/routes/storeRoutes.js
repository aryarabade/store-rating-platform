const express = require('express');
const router = express.Router();

const { getOwnerDashboard } = require('../controllers/storeController');
const authMiddleware = require('../middlewares/authMiddleware');
const restrictTo = require('../middlewares/roleMiddleware');

// Every route here requires: logged in AND role === store_owner
router.use(authMiddleware, restrictTo('store_owner'));

router.get('/dashboard', getOwnerDashboard);

module.exports = router;
