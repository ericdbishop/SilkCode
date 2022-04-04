pragma solidity >=0.4.22;
contract SilkCode {
    // Used ballot.sol lecture code as basis for SilkCode.sol

    struct User {
        // Measure of this user's reliability and helpfulness.
        uint reputation;
        uint nextId;
        mapping(uint => helpRequest) IdToRequest;
    }

    struct helpRequest {
        uint reward;
        address payable helper;
    }

    //uint numUsers = 0;
    address publisher;
    mapping(address => User) addressToUser;
    //address[] users;


       //modifiers

    modifier onlyPublisher()
     {require(msg.sender == publisher);
      _;
     }

    modifier isNotUser() {
        require(addressToUser[msg.sender].nextId > 0);
        _;
     }

    modifier isValidId(uint ID) {
        // require the reward of the help request mapped to ID is not null
        require(addressToUser[msg.sender].IdToRequest[ID].reward > 0);
        _;
     }

    modifier helperDoesNotExist(address creator, uint ID) 
     {
        require(addressToUser[creator].IdToRequest[ID].helper == address(0));
        _;
     }

    constructor() {
        publisher = msg.sender;
        //voters[chairperson].weight = 2; // weight 2 for testing purposes
        ////proposals.length = numProposals; -- before 0.6.0
        //for (uint prop = 0; prop < numProposals; prop ++)
            //proposals.push(Proposal(0));

    }

    function createUser() public {
        User storage newUser = addressToUser[msg.sender];
        newUser.nextId = 1;
        newUser.reputation = 100;

        //users[numUsers++] = msg.sender;
    }

    // When creating a help request, send the payout you will be rewarding to
    // the smart contract to be stored.
    function makeRequest() public payable returns (uint id){

        id = addressToUser[msg.sender].nextId;
        
        addressToUser[msg.sender].IdToRequest[id].reward = msg.value;
        addressToUser[msg.sender].nextId += 1;

        return id;
    }

    // When a request has been fulfilled, pay out the reward.
    function payRequest(uint requestID, uint rating) public isValidId(requestID) payable returns (uint) {
        address payable helper = addressToUser[msg.sender].IdToRequest[requestID].helper;
        uint reward = addressToUser[msg.sender].IdToRequest[requestID].reward;

        helper.transfer(reward);

        addressToUser[helper].reputation = (addressToUser[helper].reputation/10) + rating;
        if (addressToUser[helper].reputation > 100) {
            addressToUser[helper].reputation = 100;
        }

        delete(addressToUser[msg.sender].IdToRequest[requestID]);

        return requestID;
    }

    function withdrawRequest(uint requestID) public isValidId(requestID) payable {
        uint reward = addressToUser[msg.sender].IdToRequest[requestID].reward;
        address payable self = payable(msg.sender);

        self.transfer(reward);
    }

    // Called by helper when they begin a help request.
    function acceptRequest(address creator, uint requestID) public helperDoesNotExist(creator, requestID) {
        addressToUser[creator].IdToRequest[requestID].helper = payable(msg.sender);
    }

}