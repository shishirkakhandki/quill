const { ethers, upgrades } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const MyVulnerableContract = await ethers.getContractFactory("MyVulnerableContract");

    try {
        const instance = await upgrades.deployProxy(MyVulnerableContract, [deployer.address], { initializer: 'initialize' });
        
        // Log the instance object to inspect what's returned
        console.log("Deployment instance:", instance);

        if (!instance || !instance.deployTransaction) {
            throw new Error('Deployment failed or did not return expected result');
        }

        await instance.deployTransaction.wait();
        console.log("Contract Deployed Address:", instance.address);
    } catch (error) {
        console.error("Error deploying MyVulnerableContract:", error);
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
