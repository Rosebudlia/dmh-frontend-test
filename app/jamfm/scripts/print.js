/**
 * Initialize article QR code with given URL
 *
 * @param {String} url
 * @param selector
 */
function initializeArticleQrCode() {
    try {
        var codes = document.querySelectorAll('.article-qr-code');
        if( !!codes ) {
            for(var i=0, len=codes.length; i<len; i++) {
                var url = codes[i].getAttribute('data-url') || '';
                if( !!url ) {
                    $(codes[i]).qrcode({
                        render: 'canvas',
                        text: url
                    });
                }
            }
        }
    } catch(e) {
        console.error(e);
    }
}

