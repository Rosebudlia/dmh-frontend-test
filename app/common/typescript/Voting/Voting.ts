/// <reference path="../../../../node_modules/@types/jquery/index.d.ts" />
/// <reference path="../global.inc.ts" />


/**
 * Voting options interface
 */
interface VotingOptions {
    debug: boolean;
    resultPostUrl: string;
    resultGetUrl: string;
    containerSelector: string;
}


/**
 * Voting widget main class
 */
class Voting {
    debug: boolean;
    questionData: any;
    currentIndex: number;
    countQuestions: number;
    resultPostUrl: string;
    resultGetUrl: string;
    containerSelector: string;
    type: string;
    mainContainer: any;
    votingMedia: any;
    resultsContainer: any;
    questionSlides: any;


    /**
     * Show error in error console.
     * If except is set to true an exception will be thrown.
     *
     * @param message
     * @param except
     * @returns {boolean}
     * @private
     */
    private static _error(message:string, except?:boolean) {
        let msg = 'Voting error: ';

        // Create error message
        msg += (!!message) ? message : 'Unknown error';

        if( except && except === true ) {
            throw(msg)
        }

        console.error( msg );
        return false;
    }


    /**
     * Get answer map
     *
     * @param questionSlide
     * @returns {Array}
     * @private
     */
    private static _getAnswerMap(questionSlide:any) {
        let answers = [],
            nodes = $(questionSlide).find('.voting__widget__content__answer');

        for(let i = 0, len = nodes.length; i < len; i++) {
            answers.push($(nodes[i]).find('label').html());
        }

        return answers;
    }


    /**
     * Render the results
     *
     * @param results
     * @private
     */
    private _renderResults(results:any) {
        let resultsContainer = this.mainContainer.querySelector('.voting__widget__results');

        if( !!resultsContainer ) {
            $(resultsContainer).prepend( results );

            let icons = resultsContainer.querySelectorAll('.voting__widget__results__list .icon-camera');
            if( !!icons ) {
                for(let i=0, len=icons.length; i<len; i++) {
                    let icon = icons[i];

                    let image = icon.getAttribute('data-image');
                    if( !!image ) {
                        icon.style.verticalAlign = 'sub';
                        icon.style.fontSize = '2.6rem';
                        icon.style.position = 'relative';

                        (function(image) {
                            icon.addEventListener('mouseover', function() {
                                let img = icon.querySelector('img');

                                if( !img ) {
                                    img = document.createElement('img');
                                    img.src = image;
                                    img.style.position = 'absolute';
                                    img.style.top = '0';
                                    img.style.maxHeight = '234px';
                                    img.style.zIndex = '99999';

                                    icon.appendChild(img);

                                    if( !!isMobile ) {
                                        window.setTimeout(function() {
                                            img.style.display = 'none';
                                        }, 5000)
                                    }
                                } else {
                                    img.style.display = 'initial';
                                }
                            });
                        })(image);

                        icon.addEventListener('mouseleave', function() {
                            let img = icon.querySelector('img');
                            if( !!img ) {
                                img.style.display = 'none';
                            }
                        });
                    } else {
                        icon.style.display = 'none';
                    }
                }
            }
        }
    }


    /**
     * Fetch all answers
     *
     * @returns {Array}
     * @private
     */
    private _getAllAnswers() {
        let answers = [];

        if( !!this.questionData ) {
            for(let index=0; index<this.questionData.length; index++) {
                if( !this.questionData[ index ].isAd ) {
                    let input = this.questionData[ index ].input;
                    if( !input ) {
                        input = $( this.questionData[ index ].question ).find( 'input' )
                    }

                    answers[ index ] = {
                        'answer': this.questionData[ index ].answer,
                        'raw': this.questionData[ index ].answer_raw,
                        'input': input,
                        'media': $( this.questionData[ index ].question ).find( '.voting__widget__content__media' ),
                        'node': this.questionData[ index ].question
                    };
                }
            }
        }

        return answers;
    }


    /**
     * Get the active question node
     *
     * @returns {JQuery}
     * @private
     */
    private _getActiveQuestion() {
        return $(this.mainContainer).find('.voting__widget__content.active');
    }


    /**
     * Show next button
     *
     * @private
     */
    private _showNextButton() {
        let active = this._getActiveQuestion(),
            btn = $( active ).find( '.voting__widget__content__next' ),
            value = null,
            isChecked = ($( active ).find( 'input:checked' ).length > 0);

        if( active.length ) {
            switch( this.type ) {
                case 'stars':
                    value = $( active ).find( 'input[type="hidden"]' ).val();
                    break;

                case 'thumbs':
                    value = $( active ).find( 'input[type="hidden"]' ).val();
                    break;

                case 'normal':
                default:
                    value = $( active ).find( 'input:checked' ).val();
                    break;
            }

            if(  (!!value || !!isChecked) && btn.length ) {
                btn.prop( 'disabled', false );
            } else {
                btn.prop( 'disabled', true );
            }
        }
    }


    /**
     * Post the voting results
     *
     * @private
     */
    private _postResults() {
        let answers = null,
            current = this.questionSlides[this.currentIndex].parentNode;

        if( !!current ) {
            let postURL = current.getAttribute('data-url') || '';
            let container = document.querySelector(this.containerSelector);
            let data = {};

            let self = this;
            let future = this.resultsContainer.classList.contains( 'voting__widget__results--future' );

            this.questionData[ this.currentIndex ].question.classList.remove( 'active' );
            this.resultsContainer.classList.add( 'active' );

            // Fetch input data
            if( this.type === 'thumbs' || this.type === 'stars' ) {
                let answers = this._getAllAnswers();

                for(let ansIndex in answers) {
                    let aid = answers[ansIndex].node.querySelector('.voting__widget__content__answer').getAttribute('id');
                    let aval = answers[ansIndex].answer;

                    if( !aid ) {
                        console.error('WARNING: Cannot fetch id for answer #' + ansIndex);
                        continue;
                    }

                    if( aval.length > 0 ) {
                        data[aid] = aval;
                    }
                }
            } else {
                let inputData = container.querySelectorAll("input:checked");
                if (!!inputData) {
                    for (let i = 0, len = inputData.length; i < len; i++) {
                        let id = inputData[i].getAttribute('id') || '';
                        let value = (<HTMLInputElement>inputData[i]).value || '';

                        data[String(id)] = escapeHtml(value);
                    }
                }
            }

            if( !!postURL ) {
                let ajaxOpts = {
                    url: postURL,
                    method: 'POST',
                    data: data
                };

                if( this.type === 'thumbs' || this.type === 'stars' ) {
                    ajaxOpts['contentType'] = 'application/json';
                    ajaxOpts['data'] = JSON.stringify(data);
                }

                if( this.debug ) {
                    console.log('POSTIG VOTING RESULTS: ', data, 'AJAX OPTIONS: ', ajaxOpts, 'ANSWERS', answers);
                }

                $.ajax(ajaxOpts)
                .done(function(result) {
                    $( self.resultsContainer ).find( '.voting__widget__results__content__loading__container' ).remove();
                    self._renderResults(result);
                })
                .fail(function(error) {
                    console.error(error);
                });
            }
        }
    }


    /**
     * Show the next slide
     *
     * @private
     */
    private _showNextSlide() {
        let active = this._getActiveQuestion();

        if( active.length ) {
            switch( this.type ) {
                case 'normal':
                default:
                    this.questionData[ this.currentIndex ].input = $( active ).find( 'input:checked' );
                    this.questionData[ this.currentIndex ].answer = $( active ).find( 'input:checked' ).val();
                    this.questionData[ this.currentIndex ].answer_raw = $( active ).find( 'input:checked' ).next().html();
                    break;

                case 'stars':
                    let value = $( active ).find( 'input[type="hidden"]' ).val();
                    this.questionData[ this.currentIndex ].answer = (!!value) ? value : 0;
                    break;

                case 'thumbs':
                    this.questionData[ this.currentIndex ].answer = $( active ).find( 'input[type="hidden"]' ).val();
                    break;
            }

            // Set event tracking label
            let button = active.find( '.dmh-event' );
            if( button.length ) {
                button.data( 'data-dmhevt-lbl', this.questionData[ this.currentIndex ].headline + ' - ' + this.currentIndex );
            }

            if( this.debug ) {
                console.log( this.questionData[ this.currentIndex ] );
                console.log( 'CURRENT: ', this.currentIndex );
                console.log( 'NEXT: ', this.questionData[ this.currentIndex + 1 ] );
                console.log( 'Answer: ', this.questionData[ this.currentIndex ].answer );
                console.log( 'Next: ', this.questionData[ this.currentIndex + 1 ] );
            }

            if( !!this.questionData[ this.currentIndex + 1 ] ) {
                this.questionData[ this.currentIndex ].question.classList.remove( 'active' );
                this.questionData[ this.currentIndex + 1 ].question.classList.add( 'active' );
                this.currentIndex++;
            } else {
                this._postResults();
            }
        }
    }


    /**
     * Init stars voting
     * @private
     */
    private _initStars() {
        let self = this,
            stars = this.mainContainer.querySelectorAll( '.rating span' );

        if( !!stars ) {
            for( let i = 0, len = stars.length; i < len; i++ ) {
                $( stars[ i ] ).on( 'click', function() {
                    let parent = $(this).parents('.rating');
                    let input = parent.find( 'input' );

                    parent.find( 'span.active-rating' ).removeClass( 'active-rating' );

                    let rating = parent.find( 'span:hover, span:hover ~ span' ).addClass( 'active-rating' );
                    input.val(rating.length);

                    self._showNextButton();
                } );
            }
        }
    }


    /**
     * Init thumbs voting
     * @private
     */
    private _initThumbs() {
        let self = this;
        let thumbs = this.mainContainer.querySelectorAll( '.thumbs .icon' );

        if( !!thumbs ) {
            for( let i = 0, len = thumbs.length; i < len; i++ ) {
                $( thumbs[ i ] ).on( 'click', function( event ) {
                    event.preventDefault();

                    let input = $( this ).parent().parent().find( 'input' );
                    if( input.length ) {
                        $( self.mainContainer ).find( '.icon.active' ).removeClass( 'active' );
                        input.val( (this.classList.contains( 'icon-thumb-up' )) ? '1' : '0' );
                        this.classList.add( 'active' );
                        $(thumbs).addClass('voting-thumbs-voted');

                        self._showNextButton();
                    }

                    return false;
                } );
            }
        }
    }


    /**
     * Check the voting type
     *
     * @private
     */
    private _checkType() {
        // Check type
        if( this.mainContainer.classList.contains( 'voting__widget--stars' ) ) {
            this.type = 'stars';
            this._initStars();
        } else if( this.mainContainer.classList.contains( 'voting__widget--thumb' ) ) {
            this.type = 'thumbs';
            this._initThumbs();
        }
    }


    /**
     * Constructor function
     *
     * @param opts
     */
    constructor(opts:VotingOptions) {
        let self = this;
        this.debug = opts.debug;
        this.questionData = [];
        this.currentIndex = 0;
        this.resultPostUrl = (!!opts.resultPostUrl) ? opts.resultPostUrl : '/dist/ani/xml/voting-results.single.json';
        this.resultGetUrl = (!!opts.resultGetUrl) ? opts.resultGetUrl : '/dist/ani/xml/voting-results.single.json';
        this.containerSelector = opts.containerSelector;
        this.type = 'normal';

        // Find the main container
        this.mainContainer = document.querySelector( this.containerSelector );
        if( !this.mainContainer ) {
            Voting._error( 'Main container #' + this.containerSelector + ' not found', true )
        }
        
        this._checkType();

        // Look for an image
        this.votingMedia = this.mainContainer.querySelector( '.voting__widget__content__media' );

        // Results container
        this.resultsContainer = this.mainContainer.querySelector( '.voting__widget__results' );
        if( !this.resultsContainer ) {
            Voting._error( 'Result container in main container #' + this.containerSelector + ' not found', true )
        }

        // Fetch all questions
        this.questionSlides = this.mainContainer.querySelectorAll( '.voting__widget__content' );
        if( !this.questionSlides ) {
            Voting._error( 'No questions in main container found', true );
        }

        this.countQuestions = this.questionSlides.length;
        for( let i = 0; i < this.countQuestions; i++ ) {
            if( i === 0 ) {
                this.questionSlides[i].classList.add('active');
            }

            this.questionData[i] = {
                question: this.questionSlides[i],
                answer: null,
                isAd: this.questionSlides[i].classList.contains('voting__widget__content--ad'),
                answer_raw: null,
                answerMap: Voting._getAnswerMap(this.questionSlides[i]),
                headline: $(this.questionSlides[i]).find('.voting__widget__headline').html()
            };

            // Add click handler for answers
            if( this.type !== 'stars' ) {
                $(this.questionSlides[i]).find('.voting__widget__content__answer input').on('change', function() {
                    self._showNextButton();
                });
            }

            // Add click handler for button
            $(this.questionSlides[i]).find('.voting__widget__content__next').on('click', function() {
                self._showNextSlide();
            });
        }

        if( this.debug === true ) {
            console.log( 'Voting loaded:\n\tQuestions: ', this.questionData );
        }
    }
}