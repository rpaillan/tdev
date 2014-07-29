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

    AdVisualizer.prototype.clearCanvas = function(context) {
        context.clearRect ( 0 , 0 , 5000 , 5000 );
    };

    AdVisualizer.prototype.initCanvas = function(canvas, size, border) {
        var that = this;
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');
        this.clearCanvas(this.context);
        this.calculateZoomFactor(size,border);
        size = this.getZoomedValue(size);
        this.canvas.width = size.width + 500;
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
                    //tDev.TooltipRenderer.render(that.adMap[ad], that.canvas);
                } else {
                    //tDev.TooltipRenderer.hide();
                }  
            }
        }, false);

    };

    AdVisualizer.prototype.getDarkColor = function (hex, percent) {
        hex = hex.replace(/^\s*#|\s*$/g, '');

        if(hex.length == 3){
            hex = hex.replace(/(.)/g, '$1$1');
        }

        var r = parseInt(hex.substr(0, 2), 16),
        g = parseInt(hex.substr(2, 2), 16),
        b = parseInt(hex.substr(4, 2), 16);

        var result = '#' + 
        ((0|(1<<8) + r * (1 - percent / 100)).toString(16)).substr(1) +
        ((0|(1<<8) + g * (1 - percent / 100)).toString(16)).substr(1) +
        ((0|(1<<8) + b * (1 - percent / 100)).toString(16)).substr(1);
        
        return result;
    };


    AdVisualizer.prototype.drawGrid = function(color, stepx, stepy, size) {
        this.context.save()
        this.context.strokeStyle = color;
        this.context.fillStyle = 'white';
        this.context.fillRect(0, 0, size.width, size.height);
        this.context.strokeRect(0, 0, size.width, size.height);
        this.context.lineWidth = 0.5;
        
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

    AdVisualizer.prototype.drawAd = function(position, size, color) {
        var color = color || 'blue';

        this.context.save();
        this.context.strokeStyle = 'black';
        this.context.globalAlpha = 0.5;
        this.context.lineWidth = 1;
        //this.context.fillStyle = color;


        //var grd = this.context.createRadialGradient(150,150,0,150,150,150);
        var grd = this.context.createLinearGradient(0, 0, size.width, size.height);
        grd.addColorStop(0,color);
        grd.addColorStop(1,this.getDarkColor(color, 50));
        this.context.fillStyle=grd;
        

        this.context.fillRect(position.x, position.y, size.width, size.height);
        this.context.strokeRect(position.x, position.y, size.width, size.height);
        this.context.restore();
    };

    AdVisualizer.prototype.addMeasures = function(elPosition, elSizeZoomed, elSize, lineColor, textColor, textFont, lineOffset) {
        var lineColor = lineColor || 'red';
        var textColor = textColor || 'black';
        var lineOffset = lineOffset || 6;
        var textFont = textFont || '9px Arial';
        var tipSize = 6;

        this.context.save();
        this.context.strokeStyle = lineColor;
        this.context.globalAlpha = 0.5;
        this.context.lineWidth = 1;
        
        //Horizontal Line
        this.context.beginPath();
        this.context.moveTo(elPosition.x,elPosition.y + elSizeZoomed.height + lineOffset);
        this.context.lineTo(elPosition.x + elSizeZoomed.width, elPosition.y + elSizeZoomed.height + lineOffset);
        this.context.stroke();
        
        this.context.moveTo(elPosition.x, elPosition.y + elSizeZoomed.height + (lineOffset - tipSize/2));
        this.context.lineTo(elPosition.x, elPosition.y + elSizeZoomed.height + (lineOffset + tipSize/2));
        this.context.stroke();

        this.context.moveTo(elPosition.x + elSizeZoomed.width, elPosition.y + elSizeZoomed.height + (lineOffset - tipSize/2));
        this.context.lineTo(elPosition.x + elSizeZoomed.width, elPosition.y + elSizeZoomed.height + (lineOffset + tipSize/2));
        this.context.stroke();

        //Vertical Line
        this.context.beginPath();
        this.context.moveTo(elPosition.x + elSizeZoomed.width + lineOffset, elPosition.y);
        this.context.lineTo(elPosition.x + elSizeZoomed.width + lineOffset, elPosition.y + elSizeZoomed.height);
        this.context.stroke();
        
        this.context.moveTo(elPosition.x + elSizeZoomed.width + (lineOffset - tipSize/2), elPosition.y);
        this.context.lineTo(elPosition.x + elSizeZoomed.width + (lineOffset + tipSize/2), elPosition.y);
        this.context.stroke();

        this.context.moveTo(elPosition.x + elSizeZoomed.width + (lineOffset - tipSize/2), elPosition.y + elSizeZoomed.height);
        this.context.lineTo(elPosition.x + elSizeZoomed.width + (lineOffset + tipSize/2), elPosition.y + elSizeZoomed.height);
        this.context.stroke();

        this.context.globalAlpha = 1;
        this.context.font = textFont;
        this.context.fillStyle = textColor;
        this.context.fillText(elSize.width + ' px',elPosition.x + elSizeZoomed.width/2 - 10, elPosition.y + elSizeZoomed.height + (lineOffset + 12));
        this.context.fillText(elSize.height + ' px',elPosition.x + elSizeZoomed.width + (lineOffset + 8), elPosition.y + elSizeZoomed.height/2);
        
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
      this.context.strokeStyle = '#ffc703';
      this.context.fillStyle = '#ffc703';
      this.context.fillRect(x, y, width, height);
      this.context.restore();

    };

    AdVisualizer.prototype.draw = function(canvas, query) {
        var pageSize, viewPortSize, viewPortPosition;
   
        if (query) {
            pageSize = this.getSizeValue(query.ns_ad_vw);
            viewPortSize = this.getSizeValue(query.ns_ad_vvd);
            viewPortPosition = this.getPositionValue(query.ns_ad_sc);

            this.initCanvas(canvas, pageSize,60);

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
            this.addMeasures(viewPortPosition, viewPortSize, this.getSizeValue(query.ns_ad_vvd), '#333333', '#333333', '10px Arial', 10);
            
            for (var ad in this.adMap) {
                var lastValue = this.adMap[ad][this.adMap[ad].length - 1];
                this.drawAd(lastValue.position, lastValue.size, '#0C6395');
                this.addMeasures(lastValue.position, lastValue.size, this.getSizeValue(lastValue.query.ns_ad_vad), '#0C6395', '#0C6395', '10px Arial', 6);
                this.addText(lastValue.position, lastValue.size, {text: 'C2 = ' + lastValue.query.c2 ,fillStyle: 'white'});
                this.showVisibility(this.adMap[ad]);
            }
        }
    }

    tDev.AdVisualizer = new AdVisualizer();
})(TDev);