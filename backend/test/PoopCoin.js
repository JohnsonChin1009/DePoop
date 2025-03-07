const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('PoopCoin', function () {
  let PoopCoin, poopCoin, owner, allowedAddress, randomUser;

  beforeEach(async function () {
    [owner, allowedAddress, randomUser] = await ethers.getSigners();

    // Deploy PoopCoin
    PoopCoin = await ethers.getContractFactory('PoopCoin');
    poopCoin = await PoopCoin.deploy(owner.address);
    await poopCoin.waitForDeployment();

    // Set allowed address
    await poopCoin.setAllowedAddress(allowedAddress.address);

    // Mint tokens for owner (so they can transfer)
    await poopCoin.mint(owner.address, ethers.parseEther('100'));

    // Mint some tokens for the allowed address as well
    await poopCoin.mint(allowedAddress.address, ethers.parseEther('50'));
  });

  it('Should allow only owner or allowed address to transfer', async function () {
    // Owner should be able to transfer
    await poopCoin
      .connect(owner)
      .transfer(randomUser.address, ethers.parseEther('10'));
    expect(await poopCoin.balanceOf(randomUser.address)).to.equal(
      ethers.parseEther('10')
    );

    // Allowed address should be able to transfer
    await poopCoin
      .connect(allowedAddress)
      .transfer(owner.address, ethers.parseEther('10'));
    expect(await poopCoin.balanceOf(owner.address)).to.equal(
      ethers.parseEther('100')
    );

    // Random user should NOT be able to transfer
    await expect(
      poopCoin
        .connect(randomUser)
        .transfer(owner.address, ethers.parseEther('5'))
    ).to.be.revertedWith('Only owner or allowed address can transfer tokens');
  });
});
