// hardhat.config.js
require('@nomiclabs/hardhat-waffle')
require('@openzeppelin/hardhat-upgrades')
require('@nomiclabs/hardhat-ethers')
require('dotenv').config()

const { PRIVATE_KEY } = process.env

module.exports = {
  solidity: '0.8.20',
  networks: {
    hardhat: {
      chainId: 1337,
    },
    amoy: {
      url: 'https://rpc-amoy.polygon.technology/',
      chainId: 80002,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    arbitrumSepolia: {
      url: 'https://arbitrum-sepolia.blockpi.network/v1/rpc/public',
      chainId: 421614,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
}
