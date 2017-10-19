/// <reference path="../../../common/typescript/Titlesearch/Titlesearch.ts" />
/// <reference path="../../../common/typescript/Webradio/Webradio.ts" />
/// <reference path="../../../common/typescript/global.inc.ts" />
/// <reference path="../WebradioJamFm/WebradioJamFm.ts" />


//
// External JS functions
//
declare function ucfirst(message, onlyfirst?);
declare function escapeHtml(string);
declare function jwplayer(id);
declare function browserIsSafari();
declare var radioplayer: any;

interface JQuery {
    slick: any;
    dmhEventTracker: any;
}


/**
 * Webradio class for Brocken
 */
class TitlesearchJamFm extends Titlesearch {
    webradio: WebradioJamFm;
    previewPlayer: any;


    /*
     * =========================================================================
     *                              Private
     * =========================================================================
     */


    /**
     * Attach a preview player. This player is an invisible player directly attached to the body. There should never be
     * more than once player instance on the page. This function will load the player only, if not already loaded.
     * @param filename
     * @private
     */
    _attachPreviewPlayer(filename:string) {
        let player = document.querySelector('#titlesearch-preview-player');

        if( !!player ) {
            this.previewPlayer = jwplayer('titlesearch-preview-player');
        } else {
            let playerContainer = document.createElement('div');
            let id = 'titlesearch-preview-player';

            playerContainer.classList.add('titlesearch-preview-player');
            playerContainer.setAttribute('id', id);
            document.body.appendChild(playerContainer);

            this.previewPlayer = jwplayer(id).setup({
                "file": filename,
                "height": 360,
                "width": 480
            });
        }
    }


    /*
     * =========================================================================
     *                              PUBLIC
     * =========================================================================
     */


    /**
     * Constructor
     * @param url
     * @param selector
     * @param coverFallbackUrl
     * @param currentChannel
     * @param webradio
     * @param fetchLimit
     */
    constructor(url: string, public selector: string, public coverFallbackUrl: string, currentChannel?:string, webradio?:WebradioJamFm, fetchLimit?:number) {
        super(url, selector, coverFallbackUrl, currentChannel);

        this.webradio = webradio;
        this.fetchLimit = (!!fetchLimit) ? fetchLimit : 8;
    }


    /**
     * Disable times in time seclects which are in the future, as we can only select past items
     *
     * @param hList
     * @param mList
     * @param dList
     */
    normalizeTimeSelects(hList, mList, dList) {
        let dt = new Date(),
            currentHour = dt.getHours(),
            currentMin = (dt.getMinutes() / 10) * 10,
            selectedHour = parseInt(hList.val(), 10) || 0,
            selectedDay = parseInt(dList.find('option:selected').val(), 10) || 0;

        hList.find('option').each(function() {
            if( selectedDay != 0 ) {
                $(this).prop('disabled', false);
            } else {
                if( parseInt(this.value, 10) > currentHour ) $(this).prop('disabled', true);
            }
        });

        mList.find('option').each(function() {
            if( selectedDay != 0 ) {
                $(this).prop('disabled', false);
            } else {
                if (parseInt(this.value, 10) > currentMin) $(this).prop('disabled', (selectedHour >= currentHour));
            }
        });

        // Prevent cheating
        if( mList.find('option:selected').is(':disabled') ) {
            mList.val((mList.find('option').not(':disabled').last().val() || 0));
        }
        if( hList.find('option:selected').is(':disabled') ) {
            hList.val((hList.find('option').not(':disabled').last().val() || 0));
        }
    }


    /**
     * Play preview in preview player
     * @param filename
     */
    previewPlay(filename:string) {
        $('body').find('.titlesearch-preview-playing').removeClass('titlesearch-preview-playing').addClass('ic-ic_play_sample').removeClass('ic-ic_stop_sample');

        if( !!this.previewPlayer ) {
            if( typeof radioplayer !== "undefined" && !!radioplayer ) radioplayer.emp.stop();

            this.previewPlayer.load([{
                "file": filename
            }]).play();
        }
    }


    /**
     * Stop preview playback
     */
    previewStop() {
        $('body').find('.titlesearch-preview-playing').removeClass('titlesearch-preview-playing').addClass('ic-ic_play_sample').removeClass('ic-ic_stop_sample');

        if( !!this.previewPlayer ) {
            if( typeof radioplayer !== "undefined" && !!radioplayer )  radioplayer.emp.resume();
            this.previewPlayer.stop();
        }
    }


    /**
     * Populate titlesearch container with items
     */
    populate() {
        let self = this;
        let containerNodes = document.querySelectorAll(this.selector);

        this.previewStop();

        for( let i=0, len=containerNodes.length; i<len; i++ ) {
            let container = containerNodes[i];

            if (!!container) {
                container.innerHTML = '';

                for (let item of this.songList) {
                    let dateIndex = (new Date()).getDate() - (new Date(item.start)).getDate();
                    dateIndex = dateIndex > 0 ? -dateIndex : dateIndex;

                    let deltaTime = ((new Date()).getTime() - (new Date(item.start*1000)).getTime()) / (60*1000);
                    if( deltaTime < 15 ) {
                        $('.titlesearch-control-next').prop('disabled', true);
                    }

                    // Build containers
                    let innerContainer = document.createElement('div');
                    let titleContainer = document.createElement('div');
                    let iconContainer = document.createElement('div');
                    let iconPlayContainer = document.createElement('div');
                    let iconPlay = document.createElement('a');
                    let iconStoreContainer = document.createElement('div');
                    let iconStore = document.createElement('a');

                    innerContainer.classList.add('navigation-titlesearch-item');
                    innerContainer.setAttribute('data-day', dateIndex.toString());

                    titleContainer.classList.add('navigation-titlesearch-title');

                    // Append cover container
                    let coverContainer = document.createElement('div');
                    coverContainer.classList.add('navigation-titlesearch-cover');

                    let img = document.createElement('img');

                    if( browserIsSafari() ) {
                        img.setAttribute('src', item.track.itunesCover);
                    } else {
                        img.setAttribute('src', item.track.coverUrlBig);
                    }

                    img.onerror = function() {
                        "use strict";
                        this.style.display = 'none';

                        $(coverContainer).css({
                            'background': 'url("' + self.coverFallbackUrl + '")',
                            'background-size': 'cover'
                        });
                    };

                    coverContainer.appendChild(img);
                    innerContainer.appendChild(coverContainer);

                    // Append title container
                    let tm = new Date(item.start);
                    let min = tm.getMinutes();
                    let hrs = tm.getHours();

                    titleContainer.innerHTML =
                        '<div class="navigation-titlesearch-time">' +
                        ((hrs < 10) ? '0' + hrs.toString() : hrs) +
                        ':' +
                        ((min < 10) ? '0' + min.toString() : min) +
                        '</div><div class="title">' +
                        ucfirst(item.track.title.toLowerCase()) +
                        '</div><div class="artist">' +
                        ucfirst(item.track.artist.toLowerCase()) +
                        '</div>';

                    var tooltipText = ucfirst(item.track.title.toLowerCase()) + ' - ' + ucfirst(item.track.artist.toLowerCase());
                    titleContainer.setAttribute('title', tooltipText);
                    titleContainer.classList.add('tooltip-title');
                    titleContainer.setAttribute('data-placement', 'top');

                    innerContainer.appendChild(titleContainer);

                    // Append icon container and icons
                    iconContainer.classList.add('navigation-titlesearch-icons');

                    iconPlay.classList.add('ic-ic_play_sample');

                    if( !!item.track.itunesPreview ) {
                        iconPlay.setAttribute('data-titlesearch-preview-itunes', item.track.itunesPreview);
                        self._attachPreviewPlayer(item.track.itunesPreview);

                        iconPlay.addEventListener('click', function(event) {
                            event.preventDefault();

                            let itunes = this.getAttribute('data-titlesearch-preview-itunes');

                            if( this.classList.contains('ic-ic_play_sample') ) {
                                self.previewPlay(itunes);

                                this.classList.add('ic-ic_stop_sample');
                                this.classList.add('titlesearch-preview-playing');
                                this.classList.remove('ic-ic_play_sample');
                            } else {
                                self.previewStop();

                                this.classList.add('ic-ic_play_sample');
                                this.classList.remove('titlesearch-preview-playing');
                                this.classList.remove('ic-ic_stop_sample');
                            }

                            return false;
                        });
                    } else {
                        iconPlayContainer.classList.add('disabled');
                    }

                    iconPlayContainer.classList.add('navigation-titlesearch-icon');
                    iconPlayContainer.appendChild(iconPlay);

                    let storeUrl = (browserIsSafari()) ? item.track.itunesShopUrl : item.track.googleShopUrl;
                    let store = (browserIsSafari()) ? 'iTunes-Store' : 'Android-Store';

                    iconStore.classList.add('ic-ic_shopping');
                    iconStore.setAttribute('target', '_blank');

                    if( !storeUrl ) {
                        iconStore.setAttribute('disabled', 'disabled');
                        iconStore.style.opacity = '0.5';
                    } else {
                        iconStore.setAttribute('href', storeUrl);
                    }

                    iconStore.setAttribute('data-dmhevt-cat', 'Audio-Store-Open');
                    iconStore.setAttribute('data-dmhevt-lbl', store);

                    iconStoreContainer.classList.add('navigation-titlesearch-icon');
                    iconStoreContainer.appendChild(iconStore);

                    iconContainer.appendChild(iconPlayContainer);
                    iconContainer.appendChild(iconStoreContainer);

                    innerContainer.appendChild(iconContainer);

                    container.appendChild(innerContainer);
                }

                $(container).find('.ic-ic_shopping').dmhEventTracker();

                $(container).find('.navigation-titlesearch-title.tooltip-title').tooltip({
                    container: 'body'
                });

                if( !!this.webradio ) {
                    this.webradio.setCoverImage(null, this.webradio.getPlaynowData(0));
                }

                if( window.innerWidth > SCREEN_SM_MAX ) {
                    $('.navigation-titlesearch-cover').height($('.navigation-titlesearch-cover:first').width());
                }
            }
        }
    }
}