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
        address helper;
    }

    address publisher;
    mapping(address => User) users;
    //helpRequest[] requests;


       //modifiers

    modifier onlyPublisher()
     {require(msg.sender == publisher);
      _;
     }

    //modifier isHelper(address creator) {
        //require(msg.sender == userToRequests[creator].);
        //_;
     //}

    modifier isNotUser() {
        require(users[msg.sender].nextId > 0);
        _;
     }
    modifier isValidId(uint ID) {
        // require the reward of the help request mapped to ID is not null
        require(users[msg.sender].IdToRequest[ID].reward > 0);
        _;
     }

    constructor() {
        publisher = msg.sender;
        //voters[chairperson].weight = 2; // weight 2 for testing purposes
        ////proposals.length = numProposals; -- before 0.6.0
        //for (uint prop = 0; prop < numProposals; prop ++)
            //proposals.push(Proposal(0));

    }

    function createUser() public isNotUser {
        User storage newUser;

        newUser.nextId = 1;
        newUser.reputation = 100;

    }

    // When creating a help request, send the payout you will be rewarding to
    // the smart contract to be stored.
    function makeRequest(uint reward) public payable {

        helpRequest storage newRequest = new helpRequest;
        newRequest.reward = msg.value;

        users[msg.sender].IdToRequest[users[msg.sender].nextId] = newRequest;
        users[msg.sender].nextId += 1;

    }

    // When a request has been fulfilled, pay out the reward.
    function payRequest(uint requestID) public isValidId(requestID) {


    }

    function acceptRequest(uint requestID) public isValidId(requestID) {


    }

    //function reqWinner() public view returns (uint winningProposal) {

        //uint winningVoteCount = 0;
        //for (uint prop = 0; prop < proposals.length; prop++)
            //if (proposals[prop].voteCount > winningVoteCount) {
                //winningVoteCount = proposals[prop].voteCount;
                //winningProposal = prop;
            //}
       //assert(winningVoteCount>=3);

    //}
}