const { fn, col } = require('sequelize');
const { Store, Rating, User } = require('../models');
const { success, error } = require('../utils/apiResponse');

/**
 * GET /api/store/dashboard
 * Store Owner's dashboard: average rating + list of users who rated their store.
 * Uses req.user.id to find the store this owner is linked to.
 */
async function getOwnerDashboard(req, res, next) {
  try {
    const store = await Store.findOne({ where: { owner_id: req.user.id } });

    if (!store) {
      return error(res, 'No store is linked to this account yet', 404);
    }

    const ratings = await Rating.findAll({
      where: { store_id: store.id },
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
      order: [['created_at', 'DESC']]
    });

    const avgResult = await Rating.findOne({
      where: { store_id: store.id },
      attributes: [[fn('AVG', col('rating')), 'averageRating']]
    });

    const averageRating = avgResult?.get('averageRating')
      ? parseFloat(avgResult.get('averageRating')).toFixed(2)
      : null;

    return success(res, {
      store: { id: store.id, name: store.name, email: store.email, address: store.address },
      averageRating,
      totalRatings: ratings.length,
      raters: ratings.map((r) => ({
        userId: r.user.id,
        name: r.user.name,
        email: r.user.email,
        rating: r.rating,
        ratedAt: r.created_at
      }))
    }, 'Store owner dashboard fetched');
  } catch (err) {
    next(err);
  }
}

module.exports = { getOwnerDashboard };
