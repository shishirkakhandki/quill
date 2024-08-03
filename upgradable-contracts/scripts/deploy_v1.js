require('dotenv').config()
const { ethers, upgrades } = require('hardhat')

async function main() {
  const ownerAddress = process.env.OWNER_ADDRESS
  if (!ownerAddress) {
    throw new Error('OWNER_ADDRESS not set in .env file')
  }

  const MyVulnerableContract = await ethers.getContractFactory(
    'MyVulnerableContractV1'
  )
  const myVulnerableContract = await upgrades.deployProxy(
    MyVulnerableContract,
    [ownerAddress],
    { initializer: 'initialize' }
  )
  await myVulnerableContract.waitForDeployment()

  console.log(
    'MyVulnerableContract deployed to:',
    await myVulnerableContract.getAddress()
  )
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
