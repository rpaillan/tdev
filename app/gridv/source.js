(function() {
    var oHead = document.getElementsByTagName("head")[0];
    var sBase = oHead.lastChild.src.replace(/\/?[^\/]+$/, ''); // presumably this script tag
    
    function include(sSrc) {
        includeJs(sSrc, sBase);
    }

    // Classes
    include("index.js");

})();