// import { expect } from 'chai';
// import pkg from 'hardhat';
// const { ethers } = pkg;

// async function deployDiamond() {
//   const [deployer] = await ethers.getSigners();

//   // Deploy DiamondCutFacet
//   const DiamondCutFacet = await ethers.getContractFactory('DiamondCutFacet');
//   const diamondCutFacet = await DiamondCutFacet.deploy();
//   await diamondCutFacet.deployed();

//   // Deploy Diamond
//   const Diamond = await ethers.getContractFactory('Diamond');
//   const diamond = await Diamond.deploy(deployer.address, diamondCutFacet.address);
//   await diamond.deployed();

//   // Deploy DiamondInit
//   const DiamondInit = await ethers.getContractFactory('DiamondInit');
//   const diamondInit = await DiamondInit.deploy();
//   await diamondInit.deployed();

//   // Deploy and add facets
//   const FacetNames = [
//     'DiamondLoupeFacet',
//     'DepositFacet',
//     'WithdrawFacet',
//     'PauseFacet',
//   ];
//   const cut = [];
//   const usedSelectors = new Set();

//   for (const FacetName of FacetNames) {
//     const Facet = await ethers.getContractFactory(FacetName);
//     const facet = await Facet.deploy();
//     await facet.deployed();

//     console.log(`Deployed ${FacetName}`);

//     const selectors = getSelectors(facet, usedSelectors);
//     console.log(`${FacetName} selectors:`, selectors);

//     if (selectors.length > 0) {
//       cut.push({
//         facetAddress: facet.address,
//         action: 0, // Add
//         functionSelectors: selectors
//       });
//     }
//   }

//   console.log('Final cut:', cut);

//   // Perform the diamond cut
//   const diamondCut = await ethers.getContractAt('IDiamondCut', diamond.address);
//   const tx = await diamondCut.diamondCut(
//     cut,
//     diamondInit.address,
//     diamondInit.interface.encodeFunctionData('init')
//   );
//   await tx.wait();

//   return diamond;
// }

// function getSelectors(contract, usedSelectors) {
//   const signatures = Object.keys(contract.interface.functions);
//   const selectors = signatures.reduce((acc, val) => {
//     if (val !== 'init(bytes)') {
//       const selector = contract.interface.getSighash(val);
//       if (!usedSelectors.has(selector)) {
//         usedSelectors.add(selector);
//         acc.push(selector);
//       } else {
//         console.log(`Duplicate selector found: ${val} (${selector})`);
//       }
//     }
//     return acc;
//   }, []);
//   return selectors;
// }

// describe('Diamond Proxy', function () {
//   let deployer, otherAccount;
//   let diamond, depositFacet, withdrawFacet, pauseFacet;

//   before(async function () {
//     [deployer, otherAccount] = await ethers.getSigners();
//   });

//   beforeEach(async function () {
//     // Deploy the diamond and facets
//     diamond = await deployDiamond();

//     // Get contract instances
//     depositFacet = await ethers.getContractAt('DepositFacet', diamond.address);
//     withdrawFacet = await ethers.getContractAt('WithdrawFacet', diamond.address);
//     pauseFacet = await ethers.getContractAt('PauseFacet', diamond.address);
//   });

//   it('should deposit ETH', async function () {
//     const depositAmount = ethers.utils.parseEther('1.0');
//     await depositFacet.deposit({ value: depositAmount });

//     const balance = await depositFacet.balances(deployer.address);
//     expect(balance).to.equal(depositAmount);
//   });

//   it('should pause and unpause the contract', async function () {
//     await pauseFacet.pause();
//     expect(await pauseFacet.paused()).to.be.true;

//     await pauseFacet.unpause();
//     expect(await pauseFacet.paused()).to.be.false;
//   });

//   it('should not allow deposit when paused', async function () {
//     await pauseFacet.pause();
//     const depositAmount = ethers.utils.parseEther('1.0');
//     await expect(depositFacet.deposit({ value: depositAmount }))
//       .to.be.revertedWith('Paused');
//     await pauseFacet.unpause();
//   });

//   // Skipping this test as requested
//   it.skip('should withdraw ETH', async function () {
//     const depositAmount = ethers.utils.parseEther('1.0');
//     await depositFacet.deposit({ value: depositAmount });

//     const initialBalance = await ethers.provider.getBalance(deployer.address);
//     const tx = await withdrawFacet.withdraw(depositAmount);
//     const receipt = await tx.wait();
//     const gasCost = receipt.gasUsed.mul(tx.gasPrice);

//     const finalBalance = await ethers.provider.getBalance(deployer.address);
//     expect(finalBalance).to.be.closeTo(initialBalance.add(depositAmount).sub(gasCost), ethers.utils.parseEther('0.0001'));
//   });

//   it('should not allow withdraw when paused', async function () {
//     const depositAmount = ethers.utils.parseEther('1.0');
//     await depositFacet.deposit({ value: depositAmount });

//     await pauseFacet.pause();
//     await expect(withdrawFacet.withdraw(depositAmount))
//       .to.be.revertedWith('Paused');
//     await pauseFacet.unpause();
//   });
// });