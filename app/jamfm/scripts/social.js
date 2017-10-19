function initSocialShareOverlay() {
    "use strict";

    try {
        var sharesOverlay = document.querySelectorAll('.social-share-overlay');
        if( !!sharesOverlay ) {
            for(var i=0, len=sharesOverlay.length; i<len; i++) {
                (new SocialShareJamFm(sharesOverlay[i]));
            }
        }
    } catch(e) {
        console.error(e);
    }
}