var express = require('./node_modules/express');
var Web3 = require('web3');
var fs = require('fs');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('src'));
app.use(express.static('../silkcode-contract/build/contracts'));
app.get('/', function (req, res) {
  res.render('index.html');
});

app.post('/request' , (req,res)=>{
  console.log(req.body)
  response = {
    creator: req.body.creator,
    value: req.body.value, 
    description: req.body.requestDescription, 
    id: req.body.reqId
  }
  
  var data = fs.readFileSync('requests.json');
  var dataObj = JSON.parse(data);
  dataObj.requests.push(response);
  data = JSON.stringify(dataObj);

  fs.writeFile('requests.json', data, function(err, result){
    if(err) console.log('error', err);
  }); 

  res.send(data);
})

app.get('/update', (req,res)=>{
  var data = fs.readFileSync('requests.json');
  res.send(data);
})
 
app.listen(3010, function () {
  console.log('SilkCode Dapp listening on port 3010!');
});