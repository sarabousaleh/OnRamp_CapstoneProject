// backend/db.js
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    password: 'P123S321',
    host: 'localhost',
    port: 5432,
    database: 'Bloom'
});

module.exports = pool;
