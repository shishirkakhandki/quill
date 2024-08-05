// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { LibDiamond } from '../libraries/LibDiamond.sol';

contract PauseFacet {
  event Paused(address account);
  event Unpaused(address account);

  bytes32 constant PAUSE_STORAGE_POSITION =
    keccak256('diamond.standard.pause.storage');

  struct PauseStorage {
    bool paused;
  }

  function pauseStorage() internal pure returns (PauseStorage storage ps) {
    bytes32 position = PAUSE_STORAGE_POSITION;
    assembly {
      ps.slot := position
    }
  }

  function pause() external {
    LibDiamond.enforceIsContractOwner();
    PauseStorage storage ps = pauseStorage();
    require(!ps.paused, 'PauseFacet: already paused');
    ps.paused = true;
    emit Paused(msg.sender);
  }

  function unpause() external {
    LibDiamond.enforceIsContractOwner();
    PauseStorage storage ps = pauseStorage();
    require(ps.paused, 'PauseFacet: not paused');
    ps.paused = false;
    emit Unpaused(msg.sender);
  }

  function paused() public view returns (bool) {
    return pauseStorage().paused;
  }
}
