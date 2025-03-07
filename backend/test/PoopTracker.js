const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('PoopTracker (Meta-Transactions)', function () {
  let PoopTracker, poopTracker;
  let MinimalForwarder, forwarder;
  let owner, user, relayer;

  beforeEach(async function () {
    // Get contract factories
    MinimalForwarder = await ethers.getContractFactory('MinimalForwarder');
    PoopTracker = await ethers.getContractFactory('PoopTracker');

    // Get signers
    [owner, user, relayer] = await ethers.getSigners();

    // Deploy MinimalForwarder
    forwarder = await MinimalForwarder.deploy();
    await forwarder.deployed();

    // Deploy PoopTracker with the forwarder's address
    poopTracker = await PoopTracker.deploy(forwarder.address);
    await poopTracker.deployed();
  });

  it('Should log a new poop event and emit PoopEventLogged event via meta-transaction', async function () {
    const latitude = 123456789;
    const longitude = -987654321;
    const timestamp = Math.floor(Date.now() / 1000);
    const sessionDuration = 7200;

    // Encode function call
    const data = poopTracker.interface.encodeFunctionData('logPoopEvent', [
      latitude,
      longitude,
      timestamp,
      sessionDuration,
    ]);

    // Create meta-transaction request
    const request = {
      from: user.address,
      to: poopTracker.address,
      value: 0,
      gas: 1_000_000,
      nonce: await forwarder.getNonce(user.address),
      data: data,
    };

    // Sign the request (mock signing for testing)
    const signature = await user.signMessage(ethers.utils.arrayify(ethers.utils.keccak256(data)));

    // Relayer submits the transaction
    await expect(
      forwarder.connect(relayer).execute(request, signature)
    )
      .to.emit(poopTracker, 'PoopEventLogged')
      .withArgs(user.address, latitude, longitude, timestamp, sessionDuration);
  });

  it('Should allow multiple poop events for the same user via meta-transactions', async function () {
    const events = [
      {
        latitude: 123456789,
        longitude: -987654321,
        timestamp: Math.floor(Date.now() / 1000),
        sessionDuration: 7200,
      },
      {
        latitude: 987654321,
        longitude: -123456789,
        timestamp: Math.floor(Date.now() / 1000) + 3600,
        sessionDuration: 3600,
      },
    ];

    for (const event of events) {
      const data = poopTracker.interface.encodeFunctionData('logPoopEvent', [
        event.latitude,
        event.longitude,
        event.timestamp,
        event.sessionDuration,
      ]);

      const request = {
        from: user.address,
        to: poopTracker.address,
        value: 0,
        gas: 1_000_000,
        nonce: await forwarder.getNonce(user.address),
        data: data,
      };

      const signature = await user.signMessage(ethers.utils.arrayify(ethers.utils.keccak256(data)));

      await expect(
        forwarder.connect(relayer).execute(request, signature)
      )
        .to.emit(poopTracker, 'PoopEventLogged')
        .withArgs(
          user.address,
          event.latitude,
          event.longitude,
          event.timestamp,
          event.sessionDuration
        );
    }
  });

  it('Should not allow logging events with invalid data', async function () {
    const latitude = 123456789;
    const longitude = -987654321;
    const timestamp = Math.floor(Date.now() / 1000);
    const sessionDuration = 0;

    const data = poopTracker.interface.encodeFunctionData('logPoopEvent', [
      latitude,
      longitude,
      timestamp,
      sessionDuration,
    ]);

    const request = {
      from: user.address,
      to: poopTracker.address,
      value: 0,
      gas: 1_000_000,
      nonce: await forwarder.getNonce(user.address),
      data: data,
    };

    const signature = await user.signMessage(ethers.utils.arrayify(ethers.utils.keccak256(data)));

    await expect(
      forwarder.connect(relayer).execute(request, signature)
    ).to.be.revertedWith('Session duration must be greater than 0');
  });
});
