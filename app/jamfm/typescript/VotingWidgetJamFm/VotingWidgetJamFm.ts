/// <reference path="../../../common/typescript/Voting/Voting.ts" />

class VotingWidgetJamFm extends Voting {
    constructor(containerSelector, quizId, resultPostUrl, resultGetUrl, debug) {
        super(<VotingOptions>{
            debug: debug,
            resultPostUrl: resultPostUrl,
            resultGetUrl: resultGetUrl,
            containerSelector: containerSelector
        });
    }
}