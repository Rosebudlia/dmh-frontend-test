/// <reference path="../../../common/typescript/SliderGallery/SliderGallery.ts" />
/// <reference path="../MediaPlayerJamFm/MediaPlayerJamFm.ts" />
/// <reference path="../SocialShareJamFm/SocialShareJamFm.ts" />
/// <reference path="../../../common/typescript/global.inc.ts" />




class SliderGalleryJamFm extends SliderGallery {
    lightboxAdSlides: any;
    currentIndex: number;

    /**
     * Show the figcaption and close button after slide
     *
     * @private
     */
    static _showCaption() {
        let slide = document.querySelector('.slider-gallery-lightbox .image-lightbox-container.slick-current');

        if( !!slide ) {
            let $slide = $(slide);
            let figure = $slide.find('figure');
            let close = $slide.find('.slider-gallery-lightbox-close');

            close.css('opacity', '1');
            figure.find('figcaption').show();
        }
    }


    /**
     * Initialize share icons
     *
     * @private
     */
    static _initShareIcons() {
        let shares = document.querySelectorAll('.slider-gallery-lightbox .toggle-share');

        if( !!shares ) {
            for(let i=0, len=shares.length; i<len; i++) {
                (new SocialShareJamFm(shares[i]));
            }
        }
    }


    /**
     * Initialize media player inside lightbox
     */
    static initLightboxPlayer() {
        "use strict";
        try {
            let wrapper = document.querySelectorAll('.slider-gallery-lightbox .slick-slide:not(.slick-initialized) .dmh-player-wrapper');
            if( !!wrapper ) {
                for(var i=0, len=wrapper.length; i<len; i++) {
                    // Skip cloned slides
                    if( $(wrapper[i]).parents('.slick-slide').hasClass('slick-cloned') ) continue;

                    let player = $(wrapper[i]).find('.dmh-player');

                    if( !!player ) {
                        let id = player.attr('id');

                        if( id.length ) {
                            player.attr('id', id + '--lightbox');
                            (new MediaPlayerJamFm(wrapper[i], id + '--lightbox', '100%'));
                        }
                    }
                }
            }
        } catch(e) {
            console.error(e);
        }
    }


    /**
     * Constructor
     * @param options
     */
    constructor(options) {
        super(options);

        let self = this;
        this.currentIndex = 0;

        // Build up the next ad slides
        self.buildAdSlides();

        this.element.addEventListener('dmh.slidergallery.beforeSlide', function() {
            $('.slider-gallery-lightbox .image-lightbox-container .slider-gallery-lightbox-close').addClass('hidden');
        });

        // build one slide in advance and remove one slide previous
        this.slider.on('afterChange', function(event, slick, currentSlide) {
            self.buildAdSlides();
        });

        this.element.addEventListener('dmh.slidergallery.openlightbox', function() {
            self.lightboxAdSlides = self.lightbox[0].querySelectorAll('.adslide');

            window.setTimeout(function() {
                SliderGalleryJamFm.initLightboxPlayer();
                SliderGalleryJamFm._showCaption();
                SliderGalleryJamFm._initShareIcons();

                self.lightbox.find('.adinit').removeClass('adinit');
                self.buildAdSlides(true);
            }, 200);
        });

        this.element.addEventListener('dmh.slidergallery.afterSlide', SliderGalleryJamFm._showCaption);


    }
}