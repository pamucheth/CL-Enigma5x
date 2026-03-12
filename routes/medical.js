const express = require('express');
const router = express.Router();
const pool = require('../db');

// Correctly pull the function from the auth exports
const { authenticateToken } = require('./auth');

// --- HELPER: Extracts filename and builds a clean Public URL ---
const getFullUrl = (req, filePath) => {
    if (!filePath) return null;
    
    try {
        // Extracts 'lesion-123.jpg' from any path (Windows or Linux)
        const fileName = filePath.split(/[\\/]/).pop(); 
        
        const protocol = req.headers['x-forwarded-proto'] || req.protocol;
        const host = req.get('host');
        
        // Returns: https://your-ngrok-url/uploads/lesion-123.jpg
        return `${protocol}://${host}/uploads/${fileName}`;
    } catch (err) {
        return null;
    }
};

/**
 * GET HISTORY (GET /api/medical/history)
 */
router.get('/history', authenticateToken, async (req, res) => {
    try {
        // Fallback check for different JWT payload structures
        const userId = req.user.userId || req.user.id;

        if (!userId) {
            console.error("❌ Auth Error: No valid User ID found in token payload");
            return res.status(401).json({ error: "Unauthorized: User ID missing" });
        }

        const query = `
            SELECT 
                m.id AS record_id, 
                m.diagnosis, 
                m.symptoms, 
                i.file_path, 
                m.created_at
            FROM medical_records m
            JOIN images i ON m.image_id = i.id
            WHERE m.user_id = $1
            ORDER BY m.created_at DESC;
        `;
        
        const result = await pool.query(query, [userId]);

        const formattedData = result.rows.map(row => ({
            record_id: row.record_id,
            diagnosis: row.diagnosis,
            symptoms: row.symptoms,
            file_path: getFullUrl(req, row.file_path),
            created_at: row.created_at // Sending raw ISO string for Flutter compatibility
        }));

        res.status(200).json({ data: formattedData });

    } catch (err) {
        console.error("❌ DATABASE/SERVER ERROR:", err.message);
        res.status(500).json({ 
            error: "Internal Server Error", 
            message: err.message 
        });
    }
});

module.exports = router;