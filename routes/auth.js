const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db'); 

// Load secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * 1. REGISTER ROUTE
 */
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
            [name, email, hashedPassword]
        );
        res.status(201).json({ message: "User registered successfuly!" });
    } catch (err) {
        console.error("❌ REGISTER ERROR:", err.message);
        res.status(500).json({ error: "Registration failed: " + err.message });
    }
});

/**
 * 2. LOGIN ROUTE
 */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { userId: user.id, email: user.email }, 
            JWT_SECRET, 
            { expiresIn: '24h' } 
        );

        // Matches the Flutter requirement: { "token": "..." }
        res.json({ token });

    } catch (err) {
        console.error("❌ LOGIN ERROR:", err.message); 
        res.status(500).json({ error: "Login failed: " + err.message });
    }
});

/**
 * 3. AUTHENTICATION MIDDLEWARE
 * This protects routes in medical.js and app.js
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Access denied. Token missing." });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Invalid or expired token." });
        }
        req.user = user;
        next();
    });
};

// --- EXPORTS ---
// Export the router as the default and the middleware as a named export
module.exports = router;
module.exports.authenticateToken = authenticateToken;