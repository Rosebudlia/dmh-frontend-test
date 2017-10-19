

/**
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 *
 *                          !!!!! DEPRECATED !!!!!
 *
 * Warning: This version of the cooie overlay is deprecated and only in use by old
 *          projects. If you want to implement a cookie overlay, use the new
 *          typescript version.
 *
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 */




/**
 * Cookie overlay class
 *
 * @param options
 * @constructor
 */
function DMHCookieOverlay(options) {
    "use strict";

    this.checkOptions(options);

    this.confirmed = false;
    this.opts = options;
    this.layer = options.text + options.button;

    this.checkPrivacyCookie();
}


DMHCookieOverlay.prototype.checkPrivacyCookie = function() {
    var self = this;

    this.confirmed = this.getPrivacyCookie("privacy");

    if (this.confirmed !== "true") {
        this.confirmed = false;
        this.setPrivacyCookie("privacy", this.confirmed, this.opts.duration);

        /* Display privacy notification */
        var sCookieAlert = document.createElement("div");
        sCookieAlert.innerHTML = this.layer;
        sCookieAlert.id = "CookieLayer";

        if( !!this.opts && !!this.opts.css ) {
            sCookieAlert.setAttribute("style", this.opts.css);
        }

        document.body.appendChild(sCookieAlert);

        // Handle button clicks
        var btn = sCookieAlert.querySelector('.CookieButton');
        if( !!btn ) {
            btn.addEventListener('click', function(event) {
                event.preventDefault();

                self.setPrivacyCookie("privacy", "true", self.opts.duration);
                document.getElementById("CookieLayer").setAttribute("style", "display: none;");

                return false;
            });
        }
    }
};


DMHCookieOverlay.prototype.setPrivacyCookie = function(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));

    document.cookie = cname + "=" + cvalue + ";expires=" + d.toUTCString() + ";path=/";
};


DMHCookieOverlay.prototype.getPrivacyCookie = function(cname) {
    var name = cname + "=",
        ca = document.cookie.split(';');

    if( !!ca ) {
        for(var i = 0, len=ca.length; i < len; i++) {
            var c = ca[i];

            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
    }

    return "";
};


DMHCookieOverlay.prototype.checkOptions = function(options) {
    "use strict";

    var required = [
        'text', 'button', 'duration'
    ];

    if( !options ) {
        throw('CookieOverlay error: No options given.');
    }

    for( var i=0, len=required.length; i<len; i++ ) {
        if( !options[ required[ i ] ] ) {
            throw('CookieOverlay error: Option "' + String( required[ i ] ) + '" missing.');
        }
    }
};
