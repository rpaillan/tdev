(function() {
    var oHead = document.getElementsByTagName("head")[0];
    var sBase = oHead.lastChild.src.replace(/\/?[^\/]+$/, ''); // presumably this script tag
    
    function include(sSrc) {
        document.write('<script src="' + sBase + '/' + sSrc + '"></script>');
    }

    // Classes
    include("index.js");
    include("ad.js");
    include("row.js");
    include("cell.js");
    include("screen.js");

})();