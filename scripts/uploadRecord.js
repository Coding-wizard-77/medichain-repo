const hre = require("hardhat");

async function main() {
  const [uploader] = await hre.ethers.getSigners();

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; //✅ MediChain deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
  const MediChain = await hre.ethers.getContractFactory("MediChain");
  const mediChain = await MediChain.attach(contractAddress);

  const cid = "QmTWKazfJKkNaCHgGDutMkXkEXW5YatA93v88PCanBCFna";

  const tx = await mediChain.connect(uploader).uploadRecord(cid);
  await tx.wait();

  console.log("✅ CID uploaded to blockchain successfully!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
