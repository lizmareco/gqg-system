const { Pool } = require('pg');

const pool = new Pool({
  user: 'ueeotp2fj3iu3eza1x9h',
  host: 'bxeuqkis5akk547ytqer-postgresql.services.clever-cloud.com',
  database: 'bxeuqkis5akk547ytqer',
  password: 'hmCyKP287ZcBDhQWd8CGwPiDgE0lfb',
  port: 5432,
});

module.exports = pool;
