const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { signToken } = require('../utils/jwt');
const { success, error } = require('../utils/apiResponse');
const { hashPassword } = require('../utils/hashPassword');

/**
 * POST /api/auth/signup
 * Public — Normal Users only. Admins/store owners are created by an Admin.
 */
async function signup(req, res, next) {
  try {
    const { name, email, address, password } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return error(res, 'An account with this email already exists', 409);
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      name,
      email,
      address,
      password: hashedPassword,
      role: 'user'
    });

    const token = signToken({ id: user.id, role: user.role });

    return success(res, {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    }, 'Signup successful', 201);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/login
 * Public — works for all 3 roles; role comes back in the token/response
 * so the frontend knows which dashboard to route to.
 */
async function login(req, res, next) {
  try {
    const { email, password, selectedRole } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return error(res, 'Invalid email or password', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return error(res, 'Invalid email or password', 401);
    }

    if (user.role !== selectedRole) {
      const labels = { user: 'Normal User', store_owner: 'Store Owner', admin: 'Administrator' };
      return error(res, `Invalid role selection. This account is registered as ${labels[user.role]}.`, 403);
    }

    const token = signToken({ id: user.id, role: user.role });

    return success(res, {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    }, 'Login successful');
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/auth/update-password
 * Protected — any logged-in user (all 3 roles) can update their own password.
 */
async function updatePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findByPk(req.user.id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return error(res, 'Current password is incorrect', 401);
    }

    user.password = await hashPassword(newPassword);
    await user.save();

    return success(res, {}, 'Password updated successfully');
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/auth/me
 * Protected — returns the currently logged-in user's profile.
 * Useful for the frontend to restore session on page refresh.
 */
async function getMe(req, res, next) {
  try {
    return success(res, { user: req.user }, 'Current user fetched');
  } catch (err) {
    next(err);
  }
}

module.exports = { signup, login, updatePassword, getMe };
