(function(app){

    var wasInit = false;
    app.io.on('files:load', function(data) {
        console.log('files:list data -->', data);
        app.files = data;
        if (wasInit) render (app.files);
    });

    app.io.on('files:update', function() {
        console.log('files:list data -->', data);
        app.files = data;
        render (app.files);
    });

    app.on('app-init', function() {

        var container = $('.overwrite');
        container.delegate('input', 'click', function(e) {
            var input = $(e.target);
            var isChecked = input.is(':checked');
            var value = input.attr('name');
            if (value) {
                var item = app.files[value];
                if (item) {
                    item.enabled = isChecked;
                    updateServer(item);
                }
            }
        });

        if (app.files) render(app.files);
        wasInit = true;
    });

     function render (files) {
        var container = $('.overwrite');
        container.empty();
        for (var fileName in files) {
            var item = files[fileName];

            var ch = $('<input type="checkbox" />');
            ch.attr('value', item.file);
            ch.attr('name', item.file);

            if (item.enabled) {
                ch.attr('checked', 'checked');
            }

            ch.appendTo(container);

            var label = $('<span />').text(item.file);
            label.appendTo(container);

        }
    }

    function updateServer(item) {
        var files = [item];
        console.log('item -->',item);
        app.io.emit('replaceFiles', files);
    }

})(TDev);