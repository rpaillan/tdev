
var http = require('http');
var net = require('net');
var url =  require('url');
var port = 8080;
var debugging = 1;
var regex_hostport = /^([^:]+)(:([0-9]+))?$/;

// handle a HTTP proxy request
function httpHandler(req, res) {
    capture(req);
    if (debugging) console.log('req', req.url.substr(0, 80));
    var httpVersion = req['httpVersion'];
    var hostport = getHostPortFromString(req.headers['host'], 80);
    // have to extract the path from the requested URL
    var path = req.url;
    result = /^[a-zA-Z]+:\/\/[^\/]+(\/.*)?$/.exec(req.url);
    if (result) {
        if (result[1].length > 0) {
            path = result[1];
        } else {
            path = "/";
        }
    }
    var options = {
        'host': hostport[0],
        'port': hostport[1],
        'method': req.method,
        'path': path,
        'agent': req.agent,
        'auth': req.auth,
        'headers': req.headers
    };
    var proxyRequest = http.request(options, function(proxyResponse) {
        res.writeHead(proxyResponse.statusCode, proxyResponse.headers);
        proxyResponse.on('data', function(chunk) {
            res.write(chunk);
        });
        proxyResponse.on('end', function() {
            res.end();
        });
    });
    proxyRequest.on('error', function(error) {
        res.writeHead(500);
        res.write("<h1>500 Error</h1>\r\n<p>Error was <pre>" + error + "</pre></p>\r\n</body></html>\r\n");
        res.end();
    });
    req.addListener('data', function(chunk) {
        proxyRequest.write(chunk);
    });
    req.addListener('end', function() {
        proxyRequest.end();
    });
}


function httpsHandler(req, socketRequest, bodyhead) {
    capture(req);
    if (debugging) console.log('req', req.url.substr(0, 80));
    var url = req['url'];
    var httpVersion = req['httpVersion'];
    var hostport = getHostPortFromString(url, 443);
    // set up TCP connection
    var proxySocket = new net.Socket();
    proxySocket.connect(parseInt(hostport[1], 10), hostport[0], function() {
        if (debugging) console.log("ProxySocket: " + hostport[1] + " | " + hostport[0]);
        proxySocket.write(bodyhead);
        // tell the caller the connection was successfully established
        socketRequest.write("HTTP/" + httpVersion + " 200 Connection established\r\n\r\n");
    });
    proxySocket.on('data', function(chunk) {
        socketRequest.write(chunk);
    });
    proxySocket.on('end', function() {
        socketRequest.end();
    });
    socketRequest.on('data', function(chunk) {
        proxySocket.write(chunk);
    });
    socketRequest.on('end', function() {
        proxySocket.end();
    });
    proxySocket.on('error', function(err) {
        socketRequest.write("HTTP/" + httpVersion + " 500 Connection error\r\n\r\n");
        socketRequest.end();
    });
    socketRequest.on('error', function(err) {
        proxySocket.end();
    });
}

function getHostPortFromString(hostString, defaultPort) {
    var host = hostString;
    var port = defaultPort;
    var result = regex_hostport.exec(hostString);
    if (result !== null) {
        host = result[1];
        if (result[2] !== null) {
            port = result[3];
        }
    }
    return ([host, port]);
}

// start HTTP server with custom request handler callback function
var server = http.createServer(httpHandler);

server.addListener('checkContinue', function(request, response) {
    console.log(request);
    response.writeContinue();
});
// add handler for HTTPS (which issues a CONNECT to the proxy)
server.addListener('connect', httpsHandler); // HTTPS connect listener

var filters = [];
function capture(req) {
    var parsed = url.parse(req.url, true);
    var list = filters.forEach(function(filter) {
        if (req.url.indexOf(filter.pattern) >= 0) {
            var res = {
                url: parsed.pathname,
                query: parsed.query
            };
            filter.callback(res);
        }
    });
}

module.exports = {
    listen: function(port, callback) {
        server.listen(port, callback);
    },
    capture: function(pattern, callback) {
        filters.push({
            pattern: pattern,
            callback: callback
        });
    }
};
