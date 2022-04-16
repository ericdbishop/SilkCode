// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.16;
contract SilkCode {
    // Used ballot.sol lecture code as basis for SilkCode.sol

    uint nextId;

    struct helpRequest {
        uint reward;
        uint id;
        address creator;
        address payable helper;
    }
    mapping(uint => helpRequest) IdToRequest;

    address publisher;

       //modifiers

    modifier onlyPublisher()
     {require(msg.sender == publisher);
      _;
     }

    modifier isCreator(uint ID) {
        // require the reward of the help request mapped to ID is not null
        require(IdToRequest[ID].creator == msg.sender);
        _;
     }

    modifier isValidId(uint ID) {
        // require the reward of the help request mapped to ID is not null
        require(IdToRequest[ID].reward > 0);
        _;
     }

    modifier helperDoesNotExist(uint ID) 
     {
        require(IdToRequest[ID].helper == IdToRequest[ID].creator);
        _;
     }

    constructor() {
        publisher = msg.sender;
        nextId = 0;
    }

    // When creating a help request, send the payout you will be rewarding to
    // the smart contract to be stored.
    function makeRequest() public payable returns (uint) {
        uint id = nextId;
        helpRequest memory newRequest;

        newRequest = helpRequest(msg.value, id, msg.sender, payable(msg.sender));
        
        IdToRequest[id] = newRequest;
        nextId += 1;
        return id;
    }

    // When a request has been fulfilled, pay out the reward.
    function payContract(uint requestID) public isValidId(requestID) isCreator(requestID) payable {
        address payable helper = IdToRequest[requestID].helper;
        uint reward = IdToRequest[requestID].reward;

        delete(IdToRequest[requestID]);

        helper.transfer(reward);
    }

    function withdrawRequest(uint requestID) public isCreator(requestID) payable {
        uint reward = IdToRequest[requestID].reward;
        address payable self = payable(msg.sender);

        delete(IdToRequest[requestID]);

        self.transfer(reward);
    }

    // Called by helper when they begin a help request.
    function acceptRequest(uint requestID) public isValidId(requestID) helperDoesNotExist(requestID) {
        IdToRequest[requestID].helper = payable(msg.sender);
    }

}