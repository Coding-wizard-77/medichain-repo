import express from 'express';
import multer from 'multer';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { File } from 'web3.storage';
import { create as createClient } from '@web3-storage/w3up-client';

dotenv.config();

const app = express();
const upload = multer({ dest: 'uploads/' });
const PORT = 5000;

// ✅ Async setup at top level
const client = await createClient();
await client.login(process.env.WEB3_STORAGE_EMAIL);
await client.setCurrentSpace(process.env.WEB3_STORAGE_SPACE_DID);

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const content = fs.readFileSync(req.file.path);
    const file = new File([content], req.file.originalname);

    const cid = await client.uploadFile(file);
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      cid: cid.toString(),
      ipfsLink: `https://w3s.link/ipfs/${cid}`
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ success: false, error: 'Upload failed' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
