const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { uploadToPinata } = require('../uploadToPinata');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    const cid = await uploadToPinata(req.file.path);

    // Optional: delete the temporary uploaded file
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      message: 'File uploaded to IPFS via Pinata',
      cid,
      ipfsUrl: `https://gateway.pinata.cloud/ipfs/${cid}`
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

module.exports = router;
