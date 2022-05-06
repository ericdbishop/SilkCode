// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.16;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/extensions/ERC20Capped.sol";

contract SILK is ERC20Capped {

    address publisher;

    constructor(uint256 cap, uint256 initialSupply) ERC20("Silk", "SILK") ERC20Capped(cap) public payable {
        require(initialSupply <= cap, "Balance cap exceeded");

        publisher = msg.sender;
        ERC20._mint(msg.sender, initialSupply);
    }

    modifier isOwner() {
        require(publisher == msg.sender);
        _;
    }

    function retrieveEth() public isOwner payable {
        payable(msg.sender).transfer(address(this).balance);
    }
}