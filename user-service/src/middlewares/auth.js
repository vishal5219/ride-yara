const jwt = require('jsonwebtoken');
const prisma = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

async function getUserFromToken(token) {
  try {
    if (!token) return null;
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) return null;
    return { id: user.id, role: user.role };
  } catch (err) {
    return null;
  }
}

// Express middleware for JWT validation
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

module.exports = { getUserFromToken, authenticateToken }; 