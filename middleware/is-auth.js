const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    return next(error);
  }
  const token = authHeader.split(' ')[1]; // Authorization: Bearer <token>
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, 'somesupersecretsecret');
  } catch (err) {
    err.statusCode = 500;
    return next(err);
  }
  if (!decodedToken) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    return next(error);
  }
  req.userId = decodedToken.userId;

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      return next(error);
    }
    req.user = user;
    next();
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};