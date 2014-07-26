(function(tDev) {
    var util = {
        newEl: function(sName, oAttributes) {
            var el = document.createElement(sName);
            if (typeof oAttributes === "object") {
                for (var attr in oAttributes) {
                    if (this.hasContent(oAttributes[attr])) {
                        el.setAttribute(attr, oAttributes[attr]);
                    }
                }
            }
            return el;
        },
        hasContent: function(value) {
            return (value !== null && value !== undefined) ? true : false;
        }
    };

    tDev.Util = util;

})(TDev);