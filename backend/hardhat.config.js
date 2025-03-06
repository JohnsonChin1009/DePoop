require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config(); // Load environment variables from .env

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.19',
  networks: {
    scrollSepolia: {
      url: 'https://sepolia-rpc.scroll.io',
      accounts: `${process.env.PRIVATE_KEY}` ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      scrollSepolia: process.env.SCROLL_API_KEY || '',
    },
    customChains: [
      {
        network: 'scrollSepolia',
        chainId: 534351,
        urls: {
          apiURL: 'https://api-sepolia.scrollscan.com/api',
          browserURL: 'https://sepolia.scrollscan.com/',
        },
      },
    ],
  },
};
