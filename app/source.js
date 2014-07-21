(function() {
    var oHead = document.getElementsByTagName("head")[0];
    var sBase = oHead.lastChild.src.replace(/\/?[^\/]+$/, ''); // presumably this script tag
    
    function include(sSrc) {
        document.write('<script src="' + sBase + '/' + sSrc + '"></script>');
    }

    // Classes
    include("namespace.js");
    include("main.js");
    include("io.js");

    // modules
    include("grid/source.js");
    include("test/source.js");

})();