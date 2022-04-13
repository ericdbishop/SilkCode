// Used the counter-app app.js as an example to go off of as far as how to
// structure app.js.

//var Web3 = require('web3')
//var contract = require("@truffle/contract");
App = {
    url: 'http://127.0.0.1:7545',
    web3Provider: null,
    web3: null,
    contracts: {},
    address:'0x7B7Ba104330Bcd071A9dBeE19E8f7F38a5E9dbaa', // Add contract address here
    network_id:5777, // 5777 for local
    //handler:null,
    value:1000000000000000000,
    index:0,
    margin:10,
    left:15,

    init: function() {
      return App.initWeb3();
    },
  
    initWeb3: function() {         
      if (typeof web3 !== 'undefined') {
        App.web3Provider = new Web3(Web3.currentProvider);
      } else {
        App.web3Provider = new Web3(App.url);
      }

      App.web3 = new Web3(App.web3Provider);
      ethereum.enable();
         
      return App.initContract();  
    },

    initContract: function() { 
      // App.contract = new App.web3.eth.Contract(App.abi,App.address, {});
      App.contracts.SilkCode = App.web3.eth.contract(App.abi,App.address, {});

      return App.bindEvents();
    },  
  
    bindEvents: function() {  
      $(document).on('click', '#createUser', function(){
         App.handleUser();
      });
      /* Not all of the following functions will neccesarily take an argument */
      $(document).on('click', '#makeHelpRequest', function(){
         App.handleHelpRequest(jQuery('#reward').val());
      });
      $(document).on('click', '#payHelpRequest', function(){
         App.handlePay(jQuery('#reqid').val(), jQuery('#rating').val());
      });
      //handleWithdraw requires the id of the request to remove.
      $(document).on('click', '#withdrawHelpRequest', function(){
         App.handleWithdraw(jQuery('#reqid').val());
      });
      //handleAccept requires the creator's address and the id of the request to accept.
      $(document).on('click', '#acceptHelpRequest', function(){
         App.handleAccept(jQuery('#creator').val(), jQuery('#reqid').val());
      });
      //App.populateAddress();
    },

    //populateAddress : function(){  
    //  App.handler=App.web3.currentProvider.selectedAddress;
    //},  
  
    handleUser : function(){
      App.contracts.SilkCode.methods.createUser();

    },

    handleHelpRequest : function(reward){
      intReward = parseInt(reward);
      if (isNaN(intReward)){
        alert("input is not a number");
        return false;
      }
      // makeRequest returns the requestId for the user.
      App.contracts.SilkCode.methods.makeRequest(intReward).call();
      //App.contract.methods.makeRequest(intReward);

    },

    handlePay : function(requestId, rating){
      // If requestId doesn't exist...

      // If rating is not valid
      if (rating > 100 || rating < 0){
        alert("Please enter a valid rating.");
        return false;
      }

      id = App.contracts.SilkCode.methods.payContract(requestId, rating);

    },

    handleWithdraw : function(requestId){
      App.contracts.SilkCode.methods.withdrawRequest(requestId);

    },

    // creator is the address of the creator who's request is being accepted,
    // along with the requestId.
    handleAccept : function(creator, requestId){
      App.contracts.SilkCode.methods.acceptRequest(creator, requestId);

    },

  "abi": [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "createUser",
      "outputs": [],
      "stateMutability": "nonpayable",
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
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "requestID",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "rating",
          "type": "uint256"
        }
      ],
      "name": "payContract",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
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
      "name": "withdrawRequest",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "creator",
          "type": "address"
        },
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
    }
  ]

  }
  
  $(function() {
    $(window).load(function() {
      App.init();
    });
  });
  
