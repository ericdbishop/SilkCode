// Used the counter-app app.js as an example to go off of as far as how to
// structure app.js.

//var Web3 = require('web3');
//var contract = require("@truffle/contract");

App = {
  url: 'http://127.0.0.1:7545',
  //web3Provider: null,
  web3: null,
  contracts: {},
  address:'0xd33AB1A34247E8258bfe6cb28b1a0e14a3d1a52c', // Add contract address here
  network_id:3, // 5777 for local
  handler:null,
  value:1000000000000000000,
  index:0,
  margin:10,
  left:15,
  id: 0,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {         
    //if(typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'){
      ////new MetaMask
      //console.log("window");
      //window.ethereum.enable();
      //App.web3Provider = window.ethereum;
      //console.log(App.web3Provider);
      //App.web3 = new Web3(window.ethereum);
    
    //} else {
      ///// Specify default instance if no web3 instance provided
      //App.web3Provider = new Web3(App.url);
      //App.web3 = new Web3(App.web3Provider);
    //}
    
    if (typeof web3 !== 'undefined') {
      //App.web3Provider = new Web3(Web3.currentProvider);
      App.web3 = new Web3(Web3.givenProvider);
      //console.log(window.ethereum);
      console.log("[Log] web3 is undefined");
    } else {
      //App.web3Provider = new Web3(App.url);
      App.web3 = new Web3(App.url);
      console.log("[Log] web3 is defined");
    }

    //App.web3 = new Web3(window.ethereum);
    ethereum.enable();
    
    //App.handler = ethereum.request({ method: 'eth_requestAccounts' }); 
    App.handler = reqAcc_Connect(); 
    return App.initContract();  
  },

  initContract: function() { 
    App.contracts.SilkCode = new App.web3.eth.Contract(App.abi,App.address, {});
    //App.contracts.SilkCode = App.web3.eth.contract(App.abi,App.address, {});

    return App.bindEvents();
  },  

  bindEvents: function() {  
    $(document).on('click', '#eth', function(){
       App.handleAccount();
    });
    $(document).on('click', '#createUser', function(){
       App.populateAddress().then(r => App.handler = r[0]);
       App.handleAccount();
       App.db_create_account();
    });
    /* Not all of the following functions will neccesarily take an argument */
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
  },

  populateAddress : async function(){
    // App.handler=App.web3.givenProvider.selectedAddress;
    //return await ethereum.request({method : 'eth_requestAccounts'});
    return await reqAcc_Connect();
  },  

  handleAccount : function(){
    //ethereum.request({ method: 'eth_requestAccounts' }); 
    reqAcc_Connect();
  },

  //creates an account in the db by calling the express api
  db_create_account : async function(){
    //ethereum.request({ method: 'eth_requestAccounts' }); 
    account = await reqAcc_Connect();
    address = '/create_account/' + account.toString();
    console.log(address);
    $.get(address, function(data, status){
      console.log('test_1 ${data}')
    })
    return account;
  },

  //requests account to view
  db_view_profile : function (account) {

  },

  //handleUser : function(){
  //  App.contracts.SilkCode.methods.createUser().send({from:App.handler});
  //},


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
    //console.log("makeRequest");
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
    });
    //App.contract.methods.makeRequest(intReward)
  },

  handlePay : function(requestId, rating){
    // If requestId doesn't exist...

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
      "inputs": [],
      "name": "makeRequest",
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
    }
  ]
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
  ////const accounts = await web3.eth.getAccounts();
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

