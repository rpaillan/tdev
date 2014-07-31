(function(app, module){

    module.attrinfo = {
        'c1': { desc: 'Measurement type', alt: 'Measurement Type, The value should always be "3".'},
        'c2': { desc: 'Client ID', alt: 'Client ID'},
        'c3': { desc: 'Campaign ID', alt: 'Ad Server Campaign ID'},
        'c4': { desc: 'Creative ID', alt: 'Ad Server Creative ID'},
        'c5': { desc: 'Placement ID', alt: 'Ad Server Ad Placement ID'},
        'c6': { desc: '*', alt: 'Custom ID, or Cookie Value, or CPN Value' },
        'c7': { desc: '[A] Publisher Page Url', alt: 'If the CA Tag is included in a document that is loaded in an iframe this will be the URL of the iframe document. c7 value in the page view impression measurement would be consistent across all subsequent event measurement, even if page URL changes due to history changing browser APIs like pushState or replaceState.(limit 700 characters)'},
        'c8': { desc: '[A] Publisher Page Title', alt: 'If the CA Tag is included in a document that is loaded in an iframe this will be the title of the iframe document.'},
        'c9': { desc: '[A] Referer Url', alt: 'If the CA Tag is included in a document that is loaded in an iframe this will be the URL of the document that contains the iframe. c9 value in the page view impression measurement would be consistent across all subsequent event measurement even if document referrer changes.'},
        'c10': { desc: '*', alt: 'Used for BSL: "1": Test, "2": Control'},

        'c11': { desc: 'Site ID', alt: 'Ad Server Site ID'},
        'c12': { desc: 'Project ID', alt: 'Used for BSL: Project ID'},
        'c13': { desc: 'Creative Size', alt: 'Ad Server Creative Size'},
        'c14': { desc: '*', alt: 'Used for Ad Network reporting in MMX: Genre/Channel ID'},
        'c16': { desc: 'Ad Server', alt: 'Ad Server'},
        'ns_ce_sv': { desc: 'Software Version', alt: 'the software version of the tag'},
        'ns_ce_mod': { desc: 'Enabled Modules', alt: 'a comma-separeted list of modules that are turned on - 1 or more of the following: BSL(Brand Survey Lift) BSL_LF(BSL Long Form) vCE_ST(Validated Campaign Essentials Single Truth)'},
        'ns_ad_boot': { desc: 'VCE_ST Load Time', alt: 'time in milli seconds to load vce_st.js'},
        'ns__t': { desc: 'Impression Timestamp', alt: 'a Unix timestamp of the moment the impression measurement was generated'},
        'ns__m': { desc: 'Multiple Tracking', alt: 'a Unix timestamp, seen only when there are 2 or more tags on the page tracking the same ad. Value equals ns__t value of 1st tag'},
        'ns_c': { desc: 'Encoding', alt: 'the Character Encoding used by the UserAgent (web browser)'},
        'ax_iframe': { desc: 'on Iframe?', alt: '(only present if the vGRP module is enabled), Indicates whether or not the CA Tag was loaded in an iframe. not present: not served in an iframe. present with value 1: served in a friendly iframe. present with value 2: served in a regular (unfriendly) iframe.'},
        'uid': { desc: 'Ad ID', alt: 'automatically generated ad id'},
        'ns__p': { desc: 'Ad link ID', alt: 'Unix timestamp of the impression event (used to link all Ad Visibility events to a single impression event containing the same value in ns__t).'},
        
        'ax_cid': { desc:'AdXpose Client ID', alt: 'AdXpose client ID'},
        'ax_blt': { desc: 'RPC Latency Time', alt: 'RPC call latency time in milliseconds.'},
        'ax_bl': { desc: 'RPC Return Code', alt: 'The blocking request return code. The codes mean the following: 1: Brand Safety 2: Blacklist 3: Whitelist 4: Keyword 5: Category 6: Country 7: DMA'},
        'ax_bl_data': { desc: 'RPC Return Data', alt: 'Specific data tied to the blocking alert value in ax_bl. The following info is provided: 4 (Keyword): a comma-separated list of keywords that were blocked on, 5 (Category): a comma-separated list of categories that were blocked on, 6 (Country): the two-letter country code that was blocked on, 7 (DMA): the DMA code that was blocked on, This param is blank for all other alert types.'},
        'ax_vt': { desc: 'View Time Delay', alt: 'view time (time that has passed since the last measurement)'},
        'ax_gt': { desc: 'Engagement Time', alt: 'engagement time, (time that has passed since the last measurement)'},
        'ax_gd': { desc: 'engagement Count', alt: 'engagement count, (occurrences since the last measurement)'},

        'ax_mid': { desc: 'Impression ID', alt: 'impression ID which is a random number that is passed along with all events (˜unique id for an ad) and is combined with other key values in post-processing.'},
        'ax_tb': { desc: 'Toolbar Size', alt: 'the observed toolbar size (in pixels)'},
        'ax_ad_zm': { desc: 'Zoom', alt: 'the zoom factor'},
        
        'ns_ad_wkv': { desc: 'Tab Visibility', alt: 'is added to the found measurement in WebKit-based browsers with its value being Page Visibility API document.webkitHidden value indicating if the tab is active or in background, when the API is available'},
        'ns_ad_avt': { desc: 'Total Visible Time', alt: 'indicating the accumulated visible time of the ad in milliseconds'},
        'ns_ad_event': { desc: 'Event', alt: 'the event type which matches with the Validation measurement event names used in this table (load, boot, found, late, show, hide, qp1, qp5, qp60, unload)'},
        'ns_ad_ec': { desc: 'Late Call', alt: 'ns_ad_ec is 1 for a found/late call. The value is then incremented by 1 for every subsequent call.'},
        'ns_ad_gg': { desc: 'Total Engagement Time', alt: 'total engagement time'},
        'ns_ad_gc': { desc: 'Total Engagement Count', alt: 'total engagement count'},
        'ns_ad_ck': { desc: 'Click Marker', alt: 'click marker which is included when ad has been clicked'},
        'ns_ad_pid': { desc: 'Page ID', alt: 'page ID (a "page load" timestamp) which is included for each event'},
        'ns_ad_rf': { desc: 'Outer Referer', alt: 'the referrer of the outer frame only present if the following applies: the tag is served in an iframe, the referrer of the outer iframe can be detected, the domain of the referrer of the outer iframe is different from the domain of the iframe that contains the tag, limit is 250 characters'},
        'ns_ad_vw': { desc: 'Viewport Dimension', alt: 'viewport dimensions'},
        'ns_ad_sc': { desc: 'Scrolled Offset', alt: 'scrolled offset'},

        'ns_ad_id': { desc: 'Ad ID', alt: 'ad ID'},
        'ns_ad_sz': { desc: 'Ad Size', alt: 'ad size (in pixels)'},
        'ns_ad_tb': { desc: 'Top Toolbar', alt: 'The estimated browser margin between window top and document top (toolbar) if detected.'},
        'ns_ad_tn': { desc: 'Tag Name', alt: 'HTML element tag name'},
        'ns_ad_po': { desc: 'Ad Position', alt: 'ad position (in pixels) with respect to viewport top left corner. In an iframe case this would most likely be 0x0 because the viewport is the iframe document itself and the creative occupies the entire document.'},
        'ns_ad_vi': { desc: 'Ad Visible Area %', alt: 'ad visible area %'},
        'ns_ad_src': { desc: 'Ad Src', alt: 'ad src attribute which is included when applicable(limit 150 characters)'},
        'ns_ad_sv': { desc: 'Visibility Software Version', alt: 'ad visibility code software version'},
        'ns_ad_sd': { desc: 'Screen Dimensions (adjusted)', alt: '(adjusted) screen dimensions (wxh in pixels). WxH values are adjusted with the zoom factor when needed (IE8+ and FF) to represent the physical dimensions of the screen. As the zoom level cannot be detected in FF3.5 and FF3.6, the reported screen dimensions will be affected by zoom.'},
        'ns_ad_vsd': { desc: 'Screen Dimensions', alt: 'screen dimensions (wxh in pixels)'},
        'ns_ad_vsp': { desc: 'Screen Offset', alt: 'screen offset from primary display, if different than 0x0 (lxt - reported for secondary monitors by some browsers). All other visibility values should be relative to 0x0 (primary display offset)even if we are on a secondary display.'},
        'ns_ad_vvd': { desc: 'Viewport Dimension', alt: 'viewport dimensions (in pixels)'},
        'ns_ad_vvp': { desc: 'Viewport Position ', alt: 'viewport position (in pixels)'},
        'ns_ad_vad': { desc: 'Ad Dimension', alt: 'ad dimensions (in pixels) with respect to screen top left corner'},
        'ns_ad_vap': { desc: 'Ad Position', alt: 'ad position (in pixels)'},

        'ns_type': { desc: 'Impression Type', alt: 'indicates if the measurements is to be interpreted as a page impression (expected value: "hidden")'},
        'ns_mod_ns': { desc: 'Namespace', alt: 'module namespace (vce (for ST non mod tag), mvce(for ST mod tag) )'},
        'ns_ad_brt': { desc: '*', alt: 'to measure b.scorecardresearch.com response time for impression. Will be present in the first event after a.scorecardresearch.com response comes back'},
        'ns_ad_fpv': { desc: 'Flash Player Version', alt: 'Browser Flash player major version'}



    };

    // '': { desc: '', alt: ''},

    var Row = function(attr) {
        this.attr = attr;
        this.trEl = null;
        this.tdEl = null;
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
            var desc = module.attrinfo[this.attr].desc;
            $('<span class="desc" />').text(' - ' + desc).appendTo(td);

            var alt = module.attrinfo[this.attr].alt;
            if (alt) {
                td.attr('title', alt);
            }
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