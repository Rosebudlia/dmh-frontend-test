/**
 * Simple check if we client is local instance
 *
 * @returns {boolean}
 */
function isLocal() {
    "use strict";
    return (location.href.indexOf('localhost') !== -1 || location.href.indexOf('127.0.0.1') !== -1);
}



/**
 * Detect retina displays
 * NOTE: We cannot detect retina screens in scaled mode. Retina screens will always return true, no matter of the
 *       selected scaling.
 *
 * @return {*|boolean}
 */
function isRetina() {
    return (window.devicePixelRatio > 1 ||
    (window.matchMedia &&
    window.matchMedia("(-webkit-min-device-pixel-ratio: 1.5),(-moz-min-device-pixel-ratio: 1.5),(min-device-pixel-ratio: 1.5)").matches));
}


/**
 * Check if an object is empty
 * @param obj
 * @return {boolean}
 */
function objectEmpty(obj) {
    for(var i in obj){
        return false;
    }

    return true;
}


/**
 * Check if browser is safari browser
 * @return {boolean}
 */
function browserIsSafari() {
    return navigator.userAgent.indexOf('AppleWebKit') !== -1 && navigator.userAgent.indexOf('Chrome') === -1;
}


/**
 * Escape HTML from given string
 * @param string
 * @return {string}
 */
function escapeHtml(string) {
    var entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '&quot;',
        "'": '&#39;',
        "/": '&#x2F;'
    };

    return String(string).replace(/[&<>"'\/]/g, function (s) {
        return entityMap[s];
    });
}


/**
 * Convert first letter in all/first words/word of given message to upper case
 *
 * @param message
 * @param onlyfirst
 * @return {string}
 */
function ucfirst(message, onlyfirst) {
    var msg = '';

    if( !!message ) {
        if( !!onlyfirst ) {
            msg = message[0].toUpperCase() + message.slice(1);
        } else {
            var words = encodeURI(message).split(/%20/ig);

            for(var i=0, len=words.length; i<len; i++) {
                if( words[i].length ) {
                    words[i] = decodeURI(words[i]);
                    words[i] = words[i][0].toUpperCase() + words[i].slice(1);
                }
            }

            msg = words.join(' ');
        }
    }

    return msg;
}