// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.16;

import "../../silkcode-app/node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SilkCode {

    IERC20 silk;
    uint nextId;

    // Struct for new help requests including the reward amount, id of the
    // request, creator address, and the address of the helping programmer.
    struct helpRequest {
        uint reward;
        uint id;
        address creator;
        address payable helper;
    }
    // IdToRequest maps each request id to a helpRequest struct.
    mapping(uint => helpRequest) IdToRequest;

    address publisher;

    // Event that is emitted on succesful creation of a help request.
    event request(address creator, uint id);
       //modifiers

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
        silk = IERC20();

        publisher = msg.sender;
        nextId = 0;
    }

    // Function to add eth to the smart contract.
    function addEth() public payable {}

    // Create a help request, send the payout you will be rewarding, to
    // the smart contract, to be stored.
    function makeRequest(uint reward) public payable {
        uint id = nextId;

        require(reward < getBalance(), "SILK balance is too low");

        IdToRequest[id] = helpRequest(msg.value, id, msg.sender, payable(msg.sender));

        silk.transfer(address(this), reward);

        nextId += 1;
        emit request(msg.sender, id);
    }

    // When a request has been fulfilled, the creator of the request calls this
    // to pay out the reward.
    function payContract(uint requestID) public isValidId(requestID) isCreator(requestID) payable {
        address payable helper = IdToRequest[requestID].helper;
        uint reward = IdToRequest[requestID].reward;
        assert(reward < contractBalance());

        IdToRequest[requestID].reward = 0;

        silk.transferFrom(address(this), helper, reward);
        //helper.transfer(reward);
    }

    // A creator can call this function to nullify their help request from the marketplace.
    function withdrawRequest(uint requestID) public isCreator(requestID) payable {
        uint reward = IdToRequest[requestID].reward;
        address payable creator = payable(msg.sender);
        assert(reward < contractBalance());

        IdToRequest[requestID].reward = 0;

        silk.transferFrom(address(this), creator, reward);
        //creator.transfer(reward);
    }

    // Called by helper when they decide to begin a help request.
    function acceptRequest(uint requestID) public isValidId(requestID) helperDoesNotExist(requestID) {
        IdToRequest[requestID].helper = payable(msg.sender);
    }

    function getAllowance() public view returns (uint256) {
        return silk.allowance(msg.sender, address(this));
    }

    function getBalance() public view returns (uint256) {
        return silk.balanceOf(msg.sender);
    }

    function contractBalance() public view returns (uint256) {
        return silk.balanceOf(address(this));
    }

}