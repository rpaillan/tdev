(function(tdev) {

    var attrStore = {};
    var adStore = {};

    function foreachAttr(f) {
        for (var attr in attrStore) f(attr);
    }

    tdev.on('app-init', function() {
        var tab = tdev.newTab("Log Vertical");
        prepareTable(tab);
    });

    tdev.on('req-received', function(e, req) {
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
            if (!attrStore[attr]) {
                attrStore[attr] = 0;
            }
        }
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

        var ad = new Ad(id);
        ad.update(req);

        adStore[id] = ad;
        console.log("NEW", id, q.ns_ad_event);

        ad.render();
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

    function prepareTable(container) {
        var html = $('<div class="logsv"></div>');
        html.appendTo(container);
    }

    var Ad = function(id) {
        this.event = '--';
        this.id = id;
        this.el = null;
        this.titleEl = null;
        this.attrs = {};
    };

    Ad.prototype.render = function() {
        this.el = $('<div class="ad">');
        this.titleEl =  $('<div class="title" />').text(this.id + ' :: ' + this.event).appendTo(this.el);
        $('.logsv').append(this.el);
        for (var attr in this.attrs) {
            this.attrs[attr].render();
        }
    };

    Ad.prototype.dispose = function() {
        for (var attr in this.attrs) {
            if (this.attrs[attr] && this.attrs[attr].dispose) {
                this.attrs[attr].dispose();
            }
        }
        this.el.empty();
        this.el.remove();
        this.el = null;
        this.attrs = null;
    };

    Ad.prototype.update = function(req) {
        this.event = req.query.ns_ad_event || '--';
        var me = this;
        foreachAttr(function(attr) {
            me.updateAttr(attr, req.query[attr]);
        });
        if (this.titleEl) {
            this.titleEl.text(this.id + ' :: ' + this.event);
        }
    };

    Ad.prototype.updateAttr = function(attr, value) {
        if (!this.attrs[attr]) {
            var oAttr = new Attr(attr, value, this);
            this.attrs[attr] = oAttr;
        } else {
            this.attrs[attr].update(value);
        }
    };

    var Attr = function(attr, value, ad) {
        this.len = 100;
        this.attr = attr;
        this.value = value;
        this.ad = ad;
        this.el = null;
    };

    Attr.prototype.update = function(newValue) {
        if (newValue != this.value) {
            this.el.removeClass('inline');
            var value = newValue || '---';
            value = value.substr(0, this.len);
            $('<span class="vvalue" />').text(value).appendTo(this.el);
        }
        this.value = newValue;
    };

    Attr.prototype.render = function() {
        var attrEl = $('<div class="attr" />');
        var nameEl = $('<span class="name" />').text(this.attr);

        var value = this.value || '---';
        value = value.substr(0, this.len);
        var valueEl = $('<div class="value inline" />').text(value);
        
        attrEl.append(nameEl);
        attrEl.append(valueEl);
        this.ad.el.append(attrEl);

        this.el = valueEl;
    };

    Attr.prototype.dispose = function() {
        if (this.el) {
            this.el.remove();
            this.el = null;
        }
        this.ad = null;
    };

})(TDev);