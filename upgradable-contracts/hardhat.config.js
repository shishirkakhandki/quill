// hardhat.config.js
require("@nomiclabs/hardhat-waffle");
require("@openzeppelin/hardhat-upgrades");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

const { PRIVATE_KEY } = process.env;

module.exports = {
    solidity: "0.8.20",
    networks: {
        hardhat: {
            chainId: 1337,
        },
        sepolia: {
            url: "https://eth-sepolia.api.onfinality.io/public",
            chainId: 11155111,
            accounts: [`0x${PRIVATE_KEY}`],
        },
    },
};
