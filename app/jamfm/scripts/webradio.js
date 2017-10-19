function initWebradio() {
    try {
        Webradio = new WebradioJamFm({
            url:  DMH_ROOT_URL + 'services/program-info/live/jam/',
            fallbackImageUrl: (!!DMH_WRFBIMG_SRC) ? DMH_WRFBIMG_SRC : DMH_RES_URL + 'img/img_fallback_600x600.jpg',
            webradioBaseUrl: DMH_ROOT_URL + 'services/program-info/live/jam/',
            channelList: webradioChannels,
            coverContainerClass: '.navigation-webradio-cover',
            songinfoContainerClass: '.navigation-webradio-info',
            refresh: false
        });
    } catch(e) {
        console.error(e);
    }
}


function initRadioplayerPopup() {
    try {
        var channelUrl = location.pathname.replace(/\//ig, '');
        var chan = Webradio.getJsonKeyName(channelUrl);

        if( !!chan ) {
            var chanContainer = document.querySelector('.navigation-webradio-slider-channel[data-channel-name="'+chan+'"]');
            if( chanContainer ) {
                chanContainer.classList.add('active-channel');
            }
        }

        if( !!channelUrl ) {
            $('.webradio-popup-channel-select-item.active').removeClass('active');
            $('.webradio-popup-channel-select-item[href="' + channelUrl + '"]').addClass('active');
        }

        var channelSelect = document.querySelectorAll('.webradio-popup-channel-select-main');
        if( !!channelSelect ) {
            for(var i=0, len=channelSelect.length; i<len; i++) {

                var close = channelSelect[i].parentNode.querySelector('.webradio-popup-channel-select-items-header-close');
                if( !!close ) {
                    close.addEventListener('click', function(event) {
                        "use strict";
                        event.preventDefault();
                        this.parentNode.parentNode.classList.remove('open');
                        return false;
                    });
                }

                channelSelect[i].addEventListener('click', function(event) {
                    "use strict";
                    event.preventDefault();

                    var items = this.parentNode.querySelector('.webradio-popup-channel-select-items');
                    if( !!items ) {
                        items.classList.toggle('open');
                    }

                    return false;
                });
            }
        }
    } catch(e) {
        console.error(e);
    }
}