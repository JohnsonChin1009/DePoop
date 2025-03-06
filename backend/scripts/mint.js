const { ethers } = require("hardhat");

async function main() {
  const nftAddress = "0xb21786eEF712B804eCE861523a2e2BA78b1417C3";
  const AchievementNFT = await ethers.getContractAt("AchievementNFT", nftAddress);

  const recipient = "0x29157373bDd2D176E11227051aa6B0934C0b913d"; // Replace with target wallet address
  const tokenURI = "ipfs://bafkreihmtc7szrvjqvyu4i764kpqqakm3tf4nzkkoduq465te323fiwsdq"; // IPFS link to metadata

  const tx = await AchievementNFT.mintAchievement(recipient, tokenURI);
  await tx.wait();

  console.log(`Achievement NFT minted to: ${recipient}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
