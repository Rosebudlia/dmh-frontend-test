/**
 * jQuery plugin to automatically bind event tracking to certain elements
 */
$.fn.dmhEventTracker = function () {
    const MAX_LABEL_LENGTH = 140;
    const DEFAULT_SEPARATOR = '/';

    var methods = {
        /**
         * Show an error message in the dev tools
         * @param message
         * @param throwException
         */
        showError: function (message, throwException) {
            if (!!message) {
                message = 'dmhEventTracker: ' + message;
            } else {
                message = 'dmhEventTracker: Unknown error';
            }

            if (!!throwException) {
                throw(message);
            }

            console.error(message);
        },


        /**
         * Check required parameters
         *
         * @params {Object}
         * @return {null | Object}
         */
        checkParams: function (params) {
            if (!!params.category && !!params.label) {
                return params;
            }

            return null;
        },


        /**
         * Fetch label from image node
         *
         * @param node
         * @return {string}
         */
        fetchLabelFromImage: function (node) {
            return (node.attr('src') || '') + ' - ' + window.btoa(node);
        },


        /**
         * Fetch current slide information from slick slider node
         *
         * @param node
         * @return {*}
         */
        fetchLabelFromSlickSlider: function (node) {
            var current = $(node).find('.slick-current'),
                id = $(node).attr('id') || '';

            if (!!current) {
                var index = $(current).attr('data-slick-index') || '';
                if (!!index) return id + ': Current slide #' + index;
            }

            return '';
        },


        /**
         * Fetch dynamic data
         *
         * @param fields
         * @param sep
         * @param type
         * @returns {string}
         */
        fetchDynamicLabel: function(fields, sep, type) {
            if( !!fields ) {
                var label = [];

                if( !type ) type = 'input';

                for( var i=0, len=fields.length; i<len; i++ ) {
                    var node = $(fields[i]);

                    if( node.length ) {
                        // If we have a select field and don't want the value, we need to fetch
                        // the data from the selected option, instead of the select itself
                        if( node[0].nodeName === 'SELECT' && type !== 'input' )  {
                            node = node.find('option:selected');
                        }

                        switch( type ) {
                            case 'input':
                                label.push(node.val());
                                break;

                            case 'html':
                                label.push(node.html());
                                break;

                            case 'text':
                                label.push(node.text());
                                break;

                            default:
                                break;
                        }
                    }
                }

                return label.join((!!sep) ? sep : DEFAULT_SEPARATOR);
            }
        },


        /**
         * Check if node is a slick slider
         *
         * @param node
         * @return {boolean}
         */
        isSlickSlider: function (node) {
            return (node.find('.slick-slider').length);
        },


        /**
         * Check if tracking is already enabled
         *
         * @param node
         * @return {*|boolean}
         */
        isTrackingEnabled: function (node) {
            return (node.data('dmh-event-initialized') || false);
        },


        /**
         * Parse label and check for JSON options
         *
         * @param options
         * @returns {*}
         */
        parseLabel: function(options) {
            if( !!options ) {
                try {
                    if( !!options.type && !!options.fields ) {
                        var sep = (!!options.separator) ? options.separator : '-';
                        return methods.fetchDynamicLabel(options.fields.split(','), sep, options.type);
                    }
                } catch(e) {
                    console.error(e);
                    return null;
                }
            }

            return null;
        },


        /**
         * Fetch parameters
         * @param el
         * @return {*|null|Object}
         */
        fetchParams: function (el) {
            var element = (!!el) ? $(el) : $(this),
                category = element.data('dmhevt-cat') || '',
                ivwData = element.data('dmhevt-ivw') || '',
                ivwCat = element.data('dmhevt-ivw-cp') || '',
                label = element.data('dmhevt-lbl') || '';

            // Handle slick slider elements
            if (methods.isSlickSlider(element)) {
                label = methods.fetchLabelFromSlickSlider(element);
            }

            // All other nodes
            else {
                switch (element[0].nodeName.toLowerCase()) {
                    case 'img':
                        label = methods.fetchLabelFromImage(element);
                        break;

                    default:
                        if (!label) label = $('<div/>').html(element.html()).text() || '';
                        break;
                }
            }

            // Parse the label
            if( typeof label !== 'string' ) {
                label = methods.parseLabel(label);
            }

            // Trim the label
            if (!!label) {
                label = label.replace(/\n/ig, "").trim();

                if (label.length > MAX_LABEL_LENGTH) {
                    label = label.slice(0, (MAX_LABEL_LENGTH - 1)) + '...';
                }
            }

            return methods.checkParams({
                'element': element,
                'category': category,
                'label': label,
                'ivw': (!!ivwData && (ivwData === true || ivwData === 'true' || ivwData === 'TRUE')),
                'ivwCat': ivwCat
            });
        },


        /**
         * Set tracking handler
         * @param el
         */
        setTracking: function (el) {
            var element = (!!el) ? $(el) : $(this);

            // Click / Swipe / Touch handler
            if (!!element) {
                element.on('click touch swipe', function (event) {
                    var params = methods.fetchParams(element);

                    if (!!params) {
                        params.event = event.type || '';
                        methods.trackEvent(params);
                    } else {
                        methods.showError('Invalid tracking parameters!');
                    }
                });
            }
        },


        /**
         * Track the event
         * @param params
         */
        trackEvent: function (params) {
            ga('send', 'event', params.category, params.event, params.label, params.value, params.element);

            if (!!params.ivw && !!params.ivwCat) {
                if (!!iom) {
                    iom.c({
                        "st": "antencom",
                        "cp": params.ivwCat,
                        "sv": "in",
                        "co": "kommentar"
                    }, 1);
                }
            }
        }
    };


    /**
     * Fetch all objects and set tracking
     */
    try {
        // Look for the ga object. Without initialized google analytics, we don't need to do anything
        if (!!ga) {
            if (this.length) {
                for (var i = 0, len = this.length; i < len; i++) {
                    var el = $(this[i]);

                    if (!!el.length && !methods.isTrackingEnabled(el)) {
                        el.data('dmh-event-initialized', 'true');
                        methods.setTracking(el);
                    }
                }
            }
        } else {
            methods.showError('Google Analytics is not initialized!', true);
        }
    } catch (e) {
        methods.showError(e.message);
    }
};
