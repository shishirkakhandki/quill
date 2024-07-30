// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";

contract MyVulnerableContract is Initializable, UUPSUpgradeable, OwnableUpgradeable, PausableUpgradeable {
    mapping(address => uint256) public balances;

    function initialize(address owner) public initializer {
        __Ownable_init(owner);
        __Pausable_init();
        __UUPSUpgradeable_init();
    }

    function deposit() public payable whenNotPaused {
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint256 _amount) public whenNotPaused {
        require(balances[msg.sender] >= _amount, "Insufficient balance");
        (bool success, ) = msg.sender.call{value: _amount}("");
        require(success, "Transfer failed");
        balances[msg.sender] -= _amount;
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    // Fallback function to accept ETH deposits
    receive() external payable {
        deposit();
    }
}
