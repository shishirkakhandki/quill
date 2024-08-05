// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';

contract OwnershipFacet is OwnableUpgradeable {
  function transferOwnership(address newOwner) public override onlyOwner {
    _transferOwnership(newOwner);
  }
}
