require('dotenv').config()
const { ethers, upgrades } = require('hardhat')

async function main() {
  const proxyAddress = process.env.PROXY_ADDRESS
  if (!proxyAddress) {
    throw new Error('PROXY_ADDRESS not set in .env file')
  }

  const MyVulnerableContractV2 = await ethers.getContractFactory(
    'MyVulnerableContractV2'
  )

  console.log('Upgrading to V2...')
  const upgraded = await upgrades.upgradeProxy(
    proxyAddress,
    MyVulnerableContractV2
  )

  await upgraded.waitForDeployment()

  console.log('Upgrade complete. V2 address:', await upgraded.getAddress())

  // Initialize V2-specific state
  const withdrawalLimit = ethers.parseEther('1') // Set initial withdrawal limit to 1 ETH
  await upgraded.initializeV2(withdrawalLimit)
  console.log(
    'V2 initialized with withdrawal limit:',
    ethers.formatEther(withdrawalLimit),
    'ETH'
  )

  // Verify upgrade
  const newImplementationAddress =
    await upgrades.erc1967.getImplementationAddress(proxyAddress)
  console.log('New implementation address:', newImplementationAddress)

  const withdrawalLimitAfterUpgrade = await upgraded.withdrawalLimit()
  console.log(
    'Withdrawal limit after upgrade:',
    ethers.formatEther(withdrawalLimitAfterUpgrade),
    'ETH'
  )
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
