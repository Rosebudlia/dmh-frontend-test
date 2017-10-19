/// <reference path="../../../../node_modules/@types/jquery/index.d.ts" />

interface JQueryEventObject {
    date: any
}

class EventCalendar {
    calendarId: string;
    calendar: any;
    enableDayButtons: boolean;

    static _rewriteDate(date) : string {
        return date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();
    }

    constructor (calendarId:string, enableDayButtons:boolean) {
        this.calendarId = calendarId;
        this.enableDayButtons = enableDayButtons;

        const DAY_IN_MS = 24*60*60*1000;

        // Find calendar
        this.calendar = document.getElementById(this.calendarId);

        if (!this.calendar) {
            throw('Calendar error: No calendar found');
        } else {
            // Initialize calendar date on datepicker and POST form
            let matches = /ed=([^&#=]*)/.exec(window.location.search);
            let filters = $(this.calendar).find('.event-calendar-filter');
            let datepickers = $(this.calendar).find('.datepicker');
            let tomorrow = $(this.calendar).find('.tomorrow');
            let yesterday = $(this.calendar).find('.yesterday');

            if (!this.enableDayButtons) {
                tomorrow.addClass('hidden');
                yesterday.addClass('hidden');
            }

            if( !!matches && matches.length ) {
                let param1 = matches[1];

                if( !!param1 ) {
                    let dateArray = param1.match(/\d+/ig);
                    let activeDate = new Date(dateArray[1] + '/' + dateArray[0] + '/' + dateArray[2]);
                    let tm = activeDate.getTime();
                    let tomorrowDate = new Date(tm + DAY_IN_MS);
                    let yesterdayDate = new Date(tm - DAY_IN_MS);

                    tomorrow.attr('date', EventCalendar._rewriteDate(tomorrowDate));
                    yesterday.attr('date', EventCalendar._rewriteDate(yesterdayDate));

                    tomorrow.on('click', function() {
                        window.location.href = '?ed=' + $(this).attr('date');
                    });

                    yesterday.on('click', function() {
                        window.location.href = '?ed=' + $(this).attr('date');
                    });

                    filters.each(function() {
                        try {
                            let datepicker = $(this).find('.datepicker');
                            let form = $(this).find('form');
                            datepicker.data( "DateTimePicker" ).date( param1 );
                            form.attr("action", "?ed=" + param1);
                        } catch(e) {
                            return;
                        }
                    });
                }
            } else if (!matches) {
                tomorrow.addClass('hidden');
                yesterday.addClass('hidden');

                filters.each(function() {
                    try {
                        let datepicker = $(this).find('.datepicker');
                        let form = $(this).find('form');
                        let date = new Date();
                        let euroDate = EventCalendar._rewriteDate(date);

                        datepicker.data( "DateTimePicker" ).date( date );
                        form.attr("action", "?ed=" + euroDate);
                    } catch(e) {
                        return;
                    }
                });
            }

            datepickers.on('dp.change', function(e) {
                let date = new Date(e.date);
                let euroDate = EventCalendar._rewriteDate(date);

                filters.each(function() {
                    try {
                        let form = $(this).find('form');
                        form.attr("action", "?ed=" + euroDate);
                    } catch(e) {
                        return;
                    }
                });
            });
        }
    }
}

