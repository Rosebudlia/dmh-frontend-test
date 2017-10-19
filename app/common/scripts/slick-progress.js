/**
 * Progressbar for the slick slider
 *
 * Intended usage was the Hero, any other element is unverified and might need modifications
 */
function SlickProgress() {

    this.className = 'slick-progress';
    this.node = null;
    this.parent = null;

    /**
     * Add the progressbar container to given DOM node
     *
     * @param node
     * @constructor
     */
    this.AddProgressBar = function (node, slim, timeout) {
        this.node = node;
        this.parent = node.parent();
        this.RemoveProgressbar();

        var progressbar = document.createElement('div');
        progressbar.classList.add(this.className);

        if ( !!timeout ) {
            progressbar.style.animationDuration = parseInt(timeout, 10) + 'ms';
        }

        if (!!slim) progressbar.classList.add('slick-progress--slim');
        this.node.append(progressbar);

    };

    this.TogglePause = function (progressbar) {

        if ( progressbar.classList.contains('no-animation') ) {
            progressbar.classList.remove('no-animation');
            progressbar.style.removeProperty('transform');
        } else {
            let progWidth = parseInt(String($('.slick-progress:first').css('transform')).split(',')[4], 10) || 0;
            progressbar.style.transform = 'translate3d(' + progWidth + 'px, 0, 0)';
            progressbar.classList.add('no-animation');
        }

    };

    /**
     * Delete progressbar
     * @constructor
     */
    this.RemoveProgressbar = function () {
        this.node.parents('[data-timeout]').find('.' + this.className).remove();
    };

}

