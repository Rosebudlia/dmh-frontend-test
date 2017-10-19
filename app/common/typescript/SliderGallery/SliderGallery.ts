/// <reference path="../../../../node_modules/@types/jquery/index.d.ts" />
/// <reference path="../global.inc.ts" />


//
// Constants
//
const SLIDER_GAL_DEFAULT_TIMEOUT = 2000;

/**
 * Lightbox options interface
 */
interface SliderGalleryLightboxOptions {
    sliderNextArrow: string;
    sliderPrevArrow: string;
    hideControls: boolean;
    hideControlsTimeout: any;
}


/**
 * Gallery slider options interface
 */
interface SliderGalleryOptions {
    selector: string;
    toggleDownloadSelector: string;
    toggleLightboxSelector: string;
    slideSelector: string;
    slidesToShow: number;
    slidesToScroll: number;
    sliderNextArrow: string;
    sliderPrevArrow: string;
    lightbox: SliderGalleryLightboxOptions;
    hideControls: boolean;
    hideControlTimeout:number;
    sliderArrows?: boolean;
    sliderDots: boolean;
    noControlPanel: boolean;
    adsSelector: string;
}


/**
 * Main SliderGallery class
 */
class SliderGallery {
    selector: string;
    element: any;
    id: string;
    elementRaw: any;
    sliderOptions: any;
    hideControls: any;
    countSlides: number;
    download: boolean;
    slider: any;
    lightbox: any;
    options: SliderGalleryOptions;
    hideControlsEventHandler: any;
    controlsFading: boolean;
    eventOpenLightbox: Event;
    eventInitLightbox: Event;
    eventBeforeSlide: Event;
    eventAfterSlide: Event;
    eventAdsSlide: Event;
    googleAds: string = null;


    /**
     * Close the lightbox container
     * @private
     */
    static closeLightbox() {
        document.body.style.overflow = 'initial';

        let lightbox = document.body.querySelectorAll('.slider-gallery-lightbox');
        for(let i=0, len=lightbox.length; i<len; i++) {
            document.body.removeChild(lightbox[i]);
        }
    }


    /**
     * Check if control is hidden
     *
     * @param target
     * @returns {boolean}
     * @private
     */
    private static _controlIsHidden(target) {
        return $(target).css('display') === 'none' ||
            $(target).is(':hidden') ||
            $(target).css('opacity') === '0' ||
            $(target).hasClass('hidden');

    }


    /**
     * Open given URL in new window/tab
     *
     * @param url
     * @private
     */
    private static _openUrl(url:string){
        if( !!url) {
            window.open( url, '_blank' );
        }
    }


    /**
     * Get a clone of the slider element
     *
     * @returns {Node}
     * @private
     */
    private _getSliderClone() {
        let slider = this.elementRaw.cloneNode(true);
        slider.removeAttribute('id');
        slider.removeAttribute('class');
        slider.classList.add('slider-gallery');

        let $slider = $(slider);
        $slider.find(this.options.toggleLightboxSelector).remove();
        $slider.on('keydown', function(event) {
            // Pressed escape
            if( event.keyCode === 27 ) {
                SliderGallery.closeLightbox();
            }
        });

        return slider;
    }


    /**
     * Add download handler
     *
     * @param slide
     * @private
     */
    private _addDownload(slide){
        let dlTog = $(this.options.toggleDownloadSelector);

        if( !!slide ) {
            let fig = slide.find('figure');

            if(fig.attr('data-dl-allow') === "true"){
                dlTog.removeClass('hidden');
            } else {
                dlTog.addClass('hidden');
            }

        }

        dlTog.off().on('click', function(event){
            event.stopPropagation();
            SliderGallery._openUrl(slide.find('img').attr('src'));
        });
    }


    /**
     * Hide the gallery controls
     *
     * @param {string} selector
     * @param {number} timeout
     * @private
     */
    private _hideControls(selector:string, timeout:number) {
        let self = this;

        if( !!this.hideControlsEventHandler ) {
            window.clearTimeout( this.hideControlsEventHandler );
            this.hideControlsEventHandler = null;
        }

        this.hideControlsEventHandler = window.setTimeout(function() {
            $('.slider-gallery-control').fadeTo('fast', 0.5);
            $(selector).fadeTo('fast', 0);

            window.clearTimeout( this.hideControlsEventHandler );
            this.hideControlsEventHandler = null;
            self.controlsFading = false;
        }, timeout);
    }


    /**
     * Clear ad slide content
     *
     * @param slide
     * @private
     */
    private static _emptyAdSlide(slide){
        if( !!slide ) {
            let inner = slide.querySelector('div');

            if( !!inner ) {
                inner.innerHTML = '';

                if (!!inner.getAttribute('data-google-query-id')) {
                    inner.removeAttribute('data-google-query-id');
                }
            }

            slide.classList.remove('adinit');
        }
    }


    /**
     * Build ad slide content
     * @param slide
     */
    private buildAdSlide(slide){
        if( !!slide ) {
            let $inner = $(slide.querySelector('div'));
            let id = $inner.attr('id');

            if (!!id && !!this.googleAds) {
                $inner.html("<script type='text/javascript'>" +
                    "var slot;" +
                    "googletag.cmd.push(function(){" +
                    "  slot = googletag.defineSlot('"+ this.googleAds +"', [300, 250], '" + id + "');" +
                    "  if(!!slot) { " +
                    "    slot.addService(googletag.pubads());" +
                    "    googletag.enableServices();" +
                    "    googletag.pubads().refresh([slot]);" +
                    "  } " +
                    "  googletag.display('" + id + "');" +
                    "});" +
                    "</script>");
            }

            slide.classList.add('adinit');
        }
    }


    /**
     * Build up all ad slides
     *
     * @param {Boolean} lightbox
     */
    protected buildAdSlides(lightbox?:Boolean) {
        let current = this._getCurrentSlide(lightbox);
        let nextAd = $(current).nextAll('.adslide:not(.slick-cloned):not(.adinit)').first();
        let prevAd = $(current).prevAll('.adslide:not(.slick-cloned):not(.adinit)').first();
        let lastAd = $(current).nextAll('.adslide:not(.slick-cloned):not(.adinit)').last();

        if( $(current).hasClass('adslide') ) this.buildAdSlide($(current)[0]);
        if( nextAd.length ) this.buildAdSlide(nextAd[0]);
        if( prevAd.length ) this.buildAdSlide(prevAd[0]);
        if( lastAd.length ) this.buildAdSlide(lastAd[0]);
    }


    /**
     * Open slider in a lightbox with backdrop
     *
     * @param index
     * @private
     */
    private _openLightbox(index) {
        let self = this,
            container = document.createElement('div'),
            slider = this._getSliderClone();

        container.classList.add('lightbox');
        container.classList.add('slider-gallery-lightbox');
        container.setAttribute('tabindex', '0');

        this._prepareSlides(slider);
        container.appendChild(slider);

        if( this.options.lightbox.hideControls ) {
            let selector = '.slider-gallery-control, ' +
                           '.slider-gallery-lightbox .slider-gallery .image-lightbox-container.slick-current figure figcaption, ' +
                           '.slider-gallery-lightbox .slick-arrow, ' +
                           '.slider-gallery-lightbox .slider-gallery .image-lightbox-container.slick-current .slider-gallery-lightbox-close';

            $('body').on('mousemove', function() {
                if( SliderGallery._controlIsHidden(selector) ) {
                    $(selector).css('opacity', '1');
                }

                self._hideControls(selector, self.options.hideControlTimeout);
            });

            self._hideControls(selector, self.options.hideControlTimeout);
        }

        // TODO fix event handler. For now it's not working
        let backdrop = document.createElement('div');
        backdrop.classList.add('slider-gallery-backdrop');

        backdrop.addEventListener('click', function() {
            SliderGallery.closeLightbox();
        });

        container.appendChild(backdrop);
        document.body.appendChild(container);

        self.lightbox = $(slider);

        if( this.countSlides > 1 ) {
            let opts = self.sliderOptions;
            opts.dots = false;
            opts.centerMode = true;
            opts.centerPadding = 0;
            opts.initialSlide = (!!index) ? index : 0;
            opts.arrows = true;
            opts.prevArrow = this.options.lightbox.sliderPrevArrow;
            opts.nextArrow = this.options.lightbox.sliderNextArrow;

            // Set controls to NULL
            opts.appendDots = self.lightbox;
            opts.appendArrows = self.lightbox;

            self.lightbox.on('init', function() {
                $(window).trigger('resize');

                let firstSlide = $(this).find('[data-slick-index="' + 0 + '"]');
                if (!!firstSlide) {
                    self._addDownload(firstSlide);
                }

                self.element.dispatchEvent(self.eventInitLightbox);

            });

            $(slider).slick(opts)
            .on('beforeChange', function(event, slick, currentSlide, nextSlide) {
                // Pause all jwplayer
                let players = this.querySelectorAll('.jwplayer.jw-state-playing');
                if( !!players ) {
                    for(let i=0, len=players.length; i<len; i++) {
                        let id = players[i].getAttribute('id');
                        if( !!id ) {
                            jwplayer(id).pause();
                        }
                    }
                }

                self._addDownload($(this).find('[data-slick-index="' + nextSlide + '"]'));
                self.element.dispatchEvent(self.eventBeforeSlide);
            })
            .on('afterChange', function() {
                self.buildAdSlides(true);
                self.element.dispatchEvent(self.eventAfterSlide);
            });
        }

        document.body.style.overflow = 'hidden';
        this.element.dispatchEvent(this.eventOpenLightbox);
    }


    /**
     * Prepare all slides for the slider
     *
     * @param slider
     * @private
     */
    private _prepareSlides(slider) {
        if( !!slider ) {
            let slides = $(slider).find(this.options.slideSelector);

            this.countSlides = slides.length;

            for(let i=0, len=slides.length; i<len; i++) {

                let adBox = slides[i].querySelector('.image-lightbox-container-custom');
                if (!!adBox) {
                    SliderGallery._emptyAdSlide(slides[i]);

                    let thisId = adBox.getAttribute('id');
                    adBox.setAttribute('id', thisId + '-lightbox');
                }

                // Replace image sources in slider
                let img = slides[i].querySelector('img');
                let figure = slides[i].querySelector('figure');

                if (!!figure) {
                    let closeButton = document.createElement('span');
                    closeButton.classList.add('slider-gallery-lightbox-close');
                    closeButton.classList.add('icon');
                    closeButton.classList.add('ic-ic_fullscreenExit');
                    closeButton.classList.add('btn');
                    closeButton.classList.add('btn-circle');

                    closeButton.addEventListener('click', SliderGallery.closeLightbox);

                    figure.appendChild(closeButton);

                    if (len === 1){
                        $(slides).addClass('single-slide-gallery');
                        closeButton.style.opacity = "1";
                    }

                    // Check figcaoption and hide empty ones
                    let caption = slides[i].querySelector('figcaption');
                    if( !caption || caption.innerText.trim().length <= 0 || caption.innerHTML.trim().length <= 0 ) {
                        $(caption).remove();
                    }

                }
                
                if( !!img && !!figure ) {
                    let newSrc = slides[i].getAttribute('data-image-src-large');
                    
                    if( this.download ) {
                        figure.setAttribute('data-dl-allow', 'true');
                    } else {
                        figure.setAttribute('data-dl-allow', 'false');
                    }
                    if( !!newSrc && !!img ) {
                        img.src = newSrc;
                    }
                }

            }
        }
    }

    /**
     * Get the current slide object
     *
     * @param {Boolean} lightbox
     * @returns {Element}
     * @private
     */
    _getCurrentSlide(lightbox?:Boolean): Element {
        return (lightbox && lightbox === true) ? this.lightbox.find('.slick-slide.slick-current') : this.element.querySelector('.slick-slide.slick-current');
    }


    /**
     * Parse options
     *
     * @param opts
     * @private
     */
    private _parseOptions(opts:SliderGalleryOptions) {
        let required = [
            'selector',
            'slidesToShow',
            'slideSelector'
        ];

        for(let r of required) {
            if( !opts[r] ) {
                throw('SliderGallery error: Required option ' + r + ' missing.');
            }
        }

        // Set defaults
        this.options = opts;

        if( !this.options.hideControlTimeout ) {
            this.options.hideControlTimeout = SLIDER_GAL_DEFAULT_TIMEOUT;
        }

        this.options.noControlPanel = (typeof opts.noControlPanel !== "undefined" && opts.noControlPanel !== false);

        this.options.sliderDots = (opts.sliderDots);
        if( this.options.noControlPanel === false ) {
            this.options.sliderDots = true;
        }
    }


    /**
     * Constructor
     *
     * @param opts
     */
    constructor(opts:SliderGalleryOptions) {
        let self = this;

        this._parseOptions(opts);

        this.selector = this.options.selector;
        this.element = document.querySelector(this.selector);
        if( !this.element ) {
            throw('SliderGallery error: Cannot find mail element: ' + this.selector);
        }
        let $element = $(this.element);

        this.googleAds = this.element.getAttribute('data-googleads');

        this.id = this.element.getAttribute('id');
        if( !this.id ) {
            console.error('SliderGallery warning: Gallery with no ID initialized!');
        }

        this.elementRaw = this.element.cloneNode(true);

        this.sliderOptions = {
            slidesToShow: this.options.slidesToShow,
            dots: (this.options.sliderDots),
            slidesToScroll: (!!this.options.slidesToScroll) ? this.options.slidesToScroll : 1,
            customPaging: function (slider, i) {
                return  (i + 1) + '/' + slider.slideCount;
            },
            arrows: (!!this.options.sliderNextArrow || !!this.options.sliderPrevArrow),
            nextArrow: this.options.sliderNextArrow,
            prevArrow: this.options.sliderPrevArrow,
            adaptiveHeight: false,
        };

        if( this.options.noControlPanel === false ) {
            let controls = $(this.element).parent().find('.control-panel');
            if( controls.length ) {
                this.sliderOptions['appendDots'] = controls;
                this.sliderOptions['appendArrows'] = controls;
            }
        }

        this.slider = $element.slick(this.sliderOptions).on('beforeChange', function() {
            // Pause all jwplayer
            let players = this.querySelectorAll('.jwplayer.jw-state-playing');
            if( !!players ) {
                for (let i = 0, len = players.length; i < len; i++) {
                    let id = players[i].getAttribute('id');
                    if (!!id) {
                        jwplayer(id).pause();
                    }
                }
            }

            self.element.dispatchEvent(self.eventBeforeSlide);
        }).on('afterChange', function() {
            // Find ads
            if( !!self.options.adsSelector ) {
                var curr = self._getCurrentSlide();
                if( !!curr ) {
                    if( !!curr.querySelector(self.options.adsSelector) ) {
                        self.element.dispatchEvent(self.eventAdsSlide);
                    }
                }
            }
        });

        if( !!this.options.toggleLightboxSelector ) {
            $element.find(this.options.toggleLightboxSelector).on('click', function() {
                self._openLightbox(parseInt(this.getAttribute('data-index') || '', 10) || 0);
            });

            $element.on('keydown', function(event) {
                // Pressed escape
                if( event.keyCode === 27 ) {
                    SliderGallery.closeLightbox();
                }
            });
        }

        this.controlsFading = false;
        this.hideControls = this.options.hideControls;
        if( this.hideControls ) {
            $element.on('mouseenter', function() {
                $element.find('.slick-arrow').css('opacity', '0.5');
            });

            $element.on('mouseleave', function() {
                $element.find('.slick-arrow').css('opacity', '0');
            });
        }

        this.countSlides = 0;

        // Downloadable flag
        let dl = this.element.getAttribute('data-download') || '';
        this.download = (!!dl && dl === 'true');

        // Create events

        this.eventInitLightbox = document.createEvent('Event');
        this.eventInitLightbox.initEvent('dmh.slidergallery.initlightbox', true, true);

        this.eventOpenLightbox = document.createEvent('Event');
        this.eventOpenLightbox.initEvent('dmh.slidergallery.openlightbox', true, true);

        this.eventBeforeSlide = document.createEvent('Event');
        this.eventBeforeSlide.initEvent('dmh.slidergallery.beforeSlide', true, true);

        this.eventAfterSlide = document.createEvent('Event');
        this.eventAfterSlide.initEvent('dmh.slidergallery.afterSlide', true, true);

        this.eventAdsSlide = document.createEvent('Event');
        this.eventAdsSlide.initEvent('dmh.slidergallery.adsSlide', true, true);

    }


    /**
     * Get the current slide index
     *
     * @returns {number}
     */
    getCurrentSlideIndex(): number {
        var curr = this._getCurrentSlide();
        return (!!curr) ? (parseInt(curr.getAttribute('data-index')) || 0) : 0;
    }
}