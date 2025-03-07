import '@nomicfoundation/hardhat-toolbox';
import dotenv from 'dotenv';

dotenv.config();

/** @type import('hardhat/config').HardhatUserConfig */
const config = {
  solidity: '0.8.28',
  paths: {
    sources: './contracts', // Path to your contracts
    tests: './test', // Path to your test files
    cache: './cache', // Path to cache directory
    artifacts: './artifacts', // Path to artifacts directory
  },
  networks: {
    scrollSepolia: {
      url: process.env.SEPOLIA_URL,
      accounts: [process.env.PRIVATE_KEY],
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

export default config;
