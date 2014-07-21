var fs = require('fs'),
    _settings = require('./settings.js');

var bigSrc = "";
var requireRegex = /= require \"([_.\/a-zA-Z]+)\"/g;
var fileStore = {};
var mainFile = null;

function File(folder, name) {
    this.folder = folder;
    this.name = name;
    this.text = '';
    this.source = '';
}

function loadFile(file) {
    var path = '../tag/ie11/' + file.folder + '/' + file.name;
    var content = fs.readFileSync(path);

    file.text = (content + "").replace('#{VERSION}', '4');
    file.source = file.text;
    fileStore[file.name] = file;
}

function loadRequires(file) {
    //console.log('requires on file ', file.name);

    var requires = file.text.match(requireRegex);
    if (requires) {
        requires = requires.map(function(require) {
            return {
                tocken: require,
                fileName: require.replace('= require "', '').replace('"', '') + '.js'
            };
        });
        //console.log('requires -->', requires);
        if (requires.length) {
            requires.forEach(function(require) {
                var reqFile = new File(file.folder, require.fileName);
                loadFile(reqFile);
                loadRequires(reqFile);

                // replace on parent file
                file.source = file.source.replace('//' + require.tocken, reqFile.source);
            });
        }
    }
}

function getC2(url) {
    var c2 = '9999';

    var match = url.match(/c2\/([0-9]+)\/rs\.js/);
    if (match && match.length > 1) {
        c2 =  match[1];
    }
    console.log("c2 ", url,  c2);
    return c2;
}

module.exports = {

    buildRsJs: function (c2) {
        var text = '//= require "youngman"';
        var file = new File('src', 'rs.js');
        file.text = text;
        file.source = file.text;

        fileStore[file.name] = file;

        loadRequires(file);
        var source = file.source;

        var setting = _settings[c2];
        if (!setting) {
            setting = _settings['default'];
        }
        source = source.replace('%SETTINGS%', JSON.stringify(setting));

        return source;

    },
    buildJs: function(jsFile) {
        var text = '';
        if (jsFile == 'vce_st.js') {
            text = '//= require "vce_st"';
        }
        else if (jsFile == 'bsl.js') {
            text = '//= require "bsl"';
        }
        var file = new File('src', jsFile);
        file.text = text;
        file.source = file.text;

        fileStore[file.name] = file;

        loadRequires(file);
        var source = file.source;

        return source;
    }
};