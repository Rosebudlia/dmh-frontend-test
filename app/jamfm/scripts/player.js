/**
 * Initialize media players
 */
function initPlayer() {
    try {
        var wrapper = document.querySelectorAll('.dmh-player-wrapper');
        if( !!wrapper ) {
            for(var i=0, len=wrapper.length; i<len; i++) {
                // Skip cloned slides
                if( $(wrapper[i]).parents('.slick-slide').hasClass('slick-cloned') ) continue;

                var player = wrapper[i].querySelector('.dmh-player');
                if( !!player ) {
                    (new MediaPlayerJamFm(wrapper[i], player.id, '100%'));
                }
            }
        }
    } catch(e) {
        console.error(e);
    }
}