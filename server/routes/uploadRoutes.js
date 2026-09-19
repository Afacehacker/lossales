const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');

router.post('/', upload.any(), (req, res) => {
    if (req.files && req.files.length > 0) {
        if (req.files.length === 1) {
            res.send(req.files[0].path); // Return single string for backward compatibility
        } else {
            const paths = req.files.map(file => file.path);
            res.json(paths); // Return array of URLs
        }
    } else {
        res.status(400).json({ message: 'No files uploaded' });
    }
});

module.exports = router;
