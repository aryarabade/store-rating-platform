const { Store, Rating, User } = require('../models');
const { success, error } = require('../utils/apiResponse');

async function getStoreRatings(req, res, next) {
  try {
    const { storeId } = req.params;

    const store = await Store.findByPk(storeId);
    if (!store) {
      return error(res, 'Store not found', 404);
    }

    const ratings = await Rating.findAll({
      where: { store_id: storeId },
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
      order: [['created_at', 'DESC']]
    });

    return success(res, { storeId, ratings }, 'Store ratings fetched');
  } catch (err) {
    next(err);
  }
}

async function submitRating(req, res, next) {
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

async function updateRating(req, res, next) {
  return submitRating(req, res, next);
}

module.exports = { getStoreRatings, submitRating, updateRating };
