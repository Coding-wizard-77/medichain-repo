const hre = require("hardhat");

async function main() {
  // Get the contract factory
  const MediChain = await hre.ethers.getContractFactory("MediChain");

  // Deploy the contract
  const mediChain = await MediChain.deploy();

  // Wait for deployment
  await mediChain.deployed();

  console.log(`✅ MediChain deployed to: ${mediChain.address}`);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
