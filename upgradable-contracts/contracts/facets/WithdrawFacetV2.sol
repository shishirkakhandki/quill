// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { PauseFacet } from './PauseFacet.sol';

contract WithdrawFacetV2 {
  event Withdrawn(address indexed account, uint256 amount);

  uint256 public constant VERSION = 2;
  uint256 public withdrawLimit;

  mapping(address => uint256) public balances;

  constructor(uint256 _initialWithdrawLimit) {
    withdrawLimit = _initialWithdrawLimit;
  }

  function withdraw(uint256 _amount) public {
    require(!PauseFacet(address(this)).paused(), 'Paused');
    require(balances[msg.sender] >= _amount, 'Insufficient balance');
    require(_amount <= withdrawLimit, 'Exceeds withdraw limit');
    balances[msg.sender] -= _amount;
    (bool success, ) = msg.sender.call{ value: _amount }('');
    require(success, 'Transfer failed');
    emit Withdrawn(msg.sender, _amount);
  }

  function setWithdrawLimit(uint256 _newLimit) public {
    withdrawLimit = _newLimit;
  }
}
