const { Op, fn, col, literal } = require('sequelize');
const { Store, Rating } = require('../models');
const { success, error } = require('../utils/apiResponse');

/**
 * GET /api/user/stores?name=&address=&sortBy=&order=
 * Lists all stores with overall average rating AND the logged-in
 * user's own submitted rating (if any) for each store.
 */
async function listStoresForUser(req, res, next) {
  try {
    const { name, address, sortBy = 'name', order = 'ASC' } = req.query;
    const userId = req.user.id;

    const where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };

    const allowedSortFields = ['name', 'address'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'name';
    const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const stores = await Store.findAll({
      where,
      order: [[sortField, sortOrder]],
      attributes: {
        include: [
          [fn('AVG', col('ratings.rating')), 'overallRating'],
          // subquery grabs THIS user's own rating for each store
          [
            literal(`(
              SELECT r2.rating FROM ratings r2
              WHERE r2.store_id = Store.id AND r2.user_id = ${userId}
              LIMIT 1
            )`),
            'userRating'
          ]
        ]
      },
      include: [{ model: Rating, as: 'ratings', attributes: [] }],
      group: ['Store.id']
    });

    return success(res, { stores }, 'Stores fetched');
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/user/ratings
 * Body: { storeId, rating }
 * Upserts — creates a new rating, or updates the existing one for
 * this user+store pair. This single endpoint covers both
 * "submit rating" and "modify rating" from the spec.
 */
async function submitOrUpdateRating(req, res, next) {
  try {
    const { storeId, rating } = req.body;
    const userId = req.user.id;

    const store = await Store.findByPk(storeId);
    if (!store) {
      return error(res, 'Store not found', 404);
    }

    const existingRating = await Rating.findOne({
      where: { user_id: userId, store_id: storeId }
    });
    const created = !existingRating;
    const ratingRecord = existingRating || await Rating.create({
      user_id: userId,
      store_id: storeId,
      rating
    });

    if (existingRating) {
      ratingRecord.rating = rating;
      await ratingRecord.save();
    }

    return success(
      res,
      { rating: ratingRecord },
      created ? 'Rating submitted' : 'Rating updated',
      created ? 201 : 200
    );
  } catch (err) {
    next(err);
  }
}

module.exports = { listStoresForUser, submitOrUpdateRating };
