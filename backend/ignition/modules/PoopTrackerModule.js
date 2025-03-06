const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules');

module.exports = buildModule('PoopTrackerModule', (m) => {
  // Deploy the PoopTracker contract
  const poopTracker = m.contract('PoopTracker');

  return { poopTracker };
});
