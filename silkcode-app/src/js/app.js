// Used the counter-app app.js as an example to go off of as far as how to
// structure app.js.

//var Web3 = require('web3');
//var contract = require("@truffle/contract");

App = {
    url: 'http://127.0.0.1:7545',
    //web3Provider: null,
    web3: null,
    contracts: {},
    address:'0x82eB2e4bEDc8d296BC061f8835Bb707C00F56d80', // Add contract address here
    network_id:5777, // 5777 for local
    handler:null,
    value:1000000000000000000,
    index:0,
    margin:10,
    left:15,

    init: function() {
      return App.initWeb3();
    },
  
    initWeb3: function() {         
      //if(typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'){
        ////getting Permission to access. This is for when the user has new MetaMask
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
        console.log("web3 is undefined");
      } else {
        //App.web3Provider = new Web3(App.url);
        App.web3 = new Web3(App.url);
        console.log("web3 is defined");
      }

      //App.web3 = new Web3(window.ethereum);
      ethereum.enable();
      //ethereum.request({ method: 'eth_requestAccounts' }); 
         
      return App.initContract();  
    },

    initContract: function() { 
      App.contracts.SilkCode = new App.web3.eth.Contract(App.abi,App.address, {});
      //App.contracts.SilkCode = App.web3.eth.contract(App.abi,App.address, {});

      return App.bindEvents();
    },  
  
    bindEvents: function() {  
      //$(document).on('click', '#eth', function(){
      //   App.handleAccount();
      //});
      $(document).on('click', '#createUser', function(){
         App.populateAddress().then(r => App.handler = r[0]);
         App.handleUser();
      });
      /* Not all of the following functions will neccesarily take an argument */
      $(document).on('click', '#makeHelpRequest', function(){
         App.populateAddress().then(r => App.handler = r[0]);
         App.handleHelpRequest(jQuery('#reward').val());
      });
      $(document).on('click', '#payHelpRequest', function(){
         App.populateAddress().then(r => App.handler = r[0]);
         App.handlePay(jQuery('#reqid').val(), jQuery('#rating').val());
      });
      //handleWithdraw requires the id of the request to remove.
      $(document).on('click', '#withdrawHelpRequest', function(){
         App.populateAddress().then(r => App.handler = r[0]);
         App.handleWithdraw(jQuery('#reqid').val());
      });
      //handleAccept requires the creator's address and the id of the request to accept.
      $(document).on('click', '#acceptHelpRequest', function(){
         App.populateAddress().then(r => App.handler = r[0]);
         App.handleAccept(jQuery('#creator').val(), jQuery('#reqid').val());
      });
    },

    populateAddress : async function(){
      // App.handler=App.web3.givenProvider.selectedAddress;
        return await ethereum.request({method : 'eth_requestAccounts'});
    },  

    handleAccount : function(){
      ethereum.request({ method: 'eth_requestAccounts' }); 
    },

    handleUser : function(){
      App.contracts.SilkCode.methods.createUser().send({from:App.handler});
    },

    handleHelpRequest : function(reward){
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
      console.log("makeRequest");
      App.contracts.SilkCode.methods.makeRequest(intReward).send({from:App.handler, value: reward});
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
  
