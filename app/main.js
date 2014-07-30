(function(tdev) {

    var $tdev = $(tdev);

    tdev.on = function(eventName, handler) {
        $tdev.bind(eventName, function(event, data) {
            try {
                handler(event, data);
            } catch(e) {
                console.error(e.stack);
            }
        });
    };

    tdev.trigger = function(eventName, data) {
        $tdev.trigger(eventName, data);
    };

    $(function() {
        initTabService();
        tdev.trigger('app-init');
        tabs.tabs({ active: 0 });
    });

    
    /** TABS */
    var tabs;
    var tabs_titles;
    var tabs_index = 1;
    tdev.newTab = function(name) {
        var index = tabs_index++;
        var title = $('<li><a href="#tabs-' + index + '">' + name + '</a></li>');
        var body = $('<div id="tabs-' + index + '">');

        tabs_titles.append(title);
        tabs.append(body);

        //tabs.tabs("refresh");

        return body;
    };

    function initTabService() {
        tabs = $('#tabs');
        tabs_titles = tabs.find('#tabs-titles');
    }

    tdev.on('app-init', function() {
        var n = 0;
        var counter = $('.main-info-n-req');
        tdev.on('req-received', function(e, data) {
            counter.text(n++);
        });
    });

})(TDev);