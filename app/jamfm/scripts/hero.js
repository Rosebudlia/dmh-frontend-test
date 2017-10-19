function initHeros() {
    "use strict";

    var heros = document.querySelectorAll('.hero');
    var debug = (window.location.href.indexOf('localhost') !== -1 || window.location.href.indexOf('127.0.0.1') !== -1);

    if( !!heros ) {
        for(var i=0, len=heros.length; i<len; i++) {
            var id = heros[i].getAttribute('id');

            if( !!id ) (new HeroJamFM(id, debug));
        }
    }
}