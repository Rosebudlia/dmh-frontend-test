/// <reference path="../../../common/typescript/Webradio/Webradio.ts" />
/// <reference path="../../../common/typescript/global.inc.ts" />
// / <reference path="../../scrips/_config.js" />


/**
 * Webradio class for Brocken
 */
class WebradioJamFm extends Webradio {
    coverContainerClass: string;
    songinfoContainerClass: string;
    slider: any;
    refreshInterval: any;
    container: any;


    /**
     * Constructor
     * @param opts
     */
    constructor(opts) {
        super(opts);

        let self = this;

        this.container = document.querySelector('.navigation-webradio');
        if( !this.container ) {
            throw('Webradio: Cannot initialize. Container not found.');
        }

        this.errorContainer = this.container.querySelector('.navigation-webradio-error');
        if( !this.errorContainer ) {
            console.error('Webradio Warning: Error container .navigation-webradio-error not found.');
        }

        this.coverContainerClass = '.navigation-webradio-cover';
        if( !!opts.coverContainerClass ) {
            this.coverContainerClass = opts.coverContainerClass;
        }

        this.songinfoContainerClass = '.navigation-webradio-info';
        if( !!opts.songinfoContainerClass ) {
            this.songinfoContainerClass = opts.songinfoContainerClass;
        }

        if( !this.currentChannel ) {
            this.currentChannel = 'onair';
        }

        if( $(this.container).parents('.radioplayer').length <= 0 ) {
            this.initChannelSlider();
        }

        this._fetchPlayingNow(this.sendSongData);

        if( opts.refresh != false ) {
            this.refreshInterval = window.setInterval(function() {
                self._fetchPlayingNow(self.sendSongData);
            }, 20000);
        }
    }


    toggleLoading(show) {
        "use strict";
        var loading = this.container.querySelector('.navigation-webradio-loading');
        if( !!loading ) {
            loading.style.display = (!!show) ? 'flex' : 'none';
        }
    }


    setBlurryCover(url:string) {
        let blur = $('.navigation-webradio-image-blur');
        blur.css({
            'background-image': 'url("' + url + '")'
        });

        // IE polyfill
        if( navigator.userAgent.indexOf('MSIE') !== -1 || !!navigator.userAgent.match(/Trident.*rv\:11\./) ) {
            blur.after('<div style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; background: rgba(127,127,127,0.3);"></div>');
        }
    }


    initChannelSlider() {
        let self = this;
        this.slider = this.container.querySelector('.navigation-webradio-slider');

        if( !!this.slider && !this.slider.classList.contains('slick-initialized') ) {

            $(this.slider).on('init', function(event, slick) {

                $(self.container).find('.navigation-webradio-channels').slick({
                    arrows: false,
                    dots: false,
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    variableWidth: false,

                    responsive: [
                        {
                            breakpoint: SCREEN_SM_MAX,
                            settings: {
                                slidesToShow: 1,
                                slidesToScroll: 1,
                                centerMode: true,
                                variableWidth: true,
                            }
                        },
                    ],
                });


                var channelSwitcher = self.container.querySelectorAll('.navigation-webradio-channel');
                if( !!channelSwitcher ) {
                    for(var i=0, len=channelSwitcher.length; i<len; i++) {
                        channelSwitcher[i].addEventListener('click', function(event) {
                            event.preventDefault();

                            $(self.container).find('.navigation-webradio-channel.current').removeClass('current');
                            this.classList.add('current');

                            var index = parseInt(this.getAttribute('data-index'), 10) || 0;
                            $(self.container).find('.navigation-webradio-channels').slick('slickGoTo', index);
                            $(slick.$slider).slick('slickGoTo', index);

                            return false;
                        });
                    }
                }

                self.toggleLoading(false);
                self.container.classList.remove('hidden');
            });

            $(this.slider).slick({
                slidesToShow: 1,
                slidesToScroll: 1,
                infinite: true,
                nextArrow: '<button type="button" class="slick-next ic-ic_arrow_right"></button>',
                prevArrow: '<button type="button" class="slick-prev ic-ic_arrow_left"></button>',
            });

            $(this.slider).on('beforeChange', function(event, slick) {
                self.toggleLoading(true);

                let slide = $(slick.$slider).find('.slick-current.slick-active:not(.slick-cloned)').next('.slick-slide');
                if( slide.length ) {
                    let channel = slide.data('channel-name');
                    let channelUrlSuffix = self.getPathByJsonName(channel);

                    if( !!channelUrlSuffix ) {
                        let href = slide.find('.navigation-webradio-play').attr('href');
                        slide.find('.navigation-webradio-play').attr(
                            'href', href.replace(/\/([a-z]+)$/ig, '/' + channelUrlSuffix)
                        );
                    }

                    self._fetchPlayingNow( function() {
                        self.sendSongData(self, self.channelIndex);
                    });
                }
            });

            $(this.slider).on('afterChange', function(event, slick, currentSlide, nextSlide) {
                let slide = $(slick.$slider).find('.slick-current.slick-active:not(.slick-cloned)');
                if( slide.length ) {
                    $(self.container).find('.navigation-webradio-channel.current').removeClass('current');
                    $('.navigation-webradio-channel[data-index="'+currentSlide+'"]').addClass('current');
                    $(self.container).find('.navigation-webradio-channels').slick('slickGoTo', currentSlide);
                }

                self.toggleLoading(false);
            });
        }
    }


    loadChannel(channelName: string) {
        let self = this;

        if( !!channelName ) {
            let dt = new Date();

            this.updateTitleSearch(
                'refresh',
                0,
                dt.getHours(),
                dt.getMinutes(),
                channelName
            );

            this.currentChannel = channelName;
            this.channelIndex = self.getIndexFromJsonName(channelName);
            this._fetchPlayingNow( function() {
                self.sendSongData(self, self.channelIndex);
            });
        }
    }

    /**
     * Set the current channel
     * @param channel
     */
    setCurrentChannel( channel ) {
        let self = this;

        if( !!channel ) {
            this.currentChannel = channel;

            for(var i=0, len=this.playingNowData.length; i<len; i++) {
                if( this.playingNowData[i].name === self.getJsonKeyName( self.currentChannel ) ) {
                    self.channelIndex = i;
                    self.sendSongData(self, self.channelIndex );
                }
            }

            // Set cover link
            $( '.webradio__playing__cover__link' ).each( function() {
                $( this ).attr( 'href', self.webradioBaseUrl + channel + '/' );
            } );
        }
    }


    /**
     * Set cover image in cover container
     */
    setCoverImage(slide, data) {
        if( !!slide && !!data ) {
            let coverContainer = $(slide).find( this.coverContainerClass );

            if( !!data.playingNowData ) {
                let $slide = $(slide);
                $slide.attr('data-cover-url', this.fallbackImageUrl);

                coverContainer.css({
                    'background': 'url("' + this.fallbackImageUrl + '")',
                    'background-size': 'contain'
                });

                if( !!data.playingNowData.imageElement ) {
                    $slide.attr('data-cover-url', data.playingNowData.imageElement.src);
                    coverContainer.find( 'img' ).attr('src', data.playingNowData.imageElement.src);
                    coverContainer.find( 'a' ).append( data.playingNowData.imageElement.src );

                    if( $slide.hasClass('slick-current') || $slide.hasClass('active-channel') ) {
                        this.setBlurryCover(data.playingNowData.imageElement.src);
                    }
                }
            }
        }
    }



    /**
     * Set artist and track info in container
     */
    setTrackInfo(slide, playingNowData) {
        if (!!playingNowData && !!slide) {
            let infoContainer = $(slide).find(this.songinfoContainerClass);

            if (!!playingNowData.playHistories[0].track.artist) {
                infoContainer.find('.artist').html(playingNowData.playHistories[0].track.artist);
            }

            if (!!playingNowData.playHistories[0].track.title) {
                let split = playingNowData.playHistories[0].track.title.split(/(\([^)]+\))/);

                infoContainer.find('.track').html(split[0].trim());
                if( split.length > 1 ) {
                    infoContainer.find('.track-additional').html(split[1].trim());
                }
            }
        }
    }


    /**
     * Show current song data
     * @param self
     * @param index
     */
    sendSongData( self, index ) {
        for(let item of self.playingNowData) {
            let channelSlide = self.container.querySelector('.navigation-webradio-slider-channel:not(.slick-cloned)[data-channel-name="'+item.name+'"]');

            if( !!channelSlide ) {
                self.setTrackInfo(channelSlide, item);
                self.setCoverImage(channelSlide, {playingNowData: item} );
            }
        }
    }


    getIndexFromJsonName(jsonname:string) {
        let index = 0;

        if( !!jsonname ) {
            for(let item in this.playingNowData) {
                if( this.playingNowData[item].name == jsonname ) {
                    return index;
                }
                index++;
            }
        }

        return index;
    }


    /**
     * Get current channel prefix text, if available
     * @param key
     * @return {*}
     */
    getChannelPrefix( key ) : string {
        if( !!this.channels[ key ] && !!this.channels[ key ].prefix ) {
            return this.channels[ key ];
        }

        return null;
    }


    /**
     * Get play now data at given index
     * @param index
     * @return {{playingNowData: any}}
     */
    getPlaynowData(index:number) {
        return {playingNowData: this.playingNowData[index]};
    }


    /**
     * Get the channel slider
     * @return {any}
     */
    getChannelSlider() {
        return this.slider;
    }
}