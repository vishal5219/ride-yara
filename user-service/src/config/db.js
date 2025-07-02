const { Pool } = require('pg');
require('dotenv').config();

const primaryPool = new Pool({
  host: process.env.DB_HOST_PRIMARY,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
});

const replicaPool = new Pool({
  host: process.env.DB_HOST_REPLICA,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
});

const shard1Pool = new Pool({
  host: process.env.DB_HOST_SHARD1,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
});

const shard2Pool = new Pool({
  host: process.env.DB_HOST_SHARD2,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
});

module.exports = { primaryPool, replicaPool, shard1Pool, shard2Pool }; 