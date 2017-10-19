function initSocialFeed() {
    "use strict";

    try {
        var feeds = document.querySelectorAll( '.social-feed' );

        if( !!feeds ) {
            for(var q=0, len=feeds.length; q<len; q++) {
                var element = feeds[q];
                var $feed = $(element);
                var slideable, slideNum;

                // decide whether the slider should be activated (for 2/3 or 3/3 columns) or not (for 1/3 or mobile)
                if (!isMobile()) {

                if( $feed.parents('.with-sidebar').length ) {
                    slideNum = 2;
                    slideable = true;
                } else if ( $feed.parents('.sidebar').length ) {
                    slideNum = 0;
                    slideable = false;
                    $(element).addClass('sliderless');
                } else {
                    slideNum = 3;
                    slideable = true;
                }

                } else {
                    slideable = false;
                    $(element).addClass('sliderless');
                }

                var slider = element.querySelector('.social-feed-slider');
                var $slider = $(slider);
                if( !!slider && slideable === true) {
                    var controls = $(element).find('.control-panel');

                    (function($slider) {
                        $slider.on('init', function() {
                            var stHeight = $slider.find('.slick-track').height();
                            $slider.find('.slick-slide').css('height',stHeight + 'px' );
                        });
                    })($slider);

                    $slider.slick( {
                        autoplay: false,
                        dots: true,
                        customPaging: function(slider, i)  {
                            return SliderCalcPagination(slider, i, slider.getOption('slidesToShow'));
                        },
                        arrows: true,
                        nextArrow: '<span class="btn icon ic-ic_slideRight slick-next slider-gallery-control"></span>',
                        prevArrow: '<span class="btn icon ic-ic_slideLeft slick-prev slider-gallery-control"></span>',
                        appendDots: $(controls),
                        appendArrows: $(controls),
                        mobileFirst: false,
                        slidesToShow: slideNum,
                        slidesToScroll: slideNum,
                        infinite: false,
                        adaptiveHeight: false,
                        responsive: [
                            {
                                breakpoint: SCREEN_SM_MAX,
                                settings: {
                                    slidesToShow: 2,
                                    slidesToScroll: 2,
                                }
                            },

                            {
                                breakpoint: SCREEN_XS_MAX,
                                settings: {
                                    slidesToShow: 1,
                                    slidesToScroll: 1,
                                    adaptiveHeight: true
                                }
                            }
                        ]
                    });

                } else {
                    var sliderbox = $feed.find('.social-items');
                    var butBox = $('<div class="button-container"></div>');

                    $(sliderbox).after(butBox);

                    (function ($slider) {
                        butBox.append($('<span role="button" class="btn icon ic-ic_arrow_down slick-prev social-expand-button"></span>').click(function() {
                                var btn = $(this);

                                $slider.find('.open').removeClass('open');
                                $slider.removeClass('itemOpen');

                                if ($slider.hasClass('open')) {
                                    $slider.removeClass('open');
                                    $(btn).removeClass('ic-ic_arrow_up');
                                    $(btn).addClass('ic-ic_arrow_down');
                                } else {
                                    $slider.addClass('open');
                                    $(btn).removeClass('ic-ic_arrow_down');
                                    $(btn).addClass('ic-ic_arrow_up');
                                }
                            })
                        );

                        $slider.find('.social-feed-slider-item > .social-feed-slider-item-body').on('click', function (event) {
                            var $self = $(this);
                            var $parent = $self.parent('.social-feed-slider-item');

                            if( !$parent.hasClass('open') ) {
                                event.preventDefault();
                                $slider.find('.open').removeClass('open');
                                $parent.addClass('open');

                                $slider.addClass('itemOpen');
                            }
                        });
                    })($slider);
                }


                //
                // Social feed filters
                //
                var filter = element.querySelectorAll('.social-feed-filter');

                if( !!filter ) {
                    for(var f=0, lenF=filter.length; f<lenF; f++) {
                        var currentFilter = filter[f];
                        var inputs = filter[f].querySelectorAll('.form-checkbox input');

                        if( !!inputs ) {
                            for(var fIn=0, fInLen=inputs.length; fIn < fInLen; fIn++) {
                                (function (currentFilter, $slider) {
                                    var elementFilter = inputs[fIn];
                                    var target = elementFilter.getAttribute('data-social') || '';
                                    var filtered = false;
                                    if( !!target && !$feed.hasClass('sliderless')) {
                                        var readySlider = $feed.find('.social-feed-slider');
                                        var $readySlider = $(readySlider);

                                        (function(slideNum) {
                                            elementFilter.addEventListener('change', function(event) {
                                                event.preventDefault();
                                                // var filterSelected = $('.filterSelected');

                                                $readySlider.slick('slickUnfilter');
                                                filtered = false;
                                                $slider.find('.filterSelected').removeClass('filterSelected');

                                                var checked = $(currentFilter).find('.form-checkbox input:checked');
                                                if( checked.length ) {

                                                    for(var i=0, len=checked.length; i<len; i++) {
                                                        var target = checked[i].getAttribute('data-social') || '';
                                                        $slider.find('[data-social="' + target + '"]').addClass('filterSelected');

                                                        if( i === (checked.length - 1) && !!target && filtered === false) {
                                                            $readySlider.slick('slickFilter', '.filterSelected');
                                                            filtered = true;
                                                        }
                                                    }
                                                } else {
                                                    $readySlider.slick('slickUnfilter');
                                                    $slider.find('.filterSelected').removeClass('filterSelected');
                                                    filtered = false;
                                                }

                                                $slider.slick('slickSetOption', 'slidesToShow', slideNum, true);
                                                $slider.slick('slickSetOption', 'slidesToScroll', slideNum, true);

                                                return false;
                                            });
                                        })(slideNum);
                                    } else if ($feed.hasClass('sliderless')) {
                                        elementFilter.addEventListener('change', function(event) {
                                            event.preventDefault();

                                            filtered = false;
                                            $slider.find('.social-feed-slider-item').removeClass('filterSelected');

                                            var checked = $(currentFilter).find('.form-checkbox input:checked');
                                            if( checked.length ) {
                                                for(var i=0, len=checked.length; i<len; i++) {
                                                    var target = checked[i].getAttribute('data-social') || '';

                                                    filtered = true;
                                                    $slider.addClass('filtered');

                                                    $slider.find('[data-social="' + target + '"]').addClass('filterSelected');

                                                    if ( i === (checked.length - 1) && !!target && filtered === false) {
                                                        filtered = true;
                                                        $slider.addClass('filtered');
                                                    }
                                                }
                                            } else {
                                                filtered = false;
                                                $slider.removeClass('filtered');
                                            }

                                            return false;
                                        });
                                    }
                                })(currentFilter, $slider);
                            }
                        }
                    }
                }
            }
        }
    } catch (e) {
        console.error(e);
    }
}