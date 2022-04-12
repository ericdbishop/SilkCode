var express = require('./node_modules/express');
var app = express();
app.use(express.static('src'));
app.use(express.static('../silkcode-contract/build/contracts'));
app.get('/', function (req, res) {
  res.render('index.html');
});

app.listen(3010, function () {
  console.log('SilkCode Dapp listening on port 3010!');
});