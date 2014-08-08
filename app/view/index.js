(function(tdev) {
    this.canvas = null;
    tdev.on('app-init', init);
    tdev.on('req-received', function(e, data) {
        render(data);
    });
   
    function render(req) {
        var q = req.query;  
        if (['load', 'boot', 'unload'].indexOf(q.ns_ad_event)) {
            var canvas = document.getElementById('canvas');
            tdev.AdVisualizer.draw(canvas, req.query);
        }
    }
    
    function init() {
        var tab = tdev.newTab("Viewer");
        var html = $('<canvas id="canvas">there is not support for canvas</canvas>');
        html.appendTo(tab);
    }
   
})(TDev);