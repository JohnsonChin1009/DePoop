const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules');

module.exports = buildModule('Groth16Verifier', (m) => {
  // Deploy the PoopTracker contract
  const verifier = m.contract('Groth16Verifier');

  return { verifier };
});
