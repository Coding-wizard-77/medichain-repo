require("dotenv").config();
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

async function uploadToPinata(filePath) {
  console.log("⏳ Uploading file:", filePath);

  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  const data = new FormData();

  try {
    data.append("file", fs.createReadStream(filePath));
  } catch (err) {
    console.error("❌ File read error:", err);
    throw err;
  }

  try {
    const res = await axios.post(url, data, {
      maxContentLength: Infinity,
      headers: {
        ...data.getHeaders(),
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
      },
    });

    console.log("✅ File uploaded to Pinata:", res.data);
    return res.data.IpfsHash;
  } catch (err) {
    console.error("❌ Pinata API error:", err.response?.data || err.message);
    throw err;
  }
}

module.exports = { uploadToPinata };
