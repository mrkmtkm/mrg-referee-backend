const jwt = require('jsonwebtoken');

module.exports = function authenticate(req, res, next) {
  try {
    const bearToken = req.headers['authorization'];
    const bearer = bearToken.split(' ');
    const token = bearer[1];

    const decoded = jwt.verify(token, 'secret');
    req.jwtPayload = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: 'Not authenticated',
    });
  }
};
