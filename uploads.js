const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = 'C:\\Users\\Dell\\Desktop\\VisionCL_Storage';

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, 'lesion-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// This allows app.js to see both the 'upload' tool and the 'uploadDir' path
module.exports = { upload, uploadDir };