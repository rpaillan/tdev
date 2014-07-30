(function(app, module){

    module.attrinfo = {
        'ax_bl': 'bloquing request return code',
        'ax_blt': 'RPC call latency time'
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

        this.place(tr);

        this.trEl = tr;
        this.tdEl = td;
    };

    Row.prototype.place = function(tr) {
        // module.view.body.append(tr);
        var attr = this.attr;
        var current = null;
        var me = this;

        module.foreachAttr(function(i, externalAttr, row) {
            
            if (row && row.exist()) {
                current = row;
            }
            if (externalAttr === attr) {
                //debugger;
                // insert
                if (current) {
                    tr.insertAfter(current.trEl);
                } else {
                    tr.appendTo(module.view.body);
                }
            }
        });
    };

    Row.prototype.addCell = function _addCell_ (td) {
        this.trEl.append(td);
    };

    module.Row = Row;

})(TDev, TDev.GridV2);