// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { PauseFacet } from './PauseFacet.sol';

contract DepositFacet {
  event Deposited(address indexed account, uint256 amount);

  mapping(address => uint256) public balances;

  function deposit() public payable {
    require(!PauseFacet(address(this)).paused(), 'Paused');
    balances[msg.sender] += msg.value;
    emit Deposited(msg.sender, msg.value);
  }

  receive() external payable {
    require(!PauseFacet(address(this)).paused(), 'Paused');
    deposit();
  }
}
