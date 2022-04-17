var express = require('./node_modules/express');
var Web3 = require('web3');
const path = require('path')
const fs = require('fs')

//var Eth = require('web3-eth');
//var contract = require("@truffle/contract");
var app = express();
app.use(express.static('src'));
app.use(express.static('../silkcode-contract/build/contracts'));
app.get('/', function (req, res) {
  res.render('index.html');
});

// path with /* is a variable, Needs to be retrieved and passed to file functions
app.get('/create_account/*', function (req, res) {
  account_id = req.query.toString();

  //writing to the db
  //fs.writeFile('src\\db_txt\\db.txt', account_id.toString(), (err) => {
  //  if (err) throw err;
  //})

  //read off of the db
  fs.readFile('src\\db_txt\\db.txt', (err, data) => {
    if (err) throw err;
    db = data.toString()
    console.log(db);
  })
})

app.listen(3010, function () {
  console.log('SilkCode Dapp listening on port 3010!');
});