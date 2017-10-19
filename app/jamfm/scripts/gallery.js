
/**
 * Initialization function
 */
function initImageGalleries() {
    try {
        var i = 0,
            len = 0,
            id = null;

        var imageGalleries = document.querySelectorAll('.slider-gallery');
        if( !!imageGalleries ) {
            for(i=0, len=imageGalleries.length; i<len; i++) {
                id = imageGalleries[i].getAttribute('id');
                if( !!id ) {
                    (new SliderGalleryJamFm({
                        selector: '#' + id,
                        toggleDownloadSelector: '.toggle-download',
                        toggleLightboxSelector: '.toggle-lightbox',
                        slideSelector: '.image-lightbox-container',
                        slidesToShow: 1,
                        hideControls: false,
                        sliderNextArrow: '<button type="button" class="slick-next ic-ic_slideRight"></button>',
                        sliderPrevArrow: '<button type="button" class="slick-prev ic-ic_slideLeft"></button>',
                        lightbox: {
                            sliderPrevArrow: '<span class="btn btn-cicle icon ic-ic_arrow_left slick-prev slider-gallery-control"></span>',
                            sliderNextArrow: '<span class="btn btn-cicle icon slider-gallery-control slider-button-capsule">' +
                                             '<span class="ic-ic_arrow_right slick-next"></span>' +
                                             '</span>',
                            hideControls: true
                        },
                        adsSelector: '.image-lightbox-container-custom'
                    }));

                }
            }
        }
    } catch(e) {
        console.error(e);
    }
}