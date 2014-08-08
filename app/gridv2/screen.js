(function(app, module){

    var Screen = function(el, maxWidth, maxHeight, ad) {
        this.el = null;
        this.maxWidth = maxWidth;
        this.maxHeight = maxHeight;
        this.ad = ad;

        this.idx = 0
        
        this.boxes = {};
        this.showContainer(el);
        this.colors = [
            '#52656B',
            '#FF3B77',
            '#CDFF00',
            '#FFFFFF'
        ];

    };

    Screen.attr = 'zzScreen';

    Screen.prototype.doStatic = function(el, panel) {
        var box = panel.box;
        el.css({
            'position': 'absolute',
            'top': box._t,
            'left': box._l,
            'width': box._w,
            'height': box._h,
            'border': '1px solid ' + panel.color,
            'backgroundColor': panel.color,
            'opacity': '0.5'
        });
        return el;
    };

    Screen.prototype.doStaticText = function(el, panel) {
        var box = panel.box;
        el.css({
            'position': 'absolute',
            'top': box._t,
            'left': box._l,
            'color': 'white',
            'padding': '2px',
            'fontSize': '10px'
        });
        return el;
    };

    Screen.prototype.showContainer = function(td) {
        var box = {t: 0, l:0, w: this.maxWidth, h: this.maxHeight};
        var div0 = $('<div />');
        var div1 = $('<div />');
        div0.css({
            'position': 'static',
            'width': box.w,
            'height': box.h,
            'margin': '4px'
        });
        div1.css({
            'position': 'relative',
            'width': box.w,
            'height': box.h
        });

        div0.append(div1);
        td.append(div0);
        this.el = div1;
        this.el0 = div0;
    };

    Screen.prototype.updateText = function(el, panel) {
        var box = panel.box;
        var txt = panel.name + ' ' + box.w + 'x' + box.h + ' (' + box.l + 'x' + box.t + ')';

        if (panel.name === 'screen') {
            txt += ', zoom: ' + (this.get('ns_ad_zm') || '100') + '%';
        }
        if (panel.name === 'creative') {
            txt += ', vis: ' + this.get('ns_ad_vi') + '%';
        }
        el.text(txt);
    };

    Screen.prototype.update = function() {
        this.renderBox("screen", "ns_ad_vsp", "ns_ad_vsd");
        this.renderBox("viewport", "ns_ad_vvp", "ns_ad_vvd");
        this.renderBox("creative", "ns_ad_vap", "ns_ad_vad");
        this.renderAllBoxes();
    };

    Screen.prototype.renderBox = function(name, pos, size) {

        var el, elText;

        if (!this.boxes[name]) {
            el = $('<div />');
            elText = $('<div />');
            this.boxes[name] = {
                color: this.colors[this.idx++ % this.colors.length],
                name: name,
                el: el,
                box: null,
                elText: elText
            };
            this.el.append(el);
            this.el.append(elText);
        } else {
            el = this.boxes[name].el;
            elText = this.boxes[name].elText;
        }

        var pValue = this.getArray(pos);
        var sValue = this.getArray(size);
        var box = {
            l: pValue[0],
            t: pValue[1],
            w: sValue[0],
            h: sValue[1]
        };

        box.r = box.l + box.w;
        box.b = box.t + box.h;

        this.boxes[name].box = box;

        elText.text(name + ' ' + box.w + 'x' + box.h + ' (' + box.l + 'x' + box.t + ')');
    };

    Screen.prototype.renderAllBoxes = function() {
        var panel, boxName ;
        var maxW = 0, maxH = 0;
        for (boxName in this.boxes) {
            panel = this.boxes[boxName];
            var box = panel.box;
            if (box.r > maxW) maxW = box.r;
            if (box.b > maxH) maxH = box.b;
        }

        var scale = this.maxWidth / maxW;
        var rMaxH = maxH * scale;
        this.el.css('height', rMaxH);
        this.el0.css('height', rMaxH);

        console.log('maxW, maxH -->',maxW, maxH, scale);

        for (boxName in this.boxes) {
            panel = this.boxes[boxName];
            this.scaleBox(panel.box, scale);
            this.doStatic(panel.el, panel);
            this.doStaticText(panel.elText, panel);
            this.updateText(panel.elText, panel);
            console.log('updating, boxName, panel.box -->',boxName, panel.box);
        }
    };

    Screen.prototype.scaleBox = function(box, scale) {
        var attrs = 'tlwh'.split('');
        attrs.forEach(function(attr) {
            box['_' + attr] = box[attr] * scale;
        });
    };

    Screen.prototype.getArray = function(attr) {
        if (attr instanceof Array) {
            return attr;
        }
        var values = this.get(attr);
        if (values !== undefined) {
            values = values.split('x').map(function(val) { return parseInt(val, 10); });
            return values;
        }
        return [0, 0];
    };

    Screen.prototype.get = function(attr) {

        var cells = this.ad.cells;
        var value;
        if (cells[attr]) {
            console.log('cells[attr] -->',cells[attr]);
            value = cells[attr]['value'];
        }
        console.log('attr, value -->',attr, value);
        return value;
    };

    module.Screen = Screen;

})(TDev, TDev.GridV2);