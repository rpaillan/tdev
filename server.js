var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require("fs");
var _builder = require("./builder.js");

app.use(express.static(__dirname));
app.use("/lib", express.static('../tag/ie11/src'));

console.log(__dirname + '../tag/ie11/src');

app.get('lib/lt.swf', function(req, res) {
    var file = req.params.file;
    res.sendfile(file + '.html');
});
app.get('/b.voicefive.com/c2/:c2/rs.js', function(req, res) {
    var c2 = req.params.c2;
    console.log('c2 -->', c2);
    var rsSource = _builder.buildRsJs(c2);
    sendJs(res, rsSource);
});

app.get('/scorecardresearch.com/rs/:jsfile', function(req, res) {
    var jsFile = req.params.jsfile;
    console.log('jsFile -->', jsFile);
    var rsSource = _builder.buildJs(jsFile);
    sendJs(res, rsSource);
});

app.get('/scorecardresearch.com/rpc.flow', function(req, res) {
    var uid = req.query.uid;
    var c9 = req.query.c9;
    var js = 'ns_.mvce.A("' + uid + '", "&ax_loc=' + c9 + '"); // blockingconf=1 ';
    sendJs(res, js);
});

app.get('/scorecardresearch.com/p', sendToViewer);
app.get('/adxpose_inview', sendToViewer);
app.get('/adxpose_engagement', sendToViewer);

io.on('connection', function(socket) {
    console.log('a user connected');
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});

function sendJs(res, jsSource) {
    res.set('Content-Type', 'text/javascript');
    res.send(jsSource);
}

function sendToViewer(req, res) {
    io.emit('onreq', {
        url: req.originalUrl,
        query: req.query
    });
    res.send(200);
}