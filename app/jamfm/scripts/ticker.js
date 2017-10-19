/**
 * Initialize breaking news and headline ticker
 *
 * NOTE: This script will look for a class .breaking-news
 */
function initTicker() {
    try {
        var newsSlider = $( '.breaking-news__slider' );
        var $heroProgress = null;

        if( newsSlider.parents( '.breaking-news-slider' ).hasClass( 'headlines-badge' ) ) {
            $heroProgress = new SlickProgress();
        }

        // Initialize marquee ticker
        $( '.marquee' ).marquee();

        for( var i = 0, len = newsSlider.length; i < len; i++ ) {
            var $slider = $( newsSlider[ i ] ),
                parent = $slider.parents( '.breaking-news' ),
                cookieVal = null;

            // Check if the cookie is set to hide the ticker
            if( parent.length ) {
                cookieVal = $.cookie( 'hide-breaking-news_' + parent.attr( 'id' ) );

                if( !!cookieVal && cookieVal !== 'null' ) {
                    parent.remove();
                    continue;
                }
            }

            $slider.on( 'init', function() {
                if( parent.hasClass( 'headlines-badge' ) ) {
                    var container = $( '.breaking-news-progress-container ul' );

                    if( container.length ) {
                        var count = $slider[ 0 ].querySelectorAll( '.slick-slide:not(.slick-cloned)' ).length || 0;

                        if( count > 0 ) {
                            for( var i = 0; i < count; i++ ) {
                                var el = document.createElement( 'li' ),
                                    width = (100 / count) || 0;

                                el.classList.add( 'breaking-news-progress' );

                                if( i != (count - 1) ) {
                                    el.style.width = 'calc(' + width + '% - 5px)';
                                } else {
                                    el.style.width = width + '%';
                                }

                                container.append( el );
                            }
                        }
                    }

                    if( !!$heroProgress ) $heroProgress.AddProgressBar( $( '.breaking-news-progress:first' ) );
                }
            } );

            $slider
                .not( '.slick-initialized' )
                .slick( {
                    arrows: false,
                    autoplay: true,
                    autoplaySpeed: 3000,
                    infinite: true,
                    adaptiveHeight: true
                } );

            $slider.on( 'beforeChange', function( event, slick, currentSlide, nextSlide ) {
                var parent = $( this ).parents( '.breaking-news-slider' );

                $slider.eq( currentSlide ).removeClass( 'active' );
                $slider.eq( nextSlide ).addClass( 'active' );

                if( parent.hasClass( 'headlines-badge' ) ) {
                    if( !!$heroProgress ) $heroProgress.AddProgressBar( $( '.breaking-news-progress' ).eq( nextSlide ) );
                }
            } );


            $( '.breaking-news-close' ).on( 'click', function( evt ) {
                var parent = $( this ).parents( '.breaking-news' );
                evt.preventDefault();

                if( parent.length ) {
                    parent.remove();
                    $.cookie( 'hide-breaking-news_' + parent.attr( 'id' ), 'true' );
                }

                return false;
            } );
        }
    } catch( e ) {
        console.error( e );
    }
}