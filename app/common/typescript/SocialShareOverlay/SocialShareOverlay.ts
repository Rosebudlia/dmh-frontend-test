/// <reference path="../../../../node_modules/@types/jquery/index.d.ts" />
/// <reference path="../global.inc.ts" />


/**
 * Social share constant definitions and default attributes
 * @type {string}
 */
const SOCIAL_SHARE_OVERLAY_BACKDROP_CLASS = 'social-share-overlay-backdrop';
const SOCIAL_SHARE_OVERLAY_CONTAINER_CLASS = 'social-share-overlay-container';
const SOCIAL_SHARE_OVERLAY_CLOSE_CLASS = 'social-share-overlay-close';
const SOCIAL_SHARE_OVERLAY_HEADLINE_CLASS = 'social-share-overlay-headline';
const SOCIAL_SHARE_OVERLAY_CHANNELS_CLASS = 'social-share-overlay-channels';
const SOCIAL_SHARE_OVERLAY_CHANNELS_HEADLINE_CLASS = 'social-share-overlay-channels-headline';
const SOCIAL_SHARE_OVERLAY_SHARE_ICON_CLASS = 'social-share-overlay-share-icon';

const SOCIAL_SHARE_OVERLAY_ADDITIONAL_CLASS = 'social-share-overlay-additional';
const SOCIAL_SHARE_OVERLAY_ADDITIONAL_HEADLINE_CLASS = 'social-share-overlay-additional-headline';

const SOCIAL_SHARE_OVERLAY_DEFAULT_CHANNELS_HEADLINE = 'Social Media Kanäle';
const SOCIAL_SHARE_OVERLAY_DEFAULT_ADDITIONAL_HEADLINE = 'Weitere Optionen';

const SOCIAL_SHARE_OVERLAY_DEFAULT_COPY_MESSAGE = 'Link wurde in die Zwischenablage kopiert.';
const SOCIAL_SHARE_OVERLAY_DEFAULT_TOOLTIP_POSITION = 'bottom';
const SOCIAL_SHARE_OVERLAY_DEFAULT_TOOLTIP_PRINT = 'Drucken';
const SOCIAL_SHARE_OVERLAY_DEFAULT_TOOLTIP_COPY = 'In die Zwischenablage kopieren';
const SOCIAL_SHARE_OVERLAY_DEFAULT_TOOLTIP_FACEBOOK = 'Auf Facebook teilen';
const SOCIAL_SHARE_OVERLAY_DEFAULT_TOOLTIP_TWITTER = 'Auf Twitter teilen';
const SOCIAL_SHARE_OVERLAY_DEFAULT_TOOLTIP_WHATSAPP = 'Auf Whatsapp teilen';
const SOCIAL_SHARE_OVERLAY_DEFAULT_TOOLTIP_TUMBLR = 'Auf Tumblr teilen';
const SOCIAL_SHARE_OVERLAY_DEFAULT_TOOLTIP_MAIL = 'Per Mail teilen';


/**
 * Social share overlay version
 */
class SocialShareOverlay {
    node: any;
    backdrop: any;
    container: any;
    listener: any;
    messageContainer: any;


    /**
     * Show backdrop container
     * @private
     */
    private _showBackdrop() {
        let self = this;

        this.backdrop = document.createElement('div');
        this.backdrop.classList.add(SOCIAL_SHARE_OVERLAY_BACKDROP_CLASS);

        this.backdrop.addEventListener('click', function() {
            self._remove();
        });

        document.body.appendChild(this.backdrop);

        if( !this.listener ) {
            this.listener = document.addEventListener('keyup', function(event) {
                "use strict";

                if( event.keyCode === 27 ) {
                    self._remove();
                }
            });
        }
    }


    /**
     * Add additional icons
     *
     * @param container
     * @private
     */
    private _addAdditional(container: any) {
        let self = this;

        if( !!container ) {
            let additionalContainer = document.createElement('div');
            additionalContainer.classList.add(SOCIAL_SHARE_OVERLAY_ADDITIONAL_CLASS);

            let additionalHeadline = this.node.getAttribute('data-additional-headline');
            let additionalContainerHeadline = document.createElement('div');
            additionalContainerHeadline.classList.add(SOCIAL_SHARE_OVERLAY_ADDITIONAL_HEADLINE_CLASS);
            additionalContainerHeadline.innerHTML = (!!additionalHeadline) ? escapeHtml(additionalHeadline) : SOCIAL_SHARE_OVERLAY_DEFAULT_ADDITIONAL_HEADLINE;
            additionalContainer.appendChild(additionalContainerHeadline);

            // Mail
            let mailShare = this.node.getAttribute('data-share-mail');
            let mailShareIconUrl = this.node.getAttribute('data-share-mail-icon');
            if( !!mailShare && !!mailShareIconUrl ) {
                let mailShareLink = document.createElement('a');
                mailShareLink.classList.add(SOCIAL_SHARE_OVERLAY_SHARE_ICON_CLASS);
                mailShareLink.href = mailShare;
                mailShareLink.target = '_blank';

                mailShareLink.setAttribute('data-toggle', 'tooltip');
                mailShareLink.setAttribute('data-placement', SOCIAL_SHARE_OVERLAY_DEFAULT_TOOLTIP_POSITION);
                mailShareLink.setAttribute('title', SOCIAL_SHARE_OVERLAY_DEFAULT_TOOLTIP_MAIL);

                let mailShareIcon = document.createElement('img');
                mailShareIcon.src = mailShareIconUrl;

                mailShareLink.appendChild(mailShareIcon);
                additionalContainer.appendChild(mailShareLink);
            }

            // Copy to clipboard
            let copyShare = this.node.getAttribute('data-share-copy');
            let copyShareIconUrl = this.node.getAttribute('data-share-copy-icon');
            if( !!copyShare && !!copyShareIconUrl ) {
                let copyShareLink = document.createElement('span');
                copyShareLink.classList.add(SOCIAL_SHARE_OVERLAY_SHARE_ICON_CLASS);
                copyShareLink.classList.add('social-copy');
                copyShareLink.setAttribute('data-url', copyShare);

                copyShareLink.setAttribute('data-toggle', 'tooltip');
                copyShareLink.setAttribute('data-placement', SOCIAL_SHARE_OVERLAY_DEFAULT_TOOLTIP_POSITION);
                copyShareLink.setAttribute('title', SOCIAL_SHARE_OVERLAY_DEFAULT_TOOLTIP_COPY);

                let copyShareIcon = document.createElement('img');
                copyShareIcon.src = copyShareIconUrl;

                copyShareLink.appendChild(copyShareIcon);
                additionalContainer.appendChild(copyShareLink);

                copyShareLink.addEventListener('click', function(event) {
                    "use strict";
                    event.preventDefault();

                    new Clipboard('.social-copy', {
                        text: function(trigger) {
                            let url = trigger.getAttribute('data-url') || '';
                            return (!!url && url !== 'true') ? url : document.location.href;
                        }
                    });

                    if( !!self.messageContainer ) {
                        if( self.messageContainer.classList.contains('hidden') ) {
                            self.messageContainer.innerHTML += escapeHtml(SOCIAL_SHARE_OVERLAY_DEFAULT_COPY_MESSAGE);
                            self.messageContainer.classList.remove('hidden');
                        }
                    }
                })
            }


            // Print
            let printShare = this.node.getAttribute('data-share-print');
            let printShareIconUrl = this.node.getAttribute('data-share-print-icon');
            if( !!printShare && !!printShareIconUrl ) {
                let printShareLink = document.createElement('span');
                printShareLink.classList.add(SOCIAL_SHARE_OVERLAY_SHARE_ICON_CLASS);
                printShareLink.classList.add('social-print');
                printShareLink.setAttribute('data-toggle', 'tooltip');
                printShareLink.setAttribute('data-placement', SOCIAL_SHARE_OVERLAY_DEFAULT_TOOLTIP_POSITION);
                printShareLink.setAttribute('title', SOCIAL_SHARE_OVERLAY_DEFAULT_TOOLTIP_PRINT);

                let printShareIcon = document.createElement('img');
                printShareIcon.src = printShareIconUrl;

                printShareLink.appendChild(printShareIcon);
                additionalContainer.appendChild(printShareLink);

                printShareLink.addEventListener('click', function(event) {
                    "use strict";
                    event.preventDefault();
                    window.print();
                    return false;
                })
            }

            container.appendChild(additionalContainer);
        }
    }


    /**
     * Add social network channels
     *
     * @param container
     * @private
     */
    private _addChannels(container:any) {
        if( !!container ) {
            let channelContainer = document.createElement('div');
            channelContainer.classList.add(SOCIAL_SHARE_OVERLAY_CHANNELS_CLASS);

            let channelHeadline = this.node.getAttribute('data-channel-headline');
            let channelContainerHeadline = document.createElement('div');
            channelContainerHeadline.classList.add(SOCIAL_SHARE_OVERLAY_CHANNELS_HEADLINE_CLASS);
            channelContainerHeadline.innerHTML = (!!channelHeadline) ? escapeHtml(channelHeadline) : SOCIAL_SHARE_OVERLAY_DEFAULT_CHANNELS_HEADLINE;
            channelContainer.appendChild(channelContainerHeadline);

            // Facebook
            let fbShare = this.node.getAttribute('data-share-facebook');
            let fbShareIconUrl = this.node.getAttribute('data-share-facebook-icon');
            if( !!fbShare && !!fbShareIconUrl ) {
                let fbShareLink = document.createElement('a');
                fbShareLink.classList.add(SOCIAL_SHARE_OVERLAY_SHARE_ICON_CLASS);
                fbShareLink.href = fbShare;
                fbShareLink.target = '_blank';

                fbShareLink.setAttribute('data-toggle', 'tooltip');
                fbShareLink.setAttribute('data-placement', SOCIAL_SHARE_OVERLAY_DEFAULT_TOOLTIP_POSITION);
                fbShareLink.setAttribute('title', SOCIAL_SHARE_OVERLAY_DEFAULT_TOOLTIP_FACEBOOK);

                let fbShareIcon = document.createElement('img');
                fbShareIcon.src = fbShareIconUrl;

                fbShareLink.appendChild(fbShareIcon);
                channelContainer.appendChild(fbShareLink);
            }

            // Twitter
            let twShare = this.node.getAttribute('data-share-twitter');
            let twShareIconUrl = this.node.getAttribute('data-share-twitter-icon');
            if( !!twShare && !!twShareIconUrl ) {
                let twShareLink = document.createElement('a');
                twShareLink.classList.add(SOCIAL_SHARE_OVERLAY_SHARE_ICON_CLASS);
                twShareLink.href = twShare;
                twShareLink.target = '_blank';

                twShareLink.setAttribute('data-toggle', 'tooltip');
                twShareLink.setAttribute('data-placement', SOCIAL_SHARE_OVERLAY_DEFAULT_TOOLTIP_POSITION);
                twShareLink.setAttribute('title', SOCIAL_SHARE_OVERLAY_DEFAULT_TOOLTIP_TWITTER);

                let twShareIcon = document.createElement('img');
                twShareIcon.src = twShareIconUrl;

                twShareLink.appendChild(twShareIcon);
                channelContainer.appendChild(twShareLink);
            }

            // Whatsapp (mobile) / Tumblr (desktop)
            if( !isMobile() ) {
                let tbShare = this.node.getAttribute('data-share-tumblr');
                let tbShareIconUrl = this.node.getAttribute('data-share-tumblr-icon');
                if( !!tbShare && !!tbShareIconUrl ) {
                    let tbShareLink = document.createElement('a');
                    tbShareLink.classList.add(SOCIAL_SHARE_OVERLAY_SHARE_ICON_CLASS);
                    tbShareLink.href = tbShare;
                    tbShareLink.target = '_blank';

                    tbShareLink.setAttribute('data-toggle', 'tooltip');
                    tbShareLink.setAttribute('data-placement', SOCIAL_SHARE_OVERLAY_DEFAULT_TOOLTIP_POSITION);
                    tbShareLink.setAttribute('title', SOCIAL_SHARE_OVERLAY_DEFAULT_TOOLTIP_TUMBLR);

                    let tbShareIcon = document.createElement('img');
                    tbShareIcon.src = tbShareIconUrl;

                    tbShareLink.appendChild(tbShareIcon);
                    channelContainer.appendChild(tbShareLink);
                }
            } else {
                let waShare = this.node.getAttribute('data-share-whatsapp');
                let waShareIconUrl = this.node.getAttribute('data-share-whatsapp-icon');
                if( !!waShare && !!waShareIconUrl ) {
                    let waShareLink = document.createElement('a');
                    waShareLink.classList.add(SOCIAL_SHARE_OVERLAY_SHARE_ICON_CLASS);
                    waShareLink.href = waShare;
                    waShareLink.target = '_blank';

                    waShareLink.setAttribute('data-toggle', 'tooltip');
                    waShareLink.setAttribute('data-placement', SOCIAL_SHARE_OVERLAY_DEFAULT_TOOLTIP_POSITION);
                    waShareLink.setAttribute('title', SOCIAL_SHARE_OVERLAY_DEFAULT_TOOLTIP_WHATSAPP);

                    let waShareIcon = document.createElement('img');
                    waShareIcon.src = waShareIconUrl;

                    waShareLink.appendChild(waShareIcon);
                    channelContainer.appendChild(waShareLink);
                }
            }

            container.appendChild(channelContainer);
        }
    }



    /**
     * Remove backdrop and container
     * @private
     */
    private _remove() {
        if( !!this.container ) {
            document.body.removeChild(this.container);
            this.container = null;
        }

        if( !!this.backdrop ) {
            document.body.removeChild(this.backdrop);
            this.backdrop = null;
        }
    }


    /**
     * Show main container
     *
     * @private
     */
    private _showContainer() {
        "use strict";
        let self = this;

        if( !!this.backdrop ) {
            this.container = document.createElement('div');
            this.container.classList.add(SOCIAL_SHARE_OVERLAY_CONTAINER_CLASS);

            // Add close icon
            let close = document.createElement('span');
            close.classList.add('ic-ic_close');
            close.classList.add(SOCIAL_SHARE_OVERLAY_CLOSE_CLASS);
            this.container.appendChild(close);

            close.addEventListener('click', function(event) {
                event.preventDefault();
                self._remove();
                return false;
            });

            // Set headline
            let headline = this.node.getAttribute('data-headline');
            if( !!headline ) {
                let headlineNode = document.createElement('div');
                headlineNode.classList.add(SOCIAL_SHARE_OVERLAY_HEADLINE_CLASS);
                headlineNode.innerHTML = escapeHtml(headline);
                this.container.appendChild(headlineNode);
            }

            // Add message container
            this.messageContainer = document.createElement('div');
            this.messageContainer.classList.add('alert');
            this.messageContainer.classList.add('alert-info');
            this.messageContainer.classList.add('text-center');
            this.messageContainer.classList.add('hidden');
            this.container.appendChild(this.messageContainer);

            // Set Channels
            this._addChannels(this.container);
            this._addAdditional(this.container);

            document.body.appendChild(this.container);

            this.container.style.top = 'calc(50% - ' + (this.container.offsetHeight/2) + 'px)';
            this.container.style.left = 'calc(50% - ' + (this.container.offsetWidth/2) + 'px)';

            $(this.container).find('[data-toggle="tooltip"]').tooltip({
                container: 'body'
            });
        } else {
            throw('SocialShareOverlay error: Cannot add container. Missing backdrop node.')
        }
    }


    /**
     * Open the social sharing
     */
    private _open() {
        this._showBackdrop();
        this._showContainer();
    }


    /**
     * Constructor
     * @param node
     */
    constructor(node:any) {
        "use strict";
        const self = this;

        this.node = node;
        if( !this.node ) {
            throw('SocialShareOverlay error: No element node given.');
        }

        this.node.addEventListener('click', function(event:any) {
            event.preventDefault();
            self._open();
            return false;
        });
    }
}