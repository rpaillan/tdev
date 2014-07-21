(function(tdev){

    var URL = 'http://csclrpaillan.office.comscore.com:3000',
        socket = io(URL);

    tdev.io = socket;

    tdev.io.on('onreq', function(req) {
        console.log('message: ', req);
        tdev.trigger('req-received', req);
    });

})(TDev);