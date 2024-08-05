const { ethers } = require('hardhat');

async function upgradeWithdrawFacet() {
  const [deployer] = await ethers.getSigners();
  console.log('Upgrading WithdrawFacet with the account:', deployer.address);

  const initialWithdrawLimit = ethers.utils.parseEther('1'); // 1 ETH limit
  const WithdrawFacetV2 = await ethers.getContractFactory('WithdrawFacetV2');
  const withdrawFacetV2 = await WithdrawFacetV2.deploy(initialWithdrawLimit);
  await withdrawFacetV2.deployed();
  console.log('WithdrawFacetV2 deployed:', withdrawFacetV2.address);

  const diamondAddress = 'YOUR_PROXY_ADDRESS';
  const diamondCut = await ethers.getContractAt('IDiamondCut', diamondAddress);
  const diamondLoupe = await ethers.getContractAt(
    'IDiamondLoupe',
    diamondAddress
  );

  const withdrawFacetSelectors = [
    withdrawFacetV2.interface.getSighash('withdraw'),
    withdrawFacetV2.interface.getSighash('setWithdrawLimit'),
    withdrawFacetV2.interface.getSighash('VERSION'),
    withdrawFacetV2.interface.getSighash('withdrawLimit'),
  ];

  const cut = [];
  for (const selector of withdrawFacetSelectors) {
    const facet = await diamondLoupe.facetAddress(selector);
    if (facet === ethers.constants.AddressZero) {
      cut.push({
        facetAddress: withdrawFacetV2.address,
        action: 0,
        functionSelectors: [selector],
      });
    } else {
      cut.push({
        facetAddress: withdrawFacetV2.address,
        action: 1,
        functionSelectors: [selector],
      });
    }
  }

  const initFunctionCall = withdrawFacetV2.interface.encodeFunctionData(
    'setWithdrawLimit',
    [initialWithdrawLimit]
  );

  const tx = await diamondCut.diamondCut(
    cut,
    withdrawFacetV2.address,
    initFunctionCall
  );
  await tx.wait();
  console.log('Upgrade transaction completed:', tx.hash);

  const diamond = await ethers.getContractAt('WithdrawFacetV2', diamondAddress);

  const version = await diamond.VERSION();
  console.log('WithdrawFacet version:', version.toString());
  if (version.toString() === '2') {
    console.log('Version verification successful');
  } else {
    console.error('Version verification failed');
  }

  const withdrawLimit = await diamond.withdrawLimit();
  console.log(
    'Withdraw limit:',
    ethers.utils.formatEther(withdrawLimit),
    'ETH'
  );
  if (withdrawLimit.eq(initialWithdrawLimit)) {
    console.log('Withdraw limit verification successful');
  } else {
    console.error('Withdraw limit verification failed');
  }
}

upgradeWithdrawFacet()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
