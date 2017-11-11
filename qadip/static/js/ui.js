if ($.type(language) == 'undefined' || !language) {
    language = navigator.browserLanguage || navigator.language || navigator.userLanguage;
}

var win = window,
    doc = win.document,
    root = doc.documentElement,

    online = navigator.onLine,
    standalone = navigator.standalone,

    pushstart = Modernizr.touch ? "touchstart" : "mousedown",
    pushend = Modernizr.touch ? "touchend" : "mouseup",
    pushenter = Modernizr.touch ? "touchenter" : "mouseenter",
    pushleave = Modernizr.touch ? "touchleave" : "mouseleave",
    pushmove = Modernizr.touch ? "touchmove" : "mousemove",

    i18n = {
        shortMonths: {
            ru: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
            en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            he: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        },
        longMonths: {
            ru: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
            en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            he: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        },
        shortDays: {
            ru: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
            en: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
            he: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
        },
        longDays: {
            ru: ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"],
            en: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Monday"],
            he: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Monday"]
        },
        'datetime-local': {
            ru: 'Дата и Время',
            en: 'Date and Time',
            he: 'Date and Time'
        },
        'datetime': {
            ru: 'Дата и Время',
            en: 'Date and Time',
            he: 'Date and Time'
        },
        'date': {
            ru: 'Дата',
            en: 'Date',
            he: 'Date'
        },
        'month': {
            ru: 'Месяц',
            en: 'Month',
            he: 'Month'
        },
        'week': {
            ru: 'Неделя',
            en: 'Week',
            he: 'Week'
        },
        'time': {
            ru: 'Время',
            en: 'Time',
            he: 'Time'
        },
        'toggle_visibility': {
			ru: 'Переключить видимость',
			en: 'Toggle visibility',
			he: 'Toggle visibility'
		},
        'toggle': {
			ru: 'Переключатель',
			en: 'Toggle',
			he: 'Toggle'
		},
        'search': {
			ru: 'Поиск',
			en: 'Search',
			he: 'Search'
		},
        'no_records': {
			ru: 'Совпадающих записей не найдено',
			en: 'No matching records found',
			he: 'No matching records found'
		},
        'restore_visibility': {
			ru: 'Восстановление видимости',
			en: 'Restore visibility',
			he: 'Restore visibility'
		},
        'all': {
			ru: 'Все',
			en: 'All',
			he: 'All'
		}
    },

    shortMonths = i18n.shortMonths[language],
    longMonths = i18n.longMonths[language],
    shortDays = i18n.shortDays[language],
    longDays = i18n.longDays[language],

    device = new function() {
        this.width = {
            mini: 320,
            tiny: 480,
            small: 640,
            medium: 920,
            large: 1028,
            big: 1280,
            huge: 1400,
            massive: 1604
        };
        this.mini = function() { return $(window).width() <= this.width.mini; };
        this.tiny = function() { return $(window).width() <= this.width.tiny; };
        this.small = function() { return $(window).width() <= this.width.small; };
        this.medium = function() { return $(window).width() <= this.width.medium; };
        this.large = function() { return $(window).width() <= this.width.large; };
        this.big = function() { return $(window).width() <= this.width.big; };
        this.huge = function() { return $(window).width() <= this.width.huge; };
        this.massive = function() { return $(window).width() <= this.width.massive; };

        this.Android = /Android/.test(navigator.userAgent);
        this.BlackBerry = /BlackBerry/.test(navigator.userAgent);
        this.Opera = /Opera Mini/.test(navigator.userAgent);
        this.Windows = /IEMobile/.test(navigator.userAgent);
        this.iOS = /iP(hone|od|ad)/.test(navigator.userAgent);
        this.iOS7 = this.iOS && /OS 7/.test(navigator.appVersion);
        this.iOS8 = this.iOS && /OS 8/.test(navigator.appVersion);
        this.is = function() { return this.Android || this.BlackBerry || this.Opera || this.Windows || this.iOS; };
    },

	text = (function() {
		var tmp_text = {};
		$.each(i18n, function(label, value) {
			tmp_text[label] = value[language];
		});
		return tmp_text;
	})(),

    log = function() {
        console.log(arguments);
    },

    inArray = function(elem, arr) {
        return !!~$.inArray(elem, arr);
    },

    getCSS = function(options) {

        var config = $.extend({}, {
                target: false,
                parent: false,
                position: 'top',
                device: false,
                space: 12,
                scrollSpace: 12
            }, options),
            target_width = config.target.outerWidth(),
            target_height = config.target.outerHeight(),
            scrollTop = -92,
            offset = {};

        if (config.device && device[config.device]()) {

            offset = {
                top: 'auto',
                left: 0,
                right: 0,
                bottom: 0
            };

        } else if (!config.parent || !config.parent.length) {

            var $body = $('body'),
                body_width = $body.outerWidth(),
                body_height = $body.outerHeight();

            offset = {
                top: 0,
                left: 0,
                right: 'auto',
                bottom: 'auto'
            };

            if (inArray(config.position, ['top', 'top-left', 'top-right', 'left-top', 'right-top'])) {
                offset.top = (config.space);
            } else if (inArray(config.position, ['bottom', 'bottom-left', 'bottom-right', 'left-bottom', 'right-bottom'])) {
                offset.top = (body_height - target_height - config.space);
            } else if (inArray(config.position, ['left', 'right'])) {
                offset.top = ((body_height - target_height) / 2);
            }

            if (inArray(config.position, ['left', 'left-top', 'left-bottom', 'top-left', 'bottom-left'])) {
                offset.left = (config.space);
            } else if (inArray(config.position, ['right', 'right-top', 'right-bottom'])) {
                offset.left = (body_width - target_width - config.space);
            } else if (inArray(config.position, ['top', 'bottom'])) {
                offset.left = ((body_width - target_width) / 2);
            }

            if (inArray(config.position, ['center'])) {
                offset.top = ((body_height - target_height) / 2);
                offset.left = ((body_width - target_width) / 2);
            }

        } else {

            var parent_width = config.parent.outerWidth(),
                parent_height = config.parent.outerHeight(),
                parent_offset = config.parent.offset();

            offset = {
                top: parent_offset.top,
                left: parent_offset.left,
                right: 'auto',
                bottom: 'auto'
            };

                 if (inArray(config.position, ['top', 'top-left', 'top-right']))           offset.top -= (target_height + config.space);
            else if (inArray(config.position, ['bottom', 'bottom-left', 'bottom-right']))  offset.top += (parent_height + config.space);
            else if (inArray(config.position, ['left-top', 'right-top']))                  offset.top -= (target_height - parent_height);
            else if (inArray(config.position, ['left', 'right']))                          offset.top -= ((target_height - parent_height) / 2);

                 if (inArray(config.position, ['left', 'left-top', 'left-bottom']))        offset.left -= (target_width + config.space);
            else if (inArray(config.position, ['right', 'right-top', 'right-bottom']))     offset.left += (parent_width + config.space);
            else if (inArray(config.position, ['top-left', 'bottom-left']))                offset.left -= (target_width - parent_width);
            else if (inArray(config.position, ['top', 'bottom']))                          offset.left -= ((target_width - parent_width) / 2);

            if (inArray(config.position, ['center'])) {
                offset.top = ((target_height - parent_height) / 2);
                offset.left = ((target_width - parent_width) / 2)
            }

            if (inArray(config.position, ['top', 'top-left', 'top-right', 'left-top', 'right-top', 'left', 'right'])) {
                scrollTop -= target_height - config.space;
            } else if (inArray(config.position, ['bottom', 'bottom-left', 'bottom-right'])) {
                scrollTop -= config.scrollSpace - parent_offset.top;
            }

        }

        return {
            offset: offset,
            scrollTop: scrollTop
        };
    },
    getTapY = function(event) {
        event = event || window.event;
        return {
            x: (Modernizr.touch ) ?
                (event.originalEvent.changedTouches.length) ?
                    (event.originalEvent.changedTouches[0].pageX) :
                    (event.originalEvent.touches.length) ?
                    (event.originalEvent.touches[0].pageX) :
                    (event.touches[0].pageX) :
                (event.clientX || event.pageX),
            y: (Modernizr.touch ) ?
                (event.originalEvent.changedTouches.length) ?
                    (event.originalEvent.changedTouches[0].pageY) :
                    (event.originalEvent.touches.length) ?
                    (event.originalEvent.touches[0].pageY) :
                    (event.touches[0].pageY) :
                (event.clientY || event.pageY)
        }
    },

    type_of = ['default', 'primary', 'info', 'success', 'warning', 'danger', 'error', 'inverse'],

    getTypeOf = function(element) {

        if (element) $.each(type_of, function() {
            if ($(element).hasClass(this)) return this;
        });

        return '';
    };



/*
 *
 * Prototype Date
 *
 */

Date.prototype.daysInMonth = function(delta) {
    delta = delta === undefined ? 0 : delta;

    return new Date(this.getFullYear(), this.getMonth() + 1 + delta, 0).getDate();
};

Date.prototype.isDay = function(day) {
    if (day === undefined) {
        day = new Date();
    }

    return this.getFullYear() == day.getFullYear()
        && this.getMonth() == day.getMonth()
        && this.getDate() == day.getDate();
};

Date.prototype.isMonth = function(day) {
    if (day === undefined) {
        day = new Date();
    }

    return this.getFullYear() == day.getFullYear()
        && this.getMonth() == day.getMonth();
};

Date.prototype.isValid = function() {
    return Object.prototype.toString.call(this) === "[object Date]" && !isNaN(this.getTime());
};

(function() {

    Date.shortMonths = shortMonths;
    Date.longMonths = longMonths;
    Date.shortDays = shortDays;
    Date.longDays = longDays;

    // defining patterns
    var replaceChars = {
        // Day
        d: function() { return (this.getDate() < 10 ? '0' : '') + this.getDate(); },
        D: function() { return Date.shortDays[(this.getDay() === 0 ? 7 : this.getDay())]; },
        j: function() { return this.getDate(); },
        l: function() { return Date.longDays[(this.getDay() === 0 ? 7 : this.getDay())]; },
        N: function() { return (this.getDay() === 0 ? 7 : this.getDay()); },
        S: function() { return (this.getDate() % 10 == 1 && this.getDate() != 11 ? 'st' : (this.getDate() % 10 == 2 && this.getDate() != 12 ? 'nd' : (this.getDate() % 10 == 3 && this.getDate() != 13 ? 'rd' : 'th'))); },
        w: function() { return this.getDay(); },
        z: function() { var d = new Date(this.getFullYear(),0,1); return Math.ceil((this - d) / 86400000); }, // Fixed now
        // Week
        W: function() {
            var target = new Date(this.valueOf());
            var dayNr = (this.getDay() + 6) % 7;
            target.setDate(target.getDate() - dayNr + 3);
            var firstThursday = target.valueOf();
            target.setMonth(0, 1);
            if (target.getDay() !== 4) {
                target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
            }
            return 1 + Math.ceil((firstThursday - target) / 604800000);
        },
        // Month
        F: function() { return Date.longMonths[this.getMonth()]; },
        m: function() { return (this.getMonth() < 9 ? '0' : '') + (this.getMonth() + 1); },
        M: function() { return Date.shortMonths[this.getMonth()]; },
        n: function() { return this.getMonth() + 1; },
        t: function() { var d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 0).getDate() }, // Fixed now, gets #days of date
        // Year
        L: function() { var year = this.getFullYear(); return (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)); },   // Fixed now
        o: function() { var d  = new Date(this.valueOf());  d.setDate(d.getDate() - ((this.getDay() + 6) % 7) + 3); return d.getFullYear();}, //Fixed now
        Y: function() { return this.getFullYear(); },
        y: function() { return ('' + this.getFullYear()).substr(2); },
        // Time
        a: function() { return this.getHours() < 12 ? 'am' : 'pm'; },
        A: function() { return this.getHours() < 12 ? 'AM' : 'PM'; },
        B: function() { return Math.floor((((this.getUTCHours() + 1) % 24) + this.getUTCMinutes() / 60 + this.getUTCSeconds() / 3600) * 1000 / 24); }, // Fixed now
        g: function() { return this.getHours() % 12 || 12; },
        G: function() { return this.getHours(); },
        h: function() { return ((this.getHours() % 12 || 12) < 10 ? '0' : '') + (this.getHours() % 12 || 12); },
        H: function() { return (this.getHours() < 10 ? '0' : '') + this.getHours(); },
        i: function() { return (this.getMinutes() < 10 ? '0' : '') + this.getMinutes(); },
        s: function() { return (this.getSeconds() < 10 ? '0' : '') + this.getSeconds(); },
        u: function() { var m = this.getMilliseconds(); return (m < 10 ? '00' : (m < 100 ? '0' : '')) + m; },
        // Timezone
        e: function() { return "Not Yet Supported"; },
        I: function() {
            var DST = null;
                for (var i = 0; i < 12; ++i) {
                        var d = new Date(this.getFullYear(), i, 1);
                        var offset = d.getTimezoneOffset();

                        if (DST === null) DST = offset;
                        else if (offset < DST) { DST = offset; break; }                     else if (offset > DST) break;
                }
                return (this.getTimezoneOffset() == DST) | 0;
            },
        O: function() { return (-this.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? '0' : '') + (Math.abs(this.getTimezoneOffset() / 60)) + '00'; },
        P: function() { return (-this.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? '0' : '') + (Math.abs(this.getTimezoneOffset() / 60)) + ':00'; }, // Fixed now
        T: function() { return this.toTimeString().replace(/^.+ \(?([^\)]+)\)?$/, '$1'); },
        Z: function() { return -this.getTimezoneOffset() * 60; },
        // Full Date/Time
        c: function() { return this.format("Y-m-d\\TH:i:sP"); }, // Fixed now
        r: function() { return this.toString(); },
        U: function() { return this.getTime() / 1000; }
    };

    // Simulates PHP's date function
    Date.prototype.format = function(format) {
        var date = this;
        return format.replace(/(\\?)(.)/g, function(_, esc, chr) {
            return (esc === '' && replaceChars[chr]) ? replaceChars[chr].call(date) : chr;
        });
    };
}).call(this);


$(function() {

    var $html = $('html');
    var $body = $('body');
    var $doc = $(document);
    var $win = $(window);

    var hover = 'a, button, label, table tr, table tr th, table tr td, ul, ol, ul li, ol li';

    $doc
        .on(pushstart,	hover, function() { $(this).addClass("tap"); })
        .on(pushend,	hover, function() { $(this).removeClass("tap"); })
        .on(pushenter,	hover, function() { $(this).addClass("hover"); })
        .on(pushleave,	hover, function() { $(this).removeClass("hover tap"); })
    ;

    $('.sidebar .sidebar-dropdown').click(function() {
        var
            $target = $(this).parent(),
            $parent = $target.parents('.sidebar'),
            $side = $parent.hasClass('navbar')?'.navbar':$parent.hasClass('leftbar')?'.leftbar':'.rightbar',
            $sidebar = $($side),
            is_open = $target.hasClass('open')
        ;

        $sidebar.find('li.open').removeClass('open');

        if (!is_open) {
            $target.addClass('open');
            setTimeout(function() {
                $sidebar.animate({scrollTop: $target.position().top + $sidebar.scrollTop()}, 250);
            }, 10);
        }

        return false;
    });

    $(document)
        .on('click', '[data-modal]', function(e) {
            var $modal = $(this).data('modal'),
                $target = $($modal),
                $script = $target.data('script');
            if ($script && $script in win) win[$script]();
                $target.toggleClass('active');
        })
        .on('click', '.modal', function(e) {
            if (e.target == this) {
                var $script = $(this).data('script');
                if ($script && $script in win) win[$script]();
                $(this).removeClass('active');
            }
        });

    $(document)
        .on('click', '[data-loading]', function() {
            $($(this).data('loading')).toggleClass('active');
        })
        .on('click', '.loading-spinner', function(e) {
            if (e.target == this) $(this).parents('.loading').removeClass('active');
        });

    $(document)
        .on('click', '[data-message]', function() {
            $($(this).data('message')).toggleClass('hidden');
        });


    $(document)
        .on('click', '[data-switch]', function() {
            var switches = $(this).data('switch').split('|');
                switches.forEach(function(item) {
                    $(item).toggleClass('hidden');
                });
        });

    $(document)
        .on('click', '[data-audio]', function() {
            if (!$(this).data('audio')) return alert('"data-audio" not found');
            if (!$(this).data('target')) return alert('"data-target" not found');
            var $src = $(this).data('audio'),
                $target = $($(this).data('target')),
                $audio = $target.find('audio');
                $audio.attr('src', $src);
                $target
                    .removeClass('hidden')
                    .css({
                        top: $(win).height() - $target.outerHeight() - 12,
                        left: 12
                    })
                ;
            return false;
        });

    $('.nav-anchor a')
        .on('click', function() {
            var
                selection = $(this).attr('href'),
                top = $(selection).offset().top - 90,
                speed = 150
            ;

            if (selection[0] == '#') {
                $(this)
                    .parent()
                    .addClass('active')
                    .siblings()
                    .removeClass('active')
                ;
                $('body').animate({
                    scrollTop: top
                }, speed, function() {
//                    window.location.hash = selection;
                });
                return false;
            }
            return true;
        })
    ;


    $('.accordion-handle')
        .on('click', function() {
            $(this)
                .parent()
                .toggleClass('active')
                .siblings()
                .removeClass('active')
            ;
        })
    ;

    $(document)
        .on('click', '.oneclick', function() {
            var $this = $(this);
            var spinner_timeout = parseInt($this.data('timeout')) || 0;
            var spinner_class = 'fa fa-spin fa-spinner';
            var $icon = $this.find('.fa');
            $this.addClass('disabled');
            if ($icon.length) {
                var icon_class = $icon.attr('class');
                $icon.attr('class', spinner_class);
                if (spinner_timeout) {
                    setTimeout(function() {
                        $this.removeClass('disabled');
                        $icon.attr('class', icon_class);
                    }, spinner_timeout);
                }
            } else {
                $icon = $('<i/>', {class: spinner_class + ' fa-margin'});
                $this.prepend($icon);
                if (spinner_timeout) {
                    setTimeout(function() {
                        $this.removeClass('disabled');
                        $icon.remove();
                    }, spinner_timeout);
                }
            }
        })
    ;

});

function modalToggle(id) {
    $(id).toggleClass('active');
}


var ui = function() {

    this.stopPropagation = function(e) {
        e = e || window.event;
        e.stopPropagation();
    }
};


/*
 *
 * Fixed Hidden
 *
 */

(function($, undefined) {

    'use strict';

    var html = 'html';
    var target = 'input:not([type=checkbox]):not([type=radio]), textarea, select';

    function show() {
        $(html).removeClass('fixed-hidden');
    }

    function hide() {
        $(html).addClass('fixed-hidden');
    }

    if (Modernizr.touch && device.iOS) {
        $(document)
            .on('focus', target, hide)
            .on('blur', target, show);
    }

})(jQuery);


/*
 *
 * Header
 *
 */

(function($, undefined) {

    'use strict';

    var html = 'html';
    var target = 'input:not([type=checkbox]):not([type=radio]), textarea, select';
    var offset = 0;
    var current_scroll = 0;
    var previous_scroll = 0;
    var delta = 5;
    var scroll_down = false;

    function headerTop() {
        $(html).addClass('scroll-down');
    }

    function headerDown() {
        $(html).removeClass('scroll-down');
    }

    function scroll() {

        current_scroll = $(this).scrollTop();
        scroll_down = current_scroll > previous_scroll;
        offset = Math.abs(current_scroll - previous_scroll);

        if ($('.tour-back-door').length) {
            headerDown();
        } else if (current_scroll >= 48) {
            if (offset >= delta) {
                if (scroll_down) {
                    headerTop();
                } else {
                    headerDown();
                }
            }
        } else {
            headerDown();
        }

        previous_scroll = current_scroll;
    }

    $(window).on('scroll', scroll);

})(jQuery);



/*
 *
 * NavBar
 *
 */

(function($, undefined) {

    'use strict';

    var html = 'html';
    var body = 'body';
    var target = '#header-nav';
    var nav = "#nav";
    var backdoor = '.backdoor';
    var navTimer;

    function show() {
        $('<div class="backdoor"/>').appendTo($(body)).one('click', hide);

        setTimeout(function() {
            $(html).addClass('nav-active');
            $(backdoor).addClass('active');
        }, 1);

        $(document).on('click.navbar', destroy);

        return false;
    }

    function hide() {
        $(html).removeClass('nav-active');
        $(backdoor).removeClass('active');
        setTimeout(function() {
            $(backdoor).remove();
        }, 250);

        $(document).off('.navbar');

        return false;
    }

    function showTimer() {
        clearTimeout(navTimer);
        return false;
    }

    function hideTimer() {
        if ($(html).hasClass('tour-navbar')) return;
        navTimer = setTimeout(hide, 500);
        return false;
    }

    function destroy(e) {
        if ($(html).hasClass('tour-navbar')) return;
        if ($(e.target).parents().andSelf().hasClass('navbar')) return;
        hide();
        return false;
    }

    $(document)
        .on('click', target, show)
        .on('mouseenter', nav, showTimer)
        .on('mouseleave', nav, hideTimer);

})(jQuery);



/*
 *
 * SideBar
 *
 */

(function($, undefined) {

    'use strict';

    var html = 'html';
    var body = 'body';
    var target = '[data-sidebar]';
    var backdoor = '.sidebar-backdoor';

    var $this, $sidebar, sidebar, state, state_onload;

    function toggle() {

        $this = $(this);
        sidebar = $this.data('sidebar');
        $sidebar = $(sidebar);

        state = [sidebar, 'hidden'].join('-');
        state_onload = [sidebar, 'hidden', 'onload'].join('-');

        if ($(html).hasClass(state_onload)) {
            $(html).removeClass(state_onload);
            if (device.medium()) $(html).toggleClass(state);
        } else {
            $(html).toggleClass(state);
        }

        setTimeout(function() {
            $(window).trigger('resize');
        }, 300);

        return false;
    }

    function hide() {
        $(html).removeClass('leftbar-hidden rightbar-hidden leftbar-hidden-onload rightbar-hidden-onload');
    }

    $(document)
        .on('click', target, toggle)
        .on(pushend, backdoor, hide);

})(jQuery);



/*
 *
 * DropDown
 *
 */

(function($, undefined) {

    'use strict';

    var target = '[data-dropdown]';
    var backdoor = '.backdoor';
    var scroll = 0;

    var DropDown = function(element) {

        var $element = $(element);
        var $dropdown = $($element.data('dropdown'));
        var position = $element.data('position') || 'bottom';
        var $target = $element;
        if ($element.data('target')) {
            $target = $($element.data('target'));
        }

        if ($('#header').find($element)) {
            $dropdown.addClass('in-header');
        }   $dropdown.addClass(position);

        this.toggle = function(e) {
            var $this = $(this);
            var isActive = $dropdown.hasClass('active');
                scroll = $(window).scrollTop();

            if ($this.is('.disabled, :disabled')) return;

            clear();

            if (isActive) return;

            if (!$dropdown.hasClass('detach')) {
                $dropdown = $dropdown.detach();
                $dropdown.addClass('detach');
                $dropdown.appendTo('body');
            }

            reposition();

            $('<div class="backdoor"/>').appendTo('body').one('click', destroy);

            setTimeout(function() {
                $dropdown.addClass('active');
                $('.backdoor').addClass('active');
            }, 1);

            return false;
        };

        function reposition() {

            var window_height = $(window).outerHeight();
            var target_height = $dropdown.outerHeight();

            $dropdown.css(getCSS({
                parent: $target,
                target: $dropdown,
                position: position,
                device: 'small'
            }).offset).outerHeight(device.small() ? target_height > window_height ? window_height : 'auto' : 'auto');
        }

        $element.on('click.dropdown', this.toggle);
        $(window).on('resize scroll', reposition);

    };

    function hideBackDoor() {
        $(backdoor).removeClass('active');
        setTimeout(function() {
            $(backdoor).remove();
        }, 250);
    }

    function clear(is_destroy) {

        if (is_destroy) hideBackDoor();

        $(target).each(function() {
            var $this = $(this);
            var dropdown = $this.data('dropdown');
            var isActive = $(dropdown).hasClass('active');

            if (isActive) {
                $(dropdown).removeClass('active');
            }
        });
    }

    function destroy() {

        clear(true);

        if (device.small()) {
            $('html').removeClass('no-scroll');
            $(window).scrollTop(scroll);
        }
    }

    $.fn.dropdown = function(option) {
        return this.each(function () {
            var $this = $(this);
            var data  = $this.data('init.dropdown');

            if (!data) $this.data('init.dropdown', (data = new DropDown(this)));
            if (typeof option == 'string') data[option].call($this);
        });
    };

    $(document).on('click.dropdown', destroy);
    $(target).dropdown();

})(jQuery);




/*
 *
 * Hint
 *
 */

(function($, undefined) {

    'use strict';

    var body = 'body';
    var target = '[data-hint]';
    var triggerStart = Modernizr.touch ? 'touchstart' : 'mouseenter';
    var triggerEnd = Modernizr.touch ? 'touchend' : 'mouseleave';

    $(document)
        .on(triggerStart, target, function() {

            var target = $(this),
                title = target.data('hint'),
                position = target.data('position'),
                type = target.data('type'),
                uid = target.data('uid'),
                hint = $(uid) ;

            if (!hint.length) {
                uid = 'hint' + (Math.random().toString(36).substring(6));
                target.data('uid', '.' + uid);

                hint = $('<div/>', {
                    class: 'hint ' + uid + (type?' '+type:' ') + position,
                    html: title
                }).appendTo(body);
            }

            hint.css(getCSS({
                parent: target,
                target: hint,
                position: position,
                space: 24
            }).offset);

            setTimeout(function() {
                hint.addClass('active');
            }, 1);

            target.one(triggerEnd, function() {
                setTimeout(function() {
                    hint.removeClass('active');
                }, 1);
            });

        })
    ;
})(jQuery);


/*
 *
 * Popup
 *
 */

(function($, undefined) {

    'use strict';

    var body = 'body';
    var target = '[data-popup]';
    var backdoor = '.backdoor';
    var timer;

    function toggle() {
        var $target = $(this),
            header = $target.data('header'),
            content = $target.data('popup'),
            form = $target.data('form'),
            action = $target.data('action'),
            target = $target.data('target'),
            footer = $target.data('footer'),
            position = $target.data('position'),
            type = $target.data('type'),
            uid = $target.data('uid'),
            $popup = $(uid),
            $parent = $(body);

        if (!$popup.length) {
            uid = 'popup' + (Math.random().toString(36).substring(6));
            $target.data('uid', '#' + uid);
            $target.addClass(uid);

			var section = form ? 'form' : 'section';
			$popup = $('<' + section + '/>', {
				'id': uid,
				'class': 'section popup ' + (type?' '+type+' ':'') + (position?position:'top'),
				'html': '',
				'action': action,
				'data-target': target
			});

            if (header) { $popup.append($('<header/>', {html: header})); }
			if (form) { $popup.append(form); }
            if (content) { $popup.append($('<article/>', {html: content})); }
            if (footer) { $popup.append($('<footer/>', {html: footer})); }

            $popup.appendTo($parent);

			window.MaskInput();
        }

        clearTimeout(timer);

        if ($popup.hasClass('active')) {
            hide($popup);
        } else {
            show($target, $popup, $parent);
        }

        return false;
    }

    function show($target, $popup, $parent) {

        reposition($target, $popup);

        if (!$(backdoor).length) {
            $('<div class="backdoor"/>').appendTo($parent).one('click', function() {
                hide();
            });
            setTimeout(function() {
                $(backdoor).addClass('active');
            }, 1);
        }

        setTimeout(function() {
            $popup.addClass('active');
        }, 1);

        setTimeout(function() {
            reposition($target, $popup);
        }, 250);
    }

    function hide($popup) {
        setTimeout(function() {
            var $remove = $popup && $popup.length ? $popup : $('.popup.active');
                $remove.removeClass('active');
        }, 1);
        hideBackDoor();
    }

    function hideBackDoor() {
        $(backdoor).removeClass('active');
        setTimeout(function() {
            $(backdoor).remove();
        }, 250);
    }

    function resize() {
        setTimeout(function() {
            $('.popup.active').each(function() {
                var $target = $('.'+this.id);
                if ($target.length) {
                    reposition($target, $(this));
                }
            });
        }, 250);
    }

    function reposition($target, $popup) {
        $popup.css(getCSS({
            parent: $target,
            target: $popup,
            position: $target.data('position'),
            device: 'small',
            space: 24
        }).offset);
    }

    $(document)
        .on('click', target, toggle)
        .on('wheel', '.table', resize);
    $(window)
        .on('resize', resize);

})(jQuery);



/*
 *
 * Growl
 *
 */

(function($, undefined) {

    'use strict';

    var growl = '#growl';
    var growl_inner = growl + '>ul';
    var items = growl_inner + '>li';
    var tasks = growl_inner + '>li.growl-task';
    var items_active = items + '.active';
    var tasks_active = tasks + '.active';
    var toggle = '#growl-toggle';
    var count = '#growl-count';
    var item = '[data-growl]';

    function init() {
        var sizes = growlItems();
        if (!sizes.items) return;

        renderCount(sizes);
        $(toggle).addClass('active');

        if (sizes.items == sizes.tasks) return;
        growlShow();
        growlResize();
    }

    function growlItems() {
        return {
            items: $(items).size(),
            tasks: $(tasks).size(),
            items_active: $(items_active).size(),
            tasks_active: $(tasks_active).size()
        };
    }

    function growlToggle() {

        if (!growlItems().items) return;
        var is_active = $(growl).hasClass('active');

        if (!is_active) {
            $(tasks_active).removeClass('active');
            $(tasks).addClass('active');
        }   $(growl).toggleClass('active');

        growlResize(is_active);
    }

    function growlShow() {
        $(growl).addClass('active');
    }

    function growlHide() {
        $(growl).removeClass('active');
    }

    function itemRemove() {
        var task_id = $(this).data('growl');
        $(task_id).remove();

        var sizes = growlItems();
        renderCount(sizes);
        growlResize();

        if (sizes.items_active) return;
        growlHide();
    }

    function renderCount(sizes) {
        $(count).attr('class', 'tag').addClass(sizes.tasks ? 'error' : 'info').text(sizes.items);
    }

    function growlResize(is_auto) {
        if (is_auto) {
            $(growl).height('auto');
            return;
        }
        var wh = $(window).outerHeight();
        var gh = $(growl_inner).outerHeight();
        var mh = wh * 0.72;

        $(growl).height(gh > mh ? mh : 'auto');
    }

    $(init);
    $(window).on('resize', growlResize);
    $(document)
        .on('click', toggle, growlToggle)
        .on('click', item, itemRemove);

})(jQuery);


/*
 *
 * Drag
 *
 */

(function($, undefined) {

    'use strict';

    var target = '[data-drag]';
    var space = 38;

    var $this, $target, move;

    function resize() {

        var window_height = $(window).outerHeight();
        var window_width = $(window).outerWidth();

        $(target).each(function() {
            var $draggable = $(this);
            var draggable_move = $draggable.data('drag');
            var $draggable_target = draggable_move ? $(draggable_move) : $draggable;
            var draggable_height = $draggable_target.outerHeight();
            var draggable_width = $draggable_target.outerWidth();
            var draggable_offset = $draggable_target.offset();

            if (draggable_offset.top  +  draggable_height <= space) draggable_offset.top  = 0;
            if (draggable_offset.left +  draggable_width <= space)  draggable_offset.left = -(draggable_width - space);
            if (draggable_offset.top  >= window_height - space)     draggable_offset.top  = window_height - space;
            if (draggable_offset.left >= window_width - space)      draggable_offset.left = window_width - space;

            $draggable_target.offset(draggable_offset);
        });
    }

    function drag(e) {

        var x = Modernizr.touch ? e.originalEvent.touches[0].pageX : e.pageX;
        var y = Modernizr.touch ? e.originalEvent.touches[0].pageY : e.pageY;

        $this = $(this);
        move = $this.data('drag');
        $target = move ? $(move) : $this;

        var drg_h = $target.outerHeight(),
            drg_w = $target.outerWidth(),
            pos_y = $target.offset().top + drg_h - y,
            pos_x = $target.offset().left + drg_w - x,
            top = y + pos_y - drg_h,
            left = x + pos_x - drg_w;

        $target
            .css({
                top: top,
                left: left,
                right: 'auto',
                bottom: 'auto'
            })
        ;

        function moveStart(e) {

            x = Modernizr.touch ? e.originalEvent.touches[0].pageX : e.pageX;
            y = Modernizr.touch ? e.originalEvent.touches[0].pageY : e.pageY;

            top = y + pos_y - drg_h;
            left = x + pos_x - drg_w;

            $target
                .offset({
                    top: top,
                    left: left
                })
            ;
        }

        function moveEnd(e) {
            $(document).off(pushmove, moveStart);
            resize();
        }

        $(document)
            .on(pushmove, moveStart)
            .on(pushend, moveEnd)
        ;

        e.preventDefault();
    }

    $(document).on(pushstart, target, drag);
    $(window).on('resize', resize);

})(jQuery);



/*
 *
 * Tabs
 *
 */

(function($, undefined) {

    'use strict';

    var target = '.nav-tabs a';

    function tab() {
        var tab_selected = $(this).attr('href'),
            parent_selector = $(this).parents('.nav-tabs'),
            target_selector = $(parent_selector).data('tabs'),
            $tabs = $('.tabs'),
            $nav_tabs = $('.nav-tabs');

        if (tab_selected[0] == '#') {

            if ($(target_selector).length) {
                $tabs = $(target_selector);
                $nav_tabs = $('[data-tabs="'+target_selector+'"]');
            }

            $tabs
                .children('.tab')
                .removeClass('active');

            $(tab_selected)
                .addClass('active');

            $nav_tabs
                .children('li')
                .removeClass('active');

            $('[href="'+tab_selected+'"]')
                .parent()
                .addClass('active');

            $.each(window.DT.tables || {}, function() {
                if ($.type(this.a) != 'undefined') this.a.draw();
            });

            return false;
        }
    }

    $(document).on('click', target, tab);

})(jQuery);



/*
 *
 * DateTimePicker
 *
 */

(function($, undefined) {

    'use strict';

    var html = 'html';
    var body = 'body';

    var target  = 'input[type="datetime-local"],'
                + 'input[type="datetime"],'
                + 'input[type="date"],'
                + 'input[type="month"],'
//                + 'input[type="week"],'
                + 'input[type="time"]';

    var picker      = '.picker';
    var backdoor    = '.picker-backdoor';

    var scrollTimer;

    var Calendar = {

        render: function(month) {
            var self = this;
            month = parseInt(month || 0);

            var lastDate = self.date.getDate();
            self.date.setDate(1);
            self.date.setMonth(self.date.getMonth() + month);

            var daysInMonth = self.date.daysInMonth();
            self.date.setDate(daysInMonth < lastDate ? daysInMonth : lastDate);

            if (!self.date.isValid()) { self.date = new Date(); }

            self.renderWrapper(month);

            switch (self.type) {
                case 'time':    self.renderTime();     break;
                case 'date':    self.renderDate();     break;
                case 'month':   self.renderMonth();    break;
                default:        self.renderDateTime(); break;
            }
        },

        renderWrapper: function(step) {

            var self = this;
            if (step) return;

            function renderTime(with_date) {

                function renderSelect(_count, _selected, _id) {

                    var select = '<select id="' + _id + '">';

                    $.each(new Array(_count), function(index) {
                        var text = index < 10 ? '0' + index : index;
                        var selected = _selected == index ? ' selected' : '';

                        select += '<option value="' + index + '" ' + selected + '>' + text + '</option>';
                    });

                    return select += '</select>';
                }

                function renderHours() {
                    var hour = self.date.getMinutes();
                    return renderSelect(24, hour, 'picker-hours');
                }

                function renderMinutes() {
                    var second = self.date.getSeconds();
                    return renderSelect(60, second, 'picker-minutes');
                }

                if (!with_date) {
                    var header  = '<ul>'
                                + '<li class="picker-title"><div id="picker-title">'
                                + (i18n['time'][language])
                                + '</div></li>'
                                + '<li class="picker-button-clear"><button type="button" id="picker-clear"><i class="fa fa-times"></i></button></li>'
                                + '<li class="picker-button-apply"><button type="button" id="picker-apply"><i class="fa fa-check"></i></button></li>'
                                + '</ul>';

                    $('#picker-header').html(header);
                }

                var hours = renderHours();
                var minutes = renderMinutes();

                var time    = '<ul>'
                            + '<li class="picker-button"><button type="button" class="picker-step-hour" value="-1"><i class="fa fa-angle-left"></i></button></li>'
                            + '<li class="picker-hours">' + hours + '</li>'
                            + '<li class="picker-button"><button type="button" class="picker-step-hour" value="1"><i class="fa fa-angle-right"></i></button></li>'
                            + '<li class="picker-button"><button type="button" class="picker-step-minute" value="-1"><i class="fa fa-angle-left"></i></button></li>'
                            + '<li class="picker-minutes">' + minutes + '</li>'
                            + '<li class="picker-button"><button type="button" class="picker-step-minute" value="1"><i class="fa fa-angle-right"></i></button></li>'
                            + '</ul>';

				if (with_date) {
					time = '<div class="picker-title-time">' + i18n['time'][language] + '</div>' + time;
				}

                $('#picker-section-time').html(time);
            }

            function renderDate() {
                var header  = '<ul>'
                            + '<li class="picker-button"><button type="button" class="picker-step" value="-1"><i class="fa fa-angle-left"></i></button></li>'
                            + '<li class="picker-title-month"><div id="picker-title-month">Month</div></li>'
                            + '<li class="picker-button"><button type="button" class="picker-step" value="1"><i class="fa fa-angle-right"></i></button></li>'
                            + '<li class="picker-button"><button type="button" class="picker-step" value="-12"><i class="fa fa-angle-left"></i></button></li>'
                            + '<li class="picker-title-year"><div id="picker-title-year">Year</div></li>'
                            + '<li class="picker-button"><button type="button" class="picker-step" value="12"><i class="fa fa-angle-right"></i></button></li>'
                            + '</ul>';

                var week = '<ul>';
                    $.each(shortDays, function() {
                        week += '<li>'+this+'</li>';
                    });
                    week += '</ul>';

                $('#picker-header').html(header);
                $('#picker-section-days').html(week);
            }

            function renderMonth() {
                var header  = '<ul>'
                            + '<li class="picker-button"><button type="button" class="picker-step" value="-12"><i class="fa fa-angle-left"></i></button></li>'
                            + '<li class="picker-title-year-only"><div id="picker-title-year">Year</div></li>'
                            + '<li class="picker-button"><button type="button" class="picker-step" value="12"><i class="fa fa-angle-right"></i></button></li>'
                            + '</ul>';

                $('#picker-header').html(header);
            }

            function renderDateTime() {
                renderTime(true);
                renderDate();
            }

            var wrapper = '<div class="picker-header" id="picker-header"></div>';

            switch (self.type) {
                case 'time':
                    wrapper += '<div class="picker-section picker-section-time" id="picker-section-time"></div>';
                    break;
                case 'date':
                    wrapper += '<div class="picker-section picker-section-days" id="picker-section-days"></div>';
                    wrapper += '<div class="picker-section picker-section-dates" id="picker-section-dates"></div>';
                    break;
                case 'month':
                    wrapper += '<div class="picker-section picker-section-months" id="picker-section-months"></div>';
                    break;
                default:
                    wrapper += '<div class="picker-section picker-section-days" id="picker-section-days"></div>';
                    wrapper += '<div class="picker-section picker-section-dates" id="picker-section-dates"></div>';
                    wrapper += '<div class="picker-section picker-section-time" id="picker-section-time"></div>';
                    break;
            }

            self.$picker.html(wrapper);
            self.$picker.addClass('picker-calendar');

            switch (self.type) {
                case 'time':    renderTime();       break;
                case 'date':    renderDate();       break;
                case 'month':   renderMonth();      break;
                default:        renderDateTime();   break;
            }
        },

        renderTime: function() {

            var self = this;
            var currentHour = parseInt(self.date.getHours());
            var currentMinute = parseInt(self.date.getMinutes());

            $('#picker-hours').children('option').eq(currentHour).prop('selected', true);
            $('#picker-minutes').children('option').eq(currentMinute).prop('selected', true);
        },

        renderDate: function() {

            var self = this;

            function renderMonth(date) {

                function buttonDate(date, _day, _step) {

                    var _date = new Date(date.getFullYear(), date.getMonth() + _step, _day, 0, 0, 0);
                    var _value = _date.getDate();
                    var _selectDate = self.getParseValue();
                    var _classes = [];

                    if (_selectDate.isValid())
                    if (_date.isDay(_selectDate))   { _classes.push('picker-selected'); }
                    if (_date.isDay())              { _classes.push('picker-today'); }
                    if (_step < 0)                  { _classes.push('picker-prev'); }
                    if (_step > 0)                  { _classes.push('picker-next'); }
                    if (_step)                      { _classes.push('picker-step'); }
                    else                            { _classes.push('picker-choice-date'); }

                    _classes = _classes.join(' ');

                    if (_step) { _value = _step; }

                    return '<button type="button" id="picker-date-' +_value+ '" class="'+_classes+'" value="'+_value+'">'+_day+'</'+'button>';
                }

                var $button, rows, row, col, i;

                var monthStart = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0),
                    numPrevDays = parseInt(monthStart.format('N')) - 1,
                    numCurrentDays = date.daysInMonth(),
                    numNextDays = 42 - numPrevDays - numCurrentDays,
                    monthPrev = new Date(date.getFullYear(), date.getMonth(), 0, 0, 0, 0),
                    days = [];

                // Add previous month's days
                for(i = 1; i <= numPrevDays; i++) {
                    $button = buttonDate(date, (monthPrev.getDate() - numPrevDays) + i, -1);
                    days.push($button);
                }

                // Add current month's days
                for(i = 1; i <= numCurrentDays; i++) {
                    $button = buttonDate(date, i, 0);
                    days.push($button);
                }

                // Add next month's days
                for(i = 1; i <= numNextDays; i++) {
                    $button = buttonDate(date, i, 1);
                    days.push($button);
                }

                rows = [
                    days.slice(0, 7),
                    days.slice(7, 14),
                    days.slice(14, 21),
                    days.slice(21, 28),
                    days.slice(28, 35),
                    days.slice(35)
                ];

                var result = '';
                for (row = 0; row < 6; row++) {
                    result += '<ul>';
                    for (col = 0; col < 7; col++) {
                        result += '<li>' + rows[row][col] + '</li>';
                    }
                    result += '</ul>';
                }
                return result;
            }

            var currentMonth = renderMonth(self.date);

            $('#picker-title-month').html(self.date.format('F'));
            $('#picker-title-year').html(self.date.format('Y'));
            $('#picker-section-dates').html(currentMonth);
        },

        renderMonth: function() {

            var self = this;

            function renderYear(date) {

                function buttonMonth(date, _month_index, _month) {

                    var _date = new Date(date.getFullYear(), _month_index, 1, 0, 0, 0);
                    var _selectDate = self.getParseValue();
                    var _classes = [];

                    if (_selectDate.isValid())
                    if (_date.isMonth(_selectDate))   { _classes.push('picker-selected'); }
                    if (_date.isMonth())              { _classes.push('picker-today'); }

                    _classes.push('picker-choice-month');
                    _classes = _classes.join(' ');

                    return '<button type="button" class="'+_classes+'" value="'+_month_index+'">'+_month+'</'+'button>';
                }

                var rows = [
                    longMonths.slice(0, 3),
                    longMonths.slice(3, 6),
                    longMonths.slice(6, 9),
                    longMonths.slice(9)
                ], row, col, button, i = 0;

                var result = '';
                for (row = 0; row < 4; row++) {
                    result += '<ul>';
                    for (col = 0; col < 3; col++) {
                        button = buttonMonth(date, i++, rows[row][col]);
                        result += '<li>' + button + '</li>';
                    }
                    result += '</ul>';
                }
                return result;
            }

            var currentYear = renderYear(self.date);

            $('#picker-title-year').html(self.date.format('Y'));
            $('#picker-section-months').html(currentYear);
        },

        renderDateTime: function() {
            var self = this;
                self.renderDate();
                self.renderTime();
        },

        action: function() {
            var self = this;

            function setMonth() {
                self.render($(this).val());
                return false;
            }

            function setHour(hour) {
                self.date.setHours(hour);
                self.$input.val(self.date.format(self.format.pattern));

                var date = self.date.getDate();

                $('#picker-hours')
                    .children('option').prop('selected', false)
                              .eq(hour).prop('selected', true);

                $('.picker-selected').removeClass('picker-selected');
                $('#picker-date-' + date).addClass('picker-selected');

                return false;
            }

            function stepHour() {
                var step = parseInt($(this).val() || 0);
                var currentHour = self.date.getHours() + step;
                return setHour(currentHour);
            }

            function changeHour() {
                var currentHour = parseInt($(this).val() || 0);
                return setHour(currentHour);
            }

            function setMinute(minute) {
                self.date.setMinutes(minute);
                self.$input.val(self.date.format(self.format.pattern));

                var date = self.date.getDate();
                var hour = self.date.getHours();

                $('#picker-minutes')
                    .children('option').prop('selected', false)
                            .eq(minute).prop('selected', true);

                $('#picker-hours')
                    .children('option').prop('selected', false)
                              .eq(hour).prop('selected', true);

                $('.picker-selected').removeClass('picker-selected');
                $('#picker-date-' + date).addClass('picker-selected');

                return false;
            }

            function stepMinute() {
                var step = parseInt($(this).val() || 0);
                var currentMinute = self.date.getMinutes() + step;
                return setMinute(currentMinute);
            }

            function changeMinute() {
                var currentMinute = parseInt($(this).val() || 0);
                return setMinute(currentMinute);
            }

            function choiceDate() {
                var value = $(this).val();
                self.date.setDate(value);

                return self.setValue();
            }

            function choiceMonth() {
                var value = $(this).val();
                self.date.setMonth(value);

                return self.setValue();
            }

            self.$picker
                .on('click', '.picker-step', setMonth)
                .on('click', '.picker-step-hour', stepHour)
                .on('click', '.picker-step-minute', stepMinute)
                .on('change', '#picker-hours', changeHour)
                .on('change', '#picker-minutes', changeMinute)
                .on('click', '.picker-choice-date', choiceDate)
                .on('click', '.picker-choice-month', choiceMonth);
        },

        setValue: function() {
            var self = this;
            var value = self.date.format(self.format.pattern);

            self.$input.val(value);
            self.hide();

            return false;
        }
    };

    var Wheel = {
        render: function() {

            var self = this;

            function renderYears() {
                var current = self.date.getFullYear();
                var max = current + 100;
                var min = current - 100;
                var currentTop = -(current - min - 2) * 36;
                var i, result = '';

                result += '<div class="picker-scroll picker-scroll-years" data-set="setFullYear">';
                result += '<div class="picker-scroll-inner" style="top: ' + currentTop + 'px">';
                for (i = min; i <= max; i++) {
                    result += '<button type="button" class="picker-year" value="' + i + '">' + i + '</button>';
                }
                result += '</div>';
                result += '</div>';

                $('#picker-section-scroll').append(result);
            }

            function renderMonths() {
                var current = self.date.getMonth();
                var currentTop = -(current - 2) * 36;
                var result = '';

                result += '<div class="picker-scroll picker-scroll-months" data-set="setMonth">';
                result += '<div class="picker-scroll-inner" style="top: ' + currentTop + 'px">';
                $.each(inArray(self.type, ['datetime-local', 'datetime'])?shortMonths:longMonths, function(index) {
                    result += '<button type="button" class="picker-month" value="' + index + '">' + this + '</button>';
                });
                result += '</div>';
                result += '</div>';

                $('#picker-section-scroll').append(result);
            }

            function renderDays() {
                var current = self.date.getDate();
                var daysInMonth = self.date.daysInMonth();
                var max = 31;
                var min = 1;
                var currentTop = -(current - 3) * 36;
                var i, disabled, result = '';

                result += '<div class="picker-scroll picker-scroll-days" data-set="setDate">';
                result += '<div class="picker-scroll-inner" style="top: ' + currentTop + 'px">';
                for (i = min; i <= max; i++) {
                    disabled = daysInMonth > i ? ' disabled' : '';
                    result += '<button type="button" class="picker-day" value="' + i + '"' + disabled + '>' + i + '</button>';
                }
                result += '</div>';
                result += '</div>';

                $('#picker-section-scroll').append(result);
            }

            function renderHours() {
                var current = self.date.getHours();
                var max = 23;
                var min = 0;
                var currentTop = -(current - 2) * 36;
                var i, result = '';

                result += '<div class="picker-scroll picker-scroll-hours" data-set="setHours">';
                result += '<div class="picker-scroll-inner" style="top: ' + currentTop + 'px">';
                for (i = min; i <= max; i++) {
                    result += '<button type="button" class="picker-hour" value="' + i + '">' + (i<10?'0'+i:i) + '</button>';
                }
                result += '</div>';
                result += '</div>';

                $('#picker-section-scroll').append(result);
            }

            function renderMinutes() {
                var current = self.date.getMinutes();
                var max = 59;
                var min = 0;
                var currentTop = -(current - 2) * 36;
                var i, result = '';

                result += '<div class="picker-scroll picker-scroll-minutes" data-set="setMinutes">';
                result += '<div class="picker-scroll-inner" style="top: ' + currentTop + 'px">';
                for (i = min; i <= max; i++) {
                    result += '<button type="button" class="picker-minute" value="' + i + '">' + (i<10?'0'+i:i) + '</button>';
                }
                result += '</div>';
                result += '</div>';

                $('#picker-section-scroll').append(result);
            }

            function renderTime() {
                renderHours();
                renderMinutes();
            }

            function renderDate() {
                renderDays();
                renderMonths();
                renderYears();
            }

            function renderMonth() {
                renderMonths();
                renderYears();
            }

            function renderDateTime() {
                renderDate();
                renderTime();
            }

            var wrapper = '<div class="picker-header" id="picker-header"></div>'
                        + '<div class="picker-section picker-section-scroll" id="picker-section-scroll"></div>';

            var header  = '<ul>'
                        + '<li class="picker-title"><div id="picker-title">'
                        + (i18n[self.type][language])
                        + '</div></li>'
                        + '<li class="picker-button-clear"><button type="button" id="picker-clear"><i class="fa fa-times"></i></button></li>'
                        + '<li class="picker-button-apply"><button type="button" id="picker-apply"><i class="fa fa-check"></i></button></li>'
                        + '</ul>';

            self.$picker.html(wrapper);
            self.$picker.addClass('picker-wheel');

            $('#picker-header').html(header);

            switch (self.type) {
                case 'time':    renderTime();       break;
                case 'date':    renderDate();       break;
                case 'month':   renderMonth();      break;
                default:        renderDateTime();   break;
            }
        },

        action: function() {
            var self = this;

            self.$picker
                .on('touchstart', '.picker-scroll', function(e) {
                    self.scrollStart.call(self, this, e);
                });
        },

        scrollStart: function(element, e) {

            var self = this;

            e.preventDefault();
            e.stopPropagation();

            var $target = $(element),
                $scroll = $target.children(),
                $item = $scroll.children(),

                bodyHeight = $(body).outerHeight(),
                targetHeight = $target.outerHeight(),
                targetScrollY = $target.offset().top,

                itemHeight = $item.outerHeight(),
                itemCount = $item.size(),

                scrollMin = itemHeight * 2,
                scrollMax = itemHeight * (3 - itemCount),

                startTapY = getTapY(e).y,
                startTapTime = e.timeStamp,
                startScrollY = $scroll.position().top,

                scrollTimeOut = 240,
                scrollDurationMax = 2400,
                scrollDurationMin = 160,
                scrollFriction = 1200,
                isScroll = false;

            $scroll.stop();

            function scrollMove(e) {

                isScroll = true;

                var currentTapY = getTapY(e).y;
                var scrollDelta = currentTapY - startTapY;
                var currentScrollY = $scroll.position().top + scrollDelta;

                $scroll.css({top: currentScrollY});
                startTapY = currentTapY;

                if (e.timeStamp - startTapTime > 80) {
                    startScrollY = currentScrollY;
                    startTapTime = e.timeStamp;
                }

                if (currentTapY < 0 || currentTapY > bodyHeight) { $(document).trigger('touchend'); }
            }

            function scrollEnd(e) {

                $(document)
                    .off('touchmove', scrollMove)
                    .off('touchend touchcancel', scrollEnd);

                var currentTapY = getTapY(e).y;
                var currentScrollY = $scroll.position().top;
                var currentTapInterval = e.timeStamp - startTapTime;

                var scrollDelta, scrollDistance, scrollDuration;

                if (!isScroll) {

                    scrollDelta = currentTapY - targetScrollY;
                    scrollDistance = itemHeight * (3 - Math.ceil(scrollDelta / itemHeight));

                    currentScrollY += scrollDistance;

                    if (currentScrollY > scrollMin || currentScrollY < scrollMax) {
                        currentScrollY = (currentScrollY > scrollMin) ? scrollMin : scrollMax;
                    } else {
                        currentScrollY = Math.round(currentScrollY / itemHeight) * itemHeight;
                    }

                    scrollTo(currentScrollY, 300);
                    return;
                }

                if (currentScrollY > scrollMin || currentScrollY < scrollMax) {
                    currentScrollY = (currentScrollY > scrollMin) ? scrollMin : scrollMax;
                    scrollTo(currentScrollY);
                    return;
                }

                if (currentTapInterval < 1 || currentTapInterval > scrollTimeOut) {
                    currentScrollY = Math.round(currentScrollY / itemHeight) * itemHeight;
                    scrollTo(currentScrollY);
                    return;
                }

                scrollDelta = currentScrollY - startScrollY;
                scrollDistance = (scrollDelta / currentTapInterval) * scrollFriction;
                scrollDuration = (!scrollDistance) ? scrollDurationMin : scrollDurationMax;

                if (Math.abs(scrollDistance) < targetHeight) { scrollDuration /= 4; }
                if (Math.abs(scrollDistance) < scrollMax / 4) { scrollDuration /= 4; }
                if (Math.abs(scrollDistance) < scrollMax / 3) { scrollDuration /= 3; }
                if (Math.abs(scrollDistance) < scrollMax / 2) { scrollDuration /= 2; }
                if (scrollDuration < scrollDurationMin) scrollDuration = scrollDurationMin;
                if (scrollDuration > scrollDurationMax) scrollDuration = scrollDurationMax;

                currentScrollY += scrollDistance;

                if (currentScrollY > scrollMin || currentScrollY < scrollMax) {
                    currentScrollY = (currentScrollY > scrollMin) ? scrollMin : scrollMax;
                } else {
                    currentScrollY = Math.round(currentScrollY / itemHeight) * itemHeight;
                }

                scrollTo(currentScrollY, scrollDuration);
            }

            function scrollTo(scrollY, scrollDuration) {

                scrollDuration = scrollDuration || 100;
                $scroll.animate({top: scrollY}, scrollDuration, 'easeOutQuint', function() {
                    var currentIndex = Math.ceil(Math.abs((scrollY - (itemHeight * 2)) / itemHeight));
                    var currentValue = $item.eq(currentIndex).val();

                    var date = self.date || new Date();
                        date[$target.data('set')](currentValue);

                    setValue(date);
                });
            }

            function setValue(date) {

                var now = new Date();

                date = date || now;
                if (!date.isValid()) { date = now; }

                self.date = date;
                self.$input.val(date.format(self.format.pattern));
            }

            $(document)
                .on('touchmove', scrollMove)
                .on('touchend touchcancel', scrollEnd);
        }
    };

    var DateTimePicker = function(input) {

        var self = this;

        self.$input = $(input);
        self.$leftbar = $('.sidebar.leftbar');
        self.$rightbar = $('.sidebar.rightbar');

        self.id = 'picker-' + self.$input.attr('id');
        self.type = self.$input.attr('type');
        self.min = self.$input.data('min');
        self.max = self.$input.data('max');

        self.$picker = $('<div/>', {
            class: 'picker picker-' + self.type,
            id: self.id
        });
        self.$target = $('#' + self.id);
        self.$container = $('<div/>', {
            class: 'container'
        });
        self.$header = $('<header/>');

        self.$button = $('<button/>', {
            class: 'field-icon-after',
            type: 'button',
            value: '#' + self.id,
            html: $('<i/>', {
                class: (self.type == 'time') ? 'fa fa-clock-o' : 'fa fa-calendar'
            })
        });

        self.formats = {
            'datetime-local':   { pattern: 'Y-m-d H:i', mask: '9999-99-99 99:99' },
            'datetime':         { pattern: 'Y-m-d H:i', mask: '9999-99-99 99:99' },
            'date':             { pattern: 'Y-m-d',     mask: '9999-99-99' },
            'month':            { pattern: 'Y-m',       mask: '9999-99' },
            'week':             { pattern: 'Y-W',       mask: '9999-99' },
            'time':             { pattern: 'H:i',       mask: '99:99' }
        };
        self.format = self.formats[self.type];

        self.date = new Date();

        self.disabled = function(selector, toggle) {
            toggle = toggle || false;
            $(selector).attr('disabled', toggle);
        };

        self.position = function() {
            self.$picker.css(getCSS({
                parent: self.$button,
                target: self.$picker,
                position: 'bottom-left',
                device: 'small',
                space: 6
            }).offset);
        };

        self.apply = function() {
            self.hide();
        };

        self.clear = function() {
            self.$input.val('');
            self.hide();
        };

        self.destroy = function(e) {
            if (!self.$picker.find(e.target).length) {
                self.hide();
            }
        };

        self.getParseValue = function() {

            var now = new Date(),
                parse = self.$input.val();

            if (!parse) { return now; }

            if (inArray(self.type, ['time'])) {
                parse = [now.format('Y/m/d'), parse].join(' ');
            } else if (inArray(self.type, ['datetime', 'datetime-local'])) {
                parse = parse.replace(/-/g, '/');
            }

            var date = new Date(parse);
            if (date.isValid()) { return date; }

            return now;
        };

        self.toggle = function() {
            var $target = $(self.$button.val());
            return self[$target.length ? 'hide' : 'show'].call(this);
        };

        self.show = function() {
            self.hideAll();

            self.date = self.getParseValue();

            self.$input.val(self.date.format(self.format.pattern));

            $('<div/>')
                .addClass('picker-backdoor')
                .appendTo('body')
                .one('click', self.hide);

            self.$picker.appendTo(body);

            if (device.small()) {
                self.$picker.css('bottom', '-100%');
            }

            self.render();
            self.position();

            self.$picker.addClass('active');
            $(backdoor).addClass('active');

            $(document)
                .on('click', self.destroy);
            $(window)
                .on('resize', self.position)
                .on('scroll', self.position);
            self.$leftbar
                .on('scroll', self.position);
            self.$rightbar
                .on('scroll', self.position);
            self.$picker
                .on('click', '#picker-apply', self.apply)
                .on('click', '#picker-clear', self.clear);

            self.action();

            return false;
        };

        self.hide = function() {

            if (device.small()) {
                $(picker).css('bottom', '-100%');
            }

            $(picker).removeClass('active');
            $(backdoor).removeClass('active');

            scrollTimer = setTimeout(function() {
                self.hideAll();
            }, 250);
        };

        self.hideAll = function() {
            $(document)
                .off('click', self.destroy);
            $(window)
                .off('resize', self.position)
                .off('scroll', self.position);
            self.$leftbar
                .off('scroll', self.position);
            self.$rightbar
                .off('scroll', self.position);

            clearTimeout(scrollTimer);

            $(picker).remove();
            $(backdoor).remove();

        };

        self.$input
            .attr('type', 'text')
            .mask(self.format.mask)
            .before(self.$button);

        self.$button
            .on('click', self.toggle);

        return self;
    };

    $(function() {
        $(target).each(function() {
            var $this = $(this);
            var type = $this.attr('type');
            var types = Modernizr.inputtypes;

            // datetime hack
            if (type == 'datetime' && !types[type]) {
                type = 'datetime-local';
                $this.attr('type', type);
            }

            if (!Modernizr.touch || !types[type]) {
                    DateTimePicker.prototype = Modernizr.touch ? Wheel : Calendar;
                    DateTimePicker.prototype.constructor = DateTimePicker;
                new DateTimePicker(this);
            }
        });
    });

})(jQuery);



/*
 *
 * Web Tour
 *
 */

(function ($, undefined) {

    'use strict';

    var $body = $('body');
    var $html = $('html');
    var $tourPlayAgain = $('#tour-play');

    var tourTimer;
    var resizeTimer;
    var text_default = {
        ru: { prev: 'Назад', next: 'Далее', skip: 'Пропустить', done: 'Готово', help: 'Помощь' },
        en: { prev: 'Prev',  next: 'Next',  skip: 'Skip',       done: 'Done',   help: 'Help' }
    };
    var text = text_default[language];
    var defaults = {
        steps: [],
        autoplay: true,
        key_switch: true,
        skip_onclick_escape: false,
        completed: false,
        play_again: false
    };
    var step = new function() {
        return {
            selector: false,
            message_ru: '',
            message_en: '',
            position: 'bottom',
            duration: 0,
            is_backdoor: false,
            backdoor_skip_onclick: false,
            is_prev: false,
            prev_index: '',
            is_next: false,
            next_action: '',
            disabled_action: false
        };
    };

    $.tours = function(tours) {

        if (!tours) return false;

        function init(tour_id, tour_current) {

            var $tour = $('<div/>', { class: 'tour' });

            var currentIndex = 0;
            var $selector;
            var tour = $.extend({}, defaults, tour_current);
            var steps = tour.steps;
            var stepCurrent = {};

            function start() {

                currentIndex = 0;
                $selector = undefined;

                if (!steps.length) {
                    return alert('Steps are not exists');
                }

                $html.css('overflow-y', 'hidden');

                $tourPlayAgain.removeClass('active');
                $body.append($tour);

                $(window)
                    .on('resize.tour', function() {
                        if (device.medium() && Modernizr.touch) {
                            clearTimeout(resizeTimer);
                            resizeTimer = setTimeout(position, 300);
                        } else {
                            destroy();
                        }
                    });

                renderStep();
            }

            function renderStep() {

                clearTimeout(tourTimer);

                    currentIndex = parseInt(currentIndex);
                if (currentIndex < 0) currentIndex = 0;
                if (currentIndex > (steps.length - 1)) currentIndex = steps.length - 1;

                stepCurrent = $.extend(true, step, steps[currentIndex]);

                var $htmlBackDoor = '<div class="tour-back-door tour-back-door-top"></div>'
                                  + '<div class="tour-back-door tour-back-door-bottom"></div>'
                                  + '<div class="tour-back-door tour-back-door-left"></div>'
                                  + '<div class="tour-back-door tour-back-door-right"></div>';

                var $tourFooter = $('<footer/>', { class: 'btn-group tiny' });

                var message = stepCurrent.messages[language];
                var $tourMessage = $('<section/>', { html: message });

                var prev = steps[currentIndex - 1];
                var next = steps[currentIndex + 1];

                if ($selector && $selector.length) {
                    $selector.off('.tour');
                }   $selector = $(stepCurrent.selector);

                if (!$('.tour-back-door').length) {
                    $body.append($htmlBackDoor);
                }

                $('.tour-back-door').off('.tour');

                if (stepCurrent.is_backdoor || device.small()) {
                    setTimeout(function() { $('.tour-back-door').css('z-index', 1200);  }, 1);
                    setTimeout(function() { $('.tour-back-door').addClass('active');    }, 1);
                    if (stepCurrent.backdoor_skip_onclick) {
                        $('.tour-back-door').one('click.tour', destroy);
                    }
                } else {
                    setTimeout(function() { $('.tour-back-door').css('z-index', -1);    }, 250);
                    setTimeout(function() { $('.tour-back-door').removeClass('active'); }, 1);
                }

                if ($selector.length && !stepCurrent.is_next && stepCurrent.next_action) {
                    $selector.one(stepCurrent.next_action + '.tour', function() {
                        nextStep();
                        if (stepCurrent.disabled_action) {
                            return false;
                        }
                    });
                }

                navbar_hack();

                tourTimer = setTimeout(function() {

                    if (next != undefined) {
                        $tourFooter.append($('<button/>', {
                            class: 'btn tiny right tour-destroy',
                            text: text.skip
                        }));
                    } else {
                        $tourFooter.append($('<button/>', {
                            class: 'btn tiny right primary tour-destroy',
                            text: text.done
                        }));
                    }
                    if (stepCurrent.is_prev && prev != undefined) {
                        $tourFooter.append($('<button/>', {
                            class: 'btn tiny info tour-prev',
                            text: text.prev,
                            value: stepCurrent.prev_index
                        }));
                    }
                    if (stepCurrent.is_next && next != undefined) {
                        $tourFooter.append($('<button/>', {
                            class: 'btn tiny info tour-next',
                            text: text.next
                        }));
                    }

                    $tour.html('');
                    $tour.attr('class', 'tour ' + stepCurrent.position);
                    $tour[$selector.length ? 'addClass' : 'removeClass']('tour-selector');
                    $tour.append($tourMessage);
                    $tour.append($tourFooter);

                    position();

                }, stepCurrent.duration);

            }

            function position() {

                setTimeout(navbar_hack, stepCurrent.duration);

                var tourCSS = getCSS({
                    parent: $selector,
                    target: $tour,
                    position: stepCurrent.position,
                    device: 'small',
                    space: 12,
                    scrollSpace: 12
                });

                var window_height = $(window).height();
                var window_width = $(window).width();
                var selector_height = 0;
                var selector_width = 0;
                var selector_top = 0;
                var selector_left = 0;

                if ($selector.length) {
                    selector_height = $selector.outerHeight();
                    selector_width = $selector.outerWidth();
                    selector_top = $selector.offset().top;
                    selector_left = $selector.offset().left;
                }

                tourCSS.scrollTop = selector_top - (window_height / 2);

                $('html, body').animate({scrollTop: tourCSS.scrollTop}, 150, function() {

                    var outline = 2;
                    var window_top = $(window).scrollTop();

                    if ($selector.length) {
                        selector_top = $selector.offset().top;
                        selector_left = $selector.offset().left;
                    }

                    $('.tour-back-door-top').css({
                        bottom: window_height - (selector_top - window_top) + outline
                    });
                    $('.tour-back-door-bottom').css({
                        top: selector_height + (selector_top - window_top) + outline
                    });
                    $('.tour-back-door-left').css({
                        top: selector_top - window_top - outline,
                        bottom: window_height - (selector_top - window_top) - selector_height - outline,
                        right: window_width - selector_left + outline
                    });
                    $('.tour-back-door-right').css({
                        top: selector_top - window_top - outline,
                        bottom: window_height - (selector_top - window_top) - selector_height - outline,
                        left: selector_width + selector_left + outline
                    });

                    $tour.css(tourCSS.offset);
                    $tour.addClass('active');

                });
            }

            function prevStep() {
                var index = $(this).val();
                currentIndex = (index === '') ? (currentIndex - 1) : parseInt(index);
                renderStep();
            }

            function nextStep() {
                currentIndex += 1;
                renderStep();
                if (currentIndex >= steps.length - 1) {
                    complete();
                }
            }

            function destroy() {

                clearTimeout(tourTimer);
                complete();

                $('.tour').removeClass('active');
                $('.tour-back-door').removeClass('active');
                setTimeout(function() {
                    $('.tour').remove();
                    $('.tour-back-door').remove();
                }, 250);

                if (tour.play_again) {
                    $tourPlayAgain.addClass('active');
                }

                // hack for menu and sidebars
                $html.removeClass('tour-navbar nav-active');
                if (device.small()) {
                    $html.removeClass('leftbar-hidden rightbar-hidden');
                }
                $html.css('overflow-y', 'auto');

                $(window).off('.tour');
                $selector.off('.tour');
            }

            function complete() {
                if (!'completed' in tour || !tour.completed) {
                    $.post(window['tour_url'], {id: tour_id}, function(response) {
                        if (response.error) return alert(response.message);
                        tour['completed'] = true;
                    }, 'json');
                }
            }

            function navbar_hack() {
                // hack for menu and sidebars
                $html.removeClass('tour-navbar nav-active');
                if (device.medium()) {
                    $html.removeClass('leftbar-hidden rightbar-hidden');
                }
                if ($selector.length) {
                    var $sidebar = $selector.closest('.sidebar');
                    if ($sidebar.length) {
                        if ($sidebar.hasClass('navbar')) {
                            $html.addClass('tour-navbar nav-active');
                        } else if ($sidebar.hasClass('leftbar')) {
                            $html[device.medium() ? 'addClass' : 'removeClass']('leftbar-hidden');
                        } else if ($sidebar.hasClass('rightbar')) {
                            $html[device.medium() ? 'addClass' : 'removeClass']('rightbar-hidden');
                        }
                    }
                }
            }

            start();

            $(document)
                .on('click.tour', ".tour-prev", prevStep)
                .on('click.tour', ".tour-next", nextStep)
                .on('click.tour', ".tour-destroy", destroy);
        }

        $(document).on('click', '.tour-play', function() {
            var tour_id = $(this).val();
            init(tour_id, tours[tour_id]);
        });

        $.each(tours, function(tour_id, tour) {
            if (tour.autoplay && !tour.completed) {
                init(tour_id, tour);
                return false;
            }
        });

    };

}(jQuery));


/*
 *
 * Form
 *
 */

(function ($, undefined) {

    'use strict';

    $("form").submit(function(){
        $("form .btn").on('click', function(){
            return false;
        });
    });

}(jQuery));


/*
 *
 * Mask
 *
 */

(function ($, undefined) {

    'use strict';

	var MaskInput = function() {
		$('[data-mask]').each(function() {
			var
				$this = $(this),
				mask = $this.data('mask')
			;
			$this.mask(mask);
		});
	};

	window['MaskInput'] = MaskInput;

}(jQuery));



/*
 *
 * Player
 *
 */

(function ($, undefined) {

    'use strict';

    $('.player-close').on('click', function() {
        $(this).parent().addClass('hidden').find('audio').removeAttr('src');
    });

}(jQuery));



/*
 *
 * Data Table
 *
 */

(function ($, window, document, undefined) {

    'use strict';

    $.extend($.fn.dataTable.ext.buttons, {
        colvisToggle: {
            className: 'buttons-colvisToggle',
            text: text.toggle_visibility,
			action: function (e, dt, node, config) {
				var isVisible = true;
				var columnsVisible = dt.columns( config.columns || [] ).visible();

				$.each(columnsVisible, function() {
					if (this) {
						isVisible = false;
					}
				});

				$(node)[isVisible ? 'addClass' : 'removeClass']('active');

				dt.columns( config.columns || [] ).visible(isVisible);
			},
            columns: []
        }
    });

    var DT = {
        tables: {},
        settings: {},
        format: function(data) {
            return '<div class="dt-slider">' + data + '</div>';
        },
        render: function(self) {

            self = self || this;

            var $self = $(self);
            var id = $self.attr('id') || 'id_data_table_' + new Date().getMilliseconds();

			var data = $self.data() || {};
			if (id in (window['DTsettings'] || {})) {
				$.extend(true, data, window.DTsettings[id] || {});
			}

            var isStateSave = data['tableSave'] || false;
            var isColumnFilter = ('tableColumnFilter' in data) || false;
            var columnFilter = isColumnFilter ? (data['tableColumnFilter'] || {}) : {};
            var aaSorting = data['tableSort'] || [[ 0, "asc" ]];
            var bPaginate = 'tablePaginate' in data ? data['tablePaginate'] : true;
            var bFilter = 'tableFilter' in data ? data['tableFilter'] : true;
            var pageLength = 'tableLength' in data ? data['tableLength'] == 'all' ? '-1' : data['tableLength'] : 100;
            var fixedColumn = ('tableFixedColumn' in data) || false;
            var fixedColumnLeft = data['tableFixedLeft'] || fixedColumn || false;
            var fixedColumnRight = data['tableFixedRight'] || false;

            var isScroll = data['tableScroll'] || false;
            var isFixedHeight = isScroll && data['tableScroll'] !== true;
            var fixedScrollHeight = isFixedHeight ? data['tableScroll'] : 'auto';

            if (bPaginate && pageLength == '-1') {
                bPaginate = false;
            }

            var buttons = [];
            var buttonList = (data['tableButtons'] || '').split(',');
            var isFullScreen = ('tableFullscreen' in data ? data['tableFullscreen'] : false) && inArray('fullscreen', buttonList);

			var collectionButtonHidden = false;
			if ('tableCollectionButton' in data && data['tableCollectionButton'] == 'hidden') {
				collectionButtonHidden = true;
			}

            if (inArray('fullscreen', buttonList)) {
                var buttonFullScreen = {
                    text: '<i class="fa fa-arrows-alt"></i>',
                    className: 'dt-fullscreen',
                    action: function (e, dt, node, config) {
                        var $wrapper = $(node).closest('.dataTables_wrapper');
                            $wrapper.toggleClass('fullscreen');

                        $(node).toggleClass('info');
                        $(window).trigger('resize');
                    },
                    key: {
                        key: 'f',
                        altKey: true
                    }
                };
                buttons.push(buttonFullScreen);
            }

            if (inArray('columns', buttonList)) {
                var buttonColumn = {
                    extend: 'colvis',
                    fade: 1,
                    exclude: [0, 1],
                    postfixButtons: ['colvisRestore'],
                    prefixButtons: [],
                    key: {
                        key: 'g',
                        altKey: true
                    }
                };

                if ('tableToggle' in data) {
                    $.each(data['tableToggle'] || [], function(index, kwrags) {
                        buttonColumn.prefixButtons.push($.extend(true, {
                            extend: 'colvisToggle',
                            text: text.toggle + ' ' + (index + 1),
                            columns: [index]
                        }, kwrags || {}));
                    });
                }
                buttons.push(buttonColumn);
            }

            var isHeader = (buttons.length || bFilter || (bPaginate && pageLength != '-1')) ? true : false;

            var settings = {
                sDom:
                    (isHeader ?
                        ("<'section-header mini'" +
                            "<'dt-table'" +
                                "<'dt-table-tr'" +
                                    "<'dt-filter'if>l" + (buttons ? "B" : "") +
                                ">" +
                            ">" +
                        ">") : "") +
                    "<'table'tr>" +
                    (bPaginate ? "<'section-footer'p>" : ""),
                language: {
                    sSearch: "",
                    sSearchPlaceholder: text.search,
                    sZeroRecords: text.no_records,
                    sLengthMenu: "_MENU_",
                    sInfo: "_TOTAL_",
                    sInfoEmpty: "0",
                    sInfoFiltered: "/ _MAX_",
                    sProcessing: "<i class='fa fa-spinner fa-spin'></i>",
                    oPaginate: {
                        sPrevious: "<i class='fa fa-chevron-left'></i>",
                        sNext: "<i class='fa fa-chevron-right'></i>"
                    },
                    buttons: {
                        colvis: '<i class="fa fa-columns"></i>',
                        colvisRestore: text.restore_visibility
                    }
                },
                pageLength: pageLength,
                lengthMenu: [
                    [10, 25, 50, 100, -1],
                    [10, 25, 50, 100, text.all]
                ],
                buttons: {
                    dom: {
                        button: {
                            tag: 'button',
                            className: 'btn'
                        },
                        buttonLiner: {
                            tag: ''
						},
						collection: {
							className: 'dt-button-collection' + (collectionButtonHidden ? ' dt-button-collection-hidden' : '')
						}
                    },
                    buttons: buttons
                },
				stateSave: isStateSave,
                bFilter: bFilter,
                bInfo: bFilter,
                aaSorting: aaSorting,
                bPaginate: bPaginate,
                bAutoWidth: false,
                bRetrieve: true,
                bDeferRender: true,
                pageResize: true
            };

            if (isScroll) {
                settings.sScrollX = true;
                settings.sScrollY = fixedScrollHeight;
                settings.bScrollCollapse = true;
                settings.fixedColumns = {
                    leftColumns: fixedColumnLeft,
                    rightColumns: fixedColumnRight
                };
            }

            var classes = {
                sWrapper: "dataTables_wrapper section default",
                sInfo: "dataTables_info dt-info",
                sLength: "dataTables_length dt-length"
            };


            $.extend(true, $.fn.dataTable.defaults, settings);
            $.extend(true, $.fn.dataTable.ext.classes, classes);

            var table = $self.dataTable(settings);
			var api = table.api();

			if (isColumnFilter) {
				table.columnFilter(columnFilter);
			}

            DT.tables[id] = {
                t: table,
				a: api,
                s: settings
            };

            if (isFullScreen) {
                $('.dt-fullscreen').trigger('click');
            }

            if (isScroll) {
                $(window).on('resize', function() {

                    var $body = $('.dataTables_scrollBody');
                    var $head = $('.dataTables_scrollHead');
                    var $foot = $('.dataTables_scrollFoot');
                    var $wrapper = $('.dataTables_wrapper');

                    var isHead = $head.hasClass('dataTables_scrollHead');
                    var isFoot = $foot.hasClass('dataTables_scrollFoot');
                    var isFullScreen = $wrapper.hasClass('fullscreen');
                    var isScrollDown = $('html').hasClass('scroll-down');

                    var height = (function($wrapper) {

                        var height = $(window).height();
                        var offset_top = $wrapper.offset().top;
                        var space = isScrollDown ? 42 : 90;
                        var headerHeight = isHead ? $head.outerHeight() : 0;
                        var footerHeight = (isFoot ? $foot.outerHeight() : 0) + 60;
                        var fullScreenHeight = isFullScreen ? 48 : 0;
                        var paginateHeight = bPaginate ? 0 : isFullScreen ? 48 : 24;

                        return height - offset_top - space - footerHeight - headerHeight + fullScreenHeight + paginateHeight;

                    })($wrapper);

                    setTimeout(function() {

                        $body.css({
                            'max-height': height,
                            'height': isFullScreen ? height : 'auto'
                        });

                        api.draw(false);

                    }, 1);

                }).trigger('resize');
            }

            if (settings.ajax && settings.target) {
                $(settings.target).on('click', 'button', function() {
                    var params = $(this).data();
                    var url = [settings.ajax, $.param(params)].join('?');

                    api.ajax.url(url).load();
                });
            }

            $self.on('click', '.dt-child', function (e) {

				if (!e.metaKey) {
					var $this = $(this);

					var href = $this.attr('href') || location.href;
					var type = $this.data('type') || 'html';

					var tr = $(this).closest('tr');
					var row = api.row(tr);

					if (row.child.isShown()) {

						var slider = $('.dt-slider', row.child());
						if (slider.length) {
							slider.slideUp(150, function() {
								row.child.hide();
								tr.removeClass('dt-child-show');
							});
						} else {
							row.child.hide();
							tr.removeClass('dt-child-show');
						}

						return false;
					}

					if ($this.hasClass('dt-child-loading')) {
						return false;
					}

					$this.addClass('dt-child-loading');

					if (type == 'json') {
						DT.format = window.DTformat[id] || DT.format;
					}

					$.get(href, function(request) {
						row.child(DT.format(request)).show();
						row.child().find('.data-table').each(function() {
							DT.render(this);
						});

						$this.removeClass('dt-child-loading');
						tr.addClass('dt-child-show');

						$('.dt-slider', row.child()).slideDown(150);

                        $('[data-dropdown]').dropdown();
					}, type);

					return false;
				}

            });

        }
    };

    $('.data-table').each(function() {
        DT.render(this);
    });

    window.DT = DT;

}(jQuery, window, document));


/*
 *
 * Selectize
 *
 */

(function ($, undefined) {

    'use strict';

	var SelectDict = {};

    var SelectRender = function() {
		$('select, [data-selectize]').each(function() {
			var
				$this = $(this),
				target = $this.attr('id') || $this.val(),
				params = new String($this.data('selectize')).split('|'),
				data = {
					allowEmptyOption: true,
					persist: false,
					create: false,
					createOnBlur: false,
					touch: false,
					// sortField: 'text',
				}, param
			;
			$.each(params, function() {
				param = this.split(':');
				data[param[0]] = param.length > 1 ? param[1] : true;
			});
			if (data['touch'] || (!data['touch'] && !Modernizr.touch)) {
				var s = $this.selectize(data);
				SelectDict[target] = s;
			}
		});
	};
	SelectRender();
	window.SelectRender = SelectRender;
	window.SelectDict = SelectDict;

}(jQuery));


/*
 *
 * Editable
 *
 */

(function ($, undefined) {

    'use strict';

	var target = '.editable';

	$(function() {
		$(target).each(function() {

			var $this = $(this);
			var url = $this.data('url') || '';
			var callback = $this.data('callback');

			var settings = {
				loadtype: "POST",
				event: "dblclick",
				style: "inherit",
				onblur : "submit",
				ajaxoptions: {
					dataType: 'json'
				},
				callback: function(value, settings) {}
			};

			if ($.type(window[callback]) != 'undefined') {
				settings['callback'] = window[callback];
			}

			$(this).editable(url, settings);
		});
	});


}(jQuery));
