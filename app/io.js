(function(tdev){

    var URL = location.origin,
        socket = io(URL + '/megaio');

    tdev.io = socket;

    tdev.io.on('onreq', function(req) {
        exploteAdDb(req);
        console.log('message: ', req);
        tdev.trigger('req-received', req);
    });


    //var ad_db_params = "browser name|timezoneOffset|navigator.platform|number of plugins|history length|build id|browser language|CPU class|System Language|User Language|Vendor|Mouse position|Scroll Offset|Value of SafeFrame's inViewPercentage API|<Opacity><Refresh value><Focus state><isReferrer><activeX enabled><java Enabled><Flash available><Mouse moved><Click><Press><Resize><scroll><z index><Pepper Flash enabled>";
    var ad_db_params = "browser.name|timezone.offset|navigator.platform|number.of.plugins|history.length|build.id|browser.language|CPU.class|System.Language|User.Language|Vendor|Mouse.position|Scroll.Offset|in.View.Percentage|<Opacity><Refresh.value><Focus.state><isReferrer><activeX.enabled><java.Enabled><Flash.available><Mouse.moved><click><press><resize><scroll><zindex><pepper.flash.enabled>";

    ad_db_params = ad_db_params.split('|');
    ad_db_params[ad_db_params.length - 1] = ad_db_params[ad_db_params.length - 1].replace(/></g, '|').replace('<', '').replace('>', '').split('|');

    function exploteAdDb(req) {
        if (req.query['ns_ad_db']) {
            var db = req.query['ns_ad_db'];
            var dbA = db.split('|');
            ad_db_params.forEach(function(unitName, i) {
                var value = dbA[i];
                if (i == dbA.length - 1) {
                    var subUnitA = value.split('');
                    value = '';
                    unitName.forEach(function(subUnitName, j) {
                        req.query['ns_ad_db' + '__' + i + '__'+ j + '_' + subUnitName] = subUnitA[j];
                    });
                } else {
                   req.query['ns_ad_db' + '__' + i + '_' + unitName] = value;
                }
            });

            delete req.query['ns_ad_db'];
        }
    }

})(TDev);