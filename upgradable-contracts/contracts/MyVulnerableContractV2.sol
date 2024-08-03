// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "./MyVulnerableContractV1.sol";

contract MyVulnerableContractV2 is MyVulnerableContractV1 {
    uint256 public withdrawalLimit;

    event WithdrawalLimitSet(uint256 newLimit);

    function initializeV2(uint256 _withdrawalLimit) public reinitializer(2) {
        withdrawalLimit = _withdrawalLimit;
        emit WithdrawalLimitSet(_withdrawalLimit);
    }

    function withdraw(uint256 amount) override external whenNotPaused {
        // Checks
        require(_balances[msg.sender] >= amount, "Insufficient balance");

        // Effects
        _balances[msg.sender] -= amount;

        // Interactions (fixed the vulnerability)
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
          
        emit Withdrawal(msg.sender, amount);
    }
}