(function(tdev) {
    tdev.on('app-init', init);
    tdev.on('req-received', function(e, data) {
        render(data);
    });
    var ad_db_params = "browser name|timezoneOffset|navigator.platform|number of plugins|history length|build id|browser language|CPU class|System Language|User Language|Vendor|Mouse position|Scroll Offset|Value of SafeFrame's inViewPercentage API|<Opacity><Refresh value><Focus state><isReferrer><activeX enabled><java Enabled><Flash available><Mouse moved><Click><Press><Resize><scroll><z index><Pepper Flash enabled>";
    ad_db_params = ad_db_params.split('|');
    ad_db_params[ad_db_params.length - 1] = ad_db_params[ad_db_params.length - 1].replace(/></g, '|').replace('<', '').replace('>', '').split('|');
    var colors = ["#9877ae", "#45bece", "#41d8ba", "#afabf9", "#83838b", "#5e9fbe", "#91c873", "#fe6baf", "#ffba00", "#ff6633", "#d84819", "#54a57a", "#d0ab99", "#fb8801", "#ffd35c"];
    var colorIndex = 0;
    var colorMap = {};
    var attrs = ['ns_ad_event', 'ns_ad_zm', 'ns_ad_db', 'ns__t', 'ns__p', 'c1', 'c2', 'c3', 'ns_ce_mod', 'c7', 'c8', 'ns_ad_sz', 'ns_type', 'ns_ad_sd', 'ns_ad_vw'];

    function renderAdDb(addb) {
        if (addb.indexOf('|') == -1) return null;
        var res = '';
        var addbA = addb.split('|');
        ad_db_params.forEach(function(unitName, i) {
            var value = addbA[i];
            if (i == addbA.length - 1) {
                var subUnitA = value.split('');
                value = '';
                unitName.forEach(function(subUnitName, j) {
                    var subValue = subUnitA[j];
                    var color = subValue === '1' ? 'green' : 'red';
                    value += '<span class="' + color + '">' + subUnitName + '</span> |';
                });
                unitName = addbA[i];
            }
            res += '<span class="addb-item">' + unitName + ' : ' + value + '</span>';
        });
        return res;
    }

    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    function hexToRgba(hex, alpha) {
        var rgb = hexToRgb(hex);
        return 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + alpha + ')';
    }

    function render(req) {
        var q = req.query;
        //console.log('q -->', q);
        var adId = q.ns__p || q.ns__t;
        if (!colorMap[adId]) {
            if (colorIndex == colors.length - 1) colorIndex = 0;
            colorMap[adId] = colors[colorIndex++];
        }
        var color = colorMap[adId];
        var tr = $('<tr />').css('background-color', hexToRgba(color, 0.4));
        var trDbValue = null;
        $('<td />').text(index++).appendTo(tr);
        var tds = attrs.map(function(cparam) {
            var text = q[cparam] || '---';
            var td = $('<td />');
            if (cparam == 'ns_ad_db') {
                trDbValue = renderAdDb(text);
                text = '';
            }
            td.html(text);
            td.addClass(cparam);
            return td;
        });
        tr.append(tds);
        if (renderADDB && trDbValue) {
            var tr2 = $('<tr />');
            var td = $('<td />');
            td.attr('colspan', attrs.length + 1);
            td.html(trDbValue);
            tr2.append(td);
            tableBody.prepend(tr2);
        }
        tableBody.prepend(tr);
    }
    var tableBody = null;
    var index = 0;
    var renderADDB = false;

    function init() {

        var tab = tdev.newTab("Logs");

        var html = $('<table class="log"><thead id="tablehead"></thead><tbody id="tablebody"></tbody></table>');
        html.appendTo(tab);

        tableBody = $('#tablebody');
        var trHeader = $('<tr />');
        $('<td />').text('#').appendTo(trHeader);
        var ths = attrs.map(function(cparam) {
            var th = $('<th />');
            th.text(cparam);
            th.addClass(cparam);
            return th;
        });
        trHeader.append(ths);
        $('#tablehead').append(trHeader);
    }
    /*
          ax_cid: "9999"
ax_iframe: "0"
ax_mid: "2377995584297567"
c1: "3"
c2: "9999"
c3: "_e0_2816501"
c4: "21172699"
c5: "2816536_170437"
c6: ""
c10: ""
c11: "170437"
c13: "225"
c16: "adtech"
ns__c: "UTF-8"
ns__p: "1403584297507"
ns__t: "1403584297578"
ns_ad_event: "found"
ns_ad_id: "ns_ad1403584297507"
ns_ad_pid: "1403584297567"
ns_ad_po: "8x8"
ns_ad_sc: "0x0"
ns_ad_sd: "1920x1080"
ns_ad_sv: ""
ns_ad_sz: "728x90"
ns_ad_vad: "728x90"
ns_ad_vap: "1818x197"
ns_ad_vi: "46"
ns_ad_vsd: "1920x1080"
ns_ad_vsp: "1600x0"
ns_ad_vvd: "342x668"
ns_ad_vvp: "1810x189"
ns_ad_vw: "342x668"
ns_ad_wkv: "0"
ns_ce_mod: "vce_st"
ns_type: "hidden"
uid: "ns_ad1403584297507"
*/
})(TDev);