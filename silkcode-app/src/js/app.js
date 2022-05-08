// Used the following resource for altering the SilkCode.sol contract to reflect the use of our token.
// https://dapp-world.com/smartbook/accept-an-erc20-token-as-payment-in-smart-contract-zsqV 


// Used the counter-app app.js as an example to go off of as far as how to
// structure app.js.

//var Web3 = require('web3');
//var contract = require("@truffle/contract");

App = {
  url: 'http://127.0.0.1:7545',
  //web3Provider: null,
  web3: null,
  contracts: {},
  address:'0x6eC7a8085024de37bd4F51e35582FC4F8B812D57', // Add contract address here OLD ADDRESS: 0xd442b6b5ed53f1be89e8d6b1176f9c04acac6b20
  network_id:3, // 5777 for local
  handler:null,
  value:1000000000000000000,
  index:0,
  margin:10,
  left:15,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {         
    if (typeof web3 !== 'undefined') {
      App.web3 = new Web3(Web3.givenProvider);
      console.log("[Log] web3 is undefined");
    } else {
      App.web3 = new Web3(App.url);
      console.log("[Log] web3 is defined");
    }

    ethereum.enable();
    
    App.handler = reqAcc_Connect(); 
    return App.initContract();  
  },

  initContract: function() { 
    App.contracts.SilkCode = new App.web3.eth.Contract(App.abi,App.address, {});

    return App.bindEvents();
  },  

  bindEvents: function() {  
    $(document).on('click', '#eth', function(){
       App.handleAccount();
    });
    /* Not all of the following functions will neccesarily take an argument */
    $(document).on('click', '#updateRequests', function(){
       App.handleUpdate();
    });
    $(document).on('click', '#add', function(){
       App.populateAddress().then(r => App.handler = r[0]);
       handleAdd(jQuery('#addAmount').val());
    });
    $(document).on('click', '#makeHelpRequest', function(){
       App.populateAddress().then(r => App.handler = r[0]);
       App.handleHelpRequest(jQuery('#reward').val(), jQuery('#description').val());
    });
    $(document).on('click', '#payHelpRequest', function(){
       App.populateAddress().then(r => App.handler = r[0]);
       App.handlePay(jQuery('#PayReqid').val(), jQuery('#rating').val());
    });
    //handleWithdraw requires the id of the request to remove.
    $(document).on('click', '#withdrawHelpRequest', function(){
       App.populateAddress().then(r => App.handler = r[0]);
       App.handleWithdraw(jQuery('#WithdrawReqid').val());
    });
    //handleAccept requires the creator's address and the id of the request to accept.
    $(document).on('click', '#acceptHelpRequest', function(){
       App.populateAddress().then(r => App.handler = r[0]);
       App.handleAccept(jQuery('#AcceptReqid').val());
    });
    //handleAccept requires the creator's address and the id of the request to accept.
    $(document).on('click', '#airDropRequest', function(){
      //App.populateAddress().then(r => App.handler = r[0]);
      App.handleAirDrop(jQuery('#airDropAddress').val(), jQuery('#airDropAmount').val());
    });

  },

  populateAddress : async function(){
    // App.handler=App.web3.givenProvider.selectedAddress;
    //return await ethereum.request({method : 'eth_requestAccounts'});
    return await reqAcc_Connect();
  },  

  handleUpdate : function(){
    $.get('/update').then((response) => {
      console.log(response)

      var obj = JSON.parse(response);
      var table = document.createElement("table");
      var row = table.insertRow(0);

      var creator = row.insertCell(0);
      var reward = row.insertCell(1);
      var description = row.insertCell(2);
      var id = row.insertCell(3);

      creator.innerHTML = "Creator Address";
      reward.innerHTML = "Contract Reward"
      description.innerHTML = "Description";
      id.innerHTML = "Request id";

      for (let i = 1; i <= obj.requests.length; i++) {
        var row = table.insertRow(i);

        var creator = row.insertCell(0);
        var reward = row.insertCell(1);
        var description = row.insertCell(2);
        var id = row.insertCell(3);

        creator.innerHTML = obj.requests[i-1].creator;
        reward.innerHTML = obj.requests[i-1].value;
        description.innerHTML = obj.requests[i-1].description;
        id.innerHTML = obj.requests[i-1].id;
      }

      document.getElementById("reqTable").innerHTML = table.innerHTML;

    })
  },

  handleAccount : function(){
    //ethereum.request({ method: 'eth_requestAccounts' }); 
    reqAcc_Connect();
  },

  handleHelpRequest : function(reward, description){
    intReward = parseInt(reward);
    if (isNaN(intReward)){
      alert("input is not a number");
      return false;
    }
    // makeRequest returns the requestId for the user.
    if (!App.contracts.SilkCode){
      alert("contract is undefined");
      return false;
    }
    App.contracts.SilkCode.methods.makeRequest().send({from:App.handler, value: intReward})
    .then((x) => {
      console.log(x);
      console.log(x.events.request.returnValues.id);
      $.post('/request',
        {
          creator: x.events.request.returnValues.creator, 
          value:intReward, 
          requestDescription:description, 
          reqId:x.events.request.returnValues.id
        } 
      );
    }).then((response) => {
      console.log(response);
    });
  },

  handlePay : function(requestId, rating){
    // If rating is not valid
    if (rating > 100 || rating < 0){
      alert("Please enter a valid rating.");
      return false;
    }

    id = App.contracts.SilkCode.methods.payContract(requestId).send({from:App.handler})
    .then((x) => {
      console.log(x)
    });

  },

  handleWithdraw : function(requestId){
    console.log("calling withdrawRequest")
    App.contracts.SilkCode.methods.withdrawRequest(requestId).send({from:App.handler})
    .then((x) => {
      console.log(x)
    });
  },

  // creator is the address of the creator who's request is being accepted,
  // along with the requestId.
  handleAccept : function(creator, requestId){
    App.contracts.SilkCode.methods.acceptRequest(requestId).send({from:App.handler})
    .then((x) => {
      console.log(x)
    });
  },

  // Inputs of airdrop are address and amount
  handleAirDrop : function(airDropAddress, airDropAmount) {
    intAirDrop = parseInt(airDropAmount);
    if (isNaN(intAirDrop)){
      alert("input is not a number");
      return false;
    }

    App.contracts.SilkCode.methods.ownerAirDrop(airDropAddress, airDropAmount).send({from:App.handler})
    .then((x) => {
      console.log(x)
    });
  },

  "abi":[
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "creator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "request",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "requestID",
          "type": "uint256"
        }
      ],
      "name": "acceptRequest",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "addEth",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "reward",
          "type": "uint256"
        }
      ],
      "name": "makeRequest",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "ownerAirdrop",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "requestID",
          "type": "uint256"
        }
      ],
      "name": "payContract",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "retrieveEth",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "stateMutability": "payable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "requestID",
          "type": "uint256"
        }
      ],
      "name": "withdrawRequest",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllowance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "silk",
      "outputs": [
        {
          "internalType": "contract IERC20",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]
    
  
//      [
//    {
//      "inputs": [],
//      "stateMutability": "payable",
//      "type": "constructor"
//    },
//    {
//      "anonymous": false,
//      "inputs": [
//        {
//          "indexed": false,
//          "internalType": "address",
//          "name": "creator",
//          "type": "address"
//        },
//        {
//          "indexed": false,
//          "internalType": "uint256",
//          "name": "id",
//          "type": "uint256"
//        }
//      ],
//      "name": "request",
//      "type": "event"
//    },
//    {
//      "inputs": [
//        {
//          "internalType": "uint256",
//          "name": "requestID",
//          "type": "uint256"
//        }
//      ],
//      "name": "acceptRequest",
//      "outputs": [],
//      "stateMutability": "nonpayable",
//      "type": "function"
//    },
//    {
//      "inputs": [],
//      "name": "addEth",
//      "outputs": [],
//      "stateMutability": "payable",
//      "type": "function"
//    },
//    {
//      "inputs": [],
//      "name": "makeRequest",
//      "outputs": [],
//      "stateMutability": "payable",
//      "type": "function"
//    },
//    {
//      "inputs": [
//        {
//          "internalType": "uint256",
//          "name": "requestID",
//          "type": "uint256"
//        }
//      ],
//      "name": "payContract",
//      "outputs": [],
//      "stateMutability": "payable",
//      "type": "function"
//    },
//    {
//      "inputs": [
//        {
//          "internalType": "uint256",
//          "name": "requestID",
//          "type": "uint256"
//        }
//      ],
//      "name": "withdrawRequest",
//      "outputs": [],
//      "stateMutability": "payable",
//      "type": "function"
//    }
//  ]

}

async function reqAcc_Connect() { //Moved ETH_request accounts to print errors
  try {
    response = ethereum.request({ method: 'eth_requestAccounts' });
    console.log("Eth_ReqAcc: ", response);
    return response
  } catch (e) {
    console.log("Error: ", e)
    return null
};

};

async function handleAdd(amount) {
  intAmount = parseInt(amount);
    if (isNaN(intAmount)){
      alert("input is not a number");
      return false;
    }
  let response;
  console.log(App.handler);
  response = await App.contracts.SilkCode.methods.addEth().send({  //would return a boolean value
      from: App.handler,
      value: amount   //this is the amount entered in the front-end application
  });
};


$(function() {
  $(window).load(function() {
    App.init();
  });
});

