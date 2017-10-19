var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var DMHCookieOverlay = (function () {
    function DMHCookieOverlay(options) {
        "use strict";
        DMHCookieOverlay._checkOptions(options);
        this.confirmed = "false";
        this.opts = options;
        this.layer = options.text + options.button;
        this._checkPrivacyCookie();
    }
    DMHCookieOverlay._getPrivacyCookie = function (cname) {
        var name = cname + "=", ca = document.cookie.split(';');
        if (!!ca) {
            for (var i = 0, len = ca.length; i < len; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
        }
        return "";
    };
    DMHCookieOverlay._setPrivacyCookie = function (cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        document.cookie = cname + "=" + cvalue + ";expires=" + d.toUTCString() + ";path=/";
    };
    DMHCookieOverlay.prototype._checkPrivacyCookie = function () {
        var self = this;
        this.confirmed = DMHCookieOverlay._getPrivacyCookie("privacy");
        if (this.confirmed != "true") {
            this.confirmed = "false";
            DMHCookieOverlay._setPrivacyCookie("privacy", this.confirmed, this.opts.duration);
            var sCookieAlert = document.createElement("div");
            sCookieAlert.innerHTML = this.layer;
            sCookieAlert.id = "CookieLayer";
            if (!!this.opts && !!this.opts.css) {
                sCookieAlert.setAttribute("style", this.opts.css);
            }
            document.body.appendChild(sCookieAlert);
            var btn = sCookieAlert.querySelector('.CookieButton');
            if (!!btn) {
                btn.addEventListener('click', function (event) {
                    event.preventDefault();
                    DMHCookieOverlay._setPrivacyCookie("privacy", "true", self.opts.duration);
                    document.getElementById("CookieLayer").setAttribute("style", "display: none;");
                    return false;
                });
            }
        }
    };
    DMHCookieOverlay._checkOptions = function (options) {
        "use strict";
        if (!options) {
            throw ('CookieOverlay error: No options given.');
        }
        for (var i = 0, len = this.requiredOptions.length; i < len; i++) {
            if (!options[this.requiredOptions[i]]) {
                throw ('CookieOverlay error: Option "' + String(this.requiredOptions[i]) + '" missing.');
            }
        }
    };
    return DMHCookieOverlay;
}());
DMHCookieOverlay.requiredOptions = [
    'text', 'button', 'duration'
];
var CookieOverlayJamFm = (function (_super) {
    __extends(CookieOverlayJamFm, _super);
    function CookieOverlayJamFm(options) {
        return _super.call(this, options) || this;
    }
    return CookieOverlayJamFm;
}(DMHCookieOverlay));
var Hero = (function () {
    function Hero(widgetId, debug) {
        this.widgetId = widgetId;
        if (!this.widgetId) {
            throw ('Hero error: No widget ID given');
        }
        this.element = $('#' + this.widgetId);
        if (!this.element.length) {
            throw ('Hero error: No element for given Widget ID found.');
        }
        this.slider = this.element.find('.hero__slider');
        if (!this.slider.length) {
            throw ('Hero error: No slider for given hero found.');
        }
        this.slideIndex = 0;
        this.slideCount = this.slider.find('.hero__slider__slide').length || 0;
        this.navSlidesToShow = (!this.navSlidesToShow) ? 4 : this.navSlidesToShow;
        var timeout = parseInt(this.element.data('timeout'), 10) || 0;
        this.timeout = (!!timeout) ? timeout : 7000;
        this.heroNavParent = this.element.find('.hero__nav');
        this.heroNav = this.heroNavParent.find('li');
        if (!this.heroNav) {
            throw ('Hero error: No navigation for given hero found.');
        }
        this.heroProgress = new SlickProgress();
        if (!!this.slider && !!this.slideCount) {
            if (this.slideCount > 1) {
                this._initSlider();
                this._initNavigation();
            }
            else {
                this.slider.parent('.hero-bottom-slider').addClass('hero-onesie-parent');
                this.heroNavParent.remove();
            }
        }
        if (debug) {
            console.log('Hero init done:');
            console.log('id: ' + this.widgetId);
            console.log('slide count: ' + this.slideCount);
            console.log('slider: ', this.slider);
        }
    }
    Hero.prototype._initSlider = function () {
        var self = this;
        this.slider.on('init', function () {
            if (!!self.element && !!self.slider) {
                self.element.css({
                    'overflow': 'hidden',
                    'height': 'auto'
                });
                self.slider.css('overflow', 'hidden');
                self.heroNav.eq(0).addClass('active');
            }
            if (!!self.heroProgress) {
                self.heroProgress.AddProgressBar(self.heroNav.not('.hero-nav-button').first().find('.hero-nav-progress'), true, self.timeout);
                self.progBar = $(self.heroProgress.node.find('.slick-progress'));
            }
            console.log(self.progBar);
            self.element.on('mouseenter', function () {
                if (!!self.heroProgress) {
                    self.heroProgress.TogglePause(self.progBar[0]);
                }
                self.slider.slick('slickPause');
            });
            self.element.on('mouseleave', function () {
                if (!!self.heroProgress) {
                    self.heroProgress.TogglePause(self.progBar[0]);
                }
                self.slider.slick('slickPlay');
            });
        });
        this.slider
            .not('.slick-initialized')
            .slick({
            autoplay: true,
            autoplaySpeed: this.timeout,
            arrows: false,
            dots: false,
            fade: false,
            mobileFirst: true,
            waitForAnimate: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true,
            centerMode: true,
            centerPadding: 0,
            adaptiveHeight: false,
            responsive: [
                {
                    breakpoint: 1044,
                    settings: {
                        mobileFirst: false
                    }
                }
            ]
        });
        this.slider.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
            self.heroNav.eq(currentSlide).removeClass('active');
            self.heroNav.eq(nextSlide).addClass('active');
            self.slideIndex = nextSlide;
            self.heroNav.parents('ul').slick('slickGoTo', self.slideIndex);
            if (!!self.heroProgress) {
                self.heroProgress.AddProgressBar(self.heroNav.not('.hero-nav-button').find('.hero-nav-progress').eq(nextSlide), true, self.timeout);
                self.progBar = $(self.heroProgress.node.find('.slick-progress'));
            }
        });
    };
    Hero.prototype._initNavigation = function () {
        var self = this;
        this.heroNav.parent('ul')
            .not('.slick-initialized')
            .slick({
            autoplay: false,
            dots: false,
            arrows: true,
            fade: false,
            waitForAnimate: false,
            mobileFirst: false,
            slidesToShow: (this.slideCount < this.navSlidesToShow) ? this.slideCount : this.navSlidesToShow,
            slidesToScroll: (this.slideCount < this.navSlidesToShow) ? this.slideCount : this.navSlidesToShow,
            infinite: false,
            adaptiveHeight: false,
            prevArrow: '<div class="hero-nav-button hero-nav-prev"><i class="ic-ic_arrow_left"></i></div>',
            nextArrow: '<div class="hero-nav-button hero-nav-next"><i class="ic-ic_arrow_right"></i></div>'
        });
        this.heroNav.on('mousedown', function () {
            self.mousedown = true;
        });
        this.heroNav.on('mousemove', function () {
            if (!!self.mousedown) {
                self.mousedown = false;
            }
        });
        this.heroNav.on('click', function () {
            if (!!self.mousedown) {
                self.slideIndex = $(this).index() || 0;
                self.slider.slick('slickGoTo', self.slideIndex);
            }
            self.heroProgress.TogglePause(self.progBar[0]);
            self.mousedown = false;
        });
    };
    return Hero;
}());
var HeroJamFM = (function (_super) {
    __extends(HeroJamFM, _super);
    function HeroJamFM(widgetId, debug) {
        return _super.call(this, widgetId, debug) || this;
    }
    return HeroJamFM;
}(Hero));
var MajorPromoController = (function () {
    function MajorPromoController(selector) {
        var self = this;
        this.selector = selector;
        this.promos = document.querySelectorAll(this.selector);
        if (!!this.promos) {
            this._initModules();
            $(window).on('resize', function () {
                self._initModules();
            });
        }
    }
    MajorPromoController.prototype._resizeToBackgroundImage = function (container) {
        if (!!container) {
            var bgimage = container.style.backgroundImage;
            if (!!bgimage) {
                var url = String(bgimage.replace('url(', '').replace(')', '')
                    .replace(/"/g, '').replace(/'/g, '')).trim();
                if (!!url) {
                    var img_1 = document.createElement('img');
                    img_1.onload = function () {
                        container.style.height = img_1.height + 'px';
                    };
                    img_1.src = url;
                }
            }
        }
    };
    MajorPromoController.prototype._initModules = function () {
        for (var i = 0, len = this.promos.length; i < len; i++) {
            var modules = this.promos[i].querySelectorAll('.major-promo-module');
            for (var i_1 = 0, len_1 = modules.length; i_1 < len_1; i_1++) {
                if (modules[i_1].classList.contains('major-promo-module02')) {
                    var containers = modules[i_1].querySelectorAll('div[style*="background-image"]');
                    if (!!containers) {
                        for (var _i = 0, containers_1 = containers; _i < containers_1.length; _i++) {
                            var container = containers_1[_i];
                            this._resizeToBackgroundImage(container);
                        }
                    }
                }
                if (modules[i_1].classList.contains('major-promo-module06')) {
                    if (window.innerWidth > SCREEN_SM_MIN) {
                        this._resizeToBackgroundImage(modules[i_1]);
                    }
                    else {
                        modules[i_1].style.height = 'auto';
                    }
                }
            }
        }
    };
    return MajorPromoController;
}());
var MajorPromoJamFm = (function (_super) {
    __extends(MajorPromoJamFm, _super);
    function MajorPromoJamFm(selector) {
        return _super.call(this, selector) || this;
    }
    return MajorPromoJamFm;
}(MajorPromoController));
var MEDIA_PLAYER_DEFAULT_SKIN = 'dmh-skin';
var MEDIA_PLAYER_DEFAULT_PLSELECTOR = '.dmh-player-playlist';
var MediaPlayer = (function () {
    function MediaPlayer(opts) {
        if (!jwplayer) {
            throw ('MediaPlayer error: jwplayer not found.');
        }
        this.widgetId = opts.widgetId;
        if (!this.widgetId) {
            throw ('MediaPlayer error: No widget ID found!');
        }
        this.element = opts.wrapper;
        if (!this.element) {
            throw ('MediaPlayer cannot find main element.');
        }
        this.player = document.querySelector(String('#' + this.widgetId));
        if (!this.player) {
            throw ('MediaPlayer cannot find player in element');
        }
        this.url = this.element.getAttribute('data-url');
        this.width = parseInt(this.element.getAttribute('data-width'), 10) || 0;
        this.height = parseInt(this.element.getAttribute('data-height'), 10) || 0;
        this.stdHeight = opts.stdHeight;
        this.title = this.element.getAttribute('data-title');
        this.image = this.element.getAttribute('data-image');
        this.type = this.element.getAttribute('data-type');
        this.playlist = this.element.getAttribute('data-playlist');
        this.playlistIndex = 0;
        this.jwplayer = null;
        this.playlistContainer = null;
        this.loadingIcon = (!!opts.loadingIcon) ? opts.loadingIcon : null;
        this.multiplay = opts.multiplay;
        if (!this.playlist && !this.url) {
            throw ('MediaPlayer #' + this.widgetId + ' error: No data URL found!');
        }
        if (!this.width) {
            this.width = '100%';
        }
        if (this.type === 'audio' && !this.image) {
            this.height = this.stdHeight;
            this.element.classList.add('no-image');
        }
        this.adContainer = null;
        if (!!opts.additionalSelector) {
            this.adContainer = this.element.querySelector(opts.additionalSelector);
        }
        var options = {
            file: this.url,
            width: this.width,
            title: this.title,
            displaytitle: true,
            height: 0,
            image: null,
            playlist: null,
            skin: (!!opts.skin) ? opts.skin : MEDIA_PLAYER_DEFAULT_SKIN,
            localization: {
                nextUp: "Nächster Titel"
            }
        };
        if (!!this.height || this.height === 0) {
            options.height = this.height;
        }
        if (!!this.image) {
            options.image = this.image;
        }
        if (!!this.playlist) {
            this._loadPlaylist(options);
        }
        else {
            this._loadPlayer(options);
        }
    }
    MediaPlayer.prototype._getPlayer = function () {
        return this.jwplayer;
    };
    MediaPlayer.prototype._setTitle = function (title) {
        var titleContainer = this.element.querySelector('.dmh-player-title');
        if (!!titleContainer) {
            titleContainer.innerHTML = escapeHtml(title);
        }
    };
    MediaPlayer.prototype._playlistActiveUnset = function (self) {
        var $self = (!!self) ? self : this;
        $($self.element).find('.dmh-player-playlist-entry.active').removeClass('active');
    };
    MediaPlayer.prototype._getLoadingContainer = function () {
        var node = document.createElement('span');
        node.classList.add('entry-loading');
        node.style.display = 'none';
        var spinner = document.createElement('span');
        spinner.classList.add('icon');
        spinner.classList.add(this.loadingIcon);
        node.appendChild(spinner);
        return node;
    };
    MediaPlayer._showLoading = function (entry) {
        if (!!entry) {
            entry.style.opacity = '0.75';
            var l = entry.querySelector('.entry-loading');
            if (!!l) {
                l.style.display = 'block';
            }
        }
    };
    MediaPlayer._hideLoading = function (entry) {
        if (!!entry) {
            entry.style.opacity = '1';
            var l = entry.querySelector('.entry-loading');
            if (!!l) {
                l.style.display = 'none';
            }
        }
    };
    MediaPlayer.prototype._getPlaylistEntry = function (itemIndex, result) {
        var self = this;
        var entry = document.createElement('div');
        entry.classList.add('dmh-player-playlist-entry');
        entry.classList.add('clearfix');
        entry.setAttribute('data-index', itemIndex.toString());
        var index = document.createElement('span');
        index.classList.add('entry-index');
        index.innerHTML = (itemIndex + 1).toString();
        entry.appendChild(index);
        var title = document.createElement('span');
        title.classList.add('entry-title');
        if (!!result.title) {
            title.innerHTML = result.title;
            if (itemIndex === 0) {
                this._setTitle(result.title);
            }
        }
        else {
            title.innerHTML = '-';
            if (itemIndex === 0) {
                this._setTitle('-');
            }
        }
        entry.appendChild(title);
        if (this.loadingIcon) {
            entry.appendChild(this._getLoadingContainer());
        }
        var length = document.createElement('span');
        length.classList.add('entry-length');
        length.classList.add('pull-right');
        if (!!result.length) {
            length.innerHTML = result.length;
        }
        else {
            length.innerHTML = '0:00';
        }
        entry.appendChild(length);
        entry.addEventListener('click', function () {
            self._playlistActiveUnset();
            if (!!self.loadingIcon) {
                MediaPlayer._showLoading(this);
            }
            if (!!self.adContainer) {
                if (typeof googletag !== 'undefined') {
                    googletag.pubads().refresh();
                    self.adContainer.classList.add('show');
                }
            }
            if (!!self.playlistContainer && $(self.playlistContainer).css('position') === 'fixed') {
                self.playlistContainer.classList.remove('open');
            }
            if (self.type == 'video') {
                self._setTitle(result.title);
            }
            self.playlistIndex = parseInt((this.getAttribute('data-index') || null), 10);
            self.jwplayer.playlistItem(self.playlistIndex);
        });
        return entry;
    };
    MediaPlayer.prototype._loadPlaylist = function (options) {
        var self = this, selector = (!!options.playlistSelector) ? options.playlistSelector : MEDIA_PLAYER_DEFAULT_PLSELECTOR;
        this.playlistContainer = self.element.querySelector(selector);
        var closeIcon = this.playlistContainer.querySelector('.dmh-player-playlist-header-close');
        if (closeIcon) {
            closeIcon.addEventListener('click', function () {
                self.playlistContainer.classList.remove('open');
            });
        }
        $.ajax({
            url: self.playlist,
            dataType: 'json'
        })
            .done(function (result) {
            if (!!result) {
                options.visualplaylist = false;
                options.playlist = result;
                for (var i = 0; i < options.playlist.length; i++) {
                    if (!options.playlist[i].image) {
                        if (self.image) {
                            options.playlist[i].image = self.image;
                        }
                    }
                }
                self._loadPlayer(options);
                if (!!self.playlistContainer) {
                    for (var i = 0, len = result.length; i < len; i++) {
                        self.playlistContainer.appendChild(self._getPlaylistEntry(i, result[i]));
                    }
                }
            }
        })
            .fail(function (error) {
            var errorContainer = self.element.querySelector('.dmh-player-error');
            if (!!errorContainer) {
                errorContainer.classList.remove('hidden');
            }
            if (!!self.playlistContainer) {
                if (!self.playlistContainer.classList.contains('show')) {
                    self.playlistContainer.classList.add('hidden');
                }
            }
            console.error(error);
        });
    };
    MediaPlayer.prototype._loadPlayer = function (options) {
        var self = this;
        this.jwplayer = jwplayer(this.widgetId).setup(options);
        this.jwplayer.once('ready', function () {
            self.element.classList.add('init');
            if (!!self.playlist) {
                var playlistIcon = self.element.querySelector('.dmh-player-playlist-toggle');
                if (!!playlistIcon) {
                    playlistIcon.addEventListener('click', function (event) {
                        event.preventDefault();
                        if (!!self.playlistContainer) {
                            if (self.playlistContainer.classList.contains('open')) {
                            }
                            self.playlistContainer.classList.toggle('open');
                        }
                        return false;
                    });
                }
            }
        });
        if (this.multiplay !== true) {
            this.jwplayer.on('play playlistItem', function () {
                self.pauseAllPlayer();
            });
        }
        if (!!this.playlist) {
            this.jwplayer.on('play playlistItem', function () {
                self._playlistActiveUnset(self);
                if (self.jwplayer.getState() === 'playing') {
                    self.playlistIndex = self.jwplayer.getPlaylistIndex();
                    var entry = self.element.querySelector('.dmh-player-playlist-entry[data-index="' + self.playlistIndex + '"]');
                    if (!!entry) {
                        if (self.jwplayer.getState() === 'playing') {
                            entry.classList.add('active');
                            if (!!self.loadingIcon) {
                                MediaPlayer._hideLoading(entry);
                            }
                        }
                    }
                }
            });
            this.jwplayer.on('pause', function () {
                self._playlistActiveUnset(self);
            });
        }
    };
    MediaPlayer.prototype.pauseAllPlayer = function () {
        try {
            var player = document.querySelectorAll('.jwplayer');
            if (!!player) {
                for (var i = 0, len = player.length; i < len; i++) {
                    var id = player[i].getAttribute('id');
                    if (!!id && id != this.widgetId) {
                        var jw = jwplayer(id);
                        if (jw.getState() === 'playing') {
                            jw.pause(true);
                        }
                    }
                }
            }
        }
        catch (e) {
            console.error('jwplayer_stopAll error: Cannot pause player. Make sure jwplayer is initialized.');
            console.error(e);
        }
    };
    return MediaPlayer;
}());
var MediaPlayerJamFm = (function (_super) {
    __extends(MediaPlayerJamFm, _super);
    function MediaPlayerJamFm(wrapper, widgetId, stdHeight) {
        return _super.call(this, {
            wrapper: wrapper,
            widgetId: widgetId,
            stdHeight: stdHeight,
            playlistSelector: '.dmh-player-playlist',
            additionalSelector: '.dmh-player-additional',
            loadingIcon: 'ic-ic_spinner'
        }) || this;
    }
    return MediaPlayerJamFm;
}(MediaPlayer));
var SLIDER_GAL_DEFAULT_TIMEOUT = 2000;
var SliderGallery = (function () {
    function SliderGallery(opts) {
        this.googleAds = null;
        var self = this;
        this._parseOptions(opts);
        this.selector = this.options.selector;
        this.element = document.querySelector(this.selector);
        if (!this.element) {
            throw ('SliderGallery error: Cannot find mail element: ' + this.selector);
        }
        var $element = $(this.element);
        this.googleAds = this.element.getAttribute('data-googleads');
        this.id = this.element.getAttribute('id');
        if (!this.id) {
            console.error('SliderGallery warning: Gallery with no ID initialized!');
        }
        this.elementRaw = this.element.cloneNode(true);
        this.sliderOptions = {
            slidesToShow: this.options.slidesToShow,
            dots: (this.options.sliderDots),
            slidesToScroll: (!!this.options.slidesToScroll) ? this.options.slidesToScroll : 1,
            customPaging: function (slider, i) {
                return (i + 1) + '/' + slider.slideCount;
            },
            arrows: (!!this.options.sliderNextArrow || !!this.options.sliderPrevArrow),
            nextArrow: this.options.sliderNextArrow,
            prevArrow: this.options.sliderPrevArrow,
            adaptiveHeight: false
        };
        if (this.options.noControlPanel === false) {
            var controls = $(this.element).parent().find('.control-panel');
            if (controls.length) {
                this.sliderOptions['appendDots'] = controls;
                this.sliderOptions['appendArrows'] = controls;
            }
        }
        this.slider = $element.slick(this.sliderOptions).on('beforeChange', function () {
            var players = this.querySelectorAll('.jwplayer.jw-state-playing');
            if (!!players) {
                for (var i = 0, len = players.length; i < len; i++) {
                    var id = players[i].getAttribute('id');
                    if (!!id) {
                        jwplayer(id).pause();
                    }
                }
            }
            self.element.dispatchEvent(self.eventBeforeSlide);
        }).on('afterChange', function () {
            if (!!self.options.adsSelector) {
                var curr = self._getCurrentSlide();
                if (!!curr) {
                    if (!!curr.querySelector(self.options.adsSelector)) {
                        self.element.dispatchEvent(self.eventAdsSlide);
                    }
                }
            }
        });
        if (!!this.options.toggleLightboxSelector) {
            $element.find(this.options.toggleLightboxSelector).on('click', function () {
                self._openLightbox(parseInt(this.getAttribute('data-index') || '', 10) || 0);
            });
            $element.on('keydown', function (event) {
                if (event.keyCode === 27) {
                    SliderGallery.closeLightbox();
                }
            });
        }
        this.controlsFading = false;
        this.hideControls = this.options.hideControls;
        if (this.hideControls) {
            $element.on('mouseenter', function () {
                $element.find('.slick-arrow').css('opacity', '0.5');
            });
            $element.on('mouseleave', function () {
                $element.find('.slick-arrow').css('opacity', '0');
            });
        }
        this.countSlides = 0;
        var dl = this.element.getAttribute('data-download') || '';
        this.download = (!!dl && dl === 'true');
        this.eventInitLightbox = document.createEvent('Event');
        this.eventInitLightbox.initEvent('dmh.slidergallery.initlightbox', true, true);
        this.eventOpenLightbox = document.createEvent('Event');
        this.eventOpenLightbox.initEvent('dmh.slidergallery.openlightbox', true, true);
        this.eventBeforeSlide = document.createEvent('Event');
        this.eventBeforeSlide.initEvent('dmh.slidergallery.beforeSlide', true, true);
        this.eventAfterSlide = document.createEvent('Event');
        this.eventAfterSlide.initEvent('dmh.slidergallery.afterSlide', true, true);
        this.eventAdsSlide = document.createEvent('Event');
        this.eventAdsSlide.initEvent('dmh.slidergallery.adsSlide', true, true);
    }
    SliderGallery.closeLightbox = function () {
        document.body.style.overflow = 'initial';
        var lightbox = document.body.querySelectorAll('.slider-gallery-lightbox');
        for (var i = 0, len = lightbox.length; i < len; i++) {
            document.body.removeChild(lightbox[i]);
        }
    };
    SliderGallery._controlIsHidden = function (target) {
        return $(target).css('display') === 'none' ||
            $(target).is(':hidden') ||
            $(target).css('opacity') === '0' ||
            $(target).hasClass('hidden');
    };
    SliderGallery._openUrl = function (url) {
        if (!!url) {
            window.open(url, '_blank');
        }
    };
    SliderGallery.prototype._getSliderClone = function () {
        var slider = this.elementRaw.cloneNode(true);
        slider.removeAttribute('id');
        slider.removeAttribute('class');
        slider.classList.add('slider-gallery');
        var $slider = $(slider);
        $slider.find(this.options.toggleLightboxSelector).remove();
        $slider.on('keydown', function (event) {
            if (event.keyCode === 27) {
                SliderGallery.closeLightbox();
            }
        });
        return slider;
    };
    SliderGallery.prototype._addDownload = function (slide) {
        var dlTog = $(this.options.toggleDownloadSelector);
        if (!!slide) {
            var fig = slide.find('figure');
            if (fig.attr('data-dl-allow') === "true") {
                dlTog.removeClass('hidden');
            }
            else {
                dlTog.addClass('hidden');
            }
        }
        dlTog.off().on('click', function (event) {
            event.stopPropagation();
            SliderGallery._openUrl(slide.find('img').attr('src'));
        });
    };
    SliderGallery.prototype._hideControls = function (selector, timeout) {
        var self = this;
        if (!!this.hideControlsEventHandler) {
            window.clearTimeout(this.hideControlsEventHandler);
            this.hideControlsEventHandler = null;
        }
        this.hideControlsEventHandler = window.setTimeout(function () {
            $('.slider-gallery-control').fadeTo('fast', 0.5);
            $(selector).fadeTo('fast', 0);
            window.clearTimeout(this.hideControlsEventHandler);
            this.hideControlsEventHandler = null;
            self.controlsFading = false;
        }, timeout);
    };
    SliderGallery._emptyAdSlide = function (slide) {
        if (!!slide) {
            var inner = slide.querySelector('div');
            if (!!inner) {
                inner.innerHTML = '';
                if (!!inner.getAttribute('data-google-query-id')) {
                    inner.removeAttribute('data-google-query-id');
                }
            }
            slide.classList.remove('adinit');
        }
    };
    SliderGallery.prototype.buildAdSlide = function (slide) {
        if (!!slide) {
            var $inner = $(slide.querySelector('div'));
            var id = $inner.attr('id');
            if (!!id && !!this.googleAds) {
                $inner.html("<script type='text/javascript'>" +
                    "var slot;" +
                    "googletag.cmd.push(function(){" +
                    "  slot = googletag.defineSlot('" + this.googleAds + "', [300, 250], '" + id + "');" +
                    "  if(!!slot) { " +
                    "    slot.addService(googletag.pubads());" +
                    "    googletag.enableServices();" +
                    "    googletag.pubads().refresh([slot]);" +
                    "  } " +
                    "  googletag.display('" + id + "');" +
                    "});" +
                    "</script>");
            }
            slide.classList.add('adinit');
        }
    };
    SliderGallery.prototype.buildAdSlides = function (lightbox) {
        var current = this._getCurrentSlide(lightbox);
        var nextAd = $(current).nextAll('.adslide:not(.slick-cloned):not(.adinit)').first();
        var prevAd = $(current).prevAll('.adslide:not(.slick-cloned):not(.adinit)').first();
        var lastAd = $(current).nextAll('.adslide:not(.slick-cloned):not(.adinit)').last();
        if ($(current).hasClass('adslide'))
            this.buildAdSlide($(current)[0]);
        if (nextAd.length)
            this.buildAdSlide(nextAd[0]);
        if (prevAd.length)
            this.buildAdSlide(prevAd[0]);
        if (lastAd.length)
            this.buildAdSlide(lastAd[0]);
    };
    SliderGallery.prototype._openLightbox = function (index) {
        var self = this, container = document.createElement('div'), slider = this._getSliderClone();
        container.classList.add('lightbox');
        container.classList.add('slider-gallery-lightbox');
        container.setAttribute('tabindex', '0');
        this._prepareSlides(slider);
        container.appendChild(slider);
        if (this.options.lightbox.hideControls) {
            var selector_1 = '.slider-gallery-control, ' +
                '.slider-gallery-lightbox .slider-gallery .image-lightbox-container.slick-current figure figcaption, ' +
                '.slider-gallery-lightbox .slick-arrow, ' +
                '.slider-gallery-lightbox .slider-gallery .image-lightbox-container.slick-current .slider-gallery-lightbox-close';
            $('body').on('mousemove', function () {
                if (SliderGallery._controlIsHidden(selector_1)) {
                    $(selector_1).css('opacity', '1');
                }
                self._hideControls(selector_1, self.options.hideControlTimeout);
            });
            self._hideControls(selector_1, self.options.hideControlTimeout);
        }
        var backdrop = document.createElement('div');
        backdrop.classList.add('slider-gallery-backdrop');
        backdrop.addEventListener('click', function () {
            SliderGallery.closeLightbox();
        });
        container.appendChild(backdrop);
        document.body.appendChild(container);
        self.lightbox = $(slider);
        if (this.countSlides > 1) {
            var opts = self.sliderOptions;
            opts.dots = false;
            opts.centerMode = true;
            opts.centerPadding = 0;
            opts.initialSlide = (!!index) ? index : 0;
            opts.arrows = true;
            opts.prevArrow = this.options.lightbox.sliderPrevArrow;
            opts.nextArrow = this.options.lightbox.sliderNextArrow;
            opts.appendDots = self.lightbox;
            opts.appendArrows = self.lightbox;
            self.lightbox.on('init', function () {
                $(window).trigger('resize');
                var firstSlide = $(this).find('[data-slick-index="' + 0 + '"]');
                if (!!firstSlide) {
                    self._addDownload(firstSlide);
                }
                self.element.dispatchEvent(self.eventInitLightbox);
            });
            $(slider).slick(opts)
                .on('beforeChange', function (event, slick, currentSlide, nextSlide) {
                var players = this.querySelectorAll('.jwplayer.jw-state-playing');
                if (!!players) {
                    for (var i = 0, len = players.length; i < len; i++) {
                        var id = players[i].getAttribute('id');
                        if (!!id) {
                            jwplayer(id).pause();
                        }
                    }
                }
                self._addDownload($(this).find('[data-slick-index="' + nextSlide + '"]'));
                self.element.dispatchEvent(self.eventBeforeSlide);
            })
                .on('afterChange', function () {
                self.buildAdSlides(true);
                self.element.dispatchEvent(self.eventAfterSlide);
            });
        }
        document.body.style.overflow = 'hidden';
        this.element.dispatchEvent(this.eventOpenLightbox);
    };
    SliderGallery.prototype._prepareSlides = function (slider) {
        if (!!slider) {
            var slides = $(slider).find(this.options.slideSelector);
            this.countSlides = slides.length;
            for (var i = 0, len = slides.length; i < len; i++) {
                var adBox = slides[i].querySelector('.image-lightbox-container-custom');
                if (!!adBox) {
                    SliderGallery._emptyAdSlide(slides[i]);
                    var thisId = adBox.getAttribute('id');
                    adBox.setAttribute('id', thisId + '-lightbox');
                }
                var img = slides[i].querySelector('img');
                var figure = slides[i].querySelector('figure');
                if (!!figure) {
                    var closeButton = document.createElement('span');
                    closeButton.classList.add('slider-gallery-lightbox-close');
                    closeButton.classList.add('icon');
                    closeButton.classList.add('ic-ic_fullscreenExit');
                    closeButton.classList.add('btn');
                    closeButton.classList.add('btn-circle');
                    closeButton.addEventListener('click', SliderGallery.closeLightbox);
                    figure.appendChild(closeButton);
                    if (len === 1) {
                        $(slides).addClass('single-slide-gallery');
                        closeButton.style.opacity = "1";
                    }
                    var caption = slides[i].querySelector('figcaption');
                    if (!caption || caption.innerText.trim().length <= 0 || caption.innerHTML.trim().length <= 0) {
                        $(caption).remove();
                    }
                }
                if (!!img && !!figure) {
                    var newSrc = slides[i].getAttribute('data-image-src-large');
                    if (this.download) {
                        figure.setAttribute('data-dl-allow', 'true');
                    }
                    else {
                        figure.setAttribute('data-dl-allow', 'false');
                    }
                    if (!!newSrc && !!img) {
                        img.src = newSrc;
                    }
                }
            }
        }
    };
    SliderGallery.prototype._getCurrentSlide = function (lightbox) {
        return (lightbox && lightbox === true) ? this.lightbox.find('.slick-slide.slick-current') : this.element.querySelector('.slick-slide.slick-current');
    };
    SliderGallery.prototype._parseOptions = function (opts) {
        var required = [
            'selector',
            'slidesToShow',
            'slideSelector'
        ];
        for (var _i = 0, required_1 = required; _i < required_1.length; _i++) {
            var r = required_1[_i];
            if (!opts[r]) {
                throw ('SliderGallery error: Required option ' + r + ' missing.');
            }
        }
        this.options = opts;
        if (!this.options.hideControlTimeout) {
            this.options.hideControlTimeout = SLIDER_GAL_DEFAULT_TIMEOUT;
        }
        this.options.noControlPanel = (typeof opts.noControlPanel !== "undefined" && opts.noControlPanel !== false);
        this.options.sliderDots = (opts.sliderDots);
        if (this.options.noControlPanel === false) {
            this.options.sliderDots = true;
        }
    };
    SliderGallery.prototype.getCurrentSlideIndex = function () {
        var curr = this._getCurrentSlide();
        return (!!curr) ? (parseInt(curr.getAttribute('data-index')) || 0) : 0;
    };
    return SliderGallery;
}());
var SOCIAL_SHARE_OVERLAY_BACKDROP_CLASS = 'social-share-overlay-backdrop';
var SOCIAL_SHARE_OVERLAY_CONTAINER_CLASS = 'social-share-overlay-container';
var SOCIAL_SHARE_OVERLAY_CLOSE_CLASS = 'social-share-overlay-close';
var SOCIAL_SHARE_OVERLAY_HEADLINE_CLASS = 'social-share-overlay-headline';
var SOCIAL_SHARE_OVERLAY_CHANNELS_CLASS = 'social-share-overlay-channels';
var SOCIAL_SHARE_OVERLAY_CHANNELS_HEADLINE_CLASS = 'social-share-overlay-channels-headline';
var SOCIAL_SHARE_OVERLAY_SHARE_ICON_CLASS = 'social-share-overlay-share-icon';
var SOCIAL_SHARE_OVERLAY_ADDITIONAL_CLASS = 'social-share-overlay-additional';
var SOCIAL_SHARE_OVERLAY_ADDITIONAL_HEADLINE_CLASS = 'social-share-overlay-additional-headline';
var SOCIAL_SHARE_OVERLAY_DEFAULT_CHANNELS_HEADLINE = 'Social Media Kanäle';
var SOCIAL_SHARE_OVERLAY_DEFAULT_ADDITIONAL_HEADLINE = 'Weitere Optionen';
var SOCIAL_SHARE_OVERLAY_DEFAULT_COPY_MESSAGE = 'Link wurde in die Zwischenablage kopiert.';
var SOCIAL_SHARE_OVERLAY_DEFAULT_TOOLTIP_POSITION = 'bottom';
var SOCIAL_SHARE_OVERLAY_DEFAULT_TOOLTIP_PRINT = 'Drucken';
var SOCIAL_SHARE_OVERLAY_DEFAULT_TOOLTIP_COPY = 'In die Zwischenablage kopieren';
var SOCIAL_SHARE_OVERLAY_DEFAULT_TOOLTIP_FACEBOOK = 'Auf Facebook teilen';
var SOCIAL_SHARE_OVERLAY_DEFAULT_TOOLTIP_TWITTER = 'Auf Twitter teilen';
var SOCIAL_SHARE_OVERLAY_DEFAULT_TOOLTIP_WHATSAPP = 'Auf Whatsapp teilen';
var SOCIAL_SHARE_OVERLAY_DEFAULT_TOOLTIP_TUMBLR = 'Auf Tumblr teilen';
var SOCIAL_SHARE_OVERLAY_DEFAULT_TOOLTIP_MAIL = 'Per Mail teilen';
var SocialShareOverlay = (function () {
    function SocialShareOverlay(node) {
        "use strict";
        var self = this;
        this.node = node;
        if (!this.node) {
            throw ('SocialShareOverlay error: No element node given.');
        }
        this.node.addEventListener('click', function (event) {
            event.preventDefault();
            self._open();
            return false;
        });
    }
    SocialShareOverlay.prototype._showBackdrop = function () {
        var self = this;
        this.backdrop = document.createElement('div');
        this.backdrop.classList.add(SOCIAL_SHARE_OVERLAY_BACKDROP_CLASS);
        this.backdrop.addEventListener('click', function () {
            self._remove();
        });
        document.body.appendChild(this.backdrop);
        if (!this.listener) {
            this.listener = document.addEventListener('keyup', function (event) {
                "use strict";
                if (event.keyCode === 27) {
                    self._remove();
                }
            });
        }
    };
    SocialShareOverlay.prototype._addAdditional = function (container) {
        var self = this;
        if (!!container) {
            var additionalContainer = document.createElement('div');
            additionalContainer.classList.add(SOCIAL_SHARE_OVERLAY_ADDITIONAL_CLASS);
            var additionalHeadline = this.node.getAttribute('data-additional-headline');
            var additionalContainerHeadline = document.createElement('div');
            additionalContainerHeadline.classList.add(SOCIAL_SHARE_OVERLAY_ADDITIONAL_HEADLINE_CLASS);
            additionalContainerHeadline.innerHTML = (!!additionalHeadline) ? escapeHtml(additionalHeadline) : SOCIAL_SHARE_OVERLAY_DEFAULT_ADDITIONAL_HEADLINE;
            additionalContainer.appendChild(additionalContainerHeadline);
            var mailShare = this.node.getAttribute('data-share-mail');
            var mailShareIconUrl = this.node.getAttribute('data-share-mail-icon');
            if (!!mailShare && !!mailShareIconUrl) {
                var mailShareLink = document.createElement('a');
                mailShareLink.classList.add(SOCIAL_SHARE_OVERLAY_SHARE_ICON_CLASS);
                mailShareLink.href = mailShare;
                mailShareLink.target = '_blank';
                mailShareLink.setAttribute('data-toggle', 'tooltip');
                mailShareLink.setAttribute('data-placement', SOCIAL_SHARE_OVERLAY_DEFAULT_TOOLTIP_POSITION);
                mailShareLink.setAttribute('title', SOCIAL_SHARE_OVERLAY_DEFAULT_TOOLTIP_MAIL);
                var mailShareIcon = document.createElement('img');
                mailShareIcon.src = mailShareIconUrl;
                mailShareLink.appendChild(mailShareIcon);
                additionalContainer.appendChild(mailShareLink);
            }
            var copyShare = this.node.getAttribute('data-share-copy');
            var copyShareIconUrl = this.node.getAttribute('data-share-copy-icon');
            if (!!copyShare && !!copyShareIconUrl) {
                var copyShareLink = document.createElement('span');
                copyShareLink.classList.add(SOCIAL_SHARE_OVERLAY_SHARE_ICON_CLASS);
                copyShareLink.classList.add('social-copy');
                copyShareLink.setAttribute('data-url', copyShare);
                copyShareLink.setAttribute('data-toggle', 'tooltip');
                copyShareLink.setAttribute('data-placement', SOCIAL_SHARE_OVERLAY_DEFAULT_TOOLTIP_POSITION);
                copyShareLink.setAttribute('title', SOCIAL_SHARE_OVERLAY_DEFAULT_TOOLTIP_COPY);
                var copyShareIcon = document.createElement('img');
                copyShareIcon.src = copyShareIconUrl;
                copyShareLink.appendChild(copyShareIcon);
                additionalContainer.appendChild(copyShareLink);
                copyShareLink.addEventListener('click', function (event) {
                    "use strict";
                    event.preventDefault();
                    new Clipboard('.social-copy', {
                        text: function (trigger) {
                            var url = trigger.getAttribute('data-url') || '';
                            return (!!url && url !== 'true') ? url : document.location.href;
                        }
                    });
                    if (!!self.messageContainer) {
                        if (self.messageContainer.classList.contains('hidden')) {
                            self.messageContainer.innerHTML += escapeHtml(SOCIAL_SHARE_OVERLAY_DEFAULT_COPY_MESSAGE);
                            self.messageContainer.classList.remove('hidden');
                        }
                    }
                });
            }
            var printShare = this.node.getAttribute('data-share-print');
            var printShareIconUrl = this.node.getAttribute('data-share-print-icon');
            if (!!printShare && !!printShareIconUrl) {
                var printShareLink = document.createElement('span');
                printShareLink.classList.add(SOCIAL_SHARE_OVERLAY_SHARE_ICON_CLASS);
                printShareLink.classList.add('social-print');
                printShareLink.setAttribute('data-toggle', 'tooltip');
                printShareLink.setAttribute('data-placement', SOCIAL_SHARE_OVERLAY_DEFAULT_TOOLTIP_POSITION);
                printShareLink.setAttribute('title', SOCIAL_SHARE_OVERLAY_DEFAULT_TOOLTIP_PRINT);
                var printShareIcon = document.createElement('img');
                printShareIcon.src = printShareIconUrl;
                printShareLink.appendChild(printShareIcon);
                additionalContainer.appendChild(printShareLink);
                printShareLink.addEventListener('click', function (event) {
                    "use strict";
                    event.preventDefault();
                    window.print();
                    return false;
                });
            }
            container.appendChild(additionalContainer);
        }
    };
    SocialShareOverlay.prototype._addChannels = function (container) {
        if (!!container) {
            var channelContainer = document.createElement('div');
            channelContainer.classList.add(SOCIAL_SHARE_OVERLAY_CHANNELS_CLASS);
            var channelHeadline = this.node.getAttribute('data-channel-headline');
            var channelContainerHeadline = document.createElement('div');
            channelContainerHeadline.classList.add(SOCIAL_SHARE_OVERLAY_CHANNELS_HEADLINE_CLASS);
            channelContainerHeadline.innerHTML = (!!channelHeadline) ? escapeHtml(channelHeadline) : SOCIAL_SHARE_OVERLAY_DEFAULT_CHANNELS_HEADLINE;
            channelContainer.appendChild(channelContainerHeadline);
            var fbShare = this.node.getAttribute('data-share-facebook');
            var fbShareIconUrl = this.node.getAttribute('data-share-facebook-icon');
            if (!!fbShare && !!fbShareIconUrl) {
                var fbShareLink = document.createElement('a');
                fbShareLink.classList.add(SOCIAL_SHARE_OVERLAY_SHARE_ICON_CLASS);
                fbShareLink.href = fbShare;
                fbShareLink.target = '_blank';
                fbShareLink.setAttribute('data-toggle', 'tooltip');
                fbShareLink.setAttribute('data-placement', SOCIAL_SHARE_OVERLAY_DEFAULT_TOOLTIP_POSITION);
                fbShareLink.setAttribute('title', SOCIAL_SHARE_OVERLAY_DEFAULT_TOOLTIP_FACEBOOK);
                var fbShareIcon = document.createElement('img');
                fbShareIcon.src = fbShareIconUrl;
                fbShareLink.appendChild(fbShareIcon);
                channelContainer.appendChild(fbShareLink);
            }
            var twShare = this.node.getAttribute('data-share-twitter');
            var twShareIconUrl = this.node.getAttribute('data-share-twitter-icon');
            if (!!twShare && !!twShareIconUrl) {
                var twShareLink = document.createElement('a');
                twShareLink.classList.add(SOCIAL_SHARE_OVERLAY_SHARE_ICON_CLASS);
                twShareLink.href = twShare;
                twShareLink.target = '_blank';
                twShareLink.setAttribute('data-toggle', 'tooltip');
                twShareLink.setAttribute('data-placement', SOCIAL_SHARE_OVERLAY_DEFAULT_TOOLTIP_POSITION);
                twShareLink.setAttribute('title', SOCIAL_SHARE_OVERLAY_DEFAULT_TOOLTIP_TWITTER);
                var twShareIcon = document.createElement('img');
                twShareIcon.src = twShareIconUrl;
                twShareLink.appendChild(twShareIcon);
                channelContainer.appendChild(twShareLink);
            }
            if (!isMobile()) {
                var tbShare = this.node.getAttribute('data-share-tumblr');
                var tbShareIconUrl = this.node.getAttribute('data-share-tumblr-icon');
                if (!!tbShare && !!tbShareIconUrl) {
                    var tbShareLink = document.createElement('a');
                    tbShareLink.classList.add(SOCIAL_SHARE_OVERLAY_SHARE_ICON_CLASS);
                    tbShareLink.href = tbShare;
                    tbShareLink.target = '_blank';
                    tbShareLink.setAttribute('data-toggle', 'tooltip');
                    tbShareLink.setAttribute('data-placement', SOCIAL_SHARE_OVERLAY_DEFAULT_TOOLTIP_POSITION);
                    tbShareLink.setAttribute('title', SOCIAL_SHARE_OVERLAY_DEFAULT_TOOLTIP_TUMBLR);
                    var tbShareIcon = document.createElement('img');
                    tbShareIcon.src = tbShareIconUrl;
                    tbShareLink.appendChild(tbShareIcon);
                    channelContainer.appendChild(tbShareLink);
                }
            }
            else {
                var waShare = this.node.getAttribute('data-share-whatsapp');
                var waShareIconUrl = this.node.getAttribute('data-share-whatsapp-icon');
                if (!!waShare && !!waShareIconUrl) {
                    var waShareLink = document.createElement('a');
                    waShareLink.classList.add(SOCIAL_SHARE_OVERLAY_SHARE_ICON_CLASS);
                    waShareLink.href = waShare;
                    waShareLink.target = '_blank';
                    waShareLink.setAttribute('data-toggle', 'tooltip');
                    waShareLink.setAttribute('data-placement', SOCIAL_SHARE_OVERLAY_DEFAULT_TOOLTIP_POSITION);
                    waShareLink.setAttribute('title', SOCIAL_SHARE_OVERLAY_DEFAULT_TOOLTIP_WHATSAPP);
                    var waShareIcon = document.createElement('img');
                    waShareIcon.src = waShareIconUrl;
                    waShareLink.appendChild(waShareIcon);
                    channelContainer.appendChild(waShareLink);
                }
            }
            container.appendChild(channelContainer);
        }
    };
    SocialShareOverlay.prototype._remove = function () {
        if (!!this.container) {
            document.body.removeChild(this.container);
            this.container = null;
        }
        if (!!this.backdrop) {
            document.body.removeChild(this.backdrop);
            this.backdrop = null;
        }
    };
    SocialShareOverlay.prototype._showContainer = function () {
        "use strict";
        var self = this;
        if (!!this.backdrop) {
            this.container = document.createElement('div');
            this.container.classList.add(SOCIAL_SHARE_OVERLAY_CONTAINER_CLASS);
            var close_1 = document.createElement('span');
            close_1.classList.add('ic-ic_close');
            close_1.classList.add(SOCIAL_SHARE_OVERLAY_CLOSE_CLASS);
            this.container.appendChild(close_1);
            close_1.addEventListener('click', function (event) {
                event.preventDefault();
                self._remove();
                return false;
            });
            var headline = this.node.getAttribute('data-headline');
            if (!!headline) {
                var headlineNode = document.createElement('div');
                headlineNode.classList.add(SOCIAL_SHARE_OVERLAY_HEADLINE_CLASS);
                headlineNode.innerHTML = escapeHtml(headline);
                this.container.appendChild(headlineNode);
            }
            this.messageContainer = document.createElement('div');
            this.messageContainer.classList.add('alert');
            this.messageContainer.classList.add('alert-info');
            this.messageContainer.classList.add('text-center');
            this.messageContainer.classList.add('hidden');
            this.container.appendChild(this.messageContainer);
            this._addChannels(this.container);
            this._addAdditional(this.container);
            document.body.appendChild(this.container);
            this.container.style.top = 'calc(50% - ' + (this.container.offsetHeight / 2) + 'px)';
            this.container.style.left = 'calc(50% - ' + (this.container.offsetWidth / 2) + 'px)';
            $(this.container).find('[data-toggle="tooltip"]').tooltip({
                container: 'body'
            });
        }
        else {
            throw ('SocialShareOverlay error: Cannot add container. Missing backdrop node.');
        }
    };
    SocialShareOverlay.prototype._open = function () {
        this._showBackdrop();
        this._showContainer();
    };
    return SocialShareOverlay;
}());
var SocialShareJamFm = (function (_super) {
    __extends(SocialShareJamFm, _super);
    function SocialShareJamFm(node) {
        return _super.call(this, node) || this;
    }
    return SocialShareJamFm;
}(SocialShareOverlay));
var SliderGalleryJamFm = (function (_super) {
    __extends(SliderGalleryJamFm, _super);
    function SliderGalleryJamFm(options) {
        var _this = _super.call(this, options) || this;
        var self = _this;
        _this.currentIndex = 0;
        self.buildAdSlides();
        _this.element.addEventListener('dmh.slidergallery.beforeSlide', function () {
            $('.slider-gallery-lightbox .image-lightbox-container .slider-gallery-lightbox-close').addClass('hidden');
        });
        _this.slider.on('afterChange', function (event, slick, currentSlide) {
            self.buildAdSlides();
        });
        _this.element.addEventListener('dmh.slidergallery.openlightbox', function () {
            self.lightboxAdSlides = self.lightbox[0].querySelectorAll('.adslide');
            window.setTimeout(function () {
                SliderGalleryJamFm.initLightboxPlayer();
                SliderGalleryJamFm._showCaption();
                SliderGalleryJamFm._initShareIcons();
                self.lightbox.find('.adinit').removeClass('adinit');
                self.buildAdSlides(true);
            }, 200);
        });
        _this.element.addEventListener('dmh.slidergallery.afterSlide', SliderGalleryJamFm._showCaption);
        return _this;
    }
    SliderGalleryJamFm._showCaption = function () {
        var slide = document.querySelector('.slider-gallery-lightbox .image-lightbox-container.slick-current');
        if (!!slide) {
            var $slide = $(slide);
            var figure = $slide.find('figure');
            var close_2 = $slide.find('.slider-gallery-lightbox-close');
            close_2.css('opacity', '1');
            figure.find('figcaption').show();
        }
    };
    SliderGalleryJamFm._initShareIcons = function () {
        var shares = document.querySelectorAll('.slider-gallery-lightbox .toggle-share');
        if (!!shares) {
            for (var i = 0, len = shares.length; i < len; i++) {
                (new SocialShareJamFm(shares[i]));
            }
        }
    };
    SliderGalleryJamFm.initLightboxPlayer = function () {
        "use strict";
        try {
            var wrapper = document.querySelectorAll('.slider-gallery-lightbox .slick-slide:not(.slick-initialized) .dmh-player-wrapper');
            if (!!wrapper) {
                for (var i = 0, len = wrapper.length; i < len; i++) {
                    if ($(wrapper[i]).parents('.slick-slide').hasClass('slick-cloned'))
                        continue;
                    var player = $(wrapper[i]).find('.dmh-player');
                    if (!!player) {
                        var id = player.attr('id');
                        if (id.length) {
                            player.attr('id', id + '--lightbox');
                            (new MediaPlayerJamFm(wrapper[i], id + '--lightbox', '100%'));
                        }
                    }
                }
            }
        }
        catch (e) {
            console.error(e);
        }
    };
    return SliderGalleryJamFm;
}(SliderGallery));
var Webradio = (function () {
    function Webradio(opts) {
        this.playingNowData = [];
        this.currentChannel = '';
        this.defaultChannel = '';
        this.channelIndex = 0;
        this.fallbackImageUrl = '';
        this.fetchingData = false;
        this.updatingData = false;
        this.webradioBaseUrl = '';
        this.channels = {};
        this.url = '';
        this.updatingData = false;
        this.titlesearchOptions = {
            url: null,
            container: null,
            coverFallbackUrl: null
        };
        var currentUrl = window.location.pathname;
        var currentRadio = currentUrl.split('/').slice(-1).pop();
        this._parseOptions(opts);
        var ch = this.getJsonKeyName(currentRadio);
        this.currentChannel = (!!ch) ? ch : this.defaultChannel;
    }
    Webradio.prototype._setChannels = function (channelList) {
        if (!!channelList) {
            this.channels = {};
            var index = 0;
            for (var i in channelList) {
                if (channelList.hasOwnProperty(i) && channelList[i].json && channelList[i].display) {
                    if (index === 0) {
                        this.defaultChannel = i;
                    }
                    this.channels[i] = {
                        json: channelList[i].json,
                        display: channelList[i].display,
                        path: channelList[i].path
                    };
                    index++;
                }
            }
        }
    };
    Webradio.prototype._error = function (message, execption, thowException) {
        if (!!this.errorContainer) {
            this.errorContainer.classList.add('show');
        }
        if (!!thowException) {
            throw (message);
        }
        else {
            console.error('WEBRADIOTS ERROR - ' + message);
            if (!!execption)
                console.error(execption);
        }
    };
    Webradio.prototype._parseOptions = function (opts) {
        if (!!opts) {
            var requiredOptions = [
                'url', 'fallbackImageUrl', 'webradioBaseUrl'
            ];
            for (var i in requiredOptions) {
                if (!opts[requiredOptions[i]]) {
                    this._error('Cannot find ' + requiredOptions[i] + ' field in options', null, true);
                }
                else {
                    this[requiredOptions[i]] = opts[requiredOptions[i]];
                }
            }
            if (!!opts.channelList) {
                this._setChannels(opts.channelList);
            }
            else {
                console.warn('Webradio2 warning: No channel list for webradio set.');
            }
        }
    };
    Webradio.prototype._fetchPlayingNow = function (fetchCb) {
        var self = this;
        if (this.fetchingData !== true) {
            this.fetchingData = true;
            if (!!this.errorContainer) {
                this.errorContainer.classList.remove('show');
            }
            setTimeout(function () {
                self._fetchPlayingNow(fetchCb);
            }, 30000);
            $.ajax({
                url: this.url,
                dataType: 'json',
                timeout: 5000,
                cache: false
            })
                .done(function (data) {
                self.updateData(data);
                if (fetchCb)
                    fetchCb(self, self.channelIndex);
                self.fetchingData = false;
            })
                .fail(function (error) {
                self._error('Cannot fetch webradio data.', error, false);
            });
        }
    };
    Webradio.prototype.updateTitleSearch = function (action, day, hour, minute, channel) {
        if (!!this.titlesearch) {
            this.titlesearch.fetch((!!action) ? action : 'new', (!!channel) ? channel : this.currentChannel, parseInt(day, 10) || 0, parseInt(hour, 10) || 0, parseInt(minute, 10) || 0, null);
        }
    };
    Webradio.prototype.getChannelName = function (key, type) {
        if (!this.channelExists(key, type))
            key = 'onair';
        if (!!this.channels[key]) {
            switch (type) {
                case 'json':
                    return this.channels[key].json;
                case 'display':
                default:
                    return this.channels[key].display;
            }
        }
        return '';
    };
    Webradio.prototype.getPathByJsonName = function (jsonname) {
        for (var i in this.channels) {
            if (this.channels[i].json == jsonname) {
                return this.channels[i].path;
            }
        }
        return null;
    };
    Webradio.prototype.channelExists = function (key, type) {
        return (!!this.channels[key] && !!this.channels[key][type]);
    };
    Webradio.prototype.channelJSONExists = function (jsonName) {
        for (var index in this.channels) {
            if (this.channels[index].json === jsonName) {
                return true;
            }
        }
        return false;
    };
    Webradio.prototype.getJsonKeyName = function (key) {
        return this.getChannelName(key, 'json');
    };
    Webradio.prototype.updateData = function (data) {
        if (this.updatingData !== true) {
            this.updatingData = true;
            this.playingNowData = [];
            for (var i in data) {
                if (this.channelJSONExists(data[i].name)) {
                    this.playingNowData.push(data[i]);
                }
            }
            for (var item in this.playingNowData) {
                var img = document.createElement('img');
                if (this.playingNowData.hasOwnProperty(item)) {
                    if (!!this.playingNowData[item].playHistories.length &&
                        !!this.playingNowData[item].playHistories[0].track &&
                        !!this.playingNowData[item].playHistories[0].track.coverUrlBig) {
                        img.src = this.playingNowData[item].playHistories[0].track.coverUrlBig;
                    }
                    else {
                        img.src = this.fallbackImageUrl;
                    }
                    this.playingNowData[item].imageElement = img;
                    img.onerror = function () {
                        "use strict";
                        this.style.display = 'none';
                    };
                }
            }
            this.updatingData = false;
        }
    };
    Webradio.prototype.getCurrentSongData = function (channel) {
        for (var _i = 0, _a = this.playingNowData; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.name === channel) {
                return item;
            }
        }
        return null;
    };
    Webradio.prototype.getDisplayChannelName = function (key) {
        return this.getChannelName(key, 'display');
    };
    Webradio.prototype.getTitlesearch = function () {
        return this.titlesearch;
    };
    Webradio.prototype.getTitlesearchContainer = function () {
        return this.titlesearchOptions.container;
    };
    Webradio.prototype.getCurrentChannel = function () {
        return this.currentChannel;
    };
    return Webradio;
}());
var Titlesearch = (function () {
    function Titlesearch(url, selector, coverFallbackUrl, currentChannel) {
        this.coverFallbackUrl = coverFallbackUrl;
        this.baseUrl = url;
        this.container = document.querySelector(selector);
        if (!this.container) {
            throw ('Titlesearch error: Container not found!');
        }
        this.coverFallBackUrl = coverFallbackUrl;
        this.activeSongIndex = 0;
        this.songList = [];
        this.idList = [];
        this.currentDay = 0;
        this.fetchLimit = 2;
        this.events = {
            init: document.createEvent('Event'),
            fetch: document.createEvent('Event'),
            populate: document.createEvent('Event')
        };
        this.events.init.initEvent('dmh.titlesearch.init', true, true);
        this.events.fetch.initEvent('dmh.titlesearch.fetch', true, true);
        this.events.populate.initEvent('dmh.titlesearch.populate', true, true);
        if (!!currentChannel)
            this.currentChannel = currentChannel;
        this.container.dispatchEvent(this.events.init);
    }
    Titlesearch.prototype._addSongData = function (data, action) {
        if (action === 'after') {
            this.songList.unshift(data);
        }
        else {
            this.songList.push(data);
        }
    };
    Titlesearch.prototype._getShopUrl = function (index) {
        if (!!this.songList[index] && !!this.songList[index].track) {
            if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
                return this.songList[index].track.itunesShopUrl || '';
            }
            return this.songList[index].track.googleShopUrl || '';
        }
        return '';
    };
    Titlesearch.prototype._getCurrentDay = function () {
        return this.currentDay;
    };
    Titlesearch.prototype._addSongIndex = function (index) {
        this.idList.push(index);
    };
    Titlesearch.prototype._setActiveSongIndex = function (index) {
        this.activeSongIndex = parseInt(index);
    };
    Titlesearch.prototype.setLimit = function (limit) {
        this.fetchLimit = parseInt(limit, 10) || 0;
    };
    Titlesearch.prototype.fetch = function (action, channel, day, hour, minute, currentRadio) {
        var self = this;
        var url = this.baseUrl;
        if (!!channel && this.currentChannel !== channel) {
            this.currentChannel = channel;
        }
        url += this.currentChannel + '/';
        this.currentDay = day;
        if (!currentRadio) {
            this.context = 'popup';
        }
        if (action === 'new' || action === 'refresh') {
            this.songList = [];
            this.idList = [];
        }
        if (action === 'new') {
            url += '0/';
            url += new Date().getHours() + '/';
            url += new Date().getMinutes();
        }
        else {
            url += day + '/';
            url += hour + '/';
            url += minute;
        }
        if (!!this.fetchLimit && this.fetchLimit > 0) {
            url += '?items=' + this.fetchLimit;
        }
        $.ajaxSetup({ cache: false });
        $.get(url, function (data) {
            var addedItems = 0;
            if (action === 'after') {
                data.reverse();
            }
            for (var i in data) {
                if (!!self.fetchLimit && addedItems >= self.fetchLimit)
                    break;
                if (data.hasOwnProperty(i) && !!data[i].track && self.idList.indexOf(data[i].track.id) === -1) {
                    if (self.idList.length > 10) {
                        self.idList = [];
                    }
                    if (action === 'after') {
                        self.activeSongIndex++;
                    }
                    self._addSongIndex(data[i].track.id);
                    self._addSongData(data[i], action);
                    addedItems++;
                }
            }
            self._setActiveSongIndex(self.activeSongIndex);
            self.container.dispatchEvent(self.events.fetch);
        });
    };
    Titlesearch.formatTime = function (day, time, range) {
        var timeArray = time.split(':');
        var hour = parseInt(timeArray[0]);
        var minute = parseInt(timeArray[1]) + range;
        if (minute < 0) {
            minute = 60 + minute;
            hour--;
        }
        else if (minute >= 60) {
            minute = minute - 60;
            hour++;
        }
        day = parseInt(day, 10) || 0;
        if (hour < 0) {
            day--;
            hour = 24 + hour;
        }
        else if (hour > 23) {
            day++;
            hour = hour - 24;
        }
        return [day, hour, minute];
    };
    Titlesearch.prototype.getContainer = function () {
        return this.container;
    };
    return Titlesearch;
}());
var WebradioJamFm = (function (_super) {
    __extends(WebradioJamFm, _super);
    function WebradioJamFm(opts) {
        var _this = _super.call(this, opts) || this;
        var self = _this;
        _this.container = document.querySelector('.navigation-webradio');
        if (!_this.container) {
            throw ('Webradio: Cannot initialize. Container not found.');
        }
        _this.errorContainer = _this.container.querySelector('.navigation-webradio-error');
        if (!_this.errorContainer) {
            console.error('Webradio Warning: Error container .navigation-webradio-error not found.');
        }
        _this.coverContainerClass = '.navigation-webradio-cover';
        if (!!opts.coverContainerClass) {
            _this.coverContainerClass = opts.coverContainerClass;
        }
        _this.songinfoContainerClass = '.navigation-webradio-info';
        if (!!opts.songinfoContainerClass) {
            _this.songinfoContainerClass = opts.songinfoContainerClass;
        }
        if (!_this.currentChannel) {
            _this.currentChannel = 'onair';
        }
        if ($(_this.container).parents('.radioplayer').length <= 0) {
            _this.initChannelSlider();
        }
        _this._fetchPlayingNow(_this.sendSongData);
        if (opts.refresh != false) {
            _this.refreshInterval = window.setInterval(function () {
                self._fetchPlayingNow(self.sendSongData);
            }, 20000);
        }
        return _this;
    }
    WebradioJamFm.prototype.toggleLoading = function (show) {
        "use strict";
        var loading = this.container.querySelector('.navigation-webradio-loading');
        if (!!loading) {
            loading.style.display = (!!show) ? 'flex' : 'none';
        }
    };
    WebradioJamFm.prototype.setBlurryCover = function (url) {
        var blur = $('.navigation-webradio-image-blur');
        blur.css({
            'background-image': 'url("' + url + '")'
        });
        if (navigator.userAgent.indexOf('MSIE') !== -1 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
            blur.after('<div style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; background: rgba(127,127,127,0.3);"></div>');
        }
    };
    WebradioJamFm.prototype.initChannelSlider = function () {
        var self = this;
        this.slider = this.container.querySelector('.navigation-webradio-slider');
        if (!!this.slider && !this.slider.classList.contains('slick-initialized')) {
            $(this.slider).on('init', function (event, slick) {
                $(self.container).find('.navigation-webradio-channels').slick({
                    arrows: false,
                    dots: false,
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    variableWidth: false,
                    responsive: [
                        {
                            breakpoint: SCREEN_SM_MAX,
                            settings: {
                                slidesToShow: 1,
                                slidesToScroll: 1,
                                centerMode: true,
                                variableWidth: true
                            }
                        },
                    ]
                });
                var channelSwitcher = self.container.querySelectorAll('.navigation-webradio-channel');
                if (!!channelSwitcher) {
                    for (var i = 0, len = channelSwitcher.length; i < len; i++) {
                        channelSwitcher[i].addEventListener('click', function (event) {
                            event.preventDefault();
                            $(self.container).find('.navigation-webradio-channel.current').removeClass('current');
                            this.classList.add('current');
                            var index = parseInt(this.getAttribute('data-index'), 10) || 0;
                            $(self.container).find('.navigation-webradio-channels').slick('slickGoTo', index);
                            $(slick.$slider).slick('slickGoTo', index);
                            return false;
                        });
                    }
                }
                self.toggleLoading(false);
                self.container.classList.remove('hidden');
            });
            $(this.slider).slick({
                slidesToShow: 1,
                slidesToScroll: 1,
                infinite: true,
                nextArrow: '<button type="button" class="slick-next ic-ic_arrow_right"></button>',
                prevArrow: '<button type="button" class="slick-prev ic-ic_arrow_left"></button>'
            });
            $(this.slider).on('beforeChange', function (event, slick) {
                self.toggleLoading(true);
                var slide = $(slick.$slider).find('.slick-current.slick-active:not(.slick-cloned)').next('.slick-slide');
                if (slide.length) {
                    var channel = slide.data('channel-name');
                    var channelUrlSuffix = self.getPathByJsonName(channel);
                    if (!!channelUrlSuffix) {
                        var href = slide.find('.navigation-webradio-play').attr('href');
                        slide.find('.navigation-webradio-play').attr('href', href.replace(/\/([a-z]+)$/ig, '/' + channelUrlSuffix));
                    }
                    self._fetchPlayingNow(function () {
                        self.sendSongData(self, self.channelIndex);
                    });
                }
            });
            $(this.slider).on('afterChange', function (event, slick, currentSlide, nextSlide) {
                var slide = $(slick.$slider).find('.slick-current.slick-active:not(.slick-cloned)');
                if (slide.length) {
                    $(self.container).find('.navigation-webradio-channel.current').removeClass('current');
                    $('.navigation-webradio-channel[data-index="' + currentSlide + '"]').addClass('current');
                    $(self.container).find('.navigation-webradio-channels').slick('slickGoTo', currentSlide);
                }
                self.toggleLoading(false);
            });
        }
    };
    WebradioJamFm.prototype.loadChannel = function (channelName) {
        var self = this;
        if (!!channelName) {
            var dt = new Date();
            this.updateTitleSearch('refresh', 0, dt.getHours(), dt.getMinutes(), channelName);
            this.currentChannel = channelName;
            this.channelIndex = self.getIndexFromJsonName(channelName);
            this._fetchPlayingNow(function () {
                self.sendSongData(self, self.channelIndex);
            });
        }
    };
    WebradioJamFm.prototype.setCurrentChannel = function (channel) {
        var self = this;
        if (!!channel) {
            this.currentChannel = channel;
            for (var i = 0, len = this.playingNowData.length; i < len; i++) {
                if (this.playingNowData[i].name === self.getJsonKeyName(self.currentChannel)) {
                    self.channelIndex = i;
                    self.sendSongData(self, self.channelIndex);
                }
            }
            $('.webradio__playing__cover__link').each(function () {
                $(this).attr('href', self.webradioBaseUrl + channel + '/');
            });
        }
    };
    WebradioJamFm.prototype.setCoverImage = function (slide, data) {
        if (!!slide && !!data) {
            var coverContainer = $(slide).find(this.coverContainerClass);
            if (!!data.playingNowData) {
                var $slide = $(slide);
                $slide.attr('data-cover-url', this.fallbackImageUrl);
                coverContainer.css({
                    'background': 'url("' + this.fallbackImageUrl + '")',
                    'background-size': 'contain'
                });
                if (!!data.playingNowData.imageElement) {
                    $slide.attr('data-cover-url', data.playingNowData.imageElement.src);
                    coverContainer.find('img').attr('src', data.playingNowData.imageElement.src);
                    coverContainer.find('a').append(data.playingNowData.imageElement.src);
                    if ($slide.hasClass('slick-current') || $slide.hasClass('active-channel')) {
                        this.setBlurryCover(data.playingNowData.imageElement.src);
                    }
                }
            }
        }
    };
    WebradioJamFm.prototype.setTrackInfo = function (slide, playingNowData) {
        if (!!playingNowData && !!slide) {
            var infoContainer = $(slide).find(this.songinfoContainerClass);
            if (!!playingNowData.playHistories[0].track.artist) {
                infoContainer.find('.artist').html(playingNowData.playHistories[0].track.artist);
            }
            if (!!playingNowData.playHistories[0].track.title) {
                var split = playingNowData.playHistories[0].track.title.split(/(\([^)]+\))/);
                infoContainer.find('.track').html(split[0].trim());
                if (split.length > 1) {
                    infoContainer.find('.track-additional').html(split[1].trim());
                }
            }
        }
    };
    WebradioJamFm.prototype.sendSongData = function (self, index) {
        for (var _i = 0, _a = self.playingNowData; _i < _a.length; _i++) {
            var item = _a[_i];
            var channelSlide = self.container.querySelector('.navigation-webradio-slider-channel:not(.slick-cloned)[data-channel-name="' + item.name + '"]');
            if (!!channelSlide) {
                self.setTrackInfo(channelSlide, item);
                self.setCoverImage(channelSlide, { playingNowData: item });
            }
        }
    };
    WebradioJamFm.prototype.getIndexFromJsonName = function (jsonname) {
        var index = 0;
        if (!!jsonname) {
            for (var item in this.playingNowData) {
                if (this.playingNowData[item].name == jsonname) {
                    return index;
                }
                index++;
            }
        }
        return index;
    };
    WebradioJamFm.prototype.getChannelPrefix = function (key) {
        if (!!this.channels[key] && !!this.channels[key].prefix) {
            return this.channels[key];
        }
        return null;
    };
    WebradioJamFm.prototype.getPlaynowData = function (index) {
        return { playingNowData: this.playingNowData[index] };
    };
    WebradioJamFm.prototype.getChannelSlider = function () {
        return this.slider;
    };
    return WebradioJamFm;
}(Webradio));
var TitlesearchJamFm = (function (_super) {
    __extends(TitlesearchJamFm, _super);
    function TitlesearchJamFm(url, selector, coverFallbackUrl, currentChannel, webradio, fetchLimit) {
        var _this = _super.call(this, url, selector, coverFallbackUrl, currentChannel) || this;
        _this.selector = selector;
        _this.coverFallbackUrl = coverFallbackUrl;
        _this.webradio = webradio;
        _this.fetchLimit = (!!fetchLimit) ? fetchLimit : 8;
        return _this;
    }
    TitlesearchJamFm.prototype._attachPreviewPlayer = function (filename) {
        var player = document.querySelector('#titlesearch-preview-player');
        if (!!player) {
            this.previewPlayer = jwplayer('titlesearch-preview-player');
        }
        else {
            var playerContainer = document.createElement('div');
            var id = 'titlesearch-preview-player';
            playerContainer.classList.add('titlesearch-preview-player');
            playerContainer.setAttribute('id', id);
            document.body.appendChild(playerContainer);
            this.previewPlayer = jwplayer(id).setup({
                "file": filename,
                "height": 360,
                "width": 480
            });
        }
    };
    TitlesearchJamFm.prototype.normalizeTimeSelects = function (hList, mList, dList) {
        var dt = new Date(), currentHour = dt.getHours(), currentMin = (dt.getMinutes() / 10) * 10, selectedHour = parseInt(hList.val(), 10) || 0, selectedDay = parseInt(dList.find('option:selected').val(), 10) || 0;
        hList.find('option').each(function () {
            if (selectedDay != 0) {
                $(this).prop('disabled', false);
            }
            else {
                if (parseInt(this.value, 10) > currentHour)
                    $(this).prop('disabled', true);
            }
        });
        mList.find('option').each(function () {
            if (selectedDay != 0) {
                $(this).prop('disabled', false);
            }
            else {
                if (parseInt(this.value, 10) > currentMin)
                    $(this).prop('disabled', (selectedHour >= currentHour));
            }
        });
        if (mList.find('option:selected').is(':disabled')) {
            mList.val((mList.find('option').not(':disabled').last().val() || 0));
        }
        if (hList.find('option:selected').is(':disabled')) {
            hList.val((hList.find('option').not(':disabled').last().val() || 0));
        }
    };
    TitlesearchJamFm.prototype.previewPlay = function (filename) {
        $('body').find('.titlesearch-preview-playing').removeClass('titlesearch-preview-playing').addClass('ic-ic_play_sample').removeClass('ic-ic_stop_sample');
        if (!!this.previewPlayer) {
            if (typeof radioplayer !== "undefined" && !!radioplayer)
                radioplayer.emp.stop();
            this.previewPlayer.load([{
                    "file": filename
                }]).play();
        }
    };
    TitlesearchJamFm.prototype.previewStop = function () {
        $('body').find('.titlesearch-preview-playing').removeClass('titlesearch-preview-playing').addClass('ic-ic_play_sample').removeClass('ic-ic_stop_sample');
        if (!!this.previewPlayer) {
            if (typeof radioplayer !== "undefined" && !!radioplayer)
                radioplayer.emp.resume();
            this.previewPlayer.stop();
        }
    };
    TitlesearchJamFm.prototype.populate = function () {
        var self = this;
        var containerNodes = document.querySelectorAll(this.selector);
        this.previewStop();
        for (var i = 0, len = containerNodes.length; i < len; i++) {
            var container = containerNodes[i];
            if (!!container) {
                container.innerHTML = '';
                var _loop_1 = function (item) {
                    var dateIndex = (new Date()).getDate() - (new Date(item.start)).getDate();
                    dateIndex = dateIndex > 0 ? -dateIndex : dateIndex;
                    var deltaTime = ((new Date()).getTime() - (new Date(item.start * 1000)).getTime()) / (60 * 1000);
                    if (deltaTime < 15) {
                        $('.titlesearch-control-next').prop('disabled', true);
                    }
                    var innerContainer = document.createElement('div');
                    var titleContainer = document.createElement('div');
                    var iconContainer = document.createElement('div');
                    var iconPlayContainer = document.createElement('div');
                    var iconPlay = document.createElement('a');
                    var iconStoreContainer = document.createElement('div');
                    var iconStore = document.createElement('a');
                    innerContainer.classList.add('navigation-titlesearch-item');
                    innerContainer.setAttribute('data-day', dateIndex.toString());
                    titleContainer.classList.add('navigation-titlesearch-title');
                    var coverContainer = document.createElement('div');
                    coverContainer.classList.add('navigation-titlesearch-cover');
                    var img = document.createElement('img');
                    if (browserIsSafari()) {
                        img.setAttribute('src', item.track.itunesCover);
                    }
                    else {
                        img.setAttribute('src', item.track.coverUrlBig);
                    }
                    img.onerror = function () {
                        "use strict";
                        this.style.display = 'none';
                        $(coverContainer).css({
                            'background': 'url("' + self.coverFallbackUrl + '")',
                            'background-size': 'cover'
                        });
                    };
                    coverContainer.appendChild(img);
                    innerContainer.appendChild(coverContainer);
                    var tm = new Date(item.start);
                    var min = tm.getMinutes();
                    var hrs = tm.getHours();
                    titleContainer.innerHTML =
                        '<div class="navigation-titlesearch-time">' +
                            ((hrs < 10) ? '0' + hrs.toString() : hrs) +
                            ':' +
                            ((min < 10) ? '0' + min.toString() : min) +
                            '</div><div class="title">' +
                            ucfirst(item.track.title.toLowerCase()) +
                            '</div><div class="artist">' +
                            ucfirst(item.track.artist.toLowerCase()) +
                            '</div>';
                    tooltipText = ucfirst(item.track.title.toLowerCase()) + ' - ' + ucfirst(item.track.artist.toLowerCase());
                    titleContainer.setAttribute('title', tooltipText);
                    titleContainer.classList.add('tooltip-title');
                    titleContainer.setAttribute('data-placement', 'top');
                    innerContainer.appendChild(titleContainer);
                    iconContainer.classList.add('navigation-titlesearch-icons');
                    iconPlay.classList.add('ic-ic_play_sample');
                    if (!!item.track.itunesPreview) {
                        iconPlay.setAttribute('data-titlesearch-preview-itunes', item.track.itunesPreview);
                        self._attachPreviewPlayer(item.track.itunesPreview);
                        iconPlay.addEventListener('click', function (event) {
                            event.preventDefault();
                            var itunes = this.getAttribute('data-titlesearch-preview-itunes');
                            if (this.classList.contains('ic-ic_play_sample')) {
                                self.previewPlay(itunes);
                                this.classList.add('ic-ic_stop_sample');
                                this.classList.add('titlesearch-preview-playing');
                                this.classList.remove('ic-ic_play_sample');
                            }
                            else {
                                self.previewStop();
                                this.classList.add('ic-ic_play_sample');
                                this.classList.remove('titlesearch-preview-playing');
                                this.classList.remove('ic-ic_stop_sample');
                            }
                            return false;
                        });
                    }
                    else {
                        iconPlayContainer.classList.add('disabled');
                    }
                    iconPlayContainer.classList.add('navigation-titlesearch-icon');
                    iconPlayContainer.appendChild(iconPlay);
                    var storeUrl = (browserIsSafari()) ? item.track.itunesShopUrl : item.track.googleShopUrl;
                    var store = (browserIsSafari()) ? 'iTunes-Store' : 'Android-Store';
                    iconStore.classList.add('ic-ic_shopping');
                    iconStore.setAttribute('target', '_blank');
                    if (!storeUrl) {
                        iconStore.setAttribute('disabled', 'disabled');
                        iconStore.style.opacity = '0.5';
                    }
                    else {
                        iconStore.setAttribute('href', storeUrl);
                    }
                    iconStore.setAttribute('data-dmhevt-cat', 'Audio-Store-Open');
                    iconStore.setAttribute('data-dmhevt-lbl', store);
                    iconStoreContainer.classList.add('navigation-titlesearch-icon');
                    iconStoreContainer.appendChild(iconStore);
                    iconContainer.appendChild(iconPlayContainer);
                    iconContainer.appendChild(iconStoreContainer);
                    innerContainer.appendChild(iconContainer);
                    container.appendChild(innerContainer);
                };
                var tooltipText;
                for (var _i = 0, _a = this.songList; _i < _a.length; _i++) {
                    var item = _a[_i];
                    _loop_1(item);
                }
                $(container).find('.ic-ic_shopping').dmhEventTracker();
                $(container).find('.navigation-titlesearch-title.tooltip-title').tooltip({
                    container: 'body'
                });
                if (!!this.webradio) {
                    this.webradio.setCoverImage(null, this.webradio.getPlaynowData(0));
                }
                if (window.innerWidth > SCREEN_SM_MAX) {
                    $('.navigation-titlesearch-cover').height($('.navigation-titlesearch-cover:first').width());
                }
            }
        }
    };
    return TitlesearchJamFm;
}(Titlesearch));
var Voting = (function () {
    function Voting(opts) {
        var self = this;
        this.debug = opts.debug;
        this.questionData = [];
        this.currentIndex = 0;
        this.resultPostUrl = (!!opts.resultPostUrl) ? opts.resultPostUrl : '/dist/ani/xml/voting-results.single.json';
        this.resultGetUrl = (!!opts.resultGetUrl) ? opts.resultGetUrl : '/dist/ani/xml/voting-results.single.json';
        this.containerSelector = opts.containerSelector;
        this.type = 'normal';
        this.mainContainer = document.querySelector(this.containerSelector);
        if (!this.mainContainer) {
            Voting._error('Main container #' + this.containerSelector + ' not found', true);
        }
        this._checkType();
        this.votingMedia = this.mainContainer.querySelector('.voting__widget__content__media');
        this.resultsContainer = this.mainContainer.querySelector('.voting__widget__results');
        if (!this.resultsContainer) {
            Voting._error('Result container in main container #' + this.containerSelector + ' not found', true);
        }
        this.questionSlides = this.mainContainer.querySelectorAll('.voting__widget__content');
        if (!this.questionSlides) {
            Voting._error('No questions in main container found', true);
        }
        this.countQuestions = this.questionSlides.length;
        for (var i = 0; i < this.countQuestions; i++) {
            if (i === 0) {
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
            if (this.type !== 'stars') {
                $(this.questionSlides[i]).find('.voting__widget__content__answer input').on('change', function () {
                    self._showNextButton();
                });
            }
            $(this.questionSlides[i]).find('.voting__widget__content__next').on('click', function () {
                self._showNextSlide();
            });
        }
        if (this.debug === true) {
            console.log('Voting loaded:\n\tQuestions: ', this.questionData);
        }
    }
    Voting._error = function (message, except) {
        var msg = 'Voting error: ';
        msg += (!!message) ? message : 'Unknown error';
        if (except && except === true) {
            throw (msg);
        }
        console.error(msg);
        return false;
    };
    Voting._getAnswerMap = function (questionSlide) {
        var answers = [], nodes = $(questionSlide).find('.voting__widget__content__answer');
        for (var i = 0, len = nodes.length; i < len; i++) {
            answers.push($(nodes[i]).find('label').html());
        }
        return answers;
    };
    Voting.prototype._renderResults = function (results) {
        var resultsContainer = this.mainContainer.querySelector('.voting__widget__results');
        if (!!resultsContainer) {
            $(resultsContainer).prepend(results);
            var icons = resultsContainer.querySelectorAll('.voting__widget__results__list .icon-camera');
            if (!!icons) {
                var _loop_2 = function (i, len) {
                    var icon = icons[i];
                    var image = icon.getAttribute('data-image');
                    if (!!image) {
                        icon.style.verticalAlign = 'sub';
                        icon.style.fontSize = '2.6rem';
                        icon.style.position = 'relative';
                        (function (image) {
                            icon.addEventListener('mouseover', function () {
                                var img = icon.querySelector('img');
                                if (!img) {
                                    img = document.createElement('img');
                                    img.src = image;
                                    img.style.position = 'absolute';
                                    img.style.top = '0';
                                    img.style.maxHeight = '234px';
                                    img.style.zIndex = '99999';
                                    icon.appendChild(img);
                                    if (!!isMobile) {
                                        window.setTimeout(function () {
                                            img.style.display = 'none';
                                        }, 5000);
                                    }
                                }
                                else {
                                    img.style.display = 'initial';
                                }
                            });
                        })(image);
                        icon.addEventListener('mouseleave', function () {
                            var img = icon.querySelector('img');
                            if (!!img) {
                                img.style.display = 'none';
                            }
                        });
                    }
                    else {
                        icon.style.display = 'none';
                    }
                };
                for (var i = 0, len = icons.length; i < len; i++) {
                    _loop_2(i, len);
                }
            }
        }
    };
    Voting.prototype._getAllAnswers = function () {
        var answers = [];
        if (!!this.questionData) {
            for (var index = 0; index < this.questionData.length; index++) {
                if (!this.questionData[index].isAd) {
                    var input = this.questionData[index].input;
                    if (!input) {
                        input = $(this.questionData[index].question).find('input');
                    }
                    answers[index] = {
                        'answer': this.questionData[index].answer,
                        'raw': this.questionData[index].answer_raw,
                        'input': input,
                        'media': $(this.questionData[index].question).find('.voting__widget__content__media'),
                        'node': this.questionData[index].question
                    };
                }
            }
        }
        return answers;
    };
    Voting.prototype._getActiveQuestion = function () {
        return $(this.mainContainer).find('.voting__widget__content.active');
    };
    Voting.prototype._showNextButton = function () {
        var active = this._getActiveQuestion(), btn = $(active).find('.voting__widget__content__next'), value = null, isChecked = ($(active).find('input:checked').length > 0);
        if (active.length) {
            switch (this.type) {
                case 'stars':
                    value = $(active).find('input[type="hidden"]').val();
                    break;
                case 'thumbs':
                    value = $(active).find('input[type="hidden"]').val();
                    break;
                case 'normal':
                default:
                    value = $(active).find('input:checked').val();
                    break;
            }
            if ((!!value || !!isChecked) && btn.length) {
                btn.prop('disabled', false);
            }
            else {
                btn.prop('disabled', true);
            }
        }
    };
    Voting.prototype._postResults = function () {
        var answers = null, current = this.questionSlides[this.currentIndex].parentNode;
        if (!!current) {
            var postURL = current.getAttribute('data-url') || '';
            var container = document.querySelector(this.containerSelector);
            var data = {};
            var self_1 = this;
            var future = this.resultsContainer.classList.contains('voting__widget__results--future');
            this.questionData[this.currentIndex].question.classList.remove('active');
            this.resultsContainer.classList.add('active');
            if (this.type === 'thumbs' || this.type === 'stars') {
                var answers_1 = this._getAllAnswers();
                for (var ansIndex in answers_1) {
                    var aid = answers_1[ansIndex].node.querySelector('.voting__widget__content__answer').getAttribute('id');
                    var aval = answers_1[ansIndex].answer;
                    if (!aid) {
                        console.error('WARNING: Cannot fetch id for answer #' + ansIndex);
                        continue;
                    }
                    if (aval.length > 0) {
                        data[aid] = aval;
                    }
                }
            }
            else {
                var inputData = container.querySelectorAll("input:checked");
                if (!!inputData) {
                    for (var i = 0, len = inputData.length; i < len; i++) {
                        var id = inputData[i].getAttribute('id') || '';
                        var value = inputData[i].value || '';
                        data[String(id)] = escapeHtml(value);
                    }
                }
            }
            if (!!postURL) {
                var ajaxOpts = {
                    url: postURL,
                    method: 'POST',
                    data: data
                };
                if (this.type === 'thumbs' || this.type === 'stars') {
                    ajaxOpts['contentType'] = 'application/json';
                    ajaxOpts['data'] = JSON.stringify(data);
                }
                if (this.debug) {
                    console.log('POSTIG VOTING RESULTS: ', data, 'AJAX OPTIONS: ', ajaxOpts, 'ANSWERS', answers);
                }
                $.ajax(ajaxOpts)
                    .done(function (result) {
                    $(self_1.resultsContainer).find('.voting__widget__results__content__loading__container').remove();
                    self_1._renderResults(result);
                })
                    .fail(function (error) {
                    console.error(error);
                });
            }
        }
    };
    Voting.prototype._showNextSlide = function () {
        var active = this._getActiveQuestion();
        if (active.length) {
            switch (this.type) {
                case 'normal':
                default:
                    this.questionData[this.currentIndex].input = $(active).find('input:checked');
                    this.questionData[this.currentIndex].answer = $(active).find('input:checked').val();
                    this.questionData[this.currentIndex].answer_raw = $(active).find('input:checked').next().html();
                    break;
                case 'stars':
                    var value = $(active).find('input[type="hidden"]').val();
                    this.questionData[this.currentIndex].answer = (!!value) ? value : 0;
                    break;
                case 'thumbs':
                    this.questionData[this.currentIndex].answer = $(active).find('input[type="hidden"]').val();
                    break;
            }
            var button = active.find('.dmh-event');
            if (button.length) {
                button.data('data-dmhevt-lbl', this.questionData[this.currentIndex].headline + ' - ' + this.currentIndex);
            }
            if (this.debug) {
                console.log(this.questionData[this.currentIndex]);
                console.log('CURRENT: ', this.currentIndex);
                console.log('NEXT: ', this.questionData[this.currentIndex + 1]);
                console.log('Answer: ', this.questionData[this.currentIndex].answer);
                console.log('Next: ', this.questionData[this.currentIndex + 1]);
            }
            if (!!this.questionData[this.currentIndex + 1]) {
                this.questionData[this.currentIndex].question.classList.remove('active');
                this.questionData[this.currentIndex + 1].question.classList.add('active');
                this.currentIndex++;
            }
            else {
                this._postResults();
            }
        }
    };
    Voting.prototype._initStars = function () {
        var self = this, stars = this.mainContainer.querySelectorAll('.rating span');
        if (!!stars) {
            for (var i = 0, len = stars.length; i < len; i++) {
                $(stars[i]).on('click', function () {
                    var parent = $(this).parents('.rating');
                    var input = parent.find('input');
                    parent.find('span.active-rating').removeClass('active-rating');
                    var rating = parent.find('span:hover, span:hover ~ span').addClass('active-rating');
                    input.val(rating.length);
                    self._showNextButton();
                });
            }
        }
    };
    Voting.prototype._initThumbs = function () {
        var self = this;
        var thumbs = this.mainContainer.querySelectorAll('.thumbs .icon');
        if (!!thumbs) {
            for (var i = 0, len = thumbs.length; i < len; i++) {
                $(thumbs[i]).on('click', function (event) {
                    event.preventDefault();
                    var input = $(this).parent().parent().find('input');
                    if (input.length) {
                        $(self.mainContainer).find('.icon.active').removeClass('active');
                        input.val((this.classList.contains('icon-thumb-up')) ? '1' : '0');
                        this.classList.add('active');
                        $(thumbs).addClass('voting-thumbs-voted');
                        self._showNextButton();
                    }
                    return false;
                });
            }
        }
    };
    Voting.prototype._checkType = function () {
        if (this.mainContainer.classList.contains('voting__widget--stars')) {
            this.type = 'stars';
            this._initStars();
        }
        else if (this.mainContainer.classList.contains('voting__widget--thumb')) {
            this.type = 'thumbs';
            this._initThumbs();
        }
    };
    return Voting;
}());
var VotingWidgetJamFm = (function (_super) {
    __extends(VotingWidgetJamFm, _super);
    function VotingWidgetJamFm(containerSelector, quizId, resultPostUrl, resultGetUrl, debug) {
        return _super.call(this, {
            debug: debug,
            resultPostUrl: resultPostUrl,
            resultGetUrl: resultGetUrl,
            containerSelector: containerSelector
        }) || this;
    }
    return VotingWidgetJamFm;
}(Voting));
