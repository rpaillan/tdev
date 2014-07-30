(function(app, module){

    module.attrinfo = {
        'ax_bl': 'bloquing request return code'
    };

    var Row = function(attr) {
        this.attr = attr;
        this.trEl = null;
        this.tdEl =null;
    };

    Row.prototype.exist = function() {
        return this.trEl !== null;
    };

    Row.prototype.render = function() {
        var tr = $('<tr />');
        var td = $('<td />').append(
                $('<span class="attr" />').text(this.attr)
        );

        if (module.attrinfo[this.attr]) {
            var desc = module.attrinfo[this.attr];
            $('<span class="desc" />').text(' - ' + desc).appendTo(td);
        }

        tr.append(td);
        module.view.body.append(tr);
        this.trEl = tr;
        this.tdEl = td;
    };

    Row.prototype.addCell = function _addCell_ (td) {
        this.trEl.append(td);
    };

    module.Row = Row;

})(TDev, TDev.GridV2);