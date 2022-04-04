pragma solidity >=0.4.22;
contract Ballot {

    struct User {
        // Measure of this user's reliability and helpfulness.
        uint reputation;
    }

    struct helpRequest {
        uint reward;
    }

    address publisher;
    mapping(address => User) users;
    helpRequest[] requests;


       //modifiers

    modifier onlyPublisher()
     {require(msg.sender == publisher);
      _;
     }

    // modifier validVoter()
    //{
    //    require(voters[msg.sender].weight > 0, "Not a Registered Voter");
    //    _;
    //}

    //constructor (uint numProposals) public  {
        //chairperson = msg.sender;
        //voters[chairperson].weight = 2; // weight 2 for testing purposes
        ////proposals.length = numProposals; -- before 0.6.0
        //for (uint prop = 0; prop < numProposals; prop ++)
            //proposals.push(Proposal(0));

    //}


    function makeRequest(uint reward) public {

        helpRequest newRequest;
        newRequest.reward = reward;
        requests.push(newRequest);

    }


    function payRequest (address toProposal) public {

        Voter storage sender = voters[msg.sender];

        require (!sender.voted);
        require (toProposal < proposals.length);

        sender.voted = true;
        sender.vote = toProposal;
        proposals[toProposal].voteCount += sender.weight;
    }

    function reqWinner() public view returns (uint winningProposal) {

        uint winningVoteCount = 0;
        for (uint prop = 0; prop < proposals.length; prop++)
            if (proposals[prop].voteCount > winningVoteCount) {
                winningVoteCount = proposals[prop].voteCount;
                winningProposal = prop;
            }
       assert(winningVoteCount>=3);
    }
}