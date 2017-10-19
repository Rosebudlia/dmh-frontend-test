/// <reference path="../../../../node_modules/@types/jquery/index.d.ts" />
/// <reference path="../global.inc.ts" />


interface ServiceWidgetOptions {
    containerSelector: string;
    animationSpeed: number;
    animateMe: any;
    newsPlayer: any;
    newsUrl: string;

}


/**
 * ServiceWidget class
 */
class ServiceWidget {
    containerSelector: string;
    mainContainer: any;
    animationSpeed: number;
    animateMe: any;
    newsPlayer: any;
    newsUrl: string;

    /**
     * Animate text in the tile to slide up
     *
     * @param element
     * @param selector
     * @private
     */
    private _animateText(element, selector) {
        let thisData = element.querySelectorAll(selector);
        let myIndex = 0;
        let maxIndex = thisData.length;
        let myBottomPos = -101;
        let speed = this.animationSpeed;

        let animate = function() {

            if (myBottomPos < 101) {
                myBottomPos += speed;
                thisData[myIndex].style.bottom = myBottomPos + '%';

            } else {
                myBottomPos = -101;
                thisData[myIndex].style.bottom = myBottomPos + '%';
                if (myIndex < maxIndex-1) {
                    myIndex++;
                } else {
                    myIndex = 0;
                }
                thisData[myIndex].style.bottom = myBottomPos + '%';
            }

            requestAnimationFrame(animate);

        };

        animate();
    }

    /**
     * Load a chromeless JW player for the breaking news MP3 file
     */
    private _loadNewsPlayer() {
        let self = this;
    
        try {
            this.newsPlayer = jwplayer( 'myPlayer' ).setup( {
                "file": self.newsUrl,
                "width": 0,
                "height": 0
            } );
            this.newsPlayer.setControls( 'false' );
    
            let playButton = this.mainContainer.querySelector( '.service-widget-breaking-news-play-button' );
            playButton.onclick = function() {
                let state = self.newsPlayer.getState();

                switch( state ) {
                    case 'playing':
                        this.classList.remove( 'icon-stop' );
                        this.classList.add( 'ic-ic_playStream' );
                        self.newsPlayer.stop();
                        break;

                    default:
                        ServiceWidget.pauseMediaPlayers();
                        this.classList.remove( 'ic-ic_playStream' );
                        this.classList.add( 'icon-stop' );
                        self.newsPlayer.play();
                        break;
                }
            };

            this.newsPlayer.on( 'play', function() {
                ga( 'send', 'event', 'JW Player', 'Schlagzeilen der Stunde', 'play' );
            } );

            this.newsPlayer.on( 'complete', function() {
                ga( 'send', 'event', 'JW Player', 'Schlagzeilen der Stunde', 'complete' );
            } );
    
        } catch( e ) {
            console.error( e );
        }
    };



    /**
     * Constructor
     *
     * @param opts
     */
    constructor(opts:ServiceWidgetOptions) {
        "use strict";

        this.containerSelector = opts.containerSelector;
        this.animateMe = opts.animateMe;
        this.animationSpeed = opts.animationSpeed;
        this.mainContainer = document.querySelector(this.containerSelector + '.service-widget');
        if( !this.mainContainer ) {
            throw('ServiceWidget error: Cannot find main container: ' + this.containerSelector);
        }
        this.newsUrl = this.mainContainer.getAttribute('data-news-audio');

        if (!!this.newsUrl) {
            this._loadNewsPlayer();
        }

        for (let module in this.animateMe){
            if (this.animateMe[module].title || this.animateMe[module].data) {
                let animateModule = this.mainContainer.querySelector('.service-widget-' + module);
                if (this.animateMe[module].title) {
                    this._animateText(animateModule, '.service-title');
                }

                if (this.animateMe[module].data) {
                    this._animateText(animateModule, '.service-data');
                }
            }
        }

    }

    /**
     * Pause all jwplayer on a page
     */
    static pauseMediaPlayers() : void {
        try {
            let player = document.querySelectorAll('.jwplayer');
            if( !!player ) {
                for(let i=0,len=player.length; i<len; i++) {
                    let id = player[i].getAttribute('id');

                    if( !!id && id != 'myPlayer' ) {
                        let jw = jwplayer(id);

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