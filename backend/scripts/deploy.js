const { ethers } = require("hardhat");

async function main() {
  const AchievementNFT = await ethers.getContractFactory("AchievementNFT");
  const nft = await AchievementNFT.deploy();

  await nft.waitForDeployment(); // Use waitForDeployment() instead of deployed()

  console.log(`AchievementNFT deployed to: ${nft.target}`); // Use nft.target to get address
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
