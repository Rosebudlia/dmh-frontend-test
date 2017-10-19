function initSearchResults() {
    var form = document.querySelector('.search-results-form-container');
    var header = document.querySelector('.search-results-header');



    // Form logic
    if( !!form ) {
        var collapse = form.querySelector('.collapse.in');

        if( !!isMobile() ) {
            if( !!collapse ) collapse.classList.remove('in');
        }
    }
}
