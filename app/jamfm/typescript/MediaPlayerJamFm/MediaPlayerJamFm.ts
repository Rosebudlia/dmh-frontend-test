/// <reference path="../../../common/typescript/MediaPlayer/MediaPlayer.ts" />

class MediaPlayerJamFm extends MediaPlayer {
    constructor(wrapper: any, widgetId: string, stdHeight: any) {
        super(<MediaPlayerConfiguration>{
            wrapper: wrapper,
            widgetId: widgetId,
            stdHeight: stdHeight,
            playlistSelector: '.dmh-player-playlist',
            additionalSelector: '.dmh-player-additional',
            loadingIcon: 'ic-ic_spinner',
        });
    }
}