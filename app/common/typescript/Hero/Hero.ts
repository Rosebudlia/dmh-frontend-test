/// <reference path="../../../../node_modules/@types/jquery/index.d.ts" />
/// <reference path="../global.inc.ts" />


/**
 * General hero class
 */
class Hero {
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
    heroNavParent: any;
    navSlidesToShow: number;


    /**
     * Initialize main hero slider
     *
     * @private
     */
    private _initSlider() {
        let self = this;

        // Init callback
        this.slider.on('init', function() {
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

            console.log(self.progBar);

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

        this.slider
        .not('.slick-initialized')
        .slick({
            autoplay: true,
            autoplaySpeed: this.timeout,
            arrows: false,
            dots: false,
            fade: false,
            mobileFirst: true,
            waitForAnimate: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true,
            centerMode: true,
            centerPadding: 0,
            adaptiveHeight: false,
            responsive: [
                {
                    breakpoint: 1044,
                    settings: {
                        mobileFirst: false
                    }
                }
            ]
        });

        this.slider.on( 'beforeChange', function( event, slick, currentSlide, nextSlide ) {
            self.heroNav.eq( currentSlide ).removeClass( 'active' );
            self.heroNav.eq( nextSlide ).addClass( 'active' );

            self.slideIndex = nextSlide;
            self.heroNav.parents('ul').slick( 'slickGoTo', self.slideIndex  );

            if( !!self.heroProgress ){
                self.heroProgress.AddProgressBar( self.heroNav.not( '.hero-nav-button' ).find( '.hero-nav-progress' ).eq( nextSlide ), true , self.timeout);
                self.progBar = $(self.heroProgress.node.find('.slick-progress'));
            }
        } );
    }


    /**
     * Initialize hero navigation slider
     */
    private _initNavigation() {
        let self = this;

        /*
         Initialize navigation slider
         */
        this.heroNav.parent('ul')
            .not( '.slick-initialized' )
            .slick( {
                autoplay: false,
                dots: false,
                arrows: true,
                fade: false,
                waitForAnimate: false,
                mobileFirst: false,
                slidesToShow: (this.slideCount < this.navSlidesToShow) ? this.slideCount : this.navSlidesToShow,
                slidesToScroll: (this.slideCount < this.navSlidesToShow) ? this.slideCount : this.navSlidesToShow,
                infinite: false,
                adaptiveHeight: false,
                prevArrow: '<div class="hero-nav-button hero-nav-prev"><i class="ic-ic_arrow_left"></i></div>',
                nextArrow: '<div class="hero-nav-button hero-nav-next"><i class="ic-ic_arrow_right"></i></div>'
            } );

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
     * Constructor
     *
     * @param widgetId
     * @param debug
     */
    constructor(widgetId:string, debug?:boolean) {
        this.widgetId = widgetId;
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

        this.heroNavParent = this.element.find( '.hero__nav' );
        this.heroNav = this.heroNavParent.find( 'li' );
        if( !this.heroNav ) {
            throw('Hero error: No navigation for given hero found.');
        }

        this.heroProgress = new SlickProgress();

        if(!!this.slider && !!this.slideCount){
            if(this.slideCount > 1){
                this._initSlider();
                this._initNavigation();
            } else {
                //Make hero display nicely even if there is only one slide
                this.slider.parent('.hero-bottom-slider').addClass('hero-onesie-parent');
                this.heroNavParent.remove();
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