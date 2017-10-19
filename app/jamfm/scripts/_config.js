/**
 * Global config for brocken
 * @type {number}
 */
const SCREEN_XS_MAX = 767;
const SCREEN_SM_MIN = 768;
const SCREEN_SM_MAX = 991;
const SCREEN_MD_MIN = 992;
const SCREEN_MD_MAX = 1199;
const SCREEN_LG_MIN = 1200;


//
// Cookie overlay options
//
const COOKIE_OVERLAY = {
    css: '',
    text: '<div class="container"><div>' +
          '<span class="CookieInfoText">JAM.FM verwendet Cookies, um Dir den bestmöglichen Service zu gewährleisten. Wenn Du auf der Seite weitersurfst, stimmst Du der Cookie-Nutzung zu. <a href="'+ ((!!DMH_DATA_POLICY) ? DMH_DATA_POLICY : '') +'" title="Datenschutz" style="text-decoration: underline;">Weitere Informationen</a></span>',
    button: ' <span class="CookieButton"><input type="button" name="zustimmen" value="OK" class="btn" style=" font-size: 1.4rem; line-height: 1rem;"></span></div></div>',
    duration: 14,
};


var webradioChannels = {
    'live': {
        json: 'air',
        display: 'JAM FM Live',
        path: 'live',
        prefix: 'JETZT'
    },
    'blk': {
        json: 'black',
        display: 'JAM FM Black Label',
        path: 'blk',
        prefix: 'JETZT AUF'
    },
    'nmr': {
        json: 'nmr',
        display: 'JAM FM New Music Radio',
        path: 'nmr',
        prefix: 'JETZT AUF'
    }
};

var Webradio = {};


function SliderCalcPagination (slider, i, slideNum) {
    return  (i + 1) + '/' + (Math.ceil(slider.slideCount/slideNum));
}