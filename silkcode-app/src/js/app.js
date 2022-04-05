
App = {
    web3: null,
    contracts: {},
    address:'', // Add contract address here
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
      } else {
        App.web3 = new Web3(App.url);
      }
      ethereum.enable();  

      //$.getJSON('flagIndex.json',(id)=>{     
      //  $.getJSON('flags.json',(d)=>{
      //    var index = id;
      //    for(var i in d[index]){
      //      $('#flagpic').html("<img src='http://www.geognos.com/api/en/countries/flag/"+i.toUpperCase()+".png'/>");
      //      $('#country-name').html(d[index][i]) 
      //    }
      //    
      //  })
      //})
         
      return App.initContract();  
    },

    initContract: function() { 
      App.contracts.Counter = new App.web3.eth.Contract(App.abi,App.address, {});

      //$.getJSON('flags.json',(d)=>{
        //var index = Math.floor((Math.random() * 243) + 1);
        
        //for(var i in d[index]){
          //$('#flag').addClass('flag-'+i)
          //$('#country-name').html(d[index][i])
        //}
        
      //})     
      return App.bindEvents();
    },  
  
    bindEvents: function() {  
      $(document).on('click', '#createUser', function(){
         App.handleUser();
      });
      /* Not all of the following functions will neccesarily take an argument */
      $(document).on('click', '#makeHelpRequest', function(){
         App.handleHelpRequest();
      });
      $(document).on('click', '#payHelpRequest', function(){
         App.handlePay(jQuery('#pay').val());
      });
      $(document).on('click', '#withdrawHelpRequest', function(){
         App.handleWithdraw(jQuery('#removeRequest').val());
      });
      $(document).on('click', '#acceptHelpRequest', function(){
         App.handleAccept(jQuery('#acceptRequest').val());
      });
      App.populateAddress();
    },

    populateAddress : function(){  
      App.handler=App.web3.givenProvider.selectedAddress;
    },  
  
    handleUser : function(){
      App.contracts.SilkCode.methods.createUser();

    },

    handleHelpRequest : function(){
      id = App.contracts.SilkCode.methods.makeRequest();

    },

    handlePay : function(requestId, rating){
      id = App.contracts.SilkCode.methods.payContract(requestId, rating);

    },

    handleWithdraw : function(requestId){
      App.contracts.SilkCode.methods.withdrawRequest(requestId);

    },

    handleAccept : function(creator, requestId){
      App.contracts.SilkCode.methods.acceptRequest(creator, requestId);

    },

  abi:[
    {
      "constant": false,
      "inputs": [],
      "name": "createUser",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "makeContract",
      "outputs": [
        {
          "id": "int256"
        }
      ],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "requestId": "int256",
          "rating": "int256"
        }
      ],
      "name": "payContract",
      "outputs": [
        {
          "requestId": "int256"
        }
      ],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "requestId": "int256",
        }
      ],
      "name": "withdrawRequest",
      "outputs": [],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "creator": "address",
          "requestId": "int256"
        }
      ],
      "name": "acceptRequest",
      "outputs": [],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
    }
  ]

  }
  
  $(function() {
    $(window).load(function() {
      App.init();
      toastr.options = {
        // toastr.options = {
          "closeButton": true,
          "debug": false,
          "newestOnTop": false,
          "progressBar": false,
          "positionClass": "toast-bottom-full-width",
          "preventDuplicates": false,
          "onclick": null,
          "showDuration": "300",
          "hideDuration": "1000",
          "timeOut": "5000",
          "extendedTimeOut": "1000",
          "showEasing": "swing",
          "hideEasing": "linear",
          "showMethod": "fadeIn",
          "hideMethod": "fadeOut"
        // }
      };
    });
  });
  
