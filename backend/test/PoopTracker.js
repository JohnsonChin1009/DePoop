const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('PoopTracker', function () {
  let PoopTracker;
  let poopTracker;
  let owner;
  let user;

  beforeEach(async function () {
    // Get the ContractFactory and Signers
    PoopTracker = await ethers.getContractFactory('PoopTracker');
    [owner, user] = await ethers.getSigners();

    // Deploy the contract
    poopTracker = await PoopTracker.deploy();
  });

  it('Should log a new poop event and emit the PoopEventLogged event', async function () {
    // Define test data
    const latitude = 123456789;
    const longitude = -987654321;
    const timestamp = Math.floor(Date.now() / 1000);
    const sessionDuration = 7200;

    // Log a new poop event and expect the event to be emitted
    await expect(
      poopTracker
        .connect(user)
        .logPoopEvent(latitude, longitude, timestamp, sessionDuration)
    )
      .to.emit(poopTracker, 'PoopEventLogged')
      .withArgs(user.address, latitude, longitude, timestamp, sessionDuration);
  });

  it('Should allow multiple poop events for the same user', async function () {
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

    // Log first poop event
    await expect(
      poopTracker
        .connect(user)
        .logPoopEvent(
          events[0].latitude,
          events[0].longitude,
          events[0].timestamp,
          events[0].sessionDuration
        )
    )
      .to.emit(poopTracker, 'PoopEventLogged')
      .withArgs(
        user.address,
        events[0].latitude,
        events[0].longitude,
        events[0].timestamp,
        events[0].sessionDuration
      );

    // Log second poop event
    await expect(
      poopTracker
        .connect(user)
        .logPoopEvent(
          events[1].latitude,
          events[1].longitude,
          events[1].timestamp,
          events[1].sessionDuration
        )
    )
      .to.emit(poopTracker, 'PoopEventLogged')
      .withArgs(
        user.address,
        events[1].latitude,
        events[1].longitude,
        events[1].timestamp,
        events[1].sessionDuration
      );
  });

  it('Should not allow logging events with invalid data', async function () {
    // Define invalid test data (session duration is 0)
    const latitude = 123456789;
    const longitude = -987654321;
    const timestamp = Math.floor(Date.now() / 1000);
    const sessionDuration = 0;

    // Attempt to log an event with invalid data
    await expect(
      poopTracker
        .connect(user)
        .logPoopEvent(latitude, longitude, timestamp, sessionDuration)
    ).to.be.revertedWith('Session duration must be greater than 0');
  });
});
