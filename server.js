
var fs = require("fs"),
    path = require('path'),
    Http = require('http'),
    Socketio = require('socket.io'),
    Express = require('express'),
    Proxy = require('./http-proxy2.js');

var app = Express();

var http = Http.createServer(app.handle.bind(app));
var http2 = Http.createServer(app.handle.bind(app));
var io = Socketio.listen(http).of('/megaio');

io.on('connection', function(socket) {
    console.log('a user connected');
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
});

var c = fs.readFileSync('../config.json');
var config = JSON.parse(c);

// normalize
var appHome = path.normalize(__dirname + '/app');
var swfHome = path.normalize(config.tag_project + '/src');
config.tag_project = path.normalize(config.tag_project);
config.sandbox = path.normalize(config.sandbox);

console.log('config.tag_project -->',config.tag_project);
console.log('config.sandbox -->',config.sandbox);
console.log('swfHome -->', swfHome);

var _builder = require("./builder.js");
_builder.setConfig(config);

var logger = function(req, res, next) {
    console.log("REQ: ", req.path);
    next();
};

app.all("*", logger);

app.use("/lib", Express.static(swfHome));
app.use("/sandbox", Express.static(config.sandbox));
app.use("/app", Express.static(appHome));

app.get('/b.voicefive.com/c2/:c2/rs.js', function(req, res) {
    var c2 = req.params.c2;
    var rsSource = _builder.buildRsJs(c2);
    sendJs(res, rsSource);
});

app.get('/scorecardresearch.com/rs/:jsfile', function(req, res) {
    var jsFile = req.params.jsfile;
    var rsSource = _builder.buildJs(jsFile);
    sendJs(res, rsSource);
});

app.get('/scorecardresearch.com/rpc.flow', function(req, res) {
    var uid = req.query.uid;
    var c9 = req.query.c9;
    var js = 'ns_.mvce.A("' + uid + '", "&ax_loc=' + c9 + '"); // blockingconf=1 ';
    sendJs(res, js);
});

app.get('/scorecardresearch.com/p', respondOk);
app.get('/adxpose_inview', respondOk);
app.get('/adxpose_engagement', respondOk);


http.listen(config.server_port, function() {
    console.log('listening on *:' + config.server_port);
});


var additionalPort = parseInt(config.server_port, 10) + 1;
http2.listen(additionalPort, function() {
    console.log('listening on *:' + additionalPort);
});


function sendJs(res, jsSource) {
    res.set('Content-Type', 'text/javascript');
    res.send(jsSource);
}

function respondOk(req, res) {
    res.send(200);
}

function broadcast(data) {
    io.emit('onreq', data);
}

Proxy.listen(8080);
function proxySend (data) {
    broadcast(data);
}
Proxy.capture('scorecardresearch.com/p', proxySend);


