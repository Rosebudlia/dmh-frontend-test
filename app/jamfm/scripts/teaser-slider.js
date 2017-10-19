function initTeaser() {
    "use strict";

    try {
        var carousels = document.querySelectorAll( '.teaser-carousel-box' );

        if( !!carousels ) {
            for(var q=0, len=carousels.length; q<len; q++) {
                var element = carousels[q];
                var $thisCarousel = $(element);
                var slideNum;

                // decide whether the slider should be activated (for 2/3 or 3/3 columns) or not (for 1/3 or mobile)
                if (!isMobile()) {

                    if ($thisCarousel.parent().hasClass('col-md-8') === true  || $thisCarousel.parent().hasClass('with-sidebar')){
                        slideNum = 2;


                    } else {
                        slideNum = 3;

                    }
                }

                var slider = element.querySelector('.teaser-carousel');
                var $slider = $(slider);
                if( !!slider === true) {

                    var controls = $(element).find('.control-panel');



                    $slider.on('init', function() {
                        if( window.innerWidth > SCREEN_SM_MIN ) {
                            var stHeight = $slider.find('.slick-track').height();
                            $slider.find('.slick-slide').css('height', stHeight + 'px' );
                            $slider.find('.slick-list').css('height', (stHeight + 20) + 'px' );
                        }
                    });

                    $slider.slick( {
                        autoplay: false,
                        dots: true,
                        customPaging: function(slider, i)  {
                            return SliderCalcPagination(slider, i, slideNum);
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
                                    adaptiveHeight: false,
                                    customPaging: function(slider, i)  {
                                        return SliderCalcPagination(slider, i, 2);
                                    }
                                }
                            },

                            {
                                breakpoint: SCREEN_XS_MAX,
                                settings: {
                                    slidesToShow: 1,
                                    slidesToScroll: 1,
                                    customPaging: function(slider, i)  {
                                        return SliderCalcPagination(slider, i, 1);
                                    },
                                    mobileFirst: true,
                                    adaptiveHeight: true
                                }
                            }
                        ]
                    });
                }

            }
        }
    } catch (e) {
        console.error(e);
    }


}