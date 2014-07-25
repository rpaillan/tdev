(function() {
    var oHead = document.getElementsByTagName("head")[0];
    var sBase = oHead.lastChild.src.replace(/\/?[^\/]+$/, ''); // presumably this script tag
    
    function include(sSrc) {
        document.write('<script src="' + sBase + '/' + sSrc + '"></script>');
    }

    // Classes
    include("util.js");
    include("adMap.js");
    include("index.js");
    include("adTooltip.js");

})();