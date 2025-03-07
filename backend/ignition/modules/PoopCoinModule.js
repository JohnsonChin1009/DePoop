const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules');

module.exports = buildModule('PoopCoinModule', (m) => {
  const address = '0xC39fC5481845947C677da2E2d70e14866e96a42f';
  const verifier = m.contract('PoopCoin', [address]);

  return { verifier };
});
