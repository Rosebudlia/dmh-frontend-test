//
// Header file including all common constants, external functions and vars
//
// THIS FILE SHOULD BE INCLUDED IN ALL TYPESCRIPT FILES TO HAVE
// ALL THE PLATFORM STUFF AVAILABLE
//


// External constants
declare const SCREEN_SM_MIN;
declare const SCREEN_XS_MAX;
declare const SCREEN_SM_MAX;

declare const DMH_RES_URL;
declare const DMH_WRFBIMG_SRC;


// External functions
declare function jwplayer(id);
declare function DMHPlayer(slider) : void; // TODO replace with TS version
declare function isMobile();
declare function escapeHtml(html);
declare function getImageMeta(imgUrl);
declare function SlickProgress(): void;
declare function Clipboard(selector, opts): void;
declare function ucfirst(message, onlyfirst?);
declare function browserIsSafari();
declare function initPlayer();
declare function SliderCalcPagination(slider, i, j);


// External variables
declare var OMSres: any;
declare var ga: any;
declare var googletag;
declare var radioplayer: any;


// External interfacesq
interface JQuery {
    slick: any;
    tooltip(opts):void;
    dmhEventTracker: any;
}

interface googletag {
    pubads: any
}