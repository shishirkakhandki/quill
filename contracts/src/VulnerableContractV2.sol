// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./VulnerableContract.sol";

contract VulnerableContractV2 is VulnerableContract {
    function withdraw(uint256 amount) public override {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        // Fixed reentrancy vulnerability
        balances[msg.sender] -= amount;
        
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
    }
}