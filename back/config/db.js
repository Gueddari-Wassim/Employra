const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});
pool.connect();
// Test de connexion
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Erreur de connexion à PostgreSQL:', err.stack);
  }
  console.log('Connecté à PostgreSQL');
  release();
});

module.exports = pool;