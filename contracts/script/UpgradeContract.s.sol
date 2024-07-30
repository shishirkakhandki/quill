// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/VulnerableContract.sol";
import "../src/VulnerableContractV2.sol";

contract UpgradeContract is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address proxyAddress = vm.envAddress("PROXY_ADDRESS");

        vm.startBroadcast(deployerPrivateKey);

        VulnerableContract proxy = VulnerableContract(proxyAddress);
        VulnerableContractV2 newImplementation = new VulnerableContractV2();

        proxy.upgradeTo(address(newImplementation));

        console.log("Contract upgraded to V2 at:", address(newImplementation));

        vm.stopBroadcast();
    }
}