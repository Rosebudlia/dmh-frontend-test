const NAVIGATION_SCROLL_THRESHHOLD = 100;

function initNavigation() {
    "use strict";

    try {
        var navigation = document.querySelector('nav');
        var navigationScrollOffset = 0;

        if( !!navigation ) {
            window.addEventListener('scroll', function() {
                "use strict";

                var inside = navigation.querySelector('.navigation-webradio-inside');
                var outside = navigation.parentNode.querySelector('.navigation-webradio');
                var container = $('.container:not(.container-nav):first');
                var scrollTop = $(document).scrollTop();

                if( scrollTop > (navigation.offsetTop + 50) ) {
                    if( !navigation.classList.contains('navbar-fixed') ) {
                        if( container.length ) {
                            container.css('margin-top', '126px');
                        }

                        navigation.classList.add('navbar-fixed');

                        if( !!outside ) {
                            outside.classList.add('fixed');
                        }

                        var blurMain = document.querySelector('nav ~ .navigation-webradio .navigation-webradio-image-blur');
                        var webradio = document.querySelector('nav ~ .navigation-webradio .slick-current .navigation-webradio-info-container');
                        if( !!webradio && !!inside ) {
                            if( !!blurMain ) {
                                inside.appendChild(blurMain.cloneNode(true));
                            }

                            var clone = webradio.cloneNode(true);
                            $(clone).find('.navigation-webradio-info > div:first').remove();
                            $(clone).find('.navigation-webradio-info > br:first').remove();
                            inside.appendChild(clone);
                        }

                        if( !!inside && !$(inside).is(':visible') ) {
                            inside.classList.add('hidden');
                        }
                    } else {
                        if( !!outside ) {
                            if( $page.scrollDir === 1 ) {
                                if( !outside.classList.contains('collapsed') ) {
                                    outside.classList.add('collapsed');
                                }

                                navigationScrollOffset = 0;
                            } else {
                                if( scrollTop <= 0 || (outside.classList.contains('collapsed') && navigationScrollOffset > NAVIGATION_SCROLL_THRESHHOLD) ) {
                                    outside.classList.remove('collapsed');
                                    navigationScrollOffset = 0;
                                }

                                navigationScrollOffset++;
                            }
                        }
                    }
                } else {
                    if( outside.classList.contains('collapsed') ) {
                        outside.classList.remove('collapsed');
                        navigationScrollOffset = 0;
                    }

                    if( navigation.classList.contains('navbar-fixed') ) {
                        if( container.length ) {
                            container.css('margin-top', '0');
                        }

                        navigation.classList.remove('navbar-fixed');

                        if( !!outside ) {
                            outside.classList.remove('fixed');
                        }

                        if( !!inside ) {
                            inside.innerHTML = '';
                            inside.classList.remove('hidden');
                        }
                    }
                }
            });


            $(window).on('resize', function() {
                $('.navigation .navigation-first-dropdown.open > .dropdown-toggle').click();

                var cwidth = $('.container:not(.container-nav)').width(),
                    wrwidth = $('.navigation-webradio').width(),
                    nwidth = $('.navigation').width();

                if( window.innerWidth >= SCREEN_XS_MAX ) {
                    if( nwidth !== cwidth ) {
                        $('.navigation').width($('.container:not(.container-nav)').width());
                        $('.navigation').css('margin-left', $('.container:not(.container-nav)').css('padding-left'));
                    }

                    if( wrwidth !== cwidth ) {
                        $('.navigation-webradio').width($('.container:not(.container-nav)').width());
                        $('.navigation-webradio').css('margin-left', $('.container:not(.container-nav)').css('padding-left'));
                    }
                } else {
                    $('.navigation, .navigation-webradio').removeAttr('style');
                }
            });


            var firstDropdown = navigation.querySelector('.navigation-first-dropdown');
            if( !!firstDropdown ) {
                var toggle = firstDropdown.querySelector('.navigation-first-dropdown .dropdown-toggle');
                if (!!toggle) {
                    $(toggle).on('click', function () {
                        var img = this.querySelector('img');

                        if (!firstDropdown.classList.contains('open')) {
                            if (!!img) {
                                img.src = DMH_RES_URL + '/images/menu/ic_menu_close.png';
                            }

                            $('.navigation-backdrop').show();

                            if( window.innerWidth < SCREEN_SM_MIN || window.innerHeight < 768 ) {
                                $(this).parent().addClass('mobile');
                                $('body').addClass('no-overflow');
                                $(toggle).find('.navigation-dropdown-arrow:visible').removeClass('.ic-ic_arrow_down').addClass('.ic-ic_arrow_up');

                                if( isMobile() === false && window.innerHeight < 768 ) {
                                    $(this).parent().find('.dropdown-menu:first').width($('nav').width()).css({'left': 'auto'});
                                }
                            }

                        } else {
                            if (!!img) {
                                img.src = DMH_RES_URL + '/images/menu/ic_menu.png';
                            }

                            $('.navigation-backdrop').hide();
                            $('.dropdown-menu.open').removeClass('open');

                            if( window.innerWidth < SCREEN_SM_MIN || window.innerHeight < 768 ) {
                                $(this).parent().removeClass('mobile');
                                $('body').removeClass('no-overflow');

                                if( isMobile() === false && window.innerHeight < 768 ) {
                                    $(this).parent().find('.dropdown-menu:first').width('100%').removeAttr('style');
                                }
                            }
                        }
                    });
                }
            }


            // Submenus
            var submenuDropdowns = navigation.querySelectorAll('.dropdown-submenu > a');
            if( !!submenuDropdowns ) {
                for(var i=0, len=submenuDropdowns.length; i<len; i++) {
                    $(submenuDropdowns[i]).on('click', function(event){
                        event.preventDefault();

                        $(navigation).find('.dropdown-menu.open').removeClass('open');
                        $(navigation).find('.navigation-dropdown-arrow:visible').removeClass('ic-ic_arrow_up').addClass('ic-ic_arrow_down');

                        var submenu = this.parentNode.querySelector('.dropdown-menu');
                        if( !!submenu ) {
                            var $sub = $(submenu);

                            if( $sub.hasClass('open') ) {
                                $sub.removeClass('open');
                            } else {
                                $sub.addClass('open');
                                $sub.parent().find('.navigation-dropdown-arrow:visible').removeClass('ic-ic_arrow_down').addClass('ic-ic_arrow_up');
                            }
                        }

                        return false;
                    });
                }
            }


            navigation.addEventListener('click', function(event) {
                var open = this.querySelector('.dropdown.navigation-first-dropdown.open');

                if( !!event.target && !!open) {
                    if( event.target.nodeName === 'INPUT' ) return;

                    if( (!event.target.parentNode.nodeName === 'A' && !event.target.nodeName === 'A') &&
                        ($(event.target).parents('.dropdown').length || event.target.classList.contains('dropdown-menu') ||
                        event.target.classList.contains('dropdown'))
                    ) {
                        event.preventDefault();
                        event.stopPropagation();
                        return false;
                    }

                    if(event.target.parentNode.classList.contains('dropdown-toggle') || event.target.classList.contains('dropdown-toggle')) {
                        window.setTimeout(function() {
                            $('.navigation-backdrop').click();
                        }, 10);
                    }

                    $('.navigation-first-dropdown .dropdown-toggle').click();
                }
            });


            //
            // Add backdrop
            // TODO: make the element which gets the backdrop into a custom parameter when rewritten in typescript
            //
            $('.navigation-left').append('<div class="navigation-backdrop"></div>');
            $('.navigation-backdrop').on('click', function() {
                $('.navigation-first-dropdown .dropdown-toggle').click();
            });

            $(window).trigger('resize');
        }
    } catch(e) {
        console.error(e);
    }
}
