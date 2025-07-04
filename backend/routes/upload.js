const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { uploadToWeb3Storage } = require('../upload-to-web3.js');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), async (req, res) => {
if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

try {
const fileUrl = await uploadToWeb3Storage(req.file.path, req.file.originalname);
res.status(200).json({ message: 'File uploaded to web3.storage', url: fileUrl });
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Upload failed' });
}
});

module.exports = router;