function initEventTeasers() {
    "use strict";

    try {
        var teasers = document.querySelectorAll('.event-teaser');
        if( !!teasers ) {
            for(var i=0, len=teasers.length; i<len; i++) {

                // Download ICS file
                var icsDownloads = document.querySelectorAll('.event-teaser-ics');
                for(var icsIndex=0, lenicsIndex=icsDownloads.length; icsIndex<lenicsIndex; icsIndex++) {
                    icsDownloads[icsIndex].addEventListener('click', function(event) {
                        event.preventDefault();

                        var url = $(this).data('ics-url');
                        if( !!url ) {
                            window.location.href = url;
                        }

                        return false;
                    });
                }

                // Handle list item clicks
                var toolToggles = teasers[i].querySelectorAll('.event-tools-open');
                var tools = teasers[i].querySelectorAll('.event-tools');
                if(!!teasers) {
                    for(var j=0, lenJ=toolToggles.length; j<lenJ; j++) {
                        var thisToggleOpen = toolToggles[j];
                        var thisToolbox = $(tools[j]);
                        (function (thisToggleOpen, thisToolbox) {

                            thisToggleOpen.addEventListener('click', function (event) {
                                event.preventDefault();

                                thisToolbox.css('display', 'block');

                                return false;
                            });

                            var thisToggleClose = thisToolbox.find('.event-tools-close');

                            thisToggleClose.on('click', function (event) {
                                event.preventDefault();

                                thisToolbox.css('display', 'none');

                                return false;
                            });

                        })(thisToggleOpen, thisToolbox);
                    }
                }
            }
        }
    } catch(e) {
        console.error(e);
    }
}