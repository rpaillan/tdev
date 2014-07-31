(function(app){

    app.io.on('files:list', function(data) {
        console.log('files:list data -->', data);
        app.files = data;
    });

    app.on('app-init', function() {
        if (app.files) render(app.files);
    });

     function render (files) {
        var container = $('.overwrite');
        for (var fileName in files) {
            var item = files[fileName];
            (function(item) {
                var ch = $('<input type="checkbox" />');
                ch.attr('value', item.file);
                ch.attr('name', item.file);

                if (item.enabled) {
                    ch.attr('checked', 'checked');
                }

                ch.appendTo(container);

                var label = $('<span />').text(item.file);
                label.appendTo(container);

                ch.on('click', function(e) {
                    var isChecked = $(e.target).is(':checked');
                    item.enabled = isChecked;
                    updateServer(item);
                });
            })(item);
        }
    }

    function updateServer(item) {
        var files = [item];
        console.log('item -->',item);
        app.io.emit('replaceFiles', files);
    }

})(TDev);