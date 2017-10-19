/// <reference path="../../../../node_modules/@types/jquery/index.d.ts" />
/// <reference path="../global.inc.ts" />


interface HeroControls {
    sliderNextArrow: string;
    sliderPrevArrow: string;
    customPagingIndex: number;
    controlsCSSClass: string;
}


/**
 * General hero class
 */
class HeroLeftNav {
    widgetId: string;
    element: any;
    timeout: number;
    mousedown: any;
    slider: any;
    slideIndex: number;
    slideCount: number;
    heroProgress: any;
    progBar: any;
    heroNav: any;
    navSlidesToShow: number;
    controlOptions: HeroControls;


    /**
     * Initialize main hero slider
     *
     * @private
     */
    private _initSlider(controlOpts) {
        let self = this;


        // Init callback
        this.slider.on('init', function(event, slick) {
            if( !!self.element && !!self.slider ) {
                self.element.css( {
                    'overflow': 'hidden',
                    'height': 'auto'
                } );

                self.slider.css( 'overflow', 'hidden' );
                self.heroNav.eq( 0 ).addClass( 'active' );


            }

            if( !!self.heroProgress ){
                self.heroProgress.AddProgressBar( self.heroNav.not( '.hero-nav-button' ).first().find( '.hero-nav-progress' ), true, self.timeout );
                self.progBar = $(self.heroProgress.node.find('.slick-progress'));

            }

            self.element.on( 'mouseenter', function() {
                if( !!self.heroProgress ){
                    self.heroProgress.TogglePause(self.progBar[0]);
                }
                self.slider.slick( 'slickPause' );
            } );


            self.element.on( 'mouseleave', function() {
                if( !!self.heroProgress ){
                    self.heroProgress.TogglePause(self.progBar[0]);
                }
                self.slider.slick( 'slickPlay' );

            } );
        });

        let controls = $(this.element).find(controlOpts.controlsCSSClass);

        this.slider
        .not('.slick-initialized')
        .slick({
            autoplay: true,
            autoplaySpeed: this.timeout,
            arrows: false,
            dots: false,
            fade: true,
            waitForAnimate: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true,
            customPaging: function (slider, i) {
                return  (i + 1) + '/' + (Math.round(slider.slideCount/controlOpts.customPagingIndex));
            },

            centerPadding: 0,
            responsive: [
                {
                    breakpoint: 1044,
                    settings: {
                        mobileFirst: false,
                        fade: false,
                        arrows: true,
                        dots: true,
                        waitForAnimate: false,
                        nextArrow: controlOpts.sliderNextArrow,
                        prevArrow: controlOpts.sliderPrevArrow,
                        appendDots: $(controls),
                        appendArrows: $(controls)
                    }
                }
            ]
        });


        this.slider.on( 'beforeChange', function( event, slick, currentSlide, nextSlide ) {
            self.heroNav.eq( currentSlide ).removeClass( 'active' );
            self.heroNav.eq( nextSlide ).addClass( 'active' );

            if( !!self.heroProgress ){
                self.heroProgress.AddProgressBar( self.heroNav.not( '.hero-nav-button' ).find( '.hero-nav-progress' ).eq( nextSlide ), true, self.timeout );
                self.progBar = $(self.heroProgress.node.find('.slick-progress'));
            }
        } );

    }


    /**
     * Initialize hero navigation slider
     */
    private _initNavigation() {
        let self = this;


        this.heroNav.on( 'mousedown', function() {
            self.mousedown = true;
        } );


        this.heroNav.on( 'mousemove', function() {
            if( !!self.mousedown ) {
                self.mousedown = false;
            }
        } );

        this.heroNav.on( 'click', function() {
            if( !!self.mousedown ) {
                self.slideIndex = $(this).index() || 0;
                self.slider.slick( 'slickGoTo', self.slideIndex );
            }


            self.heroProgress.TogglePause(self.progBar[0]);

            self.mousedown = false;
        } );

    }


    /**
     * Parse options
     *
     * @param opts
     * @private
     */
    private _parseOptions(opts:HeroControls) {
        let required = [
            'sliderNextArrow',
            'sliderPrevArrow',
            'controlsCSSClass'
        ];

        for(let r of required) {
            if( !opts[r] ) {
                throw('SliderGallery error: Required option ' + r + ' missing.');
            }

            if (!opts.customPagingIndex) {
                opts.customPagingIndex = 1;
            }
        }

        this.controlOptions = opts;
    }


    /**
     * Constructor
     *
     * @param widgetId
     * @param debug
     */
    constructor(widgetId:string, controlOptions: HeroControls, debug?:boolean) {
        this.widgetId = widgetId;

        this._parseOptions(controlOptions);

        if( !this.widgetId ) {
            throw('Hero error: No widget ID given');
        }

        this.element = $( '#' + this.widgetId );
        if( !this.element.length ) {
            throw('Hero error: No element for given Widget ID found.');
        }

        this.slider = this.element.find('.hero__slider');
        if( !this.slider.length ) {
            throw('Hero error: No slider for given hero found.');
        }

        this.slideIndex = 0;
        this.slideCount = this.slider.find('.hero__slider__slide').length || 0;
        this.navSlidesToShow = (!this.navSlidesToShow) ? 4 : this.navSlidesToShow;

        let timeout = parseInt(this.element.data('timeout'), 10) || 0;
        this.timeout = (!!timeout) ? timeout : 7000;

        this.heroNav = this.element.find( '.hero__nav li' );
        if( !this.heroNav ) {
            throw('Hero error: No navigation for given hero found.');
        }

        this.heroProgress = new SlickProgress();

        if(!!this.slider && !!this.slideCount){
            if(this.slideCount > 1){
                this._initSlider(this.controlOptions);
                this._initNavigation();
            } else {
                //Make hero display nicely even if there is only one slide
                let controls = $(this.element).find(controlOptions.controlsCSSClass);
                $(controls).css('display', 'none');
            }
        }

        if( debug  ) {
            console.log('Hero init done:');
            console.log('id: ' + this.widgetId);
            console.log('slide count: ' + this.slideCount);
            console.log('slider: ', this.slider);
        }
    }
}