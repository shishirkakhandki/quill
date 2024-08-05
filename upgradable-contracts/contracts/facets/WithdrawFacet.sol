// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { PauseFacet } from './PauseFacet.sol';

contract WithdrawFacet {
  event Withdrawn(address indexed account, uint256 amount);

  mapping(address => uint256) public balances;

  function withdraw(uint256 _amount) public {
    require(!PauseFacet(address(this)).paused(), 'Paused');
    require(balances[msg.sender] >= _amount, 'Insufficient balance');
    // Intentionally vulnerable. Not following CEI
    (bool success, ) = msg.sender.call{ value: _amount }('');
    require(success, 'Transfer failed');
    balances[msg.sender] -= _amount;
    emit Withdrawn(msg.sender, _amount);
  }
}
