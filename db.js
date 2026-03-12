const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// --- Connection Test ---
// This prevents the "Ghost Table" issue by confirming exactly which DB we are in.
pool.query('SELECT current_database()', (err, res) => {
    if (err) {
        console.error('❌ DATABASE CONNECTION ERROR:', err.stack);
    } else {
        console.log(`✅ Connected to Database: "${res.rows[0].current_database}"`);
    }
});

module.exports = pool;