// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.16;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";

contract SilkCode {

    IERC20 public silk;
    uint nextId;

    // Struct for new help requests including the reward amount, id of the
    // request, creator address, and the address of the helping programmer.
    struct helpRequest {
        uint reward;
        uint id;
        address creator;
        address helper;
    }
    // IdToRequest maps each request id to a helpRequest struct.
    mapping(uint => helpRequest) IdToRequest;

    address publisher;

    // Event that is emitted on succesful creation of a help request.
    event request(address creator, uint id);
       //modifiers
    modifier isOwner() {
        require(publisher == msg.sender);
        _;
     }

    // Require that the caller is the owner of the request with the id, ID
    modifier isCreator(uint ID) {
        require(IdToRequest[ID].creator == msg.sender);
        _;
     }

    // Require the reward of the help request mapped to ID is not null
    modifier isValidId(uint ID) {
        require(IdToRequest[ID].reward > 0);
        _;
     }

    // Require that there is a helper for a request with id, ID
    modifier helperDoesNotExist(uint ID) 
     {
        require(IdToRequest[ID].helper == IdToRequest[ID].creator);
        _;
     }

    constructor() payable {
        silk = IERC20(0x0608C275250E37291026861487C9BA8c8Bb089B1); // Insert token contract address as the argument for the IERC20 function.

        publisher = msg.sender;
        nextId = 0;
    }

    // Function to add eth to the smart contract.
    function addEth() public payable {}

    // Create a help request, send the payout you will be rewarding, to
    // the smart contract, to be stored.
    function makeRequest(uint reward) public {
        require(reward <= getAllowance(), "SilkCode does not have the allowance to pay the reward");
        uint id = nextId;

        IdToRequest[id] = helpRequest(reward, id, msg.sender, msg.sender);

        nextId += 1;
        emit request(msg.sender, id);
    }

    // When a request has been fulfilled, the creator of the request calls this
    // to pay out the reward.
    function payContract(uint requestID) public isValidId(requestID) isCreator(requestID) payable {
        address helper = IdToRequest[requestID].helper;
        address creator = IdToRequest[requestID].creator;

        uint reward = IdToRequest[requestID].reward;

        IdToRequest[requestID].reward = 0;

        silk.transferFrom(creator, helper, reward);
    }

    // A creator can call this function to nullify their help request from the marketplace.
    function withdrawRequest(uint requestID) public isCreator(requestID) payable {
        IdToRequest[requestID].reward = 0;
    }

    // Called by helper when they decide to begin a help request.
    function acceptRequest(uint requestID) public isValidId(requestID) helperDoesNotExist(requestID) {
        IdToRequest[requestID].helper = msg.sender;
    }

    // This function is used for the owner to airdrop a certain amount of SILK to a user.
    function ownerAirdrop(address recipient, uint amount) public isOwner() payable {
        require(amount <= getAllowance(), "SilkCode does not have the allowance to airdrop this amount");

        silk.transferFrom(msg.sender, recipient, amount);
    }

    // View the marketplace's SILK allowance for msg.sender
    function getAllowance() public view returns (uint256) {
        return silk.allowance(msg.sender, address(this));
    }

    // View the SILK balance for msg.sender
    function getBalance() public view returns (uint256) {
        return silk.balanceOf(msg.sender);
    }

    // Retrieve the eth from the contract (For use in testing)
    function retrieveEth() public isOwner payable {
        payable(msg.sender).transfer(address(this).balance);
    }

}