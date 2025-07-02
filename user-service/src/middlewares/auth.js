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

module.exports = getUserFromToken; 