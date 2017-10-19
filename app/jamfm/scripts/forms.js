function initForms(debug) {
    try {
        var datePickerIcons = {
            time: "icon icon-font_time2",
            date: "icon icon-font_close",
            up: "icon icon-font_expandUpArrow",
            down: "icon icon-font_expandDownArrow",
            next: "icon icon-font_slideRightArrow",
            previous: "icon icon-font_slideLeftArrow",
        };

        // Datetime picker
        var $datepicker = $('.datepicker');
        var $datetimePicker = $('.datetimepicker');
        $datetimePicker.datetimepicker({
            icons: datePickerIcons,
            format: 'DD.MM.YYYY HH:mm',
            debug: !!debug,
            ignoreReadonly: true,
            locale: 'de'
        });

        $datetimePicker.on('blur', function(ev){
            $(this).datetimepicker('hide');
        });


        // Date picker without time
        $datepicker.each(function() {
            "use strict";

            $(this).datetimepicker({
                icons: datePickerIcons,
                format: 'DD.MM.YYYY',
                debug: !!debug,
                ignoreReadonly: true,
                inline: ($(this).hasClass('datepicker-inline')),
                locale: 'de'
            });
        });

        $datepicker.on('blur', function(ev){
            $(this).datetimepicker('hide');
        });

        var $inputs = $('input[type="text"], input[type="number"], input[type="password"]');
        $inputs.on('focus', function() {
            $(this).select();
        });

        $inputs.on('input', function() {
            var $this = $(this);

            if( !!this.value ) {
                $this.parent().find('.input-icon:hidden').show();
            } else {
                $this.parent().find('.input-icon:visible').hide();
            }
        });

        $('.upload-input').change(function(){
            if(!!this.value){
                var nameOfFile = this.value.split('\\');
                $(this).parents('.upload').find('.filename').text(nameOfFile[(nameOfFile.length - 1)] + ' ausgewählt.');
            } else {
                $(this).parents('.upload').find('.filename').text('');
            }
        });
    } catch(e) {
        console.error(e);
    }
}