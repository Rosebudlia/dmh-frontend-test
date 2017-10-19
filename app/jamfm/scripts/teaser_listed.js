/* global isMobile */



/**
 * Initialize listed teasers (add class to make box collapsible on mobile)
 */
function initListedTeaser() {
    "use strict";

    try {
        var listeds = document.querySelectorAll('.listed-box');

        if( !!listeds ) {

            for (var tsr=0, lenTsrs=listeds.length; tsr<lenTsrs; tsr++) {

                var thisBox = listeds[tsr];

                if ( !!thisBox ) {
                    var parent = $(thisBox).parent();
                    if (!parent.hasClass('search-results-body')) {
                        (function (thisBox){
                            var expand = thisBox.querySelectorAll('.mobile-listed-expand');
                            expand[0].addEventListener('click', function (){
                                thisBox.classList.remove('closed');
                                this.style.display = 'none';
                            });
                        })(thisBox);
                    }
                }
            }
        }
} catch(e) {
        console.error(e);
    }
}
