App = {
    web3: null,
    contracts: {},
    address:'0xceE430E295B0DF83535a30F732EEFC05B0aCA4cC',
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

      $.getJSON('flagIndex.json',(id)=>{     
        $.getJSON('flags.json',(d)=>{
          var index = id;
          for(var i in d[index]){
            $('#flagpic').html("<img src='http://www.geognos.com/api/en/countries/flag/"+i.toUpperCase()+".png'/>");
            $('#country-name').html(d[index][i]) 
          }
          
        })
      })
         
      return App.initContract();  
    },

    initContract: function() { 
      App.contracts.Counter = new App.web3.eth.Contract(App.abi,App.address, {});
      // console.log(random)
      $.getJSON('flags.json',(d)=>{
        var index = Math.floor((Math.random() * 243) + 1);
        
        for(var i in d[index]){
          $('#flag').addClass('flag-'+i)
          $('#country-name').html(d[index][i])
        }
        
      })     
      return App.bindEvents();
    },  
  
    bindEvents: function() {  
      $(document).on('click', '#initilaizeCounter', function(){
         App.handleInitialization(jQuery('#Initialize').val());
      });
  
      $(document).on('click', '#getCounter', function(){
        App.handleGet();
      });
      $(document).on('click', '#incrementCounter',function(){
        App.handleIncrement(jQuery('#Increment').val());
      });
      $(document).on('click', '#decrementCounter', function(){
        App.handleDecrement(jQuery('#Decrement').val());
      });
      App.populateAddress();
    },

    populateAddress : function(){  
      App.handler=App.web3.givenProvider.selectedAddress;
    },  
  
    handleInitialization:function(counterValue){
      if (counterValue===''){
        alert("Please enter a valid initializing value.")
        return false
      }
      var option={from:App.handler}    
      App.contracts.Counter.methods.initialize(counterValue)
      .send(option)
      .on('receipt',(receipt)=>{
        if(receipt.status){
          toastr.success("Counter is set to " + counterValue);
      }})
      .on('error',(err)=>{
        toastr.error("Only organizer can initialize the counter.");
      })
    },

    handleGet:function(){
      App.contracts.Counter.methods.get()
      .call()
      .then((r)=>{
        jQuery('#counter_value').text(r)
      })
    },

    
    handleIncrement:function(incrementValue){
      if (incrementValue===''){
        alert("Please enter a valid incrementing value.")
        return false
      }
      var option={from:App.handler} 
      App.contracts.Counter.methods.increment(incrementValue)
      .send(option)
      .on('receipt',(receipt)=>{
        if(receipt.status){
          toastr.success("Counter is incremented by " + incrementValue);
      }})
    },

    handleDecrement:function(decrementValue){
      if (decrementValue===''){
        alert("Please enter a valid decrementing value.")
        return false
      }
      var option={from:App.handler} 
      App.contracts.Counter.methods.decrement(decrementValue)
      .send(option)
      .on('receipt',(receipt)=>{
        if(receipt.status){
          toastr.success("Counter is decremented by " + decrementValue);
      }})
    }, 
  abi:[
    {
      "constant": false,
      "inputs": [
        {
          "name": "x",
          "type": "int256"
        }
      ],
      "name": "initialize",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "get",
      "outputs": [
        {
          "name": "",
          "type": "int256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "n",
          "type": "int256"
        }
      ],
      "name": "increment",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "n",
          "type": "int256"
        }
      ],
      "name": "decrement",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
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
  
