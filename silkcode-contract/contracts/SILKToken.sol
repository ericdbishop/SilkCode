
// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.16;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";

contract SILK is ERC20 {
    address publisher;

    constructor(uint256 initialSupply) ERC20("Silk", "SILK") public payable {
        _mint(msg.sender, initialSupply);
        publisher = msg.sender;
    }

    modifier isOwner() {
        require(publisher == msg.sender);
        _;
    }

    function retrieveEth() public isOwner payable {
        payable(msg.sender).transfer(address(this).balance);
    }
}