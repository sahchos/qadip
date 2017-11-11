if (window.applicationCache) {
    applicationCache.addEventListener('updateready', function() {
        location.reload();
    });
}

Date.prototype.format = function(format) {
	var o = {
		"M+" : this.getMonth()+1, //month
		"d+" : this.getDate(),    //day
		"h+" : this.getHours(),   //hour
		"m+" : this.getMinutes(), //minute
		"s+" : this.getSeconds(), //second
		"q+" : Math.floor((this.getMonth()+3)/3),  //quarter
		"S" : this.getMilliseconds() //millisecond
	};
	if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("("+ k +")").test(format))
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
	return format;
};

var
	win = window,
	online = navigator.onLine,
	standalone = navigator.standalone,
	doc = document,
	root = doc.documentElement,

	isTouch = ('ontouchstart' in win || (win.DocumentTouch && doc instanceof DocumentTouch)) ? true : false,

	pushstart = isTouch ? "touchstart" : "mousedown",
	pushend = isTouch ? "touchend" : "mouseup",
	pushenter = isTouch ? "touchenter" : "mouseenter",
	pushleave = isTouch ? "touchleave" : "mouseleave",

	text = {
		try_again: 'Try again',
		not_found: 'Not found',
		empty_name: 'Name is empty',
		empty_phone: 'Phone is empty',
		empty_token: 'Token is empty',
		empty_caller: 'Phone for call back is empty',
		empty_called: 'Empty phone number',
		busy_phone: 'Phone number is busy',
		busy_name: 'Name is busy',
		today: 'Today',
		yesterday: 'Yesterday',
		unknown: 'unknown',
		offline: 'Your status is offline'
	},


	// localStorage
	storage = $.localStorage,

	token = storage.isSet('token') ? storage.get('token') : '',

	active = storage.isSet('active') ? storage.get('active') : token ? 'contacts' : 'signin',
	back = storage.isSet('back') ? storage.get('back') : token ? 'signin' : '',

	contacts = token && storage.isSet('contacts') ? storage.get('contacts') : {},
	contacts_search = token && storage.isSet('contacts_search') ? storage.get('contacts_search') : {},
	contacts_favorites = token && storage.isSet('contacts_favorites') ? storage.get('contacts_favorites') : [],
	contacts_history = token && storage.isSet('contacts_history') ? storage.get('contacts_history') : [],

	contact_id = token && storage.isSet('contact_id') ? storage.get('contact_id') : '',
	contact_favorite = token && contacts_favorites.indexOf(contact_id) != -1,
	contact = token && storage.isSet('contacts', contact_id) ? storage.get('contacts', contact_id) : {},

	caller = token && storage.isSet('caller') ? storage.get('caller') : '',
	caller_name = token && storage.isSet('caller_name') ? storage.get('caller_name') : '',
	caller_phones = token && storage.isSet('caller_phones') ? storage.get('caller_phones') : [],

	called = token && storage.isSet('called') ? storage.get('called') : '',
	called_keypad = token && storage.isSet('called_keypad') ? storage.get('called_keypad') : '',
	called_keypad_name = token && storage.isSet('called_keypad_name') ? storage.get('called_keypad_name') : '',

	create_contact_deny = online ? online : storage.isSet('create_contact_deny') ? storage.get('create_contact_deny') : false,

	callTimeout,

    geo = {
        target: false,
        options: {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 0
        },
        target_current: function(position) {
            geo.target = [position.coords.latitude, position.coords.longitude].join(',');
        },
        success: function(position) {
            geo.target_current(position);
            navigator.geolocation.watchPosition(geo.target_current, function() {}, geo.options);

            geo.render();
            loading.end();
        },
        error: function(err) {
            render.geo(err);
            loading.end();
        },
        render: function() {
            render.all(active, true);
                 if (!token) signout();
            else if (!caller || !caller_name) page.active('settings', false);
            else if (online) settings(false);
        },
        init: function() {
            loading.start();
            navigator.geolocation.getCurrentPosition(geo.success, geo.error, geo.options);
        }
    },

    visibility = new function() {

        online = navigator.onLine;
        var hidden, visibilityChange;

        if (typeof document.hidden !== "undefined") {
            hidden = "hidden";
            visibilityChange = "visibilitychange";
        } else if (typeof document.mozHidden !== "undefined") {
            hidden = "mozHidden";
            visibilityChange = "mozvisibilitychange";
        } else if (typeof document.msHidden !== "undefined") {
            hidden = "msHidden";
            visibilityChange = "msvisibilitychange";
        } else if (typeof document.webkitHidden !== "undefined") {
            hidden = "webkitHidden";
            visibilityChange = "webkitvisibilitychange";
        } else {
            hidden = "hidden";
            visibilityChange = "visibilitychange";
        }

        this.change = function() {
            if (device.all && !document[hidden]) {
                geo.render();
            }
        };

    },

	// add-on
	is = new function() {
		this.set = function(el) {
			return (el !== undefined);
		};
		this.b = this.bool = this.boolean = function(el) {
			return (typeof el === "boolean");
		};
		this.s = this.str = this.string = function(el) {
			return (typeof el === "string");
		};
		this.a = this.arr = this.array = function(el) {
			return (typeof el === "object") && (el instanceof Array);
		};
		this.o = this.obj = this.object = function(el) {
			return (typeof el === "object") && (el instanceof Object);
		};
		this.f = function(el) {
			return (typeof el === "function");
		};
		this.e = this.element = function(el) {
			return (
				(typeof HTMLElement === "object") ? (el instanceof HTMLElement) :
				(el && typeof el === "object" && el !== null && el.nodeType === 1 && typeof el.nodeName === "string")
			);
		};
	},

	device = new function() {
		this.Android = /Android/.test(navigator.userAgent);
		this.BlackBerry = /BlackBerry/.test(navigator.userAgent);
		this.Opera = /Opera Mini/.test(navigator.userAgent);
		this.Windows = /IEMobile/.test(navigator.userAgent);
		this.iOS = /iP(hone|od|ad)/.test(navigator.userAgent);
		this.iOS7 = this.iOS && /OS 7/.test(navigator.appVersion);
		this.iOS8 = this.iOS && /OS 8/.test(navigator.appVersion);
        this.all = this.Android || this.BlackBerry || this.Opera || this.Windows || this.iOS;
	},

	// functions
	sms = new function() {
		this.secret = 'wakawaka';
		this.phone = '+972544400611';
		this.divider = device.iOS ? ';' : '?';
		this.send = function() {
			if (!token) return error(text.empty_token);
			if (!caller) return error(text.empty_caller);
			if (!called) return error(text.empty_called);

			var body = [this.secret, token, caller, called].join('@'),
				href = ['sms://', this.phone, this.divider, 'body=', body].join('');

			return location.href = href;
		}
	},

	loading = new function() {
		this.el = $('#loading');
		this.start = function() { this.el.addClass('active'); };
		this.end   = function() { this.el.removeClass('active'); };
	},

	nav = new function() {
		this.el = $('html');
		this.hide = function() { this.el.addClass('nav-hidden'); };
		this.show = function() { this.el.removeClass('nav-hidden'); };
	},

	page = new function() {
		this.active = function(page_active, is_nav, no_back) {

			clearTimeout(callTimeout);

			if (!is.string(page_active)) page_active = $(this).val();
			if (!page_active) page_active = active;
			if (is.boolean(is_nav)) nav[is_nav ? 'show' : 'hide']();

			if (!no_back)
				back = active;
				active = page_active;

			storage.set('active', page_active);
			storage.set('back', back);

			$('body').attr('class', page_active + ' back-' + back);
		};
	},

	render = new function() {

		function wrapper(target, data, is_active, is_nav) {
			$('#'+target).html($('#tmpl-'+target).tmpl(data));
			if (is_active) page.active(target, is_nav);
		}

		this.signin = function(is_active, is_nav) {
			wrapper('signin', {
				token: token
			}, is_active, is_nav);
		};

		this.contact_new = function(is_active, is_nav) {
			wrapper('contact-new', {}, is_active, is_nav);
		};

		this.contact = function(is_active, is_nav) {
			wrapper('contact', {
				contact_id: contact_id,
				contact: contact,
				favorite: contact_favorite,
				back: back
			}, is_active, is_nav);
		};

		this.favorites = function(is_active, is_nav) {
			var favorites = [];
			for(var i in contacts_favorites) {
				var id = contacts_favorites[i]
				  , contact = contacts[id];
				if (contact) favorites.push({ id: id, name: contact.name });
			}
			wrapper('favorites', {
				favorites: favorites,
				back: back
			}, is_active, is_nav);
		};

		this.history = function(is_active, is_nav) {
			var today = new Date().format('yyyy.MM.dd'),
				yesterday = new Date(new Date().setDate(new Date().getDate()-1)).format('yyyy.MM.dd'),
				last_date;

			wrapper('history', {
				history: contacts_history.sort(function(a, b) {
                    if (!a.unixtime || !b.unixtime) return -1;
                    var keyA = new Date(a.unixtime).getTime(),
                        keyB = new Date(b.unixtime).getTime();
                    if (keyA < keyB) return 1;
                    if (keyA > keyB) return -1;
                    return 0;
                }),
				legend: function(date, is_replace) {
					var ret;
					if (last_date != date) {
						if (date == today) ret = text.today;
						else if (date == yesterday) ret = text.yesterday;
						else ret = date;
					}
					if (is_replace) last_date = date;
					return ret;
				}
			}, is_active, is_nav)
		};

		this.contacts = function(is_active, is_nav) {
			var last_char = '',
				tuple = [];
			for (var i in contacts) {
				var tuple_contact = contacts[i];
					tuple_contact['id'] = i;
				tuple.push(tuple_contact);
			}
			wrapper('contacts', {
				create_contact_deny: create_contact_deny,
				contacts: tuple.sort(function(a,b) {
					if (!a.name || !b.name) return 0;
					var x = a.name.toLowerCase();
					var y = b.name.toLowerCase();
					return x < y ? -1 : x > y ? 1 : 0;
				}),
				legend: function(name, is_replace) {
					var ret, char = name.toUpperCase().substr(0,1);
					if (last_char != char) ret = char;
					if (is_replace) last_char = char;
					return ret;
				}
			}, is_active, is_nav);
		};

		this.keypad = function() {
			wrapper('keypad', {
			 	keypad_called: called_keypad,
				keypad_called_name: called_keypad_name,
				online: online
			});
		};

		this.settings = function(is_active, is_nav) {

			wrapper('settings', {
				caller: caller,
				caller_name: caller_name,
				caller_phones: caller_phones
			}, is_active, is_nav);
		};

		this.ringing = function(is_history, is_active, is_nav) {
			var data = {
                unixtime: new Date().getTime(),
				time: new Date().format('hh:mm'),
				date: new Date().format('yyyy.MM.dd'),
				phone: called,
				name: called,
				label: text.unknown,
				back: active
			};
			if (called in contacts_search) {
				var id = contacts_search[called];
				if (id in contacts) data = $.extend(data, {
					id: id,
					name: contacts[id]['name'],
					label: contacts[id]['phones'][called]
				});
			}
			if (is_history) {
				contacts_history.push(data);
				storage.set('contacts_history', contacts_history);
				render.history();
			}
			wrapper('ringing', data, is_active, is_nav);
		};

        this.geo = function(err) {
            wrapper('geo', err, true, false);
        };

		this.all = function(active, is_nav) {

			this.signin();
			this.contact_new();
			this.contact();
			this.favorites();
			this.history();
			this.contacts();
			this.keypad();
			this.settings();
			this.ringing();
			this.geo();

			page.active(active, is_nav, true);
		};
	},


	error = function(message) {
		if (is.object(message))
			for (var i in message)
				return alert(message[i]);
		return alert(message);
	},

	signin = function() {
		if (!online) return error(text.offline);

		var request = {
			token: $('#token').val(),
            target: geo.target,
			signin: true
		};

		if (!request.token) return error(text.empty_token);

		$.ajax({
			data: request,
			success: function(response) {
				if (response.error) return error(response.message);
				for(var item in response) {
					win[item] = response[item];
					storage.set(item, response[item]);
				}
				render.settings(true, false);
			},
			beforeSend: function() { loading.start(); },
			complete: function() { loading.end(); }
		});
	},

	favorite = function() {
		var id = $(this).data('id');

		if (!id) return;

		$(this).toggleClass('active');

		if (contacts_favorites.indexOf(id) !== -1)
			while (contacts_favorites.indexOf(id) !== -1)
				contacts_favorites.splice(contacts_favorites.indexOf(id), 1);
		else
			contacts_favorites.push(id);

		storage.set('contacts_favorites', contacts_favorites);
		render.favorites();
	},

	contact_new = function() {
		if (!online) return error(text.offline);

		var request = {
			token: token,
			name: $("#name").val(),
			phone: $("#phone").val(),
            target: geo.target,
			contact_new: true
		};

		if (!request.token) return error(text.empty_token);
		if (!request.name) return error(text.empty_name);
		if (!request.phone) return error(text.empty_phone);
		if (request.name in contacts_search) return error(text.busy_name);
		if (request.phone in contacts_search) return error(text.busy_phone);

		$.ajax({
			data: request,
			success: function(response) {
				if (response.error) error(response.message);
				else settings(true);
			},
			beforeSend: function() { loading.start(); },
			complete: function() { loading.end(); }
		});
	},

	history_clear = function() {
		contacts_history = [];
		storage.remove('contacts_history');
		render.history();
	},

	search = function(number, is_render) {
		var $called = $('#called'),
			$contact_name = $('#called-name'),
			$backspace = $('#backspace'),
			width = $called.width();

		if (!is.set(number) || !is.string(number)) number = $(this).val();

		var length = number.length;

		called_keypad = number;
		storage.set('called_keypad', number);

		if (is_render) $called.val(number);
		$called.css('fontSize', ((width - 52 < length * 14) ? (width / length) * 1.6 : '32') + 'px');

		if (number in contacts_search) {
			var contact = contacts[contacts_search[number]];
			$contact_name.html(contact.name).fadeIn(150);

			called_keypad_name = contact.name;
			storage.set('called_keypad_name', contact.name);
		} else {
			$contact_name.fadeOut(150, function() { $(this).empty(); });

			called_keypad_name = '';
			storage.remove('called_keypad_name');
		}
		$backspace.fadeTo(150, number ? 1 : .1 );
	},

	contacts_filter = function(value) {
		var $list = $('#list');

		value = value.trim();

		storage.set('search', value);

		$list.children('li')[value ? 'hide' : 'show']();

		if (value) $.each(contacts_search, function(index, id) {
			if (index.toLowerCase().indexOf(value.toLowerCase()) > -1) $('#'+id).show();
		});
	},

	item_contact = function() {

		contact_id = $(this).data('id');
		back = $(this).data('back');
		contact = contacts[contact_id];
		contact_favorite = contacts_favorites.indexOf(contact_id) != -1;

		storage.set('contact_id', contact_id);
		storage.set('contact', contact);
		storage.set('contact_favorite', contact_favorite);
		storage.set('back', back);

		render.contact(true);
	},

	keypad = function() {
		var pressed = $(this).val(),
			pseudo_pressed = $(this).data('value'),
			number = $('#called').val(),
			current_number = number,keyTimer;

		if (pressed) {
			current_number = number + pressed;
			keyTimer = setTimeout(function() {
				if (pseudo_pressed) {
					current_number = number + pseudo_pressed;
					search(current_number, true);
				}
			}, 500);
		} else {
			current_number = number.substring(0, number.length - 1);
			keyTimer = setInterval(function() {
				current_number = current_number.substring(0, current_number.length - 1);
				if (!current_number) clearInterval(keyTimer);
				search(current_number, true);
			}, 250);
		}
		search(current_number, true);

		$(this).one(pushend, function() {
			clearTimeout(keyTimer);
			clearInterval(keyTimer);
		});
	},

	settings_active_phone = function() {
		$('#caller').val($(this).data('phone'));
		$(this).addClass('active').siblings().removeClass('active');
	},

	settings = function(is_sync) {
		if (!online) return false;

		var request = {
			token: token,
			caller: $('#caller').val(),
            target: geo.target
		};
        request[is_sync ? 'settings' : 'sync'] = true;

		if (!request.token) return error(text.empty_token);
		if (!request.caller) return error(text.empty_caller);

		$.ajax({
			data: request,
			success: function(response) {
				if (response.error) return error(response.message);
				contacts = response.contacts;
				for (var id in contacts) {
					contacts_search[contacts[id]['name']] = id;
					for(var i in contacts[id]['phones']) contacts_search[i] = id;
				}
				for (var item in response) {
					win[item] = response[item];
					storage.set(item, response[item]);
				}
				caller = request.caller;
				storage.set('caller', caller);
				storage.set('contacts_search', contacts_search);

				render.all(!is_sync ? active : 'contacts', true);
			},
			beforeSend: function() { if (is_sync) loading.start(); },
			complete: function() { if (is_sync) loading.end(); }
		});
	},

	call = function() {

		called = $(this).data('phone');
		if (!called) called = called_keypad;
		storage.set('called', called);

		var request = {
			token: token,
			caller: caller,
			called: called,
            target: geo.target,
			ringing: true
		};

		if (!request.token) return error(text.empty_token);
		if (!request.caller) return error(text.empty_caller);
		if (!request.called) return error(text.empty_called);

		if (!online) return sms.send();

		render.ringing(true, true);

		$.ajax({
			data: request,
			success: function(response) {
				if (response.error) return error(response.message);
				called = '';
				called_keypad = '';
				called_keypad_name = '';
				storage.remove('called');
				storage.remove('called_keypad');
				storage.remove('called_keypad_name');
			},
			complete: function() {
				$('#called').val('');
				$('#called-name').hide().empty();
				$('#backspace').hide();
				callTimeout = setTimeout(function() {
					page.active(back);
				}, 2500);
			}
		});
	},

	signout = function() {
		storage.removeAll();
		render.all('signin', false);
    },

    refresh = function() {
        location.reload();
    };


$.ajaxSetup({
	url: '/callback/request/',
	dataType: 'json',
	type: 'POST',
	error: function() { if (online) error(text.try_again); }
});

geo.init();

$(doc)
    .on('visibilitychange', visibility.change)
	.on('touchmove', function(e) {
		e.preventDefault(); return false;
	})
	.on('touchmove', 'section', function(e) {
		if ($(this).height() < $(this).children('article').height()) e.stopPropagation();
	})
	.on(pushstart,	'a, button, label, table tr, ul li',	function() { $(this).addClass("tap"); })
	.on(pushend,	'a, button, label, table tr, ul li',	function() { $(this).removeClass("tap"); })
	.on(pushenter,	'a, button, label, table tr, ul li',	function() { $(this).addClass("hover"); })
	.on(pushleave,	'a, button, label, table tr, ul li',	function() { $(this).removeClass("hover tap"); })

	.on(pushstart,	'.keypad-button', keypad)
	.on(pushend,	'.profile-favorite', favorite)

	.on(pushend,	'#history-clear', history_clear)
	.on(pushend,	'#post-contact-new', contact_new)

	.on(pushend,	'.nav-button', page.active)
	.on('click',	'.nav-click', page.active)

	.on('click',	'.item-contact', item_contact)
	.on('click',	'.call', call)
	.on('click',	'.item-phone', settings_active_phone)
	.on('click',	'#save', settings)

	.on('click',	'#post-signout', signout)
	.on('click',	'#post-signin', signin)

    .on('click',	'#refresh', refresh)

	.on('keyup input',  '#called', search)
	.on('paste',	    '#called', function(e) {
		setTimeout(function () {
			search($(e.currentTarget).val());
		}, 0);
	})
	.on('keyup input paste', '#contacts_filter', function(e) {
		setTimeout(function () {
			contacts_filter($(e.currentTarget).val());
		}, 0);
	});
