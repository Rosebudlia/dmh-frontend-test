/**
 * Check for mobile device
 * @return {boolean}
 */
function isMobile() {
    return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4)));
}

function initCookieOverlay() {
    try {
        (new CookieOverlayJamFm({
            css: COOKIE_OVERLAY.css,
            text: COOKIE_OVERLAY.text,
            button: COOKIE_OVERLAY.button,
            duration: COOKIE_OVERLAY.duration
        }));
    } catch(e) {
        console.error(e);
    }
}


function initTables() {
    "use strict";
    try {
        // Add class .table to all table elements lacking it
        var tables = document.querySelectorAll('table:not(.table)');
        if( !!tables ) {
            for(var i=0, len=tables.length; i<len; i++) {
                tables[i].classList.add('table');
            }
        }
    } catch(e) {
        console.error(e);
    }
}


function initHomepage() {
    "use strict";

    // Initialize locale for datepicker
    try {
        moment.locale('de');
    } catch(e) {
        console.error('Error in initHomepage: Cannot set moment locale!');
        console.error(e);
    }

    // Tooltips
    try {
        $('[data-toggle="tooltip"]').tooltip({
            container: 'body',
        });

        $('[data-toggle="tooltip-container"]').tooltip({
            html: true
        });
    } catch(e) {
        console.error(e);
    }

    initNavigation();
    initWebradio();
    initHeros();


    initForms();
    initTicker();
    initSocialShareOverlay();

    // Social feed
    initSocialFeed();

    // Image galleries
    initImageGalleries();

    // Event Teasers
    initEventTeasers();
    initTeaser();

    //Media Player
    initPlayer();

    //search results
    initSearchResults();

    //listed teasers
    initListedTeaser();

    // Cookie overlay
    initCookieOverlay();

    // Major Promo
    initMajorPromos();

    // Title search
    initTitlesearchContainer();

    // Init tables
    initTables();

    // Init votings
    initVotings();

    // Article qr codes
    initializeArticleQrCode();
}


//
// Page object
//
var $page = {
    lastScroll: 0,
    scrollDir: 0
};

window.addEventListener('scroll', function() {
    "use strict";

    var scrollTop = $(document).scrollTop();

    $page.scrollDir = 0;
    if( scrollTop > $page.lastScroll ) {
        $page.scrollDir = 1;
    } else {
        $page.scrollDir = -1;
    }

    $page.lastScroll = scrollTop;
});