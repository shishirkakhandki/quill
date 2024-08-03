import { expect } from 'chai';
import hre from 'hardhat';

describe("MyVulnerableContract", function () {
  let MyVulnerableContractV1;
  let MyVulnerableContractV2;
  let contract;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    const { ethers, upgrades } = hre;
    [owner, addr1, addr2] = await ethers.getSigners();

    MyVulnerableContractV1 = await ethers.getContractFactory("MyVulnerableContractV1");
    contract = await upgrades.deployProxy(MyVulnerableContractV1, [await owner.getAddress()], { initializer: 'initialize' });
  });

  describe("V1", function () {
    it("Should set the right owner", async function () {
      expect(await contract.owner()).to.equal(await owner.getAddress());
    });

    it("Should allow deposits", async function () {
      const { ethers } = hre;
      await contract.connect(addr1).deposit({ value: ethers.parseEther("1") });
      expect(await contract.getBalance(await addr1.getAddress())).to.equal(ethers.parseEther("1"));
    });

    it("Should allow withdrawals", async function () {
      const { ethers } = hre;
      await contract.connect(addr1).deposit({ value: ethers.parseEther("1") });
      await contract.connect(addr1).withdraw(ethers.parseEther("0.5"));
      expect(await contract.getBalance(await addr1.getAddress())).to.equal(ethers.parseEther("0.5"));
    });
  });

  describe("V2", function () {
    beforeEach(async function () {
      const { ethers, upgrades } = hre;
      MyVulnerableContractV2 = await ethers.getContractFactory("MyVulnerableContractV2");
      contract = await upgrades.upgradeProxy(await contract.getAddress(), MyVulnerableContractV2);
      await contract.initializeV2(ethers.parseEther("1"));
    });

    it("Should set withdrawal limit", async function () {
      const { ethers } = hre;
      expect(await contract.withdrawalLimit()).to.equal(ethers.parseEther("1"));
    });

    it("Should allow withdrawals up to the limit", async function () {
      const { ethers } = hre;
      await contract.connect(addr1).deposit({ value: ethers.parseEther("2") });
      await contract.connect(addr1).withdraw(ethers.parseEther("1"));
      expect(await contract.getBalance(await addr1.getAddress())).to.equal(ethers.parseEther("1"));
    });
  });
});