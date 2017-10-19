/// <reference path="../../../../node_modules/@types/jquery/index.d.ts" />
/// <reference path="../global.inc.ts" />


/**
 * General Major Promo Controller class
 */
class MajorPromoController {
    selector: string;
    promos: any;


    /**
     * Resize container to the height of its background image
     *
     * @param container
     * @private
     */
    private _resizeToBackgroundImage(container:any) {
        if( !!container ) {
            let bgimage = container.style.backgroundImage;

            if (!!bgimage) {
                let url = String(bgimage.replace('url(', '').replace(')', '')
                                 .replace(/"/g, '').replace(/'/g, '')).trim();

                if (!!url) {
                    let img = document.createElement('img');

                    img.onload = function () {
                        container.style.height = img.height + 'px';
                    };

                    img.src = url;
                }
            }
        }
    }


    /**
     * Initialize all modules
     * @private
     */
    private _initModules() {
        // Resize all containers to match the background image height for type module02
        for(let i=0, len=this.promos.length; i<len; i++) {
            let modules = this.promos[i].querySelectorAll('.major-promo-module');

            for (let i = 0, len = modules.length; i < len; i++) {
                if (modules[i].classList.contains('major-promo-module02')) {
                    let containers = modules[i].querySelectorAll('div[style*="background-image"]');

                    if( !!containers ) {
                        for(let container of containers) {
                            this._resizeToBackgroundImage(container);
                        }
                    }
                }

                if(modules[i].classList.contains('major-promo-module06')) {
                    if( window.innerWidth > SCREEN_SM_MIN ) {
                        this._resizeToBackgroundImage(modules[i]);
                    } else {
                        modules[i].style.height = 'auto';
                    }
                }
            }
        }
    }


    /**
     * Constructor
     * @param selector
     */
    constructor(selector: string) {
        var self = this;
        this.selector = selector;

        // Find main container
        this.promos = document.querySelectorAll(this.selector);

        if( !!this.promos) {
            this._initModules();

            $(window).on('resize', function() {
                self._initModules();
            });
        }
    }
}