(function(app, module) {

    var attrStore = module.attrStore =  app.attrStore = [];
    var attrStoreRow = module.attrStoreRow = {};
    var adStore = module.adStore = {};

    module.eventColors = {
        'load': '#F2E1AC',
        'boot': '#63A69F',
        'found': '#F2836B',
        'qp1': '#F2594B',
        'qp5': '#CD2C24',
        'qp60': '#FF8000',
        'hide': '#FFD933',
        'show': '#CCCC52',
        'unload': '#8FB359'
    };

    module.foreachAttr = function _foreachAttr_ (f) {
        for (var i = 0, len = attrStore.length; i < len; i++) {
            f(i, attrStore[i], attrStoreRow[attrStore[i]]);
        }
    };

    app.on('app-init', function() {
        var tab = app.newTab("Log Vertical 2");

        module.view = {};
        module.view.table = $('<table class="logsv2"><thead><tr class="head"><th>attr / ad</th></tr></thead><tbody class="body"></tbody></table>');
        module.view.head = module.view.table.find('.head');
        module.view.body = module.view.table.find('.body');

        module.view.table.appendTo(tab);
    });


    app.on('req-received', function(e, req) {
        findAttrs(req);
        if (isNewAd(req)) {
            addNewAd(req);
        } else {
            appendReq(req);
        }
    });


    function findAttrs(req) {
        var q = req.query;
        for (var attr in q) {
            if (attrStore.indexOf(attr) === -1) {
                attrStore.push(attr);
                attrStoreRow[attr] = new module.Row(attr);
            }
        }
        attrStore.sort(function(a, b) {
            return a.localeCompare(b, 'kn', { "numeric": true });
        });
        renderRows();
    }

    function renderRows() {
        module.foreachAttr(function(i, attr, row) {
            if (!row.exist()) {
                row.render();
            }
        });
    }


    function isNewAd(req) {
        var q = req.query,
            id = q.ns__p || q.ns__t,
            event = q.ns_ad_event;

        return (id && event == "load" && !adStore[id]);
    }

    function addNewAd(req) {
        var q = req.query,
            id = q.ns__p || q.ns__t;

        var ad = new module.Ad(id);
        ad.render();

        ad.update(req);
        console.log("NEW", id, q.ns_ad_event);
        adStore[id] = ad;
    }

    function appendReq(req) {
        var q = req.query;
        var id = q.ns__p || q.ns__t;
        if (adStore[id]) {
            var ad = adStore[id];
            if (q.ns_ad_event == 'unload') {
                console.log("DELETE", id, q.ns_ad_event);
                ad.dispose();
                delete adStore[id];
            } else {
                console.log("UPDATE", id, q.ns_ad_event);
                ad.update(req);
            }
        }
    }

    

    

    var Attr = function(attr, value, ad) {
        this.updates = 0;
        this.len = 100;
        this.attr = attr;
        this.value = value;
        this.ad = ad;
        this.el = null;
        this.container = null;
    };

    Attr.prototype.update = function(newValue) {
        if (newValue != this.value && this.el) {
            if (this.updates === 0) {
                this.el.empty();
                if (this.value !== undefined) {
                    this.el.removeClass('inline');
                    $('<div class="vvalue" />').text(this.value).appendTo(this.el);
                    this.updates++;
                }
            }
            var value = newValue.substr(0, this.len);
            $('<div class="vvalue" />').text(value).appendTo(this.el);

        }
        this.value = newValue;
        if (!this.el) this.render();
    };

    Attr.prototype.render = function() {
        var attrEl = $('<div class="attr" />');
        var nameEl = $('<span class="name" />').text(this.attr);

        var value = this.value === undefined ?  '---' : this.value;
        value = value.substr(0, this.len);
        var valueEl = $('<div class="value inline" />').text(value);
        
        attrEl.append(nameEl);
        attrEl.append(valueEl);

        this.place(attrEl);

        this.el = valueEl;
        this.container = attrEl;
    };

    

    Attr.prototype.dispose = function() {
        if (this.el) {
            this.el.remove();
            this.el = null;
        }
        this.ad = null;
    };

})(TDev, TDev.GridV2 = {});