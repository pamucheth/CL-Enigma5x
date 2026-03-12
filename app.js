require('dotenv').config(); 

const requiredEnv = ['JWT_SECRET', 'DB_PASSWORD', 'DB_USER'];
requiredEnv.forEach((key) => {
    if (!process.env[key]) {
        console.error(`❌ MISSING CRITICAL ERROR: ${key} is not defined in .env`);
        process.exit(1); 
    }
});

const express = require('express');
const cors = require('cors');
const path = require('path');

// Route Imports
const authRoutes = require('./routes/auth');
const medicalRoutes = require('./routes/medical');

const app = express();

app.use(cors());
app.use(express.json());

// Serve the uploads folder so images are viewable via URL
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', authRoutes); 
// Security is handled inside medicalRoutes using the imported middleware
app.use('/api/medical', medicalRoutes);

// Homepage Route
app.get('/', (req, res) => {
    res.send('<h1>VisionCL API is Online</h1>');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 VisionCL API Running on http://localhost:${PORT}`);
});