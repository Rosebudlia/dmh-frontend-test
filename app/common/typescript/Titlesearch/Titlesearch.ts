/// <reference path="../Webradio/Webradio.ts" />
/// <reference path="../../../../node_modules/@types/jquery/index.d.ts" />


/**
 * General titleseach class to work with the history microservice
 */
class Titlesearch {
    baseUrl: string;
    container: any;
    coverFallBackUrl: string;
    idList: any; // list of the songs id to avoid displaying it twice
    songList: any; // list of the data of the current displayed songs
    activeSongIndex: number;
    currentChannel: string;
    webradio: Webradio;
    context: string;
    currentDay: number;
    fetchLimit: number;
    events: any;


    /*
     * =========================================================================
     *                              PRIVATE
     * =========================================================================
     */

    /**
     * Add song data to playlist
     *
     * @param data
     * @param action
     * @private
     */
    private _addSongData(data, action ) {
        // we load more recent songs before the list
        if( action === 'after' ) {
            this.songList.unshift( data );
        }

        // we load more recent songs after the list
        else {
            this.songList.push( data );
        }
    }


    /**
     * Fetch shop URL from songlist data.
     * On iOS we fetch the iTunes store URL - on other devices we take the Google URL
     *
     * @param index
     * @returns {any}
     * @private
     */
    private _getShopUrl(index) {
        if( !!this.songList[index] && !!this.songList[index].track ) {
            // iOS
            if( /iPad|iPhone|iPod/.test(navigator.userAgent) ) {
                return this.songList[index].track.itunesShopUrl || '';
            }

            // Android (for now the default)
            return this.songList[index].track.googleShopUrl || '';
        }

        return '';
    }


    /**
     * Return current day
     *
     * @returns {number}
     * @private
     */
    private _getCurrentDay() {
        return this.currentDay;
    }


    /**
     * Add song index to ID list
     *
     * @param index
     * @private
     */
    private _addSongIndex(index ) {
        this.idList.push( index );
    }


    /**
     * Set active song by given index
     *
     * @param index
     * @private
     */
    private _setActiveSongIndex(index ) {
        this.activeSongIndex = parseInt( index );
    }


    /*
     * =========================================================================
     *                              PUBLIC
     * =========================================================================
     */


    /**
     * Constructor
     *
     * @param url
     * @param selector
     * @param coverFallbackUrl
     * @param currentChannel
     */
    constructor( url: string, selector: string, public coverFallbackUrl: string, currentChannel?:string) {
        this.baseUrl = url;

        this.container = document.querySelector(selector);
        if( !this.container ) {
            throw('Titlesearch error: Container not found!');
        }

        this.coverFallBackUrl = coverFallbackUrl;
        this.activeSongIndex = 0;
        this.songList = [];
        this.idList = [];
        this.currentDay = 0;
        this.fetchLimit = 2; // Default
        this.events = {
            init: document.createEvent('Event'),
            fetch: document.createEvent('Event'),
            populate: document.createEvent('Event')
        };

        this.events.init.initEvent('dmh.titlesearch.init', true, true);
        this.events.fetch.initEvent('dmh.titlesearch.fetch', true, true);
        this.events.populate.initEvent('dmh.titlesearch.populate', true, true);

        if( !!currentChannel ) this.currentChannel = currentChannel;
        this.container.dispatchEvent(this.events.init);
    }


    /**
     * Set the limit of how many songs to fetch
     *
     * @param limit
     */
    setLimit(limit) {
        this.fetchLimit = parseInt(limit, 10) || 0;
    }


    /**
     * Fetch current playlist data for titlesearch
     *
     * @TODO Better channel handling. Is now kinda duplicated.
     *
     * @param action
     * @param channel
     * @param day
     * @param hour
     * @param minute
     * @param currentRadio
     */
    fetch( action, channel, day, hour, minute, currentRadio) {
        let self = this;
        let url = this.baseUrl;

        if( !!channel && this.currentChannel !== channel ) {
            this.currentChannel = channel;
        }
        url += this.currentChannel + '/';

        this.currentDay = day;

        // if we can't find the current radio, we display on air
        // this is also valid when we display the widget not on the pop-up
        if(!currentRadio){
            this.context = 'popup';
        }

        // action can have 4 values :
        // - 'new' which replaces the list
        // - 'refresh' which is triggered after clicking the 'aktualisieren' button and replaces the content too
        // - 'after' or 'before' which add the new songs after or before
        if( action === 'new' || action === 'refresh' ) {
            this.songList = [];
            this.idList = [];
        }


        if( action === 'new' ) {
            // first load, we display the lasts songs
            url += '0/';
            url += new Date().getHours() + '/';
            url += new Date().getMinutes();
        } else {
            // we are refreshing or adding songs
            url += day + '/';
            url += hour + '/';
            url += minute;
        }

        if( !!this.fetchLimit && this.fetchLimit > 0 ) {
            url += '?items=' + this.fetchLimit;
        }

        $.ajaxSetup({ cache: false });
        $.get( url, function( data ) {
            let addedItems = 0;

            // to add the new data in the right order
            if( action === 'after' ) {
                data.reverse();
            }

            for( let i in data ) {
                // Break after limit is reached
                if( !!self.fetchLimit && addedItems >= self.fetchLimit ) break;

                if( data.hasOwnProperty(i) && !!data[i].track && self.idList.indexOf(data[i].track.id) === -1 ) {
                    //clear the ID list after 10 songs so that the song can be displayed again if it is deliberately repeated
                    if (self.idList.length > 10){
                        self.idList = [];
                    }

                    // We add content before the first song in the list
                    // so we must shift the index by one to keep the current active song active
                    if( action === 'after' ) {
                        self.activeSongIndex++;
                    }
                    // We store the id of the song, not to display it twice later
                    self._addSongIndex( data[ i ].track.id );

                    //We store its data too for displaying it after
                    self._addSongData( data[ i ], action );

                    addedItems++;
                }
            }
            // to save globaly the value
            self._setActiveSongIndex( self.activeSongIndex );

            self.container.dispatchEvent(self.events.fetch);
        });
    }


    /**
     * Format time string
     *
     * @param day
     * @param time
     * @param range
     * @returns {[any,number,any]}
     */
    static formatTime( day, time, range ) {
        let timeArray = time.split( ':' );
        let hour = parseInt( timeArray[ 0 ] );
        let minute = parseInt( timeArray[ 1 ] ) + range;

        if( minute < 0 ) {
            minute = 60 + minute;
            hour--;
        } else if( minute >= 60 ) {
            minute = minute - 60;
            hour++;
        }

        day = parseInt( day, 10 ) || 0;

        if( hour < 0 ) {
            day--;
            hour = 24 + hour;
        } else if( hour > 23 ) {
            day++;
            hour = hour - 24;
        }

        return [ day, hour, minute ];
    }


    /**
     * Return titlesearch container HTML node
     * @returns {any}
     */
    getContainer() {
        return this.container;
    }
}