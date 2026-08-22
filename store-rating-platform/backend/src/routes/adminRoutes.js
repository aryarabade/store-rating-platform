const express = require('express');
const router = express.Router();

const {
  getDashboardStats,
  addUser,
  addStore,
  updateStore,
  deleteStore,
  listStores,
  listUsers,
  getUserDetails
} = require('../controllers/adminController');
const { validateStoreCreate, validateStoreUpdate } = require('../validators/storeValidator');
const { validateSignup } = require('../validators/authValidator');
const authMiddleware = require('../middlewares/authMiddleware');
const restrictTo = require('../middlewares/roleMiddleware');

// Every route here requires: logged in AND role === admin
router.use(authMiddleware, restrictTo('admin'));

router.get('/dashboard', getDashboardStats);

router.post('/users', validateSignup, addUser); // reuses name/email/address/password rules
router.get('/users', listUsers);
router.get('/users/:id', getUserDetails);

router.post('/stores', validateStoreCreate, addStore);
router.get('/stores', listStores);
router.put('/stores/:id', validateStoreUpdate, updateStore);
router.delete('/stores/:id', deleteStore);

module.exports = router;
