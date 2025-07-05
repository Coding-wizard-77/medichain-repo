import express from 'express';
import dotenv from 'dotenv';
import uploadRouter from './routes/upload.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use('/upload', uploadRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

process.on('uncaughtException', err => {
  console.error('Uncaught:', err);
});

