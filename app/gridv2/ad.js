(function(app, module){

    var Ad = function(id) {
        this.event = '--';
        this.id = id;
        this.el = null;
        this.titleEl = null;
        this.infoEl = null;
        this.cells = {};

        this.infoView = {
            browser: false,
            os: false,
            iframe: false,
            events: []
        };
    };

    Ad.prototype.render = function() {
        this.titleEl =  $('<div class="title" />').text(this.id + ' :: ' + this.event);
        var th = $('<th />').append(this.titleEl);
        module.view.head.append(th);
        this.el = th;

        var info = $('<div class="sticky-info" />').appendTo(th);
        this.infoEl = info;
        
        this.infoEl.sticky({
            topSpacing: 10
        });

        this.infoView.iconEl = $('<div class="icon-set"/>').appendTo(info);
        this.infoView.eventEl = $('<div class="events"/>').appendTo(info);
    };

    Ad.prototype.updateStikyInfo = function (req) {
        var q = req.query;
        var c = this.infoView;

        var browserName = q["ns_ad_db__0_browser.name"];
        if (!c.browser && browserName) {
            var browser = browserName.toLowerCase().split('/').shift();
            if (browser) {
                c.iconEl.append($('<div class="icon" />').addClass(browser));
            }
            c.browser = true;
        }

        var osName = q["ns_ad_db__2_navigator.platform"];
        if (!c.os && osName) {
            var os = osName.toLowerCase();
            if (os) {
                c.iconEl.append($('<div class="icon" />').addClass(os));
            }
            c.os = true;
        }

        var iframeNumber = q["ax_iframe"];
        if (!c.iframe && iframeNumber) {
            var iframe = iframeNumber.toLowerCase();
            if (iframe) {
                iframe = {'0': 'IN', '1': 'FI', '2': 'XI'}[iframe];
                c.iconEl.append($('<div class="icon text" />').text(iframe));
            }
            c.iframe = true;
        }

        var event = q["ns_ad_event"];
        if (event && c.events.indexOf(event) == -1) {
            c.events.push(event);
            var color = 'white';
            if (module.eventColors[event]) {
                color = module.eventColors[event];
                c.eventEl.append($('<span class="event" />')
                    .css('backgroundColor', color)
                    .text(event));
            }
        }

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

        this.updateStikyInfo(req);
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