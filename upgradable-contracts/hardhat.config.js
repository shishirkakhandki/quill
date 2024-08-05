/* global ethers task */
require('@nomiclabs/hardhat-waffle');
require('@nomicfoundation/hardhat-verify');
require('dotenv').config();

const { PRIVATE_KEY } = process.env;

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: '0.8.20',
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    sepolia: {
      url: 'https://eth-sepolia.g.alchemy.com/v2/z3Y_0eRSiUlVGihV5T1-tZ_Guzqo9qie',
      chainId: 11155111,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    arbitrumSepolia: {
      url: 'https://arbitrum-sepolia.blockpi.network/v1/rpc/public',
      chainId: 421614,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
};
