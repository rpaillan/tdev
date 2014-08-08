(function(){

    var Info = {
        'metrics': {},
        'log': log
    };

    document.addEventListener('DOMContentLoaded', function() {
        createDom();
    });

    var dom,
        doc = document,
        create = function(name, attrs) {
            var el = doc.createElement(name);
            for (var attr in attrs)
                el.style[attr] = attrs[attr];
            return el;
        };

    function log(metric, value) {
        if (!Info.metrics[metric]) {
            var mEl = create('span', {
                'display': 'inline-block',
                'margin-right': '20px'
            });
            var vEl = mEl.cloneNode();
            var cont = create('div');

            mEl.innerText = metric;
            vEl.innerText = value;

            cont.appendChild(mEl);
            cont.appendChild(vEl);
            dom.appendChild(cont);

            Info.metrics[metric] = vEl;
        } else {
            Info.metrics[metric].innerText = value;
        }
    }
  
    function createDom() {
        dom = create('div', {
            'position': 'fixed',
            'top': '20px',
            'left': '20px',
            'border': '1px solid red',
            'padding': '15px'
        });
        doc.body.appendChild(dom);
    }

    window.Info = Info;
})();