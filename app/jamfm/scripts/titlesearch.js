
function titlesearchContainerGetTime(container) {
    var time = 0,
        day = 0;

    if( !!container ) {
        var item = container.querySelector('.navigation-titlesearch-item:last-of-type');
        if( !!item ) {
            time = item.querySelector('.navigation-titlesearch-time').innerHTML;
            day = item.getAttribute('data-day') || '';
        }
    }

    return {
        time: time,
        day: day
    };
}


function initTitlesearchContainer() {
    try {
        var containers = document.querySelectorAll('.titlesearch-container');

        for(var c=0, lenC=containers.length; c<lenC; c++) {
            var container = containers[c];

            /**
             * Initialize titlesearch items and playlist controls
             * @type {string}
             */
            var id = containers[c].getAttribute('id');
            if( !!id ) {

                // Fetch parameters for titlesearch
                var url = containers[c].getAttribute('data-titlesearch-url')  || '',
                    coverFallbackUrl = containers[c].getAttribute('data-titlesearch-coverFallbackUrl') || '';

                // Fetch item limit
                var fetchLimit = containers[c].getAttribute('data-fetch-limit')  || null;

                if( !url ) {
                    console.error('initTitlesearchContainer error: Cannot find url data parameter.');
                } else {
                    // Initialize titlesearch
                    var selector = '#' + id + ' .titlesearch',
                        titlesearch = new TitlesearchJamFm(url, selector, coverFallbackUrl, Webradio.currentChannel, Webradio, fetchLimit);

                    (function(titlesearch, container) {
                        container.addEventListener('dmh.titlesearch.fetch', function() {
                            titlesearch.populate();
                        });
                    })(titlesearch, container);


                    var dt = new Date();
                    titlesearch.fetch('new', Webradio.currentChannel, dt.getHours(), dt.getMinutes(), 0);

                    var controls = container.querySelectorAll('.titlesearch-control');
                    if( !!controls ) {
                        for( var iCtrl=0, lenCtrl=controls.length; iCtrl<lenCtrl; iCtrl++) {
                            (function(container, titlesearch) {
                                // Handle clicks
                                controls[iCtrl].addEventListener('click', function(event) {
                                    event.preventDefault();

                                    var time = titlesearchContainerGetTime(container),
                                        action = 'before',
                                        tm = -15;

                                    if( this.classList.contains('titlesearch-control-next') ) {
                                        action = 'after';
                                        tm = 15;
                                    }

                                    var channelInput = container.querySelector('select#channel');
                                    var channel = (!!channelInput) ? (channelInput.value || '') : Webradio.currentChannel;

                                    time = TitlesearchJamFm.formatTime(time.day, time.time, tm);
                                    titlesearch.fetch(action, channel, time[0], time[1], time[2], channel);
                                    return false;
                                });

                                controls[iCtrl].classList.remove('disabled');
                            })(container, titlesearch);
                        }
                    }
                }
            }

            /**
             * Initialize filters
             * @type {Element}
             */
            (function(titlesearch) {
                var filter = container.querySelector('.titlesearch-filter-form');
                if( !!filter ) {
                    // Normalize all time selects
                    var filters = filter.querySelectorAll('select');
                    if( !!filters ) {
                        for(var f=0, lenF=filters.length; f<lenF; f++) {
                            filters[f].addEventListener('change', function() {
                                TitlesearchJamFm.prototype.normalizeTimeSelects($(filter).find('#hours'), $(filter).find('#minutes'), $(filter).find('#day'));
                            });
                        }
                    }

                    TitlesearchJamFm.prototype.normalizeTimeSelects($(filter).find('#hours'), $(filter).find('#minutes'), $(filter).find('#day'));

                    // Filter button handler
                    var btn = filter.querySelector('.btn');
                    btn.addEventListener('click', function(event) {
                        event.preventDefault();

                        var channel = filter.querySelector('#channel').value || '',
                            day = $(filter).find('#day select').val(),
                            hours = filter.querySelector('#hours').value || '',
                            minutes = filter.querySelector('#minutes').value || '';

                        titlesearch.fetch('refresh', channel, day, hours, minutes, channel);
                        return false;
                    });

                    $('.titlesearch-toggle-filter').on('click', function() {
                        filter.classList.toggle('visible-md');
                        filter.classList.toggle('visible-lg');
                        filter.classList.toggle('show');
                    });

                    $(btn).click();
                }
            })(titlesearch);

            // Check for certain GET parameter. If found we just trigger the search via button click as
            // values are preselected
            if( location.href.indexOf('?channel=') !== -1 ) {
                var fetchButton = $('.titlesearch-filter-form a.btn')[0];
                if( !!fetchButton ) {
                    fetchButton.click();
                }
            }

            window.setTimeout(function() {
                "use strict";
                var fetchButton = $('.titlesearch-filter-form a.btn')[0];
                if( !!fetchButton ) {
                    fetchButton.click();
                }
            }, 200);
        }
    } catch(e) {
        console.error(e);
    }
}