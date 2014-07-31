var fs = require("fs"),
    path = require('path'),
    Http = require('http'),
    Socketio = require('socket.io'),
    Express = require('express'),
    Proxy = require('./http-proxy.js');

var app = Express();

var http = Http.createServer(app.handle.bind(app));
var http2 = Http.createServer(app.handle.bind(app));
var io = Socketio.listen(http).of('/megaio');

io.on('connection', function(socket) {
    console.log('a user connected');

    socket.emit('files:load', files);

    socket.on('replaceFiles', function(data) {
        updateReplaceProxy(data);
    });

    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
});

var config = {
    "server_port": 3000,
    "tag_project": "C:/workspace/tag/ie11",
    "sandbox": "/sandbox"
};

try {
    var externalConfigStr = fs.readFileSync('../config.json');
    var externalConfig = JSON.parse(externalConfigStr);
    for (var attr in externalConfig) {
        config[attr] = externalConfig[attr];
    }
} catch (e) {}

// normalize
var appHome = path.normalize(__dirname + '/app');
var swfHome = path.normalize(config.tag_project + '/src');
config.tag_project = path.normalize(config.tag_project);
config.sandbox = path.normalize(__dirname + config.sandbox);

console.log('config.tag_project -->', config.tag_project);
console.log('config.sandbox -->', config.sandbox);
console.log('swfHome -->', swfHome);

var _builder = require("./builder.js");
_builder.setConfig(config);

app.use("/sandbox/lib", Express.static(swfHome));
app.use("/app", Express.static(appHome));
app.use("/sandbox", Express.static(config.sandbox));

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

function sendJs2(res, jsSource) {
    res.setHeader('Content-Type', 'text/javascript');
    res.write(jsSource);
    res.end();
}

function respondOk(req, res) {
    res.send(200);
}

function broadcast(data) {
    io.emit('onreq', data);
}

Proxy.listen(8080, function() {
    console.log('proxy listening on *:8080');
});

function proxySend(data) {
    broadcast(data);
}

function genericHandler (req, res, jsFile) {
    console.log('[REPLACED] ', req.url);
    var rsSource = _builder.buildJs(jsFile);
    sendJs2(res, rsSource);
}

var files = {
    'rs.js': {
        file: 'rs.js',
        enabled: false,
        pattern: '*/c2/:c2/rs.js',
        handler: function(req, res) {
            console.log('[REPLACED] ', req.url);
            var c2 = req.params.c2;
            var rsSource = _builder.buildRsJs(c2);
            sendJs2(res, rsSource);
        }
    },
    'vce_st.js': {
        file: 'vce_st.js',
        enabled: false,
        pattern: '*/vce_st.js',
        handler: function(req, res) {
            genericHandler(req, res, 'vce_st.js');
        }
    }
};

function updateReplaceProxy(data) {
    data.forEach(function(dataItem) {
        var file = files[dataItem.file];
        if (file) {
            if (dataItem.enabled !== file.enabled) {
                file.enabled = dataItem.enabled;
                if (file.enabled) {
                    Proxy.replaceFile(file);
                } else {
                    Proxy.removeReplaceFile(file);
                }
            }
        }
    });

    io.emit('files:update', files);
}

Proxy.capture('scorecardresearch.com/p', proxySend);
