(function(tDev) {
    var AdVisualizer = function() {
        this.canvas = null;
        this.context = null;
        this.zoomFactor = 0.2;
        this.adMap = {};
    };


    AdVisualizer.prototype.calculateZoomFactor = function(size, border) {
        this.zoomFactor = (this.canvas.parentElement.offsetHeight - 2*border) / size.height;
    };

    AdVisualizer.prototype.getZoomedValue = function(value) {
        if (value && typeof value === 'object') {
            for (var property in value) {
                if (value[property]) {
                    value[property] = value[property] * this.zoomFactor;
                }
            }
            return value;
        }
        return value * this.zoomFactor;
    };

    AdVisualizer.prototype.initCanvas = function(canvas, size, border) {
        var that = this;
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');
        this.calculateZoomFactor(size,border);
        size = this.getZoomedValue(size);
        this.context.clearRect ( 0 , 0 , size.width , size.height );
        this.canvas.width = size.width + border;
        this.canvas.height = size.height + border;

        this.drawGrid('lightgray', 10, 10, size);

        function getMousePos(canvas, evt) {
            var rect = canvas.getBoundingClientRect();
            return {
              x: evt.clientX - rect.left,
              y: evt.clientY - rect.top
            };
          }

        this.canvas.addEventListener('mousemove', function(evt) {
            var mousePos = getMousePos(canvas, evt);
            for (var ad in that.adMap) {
                var onAdd = false;
                var lastValue = that.adMap[ad][that.adMap[ad].length - 1];
                if(mousePos.x > lastValue.position.x && mousePos.x < lastValue.size.width + lastValue.position.x){
                    if(mousePos.y > lastValue.position.y && mousePos.y < lastValue.size.height + lastValue.position.y){
                        onAdd = true;
                    }
                }             
                if(onAdd) {
                    tDev.TooltipRenderer.render(that.adMap[ad], that.canvas);
                } else {
                    tDev.TooltipRenderer.hide();
                }  
            }
        }, false);

    };

    AdVisualizer.prototype.drawGrid = function(color, stepx, stepy, size) {
        this.context.save()
        this.context.fillStyle = 'white';
        this.context.fillRect(0, 0, size.width, size.height);
        this.context.lineWidth = 0.5;
        this.context.strokeStyle = color;
        for (var i = stepx + 0.5; i < size.width; i += stepx) {
            this.context.beginPath();
            this.context.moveTo(i, 0);
            this.context.lineTo(i, size.height);
            this.context.stroke();
        }
        for (var i = stepy + 0.5; i < size.height; i += stepy) {
            this.context.beginPath();
            this.context.moveTo(0, i);
            this.context.lineTo(size.width, i);
            this.context.stroke();
        }
        this.context.restore();
    };

    AdVisualizer.prototype.drawAd = function(position, size) {
        this.context.save();
        this.context.strokeStyle = 'black';
        this.context.globalAlpha = 0.5;
        this.context.lineWidth = 1;
        this.context.fillStyle = 'blue';
        this.context.fillRect(position.x, position.y, size.width, size.height);
        this.context.strokeRect(position.x, position.y, size.width, size.height);
        this.context.restore();
    };

    AdVisualizer.prototype.addMeasures = function(adPosition, adSizeZoomed, adSize) {
        this.context.save();
        this.context.strokeStyle = 'red';
        this.context.globalAlpha = 0.5;
        this.context.lineWidth = 1;
        
        //Horizontal Line
        this.context.beginPath();
        this.context.moveTo(adPosition.x,adPosition.y + adSizeZoomed.height + 5);
        this.context.lineTo(adPosition.x + adSizeZoomed.width, adPosition.y + adSizeZoomed.height + 5);
        this.context.stroke();
        
        this.context.moveTo(adPosition.x, adPosition.y + adSizeZoomed.height + 2);
        this.context.lineTo(adPosition.x, adPosition.y + adSizeZoomed.height + 8);
        this.context.stroke();

        this.context.moveTo(adPosition.x + adSizeZoomed.width, adPosition.y + adSizeZoomed.height + 2);
        this.context.lineTo(adPosition.x + adSizeZoomed.width, adPosition.y + adSizeZoomed.height + 8);
        this.context.stroke();

        //Vertical Line
        this.context.beginPath();
        this.context.moveTo(adPosition.x + adSizeZoomed.width + 5, adPosition.y);
        this.context.lineTo(adPosition.x + adSizeZoomed.width + 5, adPosition.y + adSizeZoomed.height);
        this.context.stroke();
        
        this.context.moveTo(adPosition.x + adSizeZoomed.width + 2, adPosition.y);
        this.context.lineTo(adPosition.x + adSizeZoomed.width + 8, adPosition.y);
        this.context.stroke();

        this.context.moveTo(adPosition.x + adSizeZoomed.width + 2, adPosition.y + adSizeZoomed.height);
        this.context.lineTo(adPosition.x + adSizeZoomed.width + 8, adPosition.y + adSizeZoomed.height);
        this.context.stroke();

        this.context.globalAlpha = 1;
        this.context.font='9px Arial';
        this.context.fillStyle = 'red';
        this.context.fillText(adSize.width + ' px',adPosition.x + adSizeZoomed.width/2 - 10, adPosition.y + adSizeZoomed.height + 15);
        this.context.fillText(adSize.height + ' px',adPosition.x + adSizeZoomed.width + 15, adPosition.y + adSizeZoomed.height/2);
        
        this.context.restore();        
    };

    AdVisualizer.prototype.addText = function(adPosition, adSizeZoomed, oText ) {
        this.context.save();
        
        this.context.globalAlpha = oText.globalAlpha || 1;
        this.context.font = oText.font?oText.font:'15px Arial';
        this.context.fillStyle = oText.fillStyle?oText.fillStyle:'green';
        
        var position  = {};
        if(!oText.position) oText.position = 'CENTER';
        switch (oText.position){
            case 'CENTER':
                position.x = adPosition.x + adSizeZoomed.width/2 - 10;
                position.y = adPosition.y + adSizeZoomed.height/2 + 5;
            break;
        }

        this.context.fillText(oText.text, position.x, position.y);
        this.context.restore();
    };

    AdVisualizer.prototype.drawviewPort = function(position, size) {
        this.context.save();
        this.context.fillStyle = 'grey';
        this.context.globalAlpha = 0.2;
        this.context.fillRect(position.x, position.y, size.width, size.height);
    };

    AdVisualizer.prototype.getSizeValue = function(key) {
        var splitter = 'x';
        value = key.split(splitter);
        value = {
            width: value[0],
            height: value[1]
        };
        return value;
    };

    AdVisualizer.prototype.getPositionValue = function(key) {
        var splitter = 'x';
        value = key.split(splitter);
        value = {
            x: value[0],
            y: value[1]
        };
        return value;
    };

    AdVisualizer.prototype.showVisibility = function(data) {
         
        var qp1 = false;
        var qp5 = false; 
        var qp60 = false;

        for(var i = data.length-1; i>=0; i--){
            var q  = data[i].query;
            if(q.ns_ad_event ==='qp1') qp1 = true;
            if(q.ns_ad_event ==='qp5') qp5 = true;
            if(q.ns_ad_event ==='qp60') qp60 = true;
        }

        var adPosition = data[data.length - 1].position;

        var marginX = 2;
        var marginY = 2;
        var offsetY = adPosition.y + marginY;
        var offsetX = adPosition.x + marginX;
        var width = 7;
        var height = 8;

        this.context.save();
        this.context.strokeStyle = 'white';
        this.context.globalAlpha = 1;
        this.context.lineWidth = 1;
        this.context.strokeRect(offsetX, offsetY, 29, 12);
        this.context.restore();
        
        offsetY+=2;
        offsetX+=2;


        if(qp1) {
            this.drawQpIcon(offsetX, offsetY, width, height);
            offsetX+=width + marginX;
        }
        if(qp5){
            this.drawQpIcon(offsetX, offsetY, width, height);
            offsetX+=width + marginX;
        }
        if(qp60){
            this.drawQpIcon(offsetX, offsetY, width, height);
        }

        

    };

    AdVisualizer.prototype.drawQpIcon = function(x, y, width, height) {
       this.context.save();
      this.context.globalAlpha = 1;
      this.context.beginPath();
      this.context.lineWidth = 1;
      this.context.strokeStyle = '#BFFF00';
      this.context.fillStyle = '#BFFF00';
      this.context.fillRect(x, y, width, height);
      this.context.restore();

    };

    AdVisualizer.prototype.draw = function(canvas, query) {
        var pageSize, viewPortSize, viewPortPosition;
   
        if (query) {
            pageSize = this.getSizeValue(query.ns_ad_vw);
            viewPortSize = this.getSizeValue(query.ns_ad_vvd);
            viewPortPosition = this.getPositionValue(query.ns_ad_sc);

            this.initCanvas(canvas, pageSize,20);
            
            if (query.ns_ad_event && query.ns_ad_vad) {
                var ad = {};
                ad.size = this.getZoomedValue(this.getSizeValue(query.ns_ad_vad));
                ad.position = this.getZoomedValue(this.getPositionValue(query.ns_ad_po));
                ad.query = query;
                
                if(!this.adMap[query.ns_ad_id]){
                    this.adMap[query.ns_ad_id] = [];
                }

                if(this.adMap[query.ns_ad_id]){
                    this.adMap[query.ns_ad_id].push(ad);    
                }
            }

            viewPortSize = this.getZoomedValue(viewPortSize);
            viewPortPosition = this.getZoomedValue(viewPortPosition);
            this.drawviewPort(viewPortPosition, viewPortSize);
            
            for (var ad in this.adMap) {
                var lastValue = this.adMap[ad][this.adMap[ad].length - 1];
                this.drawAd(lastValue.position, lastValue.size);
                this.addMeasures(lastValue.position, lastValue.size, this.getSizeValue(lastValue.query.ns_ad_vad));
                //this.addText(lastValue.position, lastValue.size, {text: '50%',fillStyle: 'white'});
                this.showVisibility(this.adMap[ad]);
            }
        }
    }

    tDev.AdVisualizer = new AdVisualizer();
})(TDev);