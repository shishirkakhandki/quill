// scripts/deploy.js
const { ethers, upgrades } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const MyVulnerableContract = await ethers.getContractFactory("MyVulnerableContract");

    try {
        // Deploy the contract using upgradeable proxy
        const instance = await upgrades.deployProxy(MyVulnerableContract, [deployer.address], { initializer: 'initialize' });

        // Log contract details
        console.log("Contract Deployed Address:", instance.address);
    } catch (error) {
        console.error("Error deploying MyVulnerableContract:", error);
    }
}

// Run the main function and handle any errors
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
