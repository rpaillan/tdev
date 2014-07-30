var hoxy = require('hoxy');

var proxy = new hoxy.Proxy().listen(8080);

proxy.intercept('request', function(req, resp){
  console.log('request made to: ' + req.fullUrl());
});