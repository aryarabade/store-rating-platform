const { Op, fn, col } = require('sequelize');
const { User, Store, Rating } = require('../models');
const { success, error } = require('../utils/apiResponse');
const { hashPassword } = require('../utils/hashPassword');

/**
 * GET /api/admin/dashboard
 * Returns total counts for the admin dashboard cards.
 */
async function getDashboardStats(req, res, next) {
  try {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      User.count(),
      Store.count(),
      Rating.count()
    ]);

    return success(res, { totalUsers, totalStores, totalRatings }, 'Dashboard stats fetched');
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/admin/users
 * Admin creates a new user of ANY role (admin, user, store_owner).
 */
async function addUser(req, res, next) {
  try {
    const { name, email, address, password, role } = req.body;

    const validRoles = ['admin', 'user', 'store_owner'];
    if (!validRoles.includes(role)) {
      return error(res, 'Invalid role. Must be admin, user, or store_owner', 400);
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return error(res, 'A user with this email already exists', 409);
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({ name, email, address, password: hashedPassword, role });

    return success(res, {
      user: { id: user.id, name: user.name, email: user.email, role: user.role, address: user.address }
    }, 'User created successfully', 201);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/admin/stores
 * Admin creates a new store and links an existing store_owner user.
 */
async function addStore(req, res, next) {
  try {
    const { name, email, address, ownerId } = req.body;

    const owner = await User.findByPk(ownerId);
    if (!owner || owner.role !== 'store_owner') {
      return error(res, 'Select an existing Store Owner for this store', 400);
    }

    const existing = await Store.findOne({ where: { email } });
    if (existing) {
      return error(res, 'A store with this email already exists', 409);
    }

    const existingOwnedStore = await Store.findOne({ where: { owner_id: ownerId } });
    if (existingOwnedStore) return error(res, 'This Store Owner is already associated with a store', 409);

    const store = await Store.create({ name, email, address, owner_id: ownerId });

    return success(res, { store }, 'Store created successfully', 201);
  } catch (err) {
    next(err);
  }
}

/** PUT /api/admin/stores/:id - Admin updates a store and its owner. */
async function updateStore(req, res, next) {
  try {
    const { name, email, address, ownerId } = req.body;
    const store = await Store.findByPk(req.params.id);
    if (!store) return error(res, 'Store not found', 404);

    const owner = await User.findByPk(ownerId);
    if (!owner || owner.role !== 'store_owner') {
      return error(res, 'Select an existing Store Owner for this store', 400);
    }

    const storeWithEmail = await Store.findOne({ where: { email } });
    if (storeWithEmail && storeWithEmail.id !== store.id) {
      return error(res, 'A store with this email already exists', 409);
    }

    const otherStoreForOwner = await Store.findOne({ where: { owner_id: ownerId } });
    if (otherStoreForOwner && otherStoreForOwner.id !== store.id) {
      return error(res, 'This Store Owner is already associated with a store', 409);
    }

    await store.update({ name, email, address, owner_id: ownerId });
    return success(res, { store }, 'Store updated successfully');
  } catch (err) {
    next(err);
  }
}

/** DELETE /api/admin/stores/:id - Also removes ratings associated with the store. */
async function deleteStore(req, res, next) {
  const transaction = await Store.sequelize.transaction();
  try {
    const store = await Store.findByPk(req.params.id, { transaction });
    if (!store) {
      await transaction.rollback();
      return error(res, 'Store not found', 404);
    }

    await Rating.destroy({ where: { store_id: store.id }, transaction });
    await store.destroy({ transaction });
    await transaction.commit();
    return success(res, null, 'Store deleted successfully');
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
}

/**
 * GET /api/admin/stores?name=&email=&address=&sortBy=&order=
 * List of stores with Name, Email, Address, and computed average Rating.
 * Supports filtering + sorting per the assessment requirements.
 */
async function listStores(req, res, next) {
  try {
    const { name, email, address, sortBy = 'name', order = 'ASC' } = req.query;

    const where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (email) where.email = { [Op.like]: `%${email}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };

    const allowedSortFields = ['name', 'email', 'address', 'created_at'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'name';
    const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const stores = await Store.findAll({
      where,
      order: [[sortField, sortOrder]],
      include: [{
        model: Rating,
        as: 'ratings',
        attributes: []
      }, { model: User, as: 'owner', attributes: ['id', 'name', 'email'] }],
      attributes: {
        include: [[fn('AVG', col('ratings.rating')), 'averageRating']]
      },
      group: ['Store.id', 'owner.id']
    });

    return success(res, { stores }, 'Stores fetched');
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/admin/users?name=&email=&address=&role=&sortBy=&order=
 * List of normal/admin/store_owner users with filters.
 */
async function listUsers(req, res, next) {
  try {
    const { name, email, address, role, sortBy = 'name', order = 'ASC' } = req.query;

    const where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (email) where.email = { [Op.like]: `%${email}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };
    if (role) where.role = role;

    const allowedSortFields = ['name', 'email', 'address', 'role', 'created_at'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'name';
    const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const users = await User.findAll({
      where,
      order: [[sortField, sortOrder]],
      attributes: { exclude: ['password'] }
    });

    return success(res, { users }, 'Users fetched');
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/admin/users/:id
 * Full detail view. If the user is a store_owner, include their store's
 * average rating per the assessment spec.
 */
async function getUserDetails(req, res, next) {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Store, as: 'ownedStore' }]
    });

    if (!user) {
      return error(res, 'User not found', 404);
    }

    let responseData = { user };

    if (user.role === 'store_owner' && user.ownedStore) {
      const ratingStats = await Rating.findOne({
        where: { store_id: user.ownedStore.id },
        attributes: [[fn('AVG', col('rating')), 'averageRating']]
      });
      responseData.averageRating = ratingStats?.get('averageRating') || null;
    }

    return success(res, responseData, 'User details fetched');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getDashboardStats,
  addUser,
  addStore,
  updateStore,
  deleteStore,
  listStores,
  listUsers,
  getUserDetails
};
