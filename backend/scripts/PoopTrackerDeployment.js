const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules');

module.exports = buildModule('PoopTrackerModule', (m) => {
  // Deploy the PoopTracker contract
  const veriferAddress = "0x32bc1e753ebF0D3e922882Be2C5c6E77b367fAAe";

  const poopTracker = m.contract('PoopTracker', [veriferAddress]);

  return { poopTracker };
});