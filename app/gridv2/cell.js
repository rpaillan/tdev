(function(app, module){

    var Cell = function(row, attr, value, ad) {
        this.row = row;
        this.ad = ad;
        this.attr = attr;
        this.value = value;

        this.tdEl = null;
        this.count = 0;
    };

    Cell.prototype.exist = function() {
        return this.tdEl !== null;
    };

    Cell.prototype.dispose = function() {
        this.tdEl.empty();
        this.tdEl.remove();
        this.tdEl = null;
        this.row = null;
        this.ad = null;
    };

    Cell.prototype.update = function(newValue) {
        if (this.tdEl) {
            if (newValue !== undefined && newValue !== this.value) {
                var el = $('<span class="revision-item" />').text(newValue);
                this.tdEl.append(el);
                this.count++;
                this.value = newValue;
            }
        } else {
            this.render();
        }

        // classes
        if (this.count === 0) {
            this.tdEl.addClass('undefined');
        }
        if (this.count === 1) {
            this.tdEl.removeClass('undefined');
        }
        if (this.count === 2) {
            this.tdEl.addClass('revision');
        }
    };

    Cell.prototype.render = function() {
        var td = $('<td />');
        this.row.addCell(td);
        this.tdEl = td;
        if (this.value !== undefined) {
            td.append($('<span class="revision-item" />').text(this.value));
            this.count++;
        }
    };

    module.Cell = Cell;

})(TDev, TDev.GridV2);