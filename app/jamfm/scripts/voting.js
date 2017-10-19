function initVotings() {

    try {
        var votingWidgets = document.querySelectorAll('.voting__widget');
        if (!!votingWidgets) {

            for(var i=0, len=votingWidgets.length; i<len; i++) {
                var id = votingWidgets[i].getAttribute('id');

                new VotingWidgetJamFm('#' + id, 'q123', 'http://localhost:3001/?station=jamfm', 'http://localhost:3001/?station=jamfm', true);
                var thisWidget = votingWidgets[i];
                var selects = thisWidget.querySelectorAll('.input__wrapper--under');

                if (!!selects) {

                    for (var s = 0, lenS = selects.length; s < lenS; s++) {
                        var thisSelect = selects[s];
                        (function (thisWidget, thisSelect){
                            thisSelect.addEventListener('click', function (event) {

                                var input = thisSelect.querySelector('input');

                                if( String(input.type || '').toLowerCase() !== 'checkbox' ) {
                                    $(thisWidget).find('input:checked').removeAttr('checked');
                                    $(thisWidget).find('.option__selected').removeClass('option__selected');
                                    this.classList.add('option__selected');
                                    $(input).prop('checked', true).trigger('change');

                                } else {
                                    event.preventDefault();

                                    if( !input.checked || !this.classList.contains('option__selected') ) {
                                        this.classList.add('option__selected');
                                        $(input).prop('checked', true).trigger('change');
                                    } else {
                                        this.classList.remove('option__selected');
                                        $(input).prop('checked', false).trigger('change');
                                    }

                                }
                            });

                        })(thisWidget, thisSelect);

                    }
                }
            }
        }
    } catch(e) {
        console.error(e);
    }
}