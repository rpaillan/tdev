(function(tDev) {
    
    var TooltipRenderer = function(){
        this.tooltipContainer = null;
    };

    TooltipRenderer.prototype.init = function(){
        var container = document.getElementById("tooltip-container");
        if(!container){
            var container = tDev.Util.newEl("div", {"id": "tooltip-container"});
            document.body.insertBefore(container, document.body.firstChild);
        }
        this.tooltipContainer = document.getElementById("tooltip-container");    
    };

    TooltipRenderer.prototype.hide = function(){
        if(this.tooltipContainer) {
            this.tooltipContainer.style.visibility = 'hidden';  
        }
    };

    TooltipRenderer.prototype.render = function(data, canvas, index){
        
        this.init();

        var attrs = [
            'ns_ad_vsp',
            'ns__t', 'ns__p',
            'c1', 'c2', 'c3',
            'ns_ce_mod',
            'ns_ad_event',


            'c4', 'c5', 'c6',
            //'c7', 'c8', 'c9', 'c10', 'c11', 'c12',

            'ns_ad_sz',
            'ns_type',
            'ns_ad_sd'
          ];

        var detailTable = tDev.Util.newEl("table", {"class":"c-table"});
        var detailTbody = tDev.Util.newEl("tbody");
        if(!index){
            index = data.length - 1;
        }
        var q = data[index].query;
        
        attrs.map(function(cparam) {
            var text = q[cparam] || '---';
            var tr = tDev.Util.newEl("tr");
            var tdParam = tDev.Util.newEl("td");
            var tdValue = tDev.Util.newEl("td");
            tdParam.innerHTML = cparam;
            tdValue.innerHTML = text;
            tr.appendChild(tdParam);
            tr.appendChild(tdValue);
            detailTbody.appendChild(tr);
            return tr;
        });

        detailTable.appendChild(detailTbody);

        var id = 'std';//q['c2'];
        var ttipID = 'ttip_' + id;
        var ttip = document.getElementById(ttipID);
        if (ttip){
            ttip.parentNode.removeChild(ttip);
        }
        ttip = tDev.Util.newEl("div", {"id": ttipID, "class":"tooltip"});    
        this.tooltipContainer.style.left = canvas.width + canvas.offsetLeft;
        this.tooltipContainer.style.top = canvas.y + canvas.offsetParent.offsetTop;
        
        //History
        var historyTable = tDev.Util.newEl("table", {"class":"h-table"});
        var historyTbody = tDev.Util.newEl("tbody");
        
        function addClickHandler(link, i){
            link.addEventListener('click', function(e){
                tDev.TooltipRenderer.render(tDev.AdVisualizer.adMap[q.ns_ad_id], tDev.AdVisualizer.canvas, i);
            }, false)
        }

        for(var i = data.length-1; i>=0; i--){
            var tr = tDev.Util.newEl("tr");
            var td = tDev.Util.newEl("td");

            addClickHandler(td, i);
            td.innerHTML = data[i].query.ns_ad_event + ' - ' + data[i].query.ns__t;
            tr.appendChild(td);
            historyTbody.appendChild(tr);
          
        }
   
        historyTable.appendChild(historyTbody);

        var divHisto = tDev.Util.newEl("div", {"class":"histo"});    
        var divDetail = tDev.Util.newEl("div", {"class":"detail"});    
        divHisto.appendChild(historyTable);
        divDetail.appendChild(detailTable);
        
        ttip.appendChild(divDetail);
        ttip.appendChild(divHisto);
        this.tooltipContainer.appendChild(ttip);
        
        this.tooltipContainer.style.visibility = 'visible';
    };

    tDev.TooltipRenderer = new TooltipRenderer();
})(TDev);