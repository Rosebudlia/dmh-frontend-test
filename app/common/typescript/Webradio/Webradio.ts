/// <reference path="../Titlesearch/Titlesearch.ts" />
/// <reference path="../../../../node_modules/@types/jquery/index.d.ts" />

class Webradio {
    playingNowData: any;
    currentChannel: string;
    defaultChannel: string;
    channelIndex: number;
    fallbackImageUrl: string;
    fetchingData: boolean;
    updatingData: boolean;
    webradioBaseUrl: string;
    channels: any;
    url: string;
    errorContainer: any;

    // Titlesearch
    titlesearch: any;
    titlesearchOptions: {
        url: string;
        container: any,
        coverFallbackUrl: string,
    };

    _setChannels(channelList ) {
        if( !!channelList ) {
            this.channels = {};

            let index = 0;
            for( let i in channelList ) {
                if( channelList.hasOwnProperty(i) && channelList[ i ].json && channelList[ i ].display ) {
                    if( index === 0 ) {
                        this.defaultChannel = i;
                    }

                    this.channels[ i ] = {
                        json: channelList[ i ].json,
                        display: channelList[ i ].display,
                        path: channelList[ i ].path
                    };

                    index++;
                }
            }
        }
    }


    _error(message, execption, thowException ) {
        if( !!this.errorContainer ) {
            this.errorContainer.classList.add('show');
        }

        if( !!thowException ) {
            throw(message);
        } else {
            console.error( 'WEBRADIOTS ERROR - ' + message );
            if( !!execption ) console.error( execption );
        }
    }


    /**
     * Parse init options
     *
     * @param opts
     */
    _parseOptions(opts ) {
        if( !!opts ) {
            // Parse all required option fields, first
            let requiredOptions = [
                'url', 'fallbackImageUrl', 'webradioBaseUrl'
            ];

            for(let i in requiredOptions) {
                if( !opts[ requiredOptions[ i ] ] ) {
                    this._error( 'Cannot find ' + requiredOptions[ i ] + ' field in options', null, true );
                } else {
                    this[ requiredOptions[ i ] ] = opts[ requiredOptions[ i ] ];
                }
            }


            // Optional stuff next
            if( !!opts.channelList ) {
                this._setChannels( opts.channelList );
            } else {
                console.warn( 'Webradio2 warning: No channel list for webradio set.' );
            }
        }
    }


    /**
     * Fetch current playlist/history data
     */
    _fetchPlayingNow(fetchCb?) {
        let self = this;

        if( this.fetchingData !== true ) {
            this.fetchingData = true;

            if( !!this.errorContainer ) {
                this.errorContainer.classList.remove('show');
            }

            setTimeout( function() {
                self._fetchPlayingNow(fetchCb);
            }, 30000 );

            $.ajax({
                url: this.url,
                dataType: 'json',
                timeout: 5000,
                cache: false,
            })
            .done(function( data ) {
                self.updateData( data );

                if( fetchCb ) fetchCb(self, self.channelIndex);

                self.fetchingData = false;
            })
            .fail(function(error) {
                self._error('Cannot fetch webradio data.', error, false);
            });
        }
    }


    /**
     * Constructor
     * @param opts
     */
    constructor(opts) {
        this.playingNowData = [];
        this.currentChannel = '';
        this.defaultChannel = '';
        this.channelIndex = 0;
        this.fallbackImageUrl = '';
        this.fetchingData = false;
        this.updatingData = false;
        this.webradioBaseUrl = '';
        this.channels = {};
        this.url = '';
        this.updatingData = false;
        this.titlesearchOptions = {
            url: null,
            container: null,
            coverFallbackUrl: null
        };

        // we in the url the current channel to define the default channel
        // the webradio pop-up must always by default, and at start, display the current station
        let currentUrl = window.location.pathname;
        let currentRadio = currentUrl.split( '/' ).slice( -1 ).pop();

        this._parseOptions(opts);

        // we check if the name exists, if it does, we change the default channel by the current one
        // otherwise, we keep the default one (onair here)
        let ch = this.getJsonKeyName( currentRadio );
        this.currentChannel = (!!ch) ? ch : this.defaultChannel;
    }


    /**
     * Update title search items
     * @param action
     * @param day
     * @param hour
     * @param minute
     * @param channel
     */
    updateTitleSearch(action, day, hour, minute, channel?) {
        if( !!this.titlesearch ) {

            this.titlesearch.fetch(
                (!!action) ? action : 'new',
                (!!channel) ? channel : this.currentChannel,
                parseInt(day, 10) || 0,
                parseInt(hour, 10) || 0,
                parseInt(minute, 10) || 0,
                null
            )
        }
    }


    /**
     * Get a channel name
     * @param key
     * @param type
     * @return {*}
     */
    getChannelName( key, type ) {
        if( !this.channelExists( key, type ) ) key = 'onair';

        if( !!this.channels[ key ] ) {
            switch( type ) {
                case 'json':
                    return this.channels[ key ].json;

                case 'display':
                default:
                    return this.channels[ key ].display;
            }
        }

        return '';
    }


    /**
     * Get the radio channel URL path for given JSON name
     *
     * @param jsonname
     * @returns {any}
     */
    getPathByJsonName(jsonname) {
        for(let i in this.channels) {
            if( this.channels[i].json == jsonname ) {
                return this.channels[i].path;
            }
        }

        return null;
    }


    /**
     * Check if given channel name exists in the list
     * @param key
     * @param type
     * @return {boolean}
     */
    channelExists( key, type ) {
        return (!!this.channels[ key ] && !!this.channels[ key ][ type ]);
    }


    /**
     * Check if given json name for channel exists in the list
     * @return {boolean}
     * @param jsonName
     */
    channelJSONExists( jsonName ) {
        for(let index in this.channels) {
            if( this.channels[index].json === jsonName ) {
                return true;
            }
        }

        return false;
    }


    /**
     * Function to format the name of the channel as the backend expecting it to be
     * @param key
     * @return {*}
     */
    getJsonKeyName( key ) {
        return this.getChannelName( key, 'json' );
    }


    /**
     * Update internal playlist/history data
     * @param data
     */
    updateData( data ) {
        if( this.updatingData !== true ) {
            this.updatingData = true;

            // Fetch playing now data
            this.playingNowData = [];
            for(let i in data) {
                if( this.channelJSONExists(data[i].name) ) {
                    this.playingNowData.push(data[i]);
                }
            }

            // Preload images
            for( let item in this.playingNowData ) {
                let img = document.createElement( 'img' );

                if( this.playingNowData.hasOwnProperty(item) ) {
                    if(
                        !!this.playingNowData[ item ].playHistories.length &&
                        !!this.playingNowData[ item ].playHistories[ 0 ].track &&
                        !!this.playingNowData[ item ].playHistories[ 0 ].track.coverUrlBig
                    ) {
                        img.src = this.playingNowData[ item ].playHistories[ 0 ].track.coverUrlBig;
                    } else {
                        img.src = this.fallbackImageUrl;
                    }

                    this.playingNowData[ item ].imageElement = img;
                    img.onerror = function() {
                        "use strict";
                        this.style.display = 'none';
                    }
                }
            }

            this.updatingData = false;
        }

    }


    /**
     * Get the song data for the currently playing song
     * @param channel
     * @return {any}
     */
    getCurrentSongData(channel:string) {
        for(let item of this.playingNowData) {

            if( item.name === channel ) {
                return item;
            }
        }

        return null;
    }


    /**
     * Function to format the channels name to display it correctly to the user
     * @param key
     * @return {*}
     */
    getDisplayChannelName( key ) {
        return this.getChannelName( key, 'display' );
    }


    /**
     * Get titlesearch object
     * @return {Titlesearch}
     */
    getTitlesearch() {
        return this.titlesearch;
    }

    /**
     * Get the titlesearch container
     * @returns {any}
     */
    getTitlesearchContainer() {
        return this.titlesearchOptions.container;
    }

    /**
     * Get the current channel
     * @return {string}
     */
    getCurrentChannel() {
        return this.currentChannel;
    }
}
