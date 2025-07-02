const prisma = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const queries = require('./queries/index');
const mutations = require('./mutations/index');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

const resolvers = {
  Query: queries,
  Mutation: mutations,
};

module.exports = resolvers; 