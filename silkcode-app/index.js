var express = require('./node_modules/express');
var Web3 = require('web3');
var fs = require('fs')
//var Eth = require('web3-eth');
//var contract = require("@truffle/contract");
var app = express();
app.use(express.static('src'));
app.use(express.static('../silkcode-contract/build/contracts'));
app.get('/', function (req, res) {
  res.render('index.html');
});

app.post('/request' , (req,res)=>{
  response = {
    creator: req.body.creator,
    value: req.body.value, 
    description: req.body.requestDescription, 
    id: req.body.reqId
  }
  
  var data = fs.readFileSync('../json/requests.json');
  var dataObj = JSON.parse(data);
  dataObj.requests.push(request);
  data = JSON.stringify(data);
  console.log(data);

  fs.writeFile('../json/requests.json', JSON.stringify(data));
})

app.listen(3010, function () {
  console.log('SilkCode Dapp listening on port 3010!');
});