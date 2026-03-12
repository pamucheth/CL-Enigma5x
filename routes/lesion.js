const express = require('express');
const router = express.Router();
const pool = require('../db');
const { upload } = require('../uploads');

// We'll pass the middleware from app.js or define it here. 
// For now, let's assume the middleware is passed in app.js.

router.post('/upload-lesion', upload.single('lesion'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        await pool.query(
            'UPDATE users SET lesion_image_url = $1 WHERE id = $2',
            [req.file.path, req.user.userId] // req.user comes from the middleware
        );

        res.json({ message: "Lesion image saved!", path: req.file.path });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;