(function(app, module){

    var Ad = function(id) {
        this.event = '--';
        this.id = id;
        this.el = null;
        this.titleEl = null;
        this.cells = {};
    };

    Ad.prototype.render = function() {
        this.titleEl =  $('<div class="title" />').text(this.id + ' :: ' + this.event);
        var th = $('<th />').append(this.titleEl);
        module.view.head.append(th);
        this.el = th;
    };

    Ad.prototype.dispose = function() {
        for (var attr in this.cells) {
            if (this.cells[attr] && this.cells[attr].dispose) {
                this.cells[attr].dispose();
            }
        }
        this.el.remove();
        this.el = null;
        this.cells = null;
    };

    Ad.prototype.update = function(req) {
        this.event = req.query.ns_ad_event || '--';
        var me = this;
        module.foreachAttr(function(i, attr, row) {
            me.updateAttr(i, attr, row, req.query[attr]);
        });
        if (this.titleEl) {
            this.titleEl.text(this.id + ' :: ' + this.event);
        }
    };

    Ad.prototype.updateAttr = function(i, attr, row, value) {
        if (!this.cells[attr]) {
            var oAttr = new module.Cell(row, attr, value, this);
            this.cells[attr] = oAttr;
        }

        this.cells[attr].update(value);
    };

    module.Ad = Ad;

})(TDev, TDev.GridV2);