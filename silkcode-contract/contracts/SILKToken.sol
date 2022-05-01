
// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.16;

import "../../silkcode-app/node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../../silkcode-app/node_modules/@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";

contract SILK is ERC20 {
    constructor(uint256 initialSupply) ERC20Detailed("Silk", "SILK", 18) public {
        _mint(msg.sender, initialSupply);
    }
}