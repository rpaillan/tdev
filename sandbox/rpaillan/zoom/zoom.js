var ns_ = {};

$(function() {
    function isDefined(o) {
        return typeof o !== 'undefined';
    }
    function isObject(o) {
        return typeof o === 'object';
    }

    function detectFlash() {
        var FLASH_MIME_TYPE = "application/x-shockwave-flash"
        , SHOCKWAVE_FLASH = "Shockwave Flash"
        , nav = navigator
        ,w = window,
        FlashDetection;

      // Based on SWFObject2
      if (isDefined(nav.plugins) && isObject(nav.plugins[SHOCKWAVE_FLASH])) {
        var d = nav.plugins[SHOCKWAVE_FLASH].description;
        if (d 
          && isDefined(nav.mimeTypes)
          && nav.mimeTypes[FLASH_MIME_TYPE]
          && nav.mimeTypes[FLASH_MIME_TYPE].enabledPlugin) {
          FlashDetection = Number(d.replace(/^.*\s+(\d+)(\.\S+)?(\s+\S+)?$/,"$1"));
        }
      }
      else if (isDefined(w.ActiveXObject)) {
        try {
          var a = new ActiveXObject(SHOCKWAVE_FLASH_AX), d;
          if (a) {
            d = a.GetVariable("$version");
            if (d) {
              FlashDetection = Number(d.split(" ")[1].split(",")[0]);
            }
          }
        }
        catch (e) {}
      }
      if (!FlashDetection || isNaN(FlashDetection)) {
        FlashDetection = 0; // no Flash, and don't retry
      }
      return FlashDetection;
    }
    
    function isCrossDomain() {
        if (window !== window.top) {
            try {
                if (!window.top.location.href) {
                    return true;
                }
            } catch (e) {
                return true;
            }
        }
        return false;
    }

    function webkitZoomLevel () {
        return isCrossDomain() && detectFlash() ? webkitZoomLevel_Flash() : webkitZoomLevel_Svg();
    }

    function webkitZoomLevel_Extended () {
        return isCrossDomain() && detectFlash() ? webkitZoomLevel_Flash() : webkitZoomLevel_Svg_Extended();
    }

    /** 
    * flash (swf) based calculation of zoom level on chrome + safari
    */
    function webkitZoomLevel_Flash() {
        var flashId = 'flash_zoom_level';
        var doc = window.document;
        var flash = doc.getElementById(flashId);
        if (!flash) {

            flash = doc.createElement('object');
            flash.style.border = '1px solid red';
            flash.setAttribute('type', 'application/x-shockwave-flash');
            flash.setAttribute('data', '/lib/zoomd.swf');
            flash.setAttribute('id', flashId);
            flash.setAttribute('width', '10px');
            flash.setAttribute('height', '20px');
            flash.setAttribute('allowScriptAccess', 'true');
            //flash.setAttribute('wmode', 'transparent');
            flash.setAttribute('quality', 'low');
            flash.setAttribute('style', 'position: fixed; top: 5px; left: 5px;'); //top: -9999px; visibility: hidden;
            //flash.setAttribute('style', 'position: absolute; top: -9999px; visibility: hidden;');

            doc.body.appendChild(flash);
        }
        if (flash.getZoomLevel) {
            return flash.getZoomLevel();
        }
        return 1;
    }

    /** 
    * dom + svg based calculation of zoom level on chrome + safari
    * the svg will return the zoom level set at browser level.
    * the dom will return the zoom level set using css (zoom: 1.2)
    * the final zoom is a combination of both
    */
    function webkitZoomLevel_Svg_Extended () {
        var prefix = 'ns__zoom_',
            svgId    = prefix + 'svg',
            scrollId = prefix + 'scroll',
            divId = prefix + 'div',
            cssBase = 'position:absolute; top:-9999px;border:0;',
            ns = 'http://www.w3.org/2000/svg',
            zoom, zoomCss, zoomBrowser, svg,
            scrollw = 17, scroll,
            docWidth, div,
            win = window,
            doc = win.document,
            docEl = doc.documentElement,
            docTop,
            safariFix = false;

        var viewport = win.innerWidth;
        
        // browser zoom
        if (!isCrossDomain()) {
            docTop = win.top.document;
            svg = docTop.getElementById(svgId);
            if (!svg) {
                svg = docTop.createElementNS(ns, 'svg');
                svg.setAttribute('xmlns', ns);
                svg.setAttribute('version', '1.1');
                svg.setAttribute('height', '0');
                svg.setAttribute('width', '0');
                svg.setAttribute('id', svgId);
                docTop.body.appendChild(svg);
            }
            zoomBrowser = svg.currentScale;
        } else {
            zoomBrowser = 1;
        }

        // min width viewport
        div = doc.getElementById(divId);
        if (!div) {
            div = doc.createElement('div');
            div.setAttribute('id', divId);
            div.setAttribute('style', cssBase + 'min-width:100%; margin:0;');
            doc.body.appendChild(div);
        }
        docWidth = div.clientWidth;
        
        // css zoom
        zoomCss = viewport / docWidth;

        // on mac+safari we have an special zoom (two finges to zoom) 
        if (viewport < docEl.clientWidth && zoomCss != 1) {
            safariFix = true;
        }
        if (safariFix) {
            zoomCss = docEl.clientWidth / docWidth;
        }

        // the final zoom is an combination of the zoom set in the browser (browser menu) and the zoom (scale)
        // applied using css. zoom css rule.
        zoom = zoomBrowser * zoomCss;

        if (window.top == window)
        console.log('viewport, docEl.clientWidth, docWidth -->',viewport, docEl.clientWidth, docWidth);

        // if vertical scrollbar visible
        // substract the scrollbar width from the viewport.
        if ( !safariFix && docEl.scrollHeight > docEl.clientHeight && zoomCss != 1) {

            // scrollbar tester
            scroll = doc.getElementById(scrollId);
            if (!scroll) {
                scroll = doc.createElement('div');
                scroll.setAttribute('style', cssBase + 'width:100px; height:100px; overflow:scroll;');
                scroll.setAttribute('id', scrollId);
                doc.body.appendChild(scroll);
            }
            // the scroollbar width is affected by the current zoom level. so des-zoom it
            scrollw = ((scroll.offsetWidth - scroll.clientWidth) * zoomCss.toFixed(1)).toFixed(0);

            // here zoomCss is an aproximation to the real zoom. here we add some filter to normalize the value.
            if (scrollw < 19 && scrollw > 15) scrollw = 17;
            if (zoomCss < 1.1 && Math.abs(scrollw - (viewport - docWidth)) < 3) {
                scrollw = viewport - docWidth;
            }
            viewport -= scrollw;
            zoomCss = viewport / docWidth;
            zoom = zoomBrowser * zoomCss;
        }

        return zoom.toFixed(2);
    }

    function webkitZoomLevel_Svg () {
        var prefix = 'ns__zoom_',
            svgId    = prefix + 'svg',
            ns = 'http://www.w3.org/2000/svg',
            zoomBrowser, svg,
            win = window,
            doc = win.document,
            docTop;
        docTop = isCrossDomain() ? doc : win.top.document;
        svg = docTop.getElementById(svgId);
        if (!svg) {
            svg = docTop.createElementNS(ns, 'svg');
            svg.setAttribute('xmlns', ns);
            svg.setAttribute('version', '1.1');
            svg.setAttribute('height', '0');
            svg.setAttribute('width', '0');
            svg.setAttribute('id', svgId);
            docTop.body.appendChild(svg);
        }
        return svg.currentScale.toFixed(2);
    }

    var fns = {
        'zoom' : function() {
            return webkitZoomLevel() * 100;
        },
        'zoom_extended': function() {
            return webkitZoomLevel_Extended() * 100;
        }
    };

    for (var fn in fns) {
        var container = $('<div />').addClass('fn').text(fn + ' : ').appendTo('#local');
        fns[fn]._el = $('<span />').addClass("value").appendTo(container);
        fns[fn].max = 0;
        fns[fn].min = 500;
    }

    function update() {
        
        function getTick() {
            if (window.performance) {
                return window.performance.now();
            } else {
                return (new Date()).getTime();
            }
        }

        for (var fn in fns) {
            var func = fns[fn];
            var t1 = getTick();
            var value = '';
            try {
                value = fns[fn]();
            } catch(e) {
                value = e;
            }
            var t2 = getTick();
            var time = t2 - t1;

            if (time > func.max) func.max = time;
            if (time < func.min) func.min = time;

            func._el.text(value + " (" + time.toFixed(1) + " min" + func.min.toFixed(1) + " max" + func.max.toFixed(1) + ")ms");
        }
    }

    [0.5, 1, 1.5, 2, 3].map(function(perc) {
        return $('<button />').text((perc * 100) + '%').click(function() {
    
            document.body.style.MozTransformOrigin = 'left top';
            document.body.style.MozTransform = 'scale(' + perc + ', '+perc+')';
            document.body.style.zoom = perc;
            

        }).prependTo('#local');
    });

    
    setInterval(update, 2000);
});