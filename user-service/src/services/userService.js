const prisma = require('../models');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/token');

class UserService {
  async register(data) {
    const { name, email, password, role, phone } = data;
    // Check if user exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new Error('Email already registered');
    // Hash password
    const hashed = await bcrypt.hash(password, 10);
    // Create user
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role, phone }
    });
    // Return user without password
    const { password: _, ...userData } = user;
    return userData;
  }
  async login({ email, password }) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Invalid credentials');
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Invalid credentials');
    // Generate JWT
    const token = generateToken({ id: user.id, role: user.role });
    const { password: _, ...userData } = user;
    return { user: userData, token };
  }
  async getProfile(userId) {
    // TODO: Get user profile from DB/Redis
  }
  async updateProfile(userId, data) {
    // TODO: Update profile, publish Kafka event, update Redis
  }
  async getHistory(userId) {
    // TODO: Get user ride history
  }
  async getRatings(userId) {
    // TODO: Get user ratings
  }
}

module.exports = new UserService(); 