(function(tdev){

    var URL = location.origin,
        socket = io(URL);

    tdev.io = socket;

    tdev.io.on('onreq', function(req) {
        console.log('message: ', req);
        tdev.trigger('req-received', req);
    });

})(TDev);