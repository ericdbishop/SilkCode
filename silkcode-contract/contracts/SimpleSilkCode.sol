
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

    //modifier isNotUser() {
    //    require(addressToUser[msg.sender].nextId > 0);
    //    _;
    // }

    //modifier isValidId(uint ID) {
    //    // require the reward of the help request mapped to ID is not null
    //    require(addressToUser[msg.sender].IdToRequest[ID].reward > 0);
    //    _;
    // }

    //modifier helperDoesNotExist(address creator, uint ID) 
    // {
    //    require(addressToUser[creator].IdToRequest[ID].helper == address(0));
    //    _;
    // }

    constructor() {
        publisher = msg.sender;
        //voters[chairperson].weight = 2; // weight 2 for testing purposes
        ////proposals.length = numProposals; -- before 0.6.0
        //for (uint prop = 0; prop < numProposals; prop ++)
            //proposals.push(Proposal(0));
    }

    // When creating a help request, send the payout you will be rewarding to
    // the smart contract to be stored.
    function makeRequest() public payable returns (uint){
        uint id = nextId;
        
        IdToRequest[id].reward = msg.value;
        nextId += 1;

        return id;
    }

    // When a request has been fulfilled, pay out the reward.
    function payContract(uint requestID) public payable returns (uint) {
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
    function acceptRequest(uint requestID) public {
        IdToRequest[requestID].helper = payable(msg.sender);
    }

}