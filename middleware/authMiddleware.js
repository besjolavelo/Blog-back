
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Token required' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(StatusCodes.FORBIDDEN).json({ message: 'Invalid token' });

    req.user = user; 
    next();
  });
};

module.exports = authenticateToken;
