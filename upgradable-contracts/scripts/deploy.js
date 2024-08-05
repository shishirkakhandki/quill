async function deployDiamond() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with the account:', deployer.address);

  const DiamondCutFacet = await ethers.getContractFactory('DiamondCutFacet');
  const diamondCutFacet = await DiamondCutFacet.deploy();
  await diamondCutFacet.deployed();
  console.log('DiamondCutFacet deployed:', diamondCutFacet.address);

  const Diamond = await ethers.getContractFactory('Diamond');
  const diamond = await Diamond.deploy(
    deployer.address,
    diamondCutFacet.address
  );
  await diamond.deployed();
  console.log('Diamond deployed:', diamond.address);

  const DiamondInit = await ethers.getContractFactory('DiamondInit');
  const diamondInit = await DiamondInit.deploy();
  await diamondInit.deployed();
  console.log('DiamondInit deployed:', diamondInit.address);

  const facets = [
    'DiamondLoupeFacet',
    'OwnershipFacet',
    'DepositFacet',
    'WithdrawFacet',
    'PauseFacet',
  ];

  const cut = [];

  for (const facetName of facets) {
    const Facet = await ethers.getContractFactory(facetName);
    const facet = await Facet.deploy();
    await facet.deployed();
    console.log(`${facetName} deployed:`, facet.address);

    const selectors = Object.keys(facet.interface.functions)
      .map((func) => facet.interface.getSighash(func))
      .filter(
        (selector) =>
          !cut.some((item) => item.functionSelectors.includes(selector))
      );

    if (selectors.length > 0) {
      cut.push({
        facetAddress: facet.address,
        action: 0,
        functionSelectors: selectors,
      });
    } else {
      console.log(`Skipping duplicate selectors in ${facetName}`);
    }
  }

  const diamondCut = await ethers.getContractAt('IDiamondCut', diamond.address);
  const tx = await diamondCut.diamondCut(
    cut,
    diamondInit.address,
    diamondInit.interface.encodeFunctionData('init')
  );
  console.log('Diamond cut tx:', tx.hash);
  await tx.wait();
  console.log('Diamond cut completed.');
}

deployDiamond()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
