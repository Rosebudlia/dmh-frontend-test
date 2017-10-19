/**
 * Cookie overlay class
 */
class DMHCookieOverlay {
    confirmed: string;
    opts: any;
    layer: string;

    static requiredOptions = [
        'text', 'button', 'duration'
    ];

    /**
     * Get the cookie data
     * @param cname
     * @returns {string}
     * @private
     */
    static _getPrivacyCookie(cname:string) {
        let name = cname + "=",
            ca = document.cookie.split(';');

        if( !!ca ) {
            for(let i = 0, len=ca.length; i < len; i++) {
                let c = ca[i];

                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
        }

        return "";
    }


    /**
     * Set cookie with cookie information
     *
     * @param cname
     * @param cvalue
     * @param exdays
     * @private
     */
    static _setPrivacyCookie(cname:string, cvalue:string, exdays:number) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));

        document.cookie = cname + "=" + cvalue + ";expires=" + d.toUTCString() + ";path=/";
    }


    /**
     * Check cookie
     * @private
     */
    _checkPrivacyCookie() {
        let self = this;

        this.confirmed = DMHCookieOverlay._getPrivacyCookie("privacy");

        if (this.confirmed != "true") {
            this.confirmed = "false";
            DMHCookieOverlay._setPrivacyCookie("privacy", this.confirmed, this.opts.duration);

            /* Display privacy notification */
            let sCookieAlert = document.createElement("div");
            sCookieAlert.innerHTML = this.layer;
            sCookieAlert.id = "CookieLayer";

            if( !!this.opts && !!this.opts.css ) {
                sCookieAlert.setAttribute("style", this.opts.css);
            }

            document.body.appendChild(sCookieAlert);

            // Handle button clicks
            let btn = sCookieAlert.querySelector('.CookieButton');
            if( !!btn ) {
                btn.addEventListener('click', function(event) {
                    event.preventDefault();

                    DMHCookieOverlay._setPrivacyCookie("privacy", "true", self.opts.duration);
                    document.getElementById("CookieLayer").setAttribute("style", "display: none;");

                    return false;
                });
            }
        }
    }


    /**
     * Check options for required parameters
     *
     * @param options
     * @private
     */
    static _checkOptions(options) {
        "use strict";

        if( !options ) {
            throw('CookieOverlay error: No options given.');
        }

        for( let i=0, len=this.requiredOptions.length; i<len; i++ ) {
            if( !options[ this.requiredOptions[ i ] ] ) {
                throw('CookieOverlay error: Option "' + String( this.requiredOptions[ i ] ) + '" missing.');
            }
        }
    }


    /**
     * Constructor
     *
     * @param options
     */
    constructor(options) {
        "use strict";

        DMHCookieOverlay._checkOptions(options);

        this.confirmed = "false";
        this.opts = options;
        this.layer = options.text + options.button;

        this._checkPrivacyCookie();
    }
}