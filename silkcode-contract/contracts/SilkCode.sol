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


    uint numUsers;
    address[] user;


       //modifiers

    modifier onlyPublisher()
     {require(msg.sender == publisher);
      _;
     }

    //modifier isNotUser() {
        //require(addressToUser[msg.sender].nextId > 0);
        //_;
     //}

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
        //voters[chairperson].weight = 2; // weight 2 for testing purposes
        ////proposals.length = numProposals; -- before 0.6.0
        //for (uint prop = 0; prop < numProposals; prop ++)
            //proposals.push(Proposal(0));

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
    function payContract(uint requestID) public isValidId(requestID) payable returns (uint) {
        address payable helper = IdToRequest[requestID].helper;
        uint reward = IdToRequest[requestID].reward;

        delete(IdToRequest[requestID]);

        helper.transfer(reward);
        return requestID;
    }

    function withdrawRequest(uint requestID) public payable {
        uint reward = IdToRequest[requestID].reward;
        address payable self = payable(msg.sender);

        self.transfer(reward);
    }

    // Called by helper when they begin a help request.
    function acceptRequest(uint requestID) public helperDoesNotExist(requestID) {
        IdToRequest[requestID].helper = payable(msg.sender);
    }

}