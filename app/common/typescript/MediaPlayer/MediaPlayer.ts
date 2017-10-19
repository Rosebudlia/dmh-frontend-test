/// <reference path="../../../../node_modules/@types/jquery/index.d.ts" />
/// <reference path="../global.inc.ts" />

//
// Constants
//
const MEDIA_PLAYER_DEFAULT_SKIN = 'dmh-skin';
const MEDIA_PLAYER_DEFAULT_PLSELECTOR = '.dmh-player-playlist';


/**
 * MediaPlayer configuration interface
 */
interface MediaPlayerConfiguration {
    wrapper: any;
    widgetId: string;
    stdHeight: any;
    skin: string;
    playlistSelector: string;
    additionalSelector: string;
    loadingIcon: string;
    multiplay: boolean;
}


/**
 * MediaPlayer class
 */
class MediaPlayer {
    widgetId: string;
    element: any;
    player: any;
    url: string;
    width: any;
    height: any;
    stdHeight: any;
    title: string;
    image: any;
    type: string;
    playlist: string;
    playlistIndex: number;
    playlistContainer: HTMLDivElement;
    jwplayer: any;
    adContainer: HTMLDivElement;
    loadingIcon: string;
    multiplay: boolean;

    /**
     * Get the jwplayer element
     *
     * @returns any
     * @private
     */
    private _getPlayer(): void {
        return this.jwplayer;
    }


    /**
     * Set title in title container
     *
     * @param title
     * @private
     */
    private _setTitle(title:string) {
        let titleContainer = this.element.querySelector('.dmh-player-title');
        if( !!titleContainer ) {
            titleContainer.innerHTML = escapeHtml(title);
        }
    }


    /**
     * Unset all active playlist entries
     *
     * @private
     */
    private _playlistActiveUnset(self?:MediaPlayer): void {
        let $self = (!!self) ? self : this;
        $($self.element).find('.dmh-player-playlist-entry.active').removeClass('active');
    }


    /**
     * Return loading container node with spinner icon inside
     * @returns {HTMLDivElement}
     * @private
     */
    private _getLoadingContainer() {
        let node = document.createElement('span');
        node.classList.add('entry-loading');
        node.style.display = 'none';

        let spinner = document.createElement('span');
        spinner.classList.add('icon');
        spinner.classList.add(this.loadingIcon);

        node.appendChild(spinner);
        return node;
    }


    /**
     * Show loading container
     * @param entry
     * @private
     */
    private static _showLoading(entry: HTMLElement) {
        if( !!entry ) {
            entry.style.opacity = '0.75';

            let l = <HTMLElement>entry.querySelector('.entry-loading');
            if( !!l ) {
                l.style.display = 'block';
            }
        }
    }


    /**
     * Hide loading container
     *
     * @param entry
     * @private
     */
    private static _hideLoading(entry: HTMLElement) {
        if( !!entry ) {
            entry.style.opacity = '1';

            let l = <HTMLElement>entry.querySelector('.entry-loading');
            if( !!l ) {
                l.style.display = 'none';
            }
        }
    }


    /**
     * Build playlist entry item
     *
     * @param itemIndex
     * @param result
     * @returns {HTMLDivElement}
     * @private
     */
    private _getPlaylistEntry(itemIndex:number, result:any): HTMLDivElement {
        let self = this;

        let entry = document.createElement('div');
        entry.classList.add('dmh-player-playlist-entry');
        entry.classList.add('clearfix');
        entry.setAttribute('data-index', itemIndex.toString());

        let index = document.createElement('span');
        index.classList.add('entry-index');
        index.innerHTML = (itemIndex+1).toString();
        entry.appendChild(index);

        let title = document.createElement('span');
        title.classList.add('entry-title');
        if( !!result.title ) {
            title.innerHTML = result.title;

            if( itemIndex === 0 ) {
                this._setTitle(result.title);
            }
        } else {
            title.innerHTML = '-';

            if( itemIndex === 0 ) {
                this._setTitle('-');
            }
        }
        entry.appendChild(title);

        if( this.loadingIcon ) {
            entry.appendChild(this._getLoadingContainer());
        }

        let length = document.createElement('span');
        length.classList.add('entry-length');
        length.classList.add('pull-right');
        if( !!result.length ) {
            length.innerHTML = result.length;
        } else {
            length.innerHTML = '0:00';
        }
        entry.appendChild(length);

        entry.addEventListener('click', function() {
            self._playlistActiveUnset();

            if( !!self.loadingIcon ) {
                MediaPlayer._showLoading(this);
            }

            if( !!self.adContainer ) {
                if( typeof googletag !== 'undefined' ) {
                    googletag.pubads().refresh();
                    self.adContainer.classList.add('show');
                }
            }

            if( !!self.playlistContainer && $(self.playlistContainer).css('position') === 'fixed' ) {
                self.playlistContainer.classList.remove('open');
            }

            // Set title in title container
            if( self.type == 'video' ) {
                self._setTitle(result.title);
            }

            self.playlistIndex = parseInt((this.getAttribute('data-index') || null), 10);
            self.jwplayer.playlistItem(self.playlistIndex);
        });

        return entry;
    }


    /**
     * Load playlist and player
     * @param options
     * @private
     */
    private _loadPlaylist(options: any): void {
        let self = this,
            selector = (!!options.playlistSelector) ? options.playlistSelector : MEDIA_PLAYER_DEFAULT_PLSELECTOR;

        this.playlistContainer = self.element.querySelector(selector);

        let closeIcon = this.playlistContainer.querySelector('.dmh-player-playlist-header-close');
        if( closeIcon ) {
            closeIcon.addEventListener('click', function() {
                self.playlistContainer.classList.remove('open');
            });
        }

        $.ajax({
            url: self.playlist,
            dataType: 'json'
        })
        .done(function(result) {
            if( !!result ) {
                options.visualplaylist = false;
                options.playlist = result;

                // Set fallback image to all playlist entries with missing image item.
                // The fallback image URL is being taken from the parent's data attribute
                for(let i=0; i<options.playlist.length; i++) {
                    if( !options.playlist[i].image ) {
                        if( self.image ) {
                            options.playlist[i].image = self.image;
                        }
                    }
                }

                self._loadPlayer(options);

                // Populate playlist container
                if( !!self.playlistContainer ) {
                    for(let i=0, len=result.length; i<len; i++) {
                        self.playlistContainer.appendChild(self._getPlaylistEntry(i, result[i]));
                    }
                }
            }
        })
        .fail(function(error) {
            let errorContainer = self.element.querySelector('.dmh-player-error');
            if( !!errorContainer ) {
                errorContainer.classList.remove('hidden');
            }

            if( !!self.playlistContainer ) {
                if( !self.playlistContainer.classList.contains('show') ) {
                    self.playlistContainer.classList.add('hidden');
                }
            }

            console.error(error);
        });
    }

    /**
     * Load media player jwplayer
     *
     * @param options
     * @private
     */
    private _loadPlayer(options: any): void {
        let self = this;
        this.jwplayer = jwplayer(this.widgetId).setup(options);

        this.jwplayer.once('ready', function() {
            self.element.classList.add('init');

            if( !!self.playlist ) {
                let playlistIcon = self.element.querySelector('.dmh-player-playlist-toggle');
                if( !!playlistIcon ) {
                    playlistIcon.addEventListener('click', function(event) {
                        event.preventDefault();

                        if( !!self.playlistContainer ) {
                            if( self.playlistContainer.classList.contains('open') ) {

                            }
                            self.playlistContainer.classList.toggle('open');
                        }

                        return false;
                    });
                }
            }
        });

        // Pause other player on the page if multiplay is disabled
        if( this.multiplay !== true ) {
            this.jwplayer.on('play playlistItem', function() {
                self.pauseAllPlayer();
            });
        }

        if( !!this.playlist ) {
            this.jwplayer.on('play playlistItem', function() {
                self._playlistActiveUnset(self);

                if( self.jwplayer.getState() === 'playing' ) {
                    self.playlistIndex = self.jwplayer.getPlaylistIndex();
                    let entry = self.element.querySelector('.dmh-player-playlist-entry[data-index="' + self.playlistIndex + '"]');

                    if( !!entry ) {
                        if( self.jwplayer.getState() === 'playing' ) {
                            entry.classList.add('active');

                            if( !!self.loadingIcon ) {
                                MediaPlayer._hideLoading(entry);
                            }
                        }
                    }
                }
            });

            this.jwplayer.on('pause', function() {
                self._playlistActiveUnset(self);
            });
        }
    }


    /**
     * Constructor
     *
     * @param opts
     */
    constructor(opts:MediaPlayerConfiguration) {
        if( !jwplayer ) {
            throw('MediaPlayer error: jwplayer not found.');
        }

        this.widgetId = opts.widgetId;
        if( !this.widgetId ) {
            throw('MediaPlayer error: No widget ID found!');
        }

        this.element = opts.wrapper;
        if( !this.element ) {
            throw('MediaPlayer cannot find main element.');
        }

        this.player = document.querySelector(String('#' + this.widgetId));
        if( !this.player ) {
            throw('MediaPlayer cannot find player in element');
        }

        this.url = this.element.getAttribute('data-url');
        this.width = parseInt(this.element.getAttribute('data-width'), 10) || 0;
        this.height = parseInt(this.element.getAttribute('data-height'), 10) || 0;
        this.stdHeight = opts.stdHeight;
        this.title = this.element.getAttribute('data-title');
        this.image = this.element.getAttribute('data-image');
        this.type = this.element.getAttribute('data-type');
        this.playlist = this.element.getAttribute('data-playlist');
        this.playlistIndex = 0;
        this.jwplayer = null;
        this.playlistContainer = null;
        this.loadingIcon = (!!opts.loadingIcon) ? opts.loadingIcon : null;
        this.multiplay = opts.multiplay;

        if( !this.playlist && !this.url ) {
            throw('MediaPlayer #' + this.widgetId + ' error: No data URL found!');
        }

        if( !this.width ) {
            this.width = '100%';
        }

        if( this.type === 'audio' && !this.image ) {
            this.height = this.stdHeight; // Hardcoded for audio player
            this.element.classList.add('no-image');
        }

        this.adContainer = null;
        if( !!opts.additionalSelector ) {
            this.adContainer = this.element.querySelector(opts.additionalSelector);
        }

        let options = {
            file: this.url,
            width: this.width,
            title: this.title,
            displaytitle: true,
            height: 0,
            image: null,
            playlist: null,
            skin: (!!opts.skin) ? opts.skin : MEDIA_PLAYER_DEFAULT_SKIN,
            localization: {
                nextUp: "Nächster Titel",
            }
        };

        if( !!this.height || this.height === 0 ) {
            options.height = this.height;
        }

        if( !!this.image ) {
            options.image = this.image;
        }

        if( !!this.playlist ) {
            this._loadPlaylist(options);
        } else {
            this._loadPlayer(options);
        }
    }


    /**
     * Pause all jwplayer on a page
     */
    pauseAllPlayer() : void {
        try {
            var player = document.querySelectorAll('.jwplayer');
            if( !!player ) {
                for(var i=0,len=player.length; i<len; i++) {
                    var id = player[i].getAttribute('id');

                    if( !!id && id != this.widgetId ) {
                        var jw = jwplayer(id);

                        if( jw.getState() === 'playing' ) {
                            jw.pause(true);
                        }
                    }
                }
            }
        } catch(e) {
            console.error('jwplayer_stopAll error: Cannot pause player. Make sure jwplayer is initialized.');
            console.error(e);
        }
    }
}