window.includeJs = function _includeJs_ (sSrc, sBase) {
    document.write('<script src="' + sBase + '/' + sSrc + '"></script>');
};

(function() {

    var oHead = document.getElementsByTagName("head")[0];
    var sBase = oHead.lastChild.src.replace(/\/?[^\/]+$/, ''); // presumably this script tag
    
    function include(sSrc) {
        includeJs(sSrc, sBase);
    }

    // Classes
    include("namespace.js");
    include("main.js");
    include("io.js");

    // modules
    include("gridv2/source.js");
    //include("gridv/source.js");
    include("grid/source.js");
    include("test/source.js");
    include("view/source.js");

})();