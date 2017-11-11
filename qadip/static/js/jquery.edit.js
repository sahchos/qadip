(function($, data) {

    data = data || {};

    var is_changed = false;

    function inArray(elem, arr) {
        return !!~$.inArray(elem, arr);
    }

    function getValue(_target, _type, _name) {
        if (_type == 'radio') {
            if ($(_target).is(':checked') || !_name in data) {
                return $(_target).val();
            }
        } else if (_type == 'checkbox') {
            if ($(_target).is(':checked')) {
                return $(_target).val();
            }
            return false;
        } else if (_type == 'hidden') {
            return $(_target).val();
        } else if (_type == 'text') {
            return $(_target).val();
        } else if (_type == 'textarea') {
            return $(_target).val();
        } else {
            return $(_target).text();
        }
        return undefined;
    }

    function getType(elem) {
        var type = elem.data('type');
        if (!type) type = elem.attr('type');
        if (!type) type = elem.data('edit-type');
        if (!type) type = 'html';
        return type;
    }

    function setEdit(elem, contenteditable) {
        $(elem).attr('contenteditable', contenteditable);
    }

    $('[data-edit]').each(function() {
        var name = $(this).data('edit');
        var type = getType($(this));

        var event = inArray(type, ['radio', 'checkbox']) ? 'change' : 'keyup';
        var readonly = $(this).data('edit-readonly');

        if ($.type(readonly) != 'undefined') return;

        if (type == 'html') {
            setEdit(this, true);
        }

        $(this)
            .on(event, function() {

                is_changed = true;

                var i, j, tmp;

                var value = getValue(this, type, name);
                var value_type = $.type(value);
                var is_value = value_type != 'undefined';
                var value_len = is_value ? value.length : 0;

                var value_old = $.type(data[name]) != 'undefined' ? data[name] : '';
                var value_old_type = $.type(value_old);
                var value_default = $(this).data('edit-default');

                var value_current = '';

                var index = $(this).data('edit-index');
                var is_index = $.type(index) == 'number';

                var slice = $(this).data('edit-slice');
                var is_slice = $.type(slice) == 'string' && !!~slice.indexOf(':');
                var slice_split = is_slice ? slice.split(':') : [];
                var slice_start = parseInt($.type(parseInt(slice_split[0])) == 'number' ? slice_split[0] : 0);
                var slice_end = parseInt($.type(parseInt(slice_split[1])) == 'number' ? slice_split[1] : value_old.length);
                var slice_len = slice_end - slice_start;

                var group = $(this).data('edit-group');
                var is_group = $.type(group) != 'undefined';

                var toggle = $(this).data('edit-toggle');
                var is_toggle = toggle !== '' && $.type(toggle) == 'string';

                var target = $(this).data('edit-target');
                var is_target = target !== '' && $.type(target) == 'string';

                if ($.type(value_default) == 'undefined') value_default = ' ';

                if (type == 'checkbox') {
                    if (is_toggle && is_target && toggle == 'hidden') {
                        $(target)[$(this).prop('checked') ? 'removeClass' : 'addClass'](toggle);
                    } else if (is_toggle && is_target && toggle == 'checked') {
                        $(target).not(this).prop('checked', !$(this).prop('checked'));
                    }
                }

                if (is_group) {

                    var value_tmp = $(this).val();

                    if (value_old_type != 'array') value_old = [];

                    if (group == 'add') {
                        value_old.push(value_tmp);
                    } else if (group == 'remove') {
                        value_old = $.grep(value_old, function(value) {
                            return value_tmp != value;
                        });
                    } else {
                        var is_checked = $(this).prop('checked');

                        if (!value_tmp && is_toggle && is_target && toggle == 'checked') {
                            is_checked = $(target).prop('checked');
                            value_tmp = $(target).val();
                        }

                        if (is_checked) {
                            value_old.push(value_tmp);
                        } else {
                            value_old = $.grep(value_old, function(value) {
                                return value_tmp != value;
                            });
                        }
                    }

                    value_current = value_old;

                    data[name] = value_current;

                } else if ((is_index || is_slice) && value_old_type == 'string') {

                    value_old = value_old.split('');

                    if (is_index) {

                        if (value_len > 1) value = value[0];
                        if (value === '') value = value_default;
                        if (value_len > 1) { $(this)[type == 'html' ? 'text' : 'val'](value); }

                        value_old[index] = value;

                    } else {

                        value = value.split('');

                        if (value_len > slice_len) value = value.slice(0, slice_len).join('').split('');
                        if (value === '') value = new Array(slice_len).join(value_default).split('');
                        if (value_len > slice_len) $(this).text(value.join(''));

                        for (i = slice_start, j = 0; i < slice_end; i++, j++) {
                            value_old[i] = value[j];
                        }
                    }

                    for (i = 0, j = value_old.length; i < j; i++) {
                        if (value_old[i] === '' || $.type(value_old[i]) == 'undefined') value_old[i] = value_default;
                    }

                    tmp = value_old.join('');

                    value_current = $.trim(tmp);
                    data[name] = value_current;
                    $('[data-edit="' + name + '"]').not('[data-edit-slice]').not('[data-edit-index]').each(function() {
                       $(this)[type == 'html' ? 'text' : 'val'](tmp);
                    });

                } else {

                    value_current = $.trim(value);

                    data[name] = value_current;

                    $('[data-edit="'+name+'"]').not('[data-edit-slice]').not('[data-edit-index]').not(this).each(function() {
                        var _type = getType($(this));
                        $(this)[_type == 'html' ? 'text' : 'val'](value);
                    });

                    if (value_type == 'string') {

                        value = value.split('');

                        $('[data-edit="'+name+'"][data-edit-index]').each(function() {
                            var _type = getType($(this));
                            var _index = $(this).data('edit-index');
                            tmp = (value[_index] === '' || $.type(value[_index]) == 'undefined') ? value_default : value[_index];
                            $(this)[_type == 'html' ? 'text' : 'val'](tmp);

                        });

                        $('[data-edit="'+name+'"][data-edit-slice]').each(function() {

                            var _type = getType($(this));
                            var _slice = $(this).data('edit-slice');
                            var _is_slice = $.type(_slice) == 'string' && !!~_slice.indexOf(':');
                            var _slice_split = _is_slice ? _slice.split(':') : [];
                            var _slice_start = parseInt($.type(parseInt(_slice_split[0])) == 'number' ? _slice_split[0] : 0);
                            var _slice_end = parseInt($.type(parseInt(_slice_split[1])) == 'number' ? _slice_split[1] : value_old.length);

                            tmp = [];
                            for (i = _slice_start, j = 0; i < _slice_end; i++, j++) {
                                tmp[j] = value[i] === '' || $.type(value[i]) == 'undefined' ? value_default : value[i];
                            }
                            tmp = tmp.join('');

                            $(this)[_type == 'html' ? 'text' : 'val'](tmp);
                        });
                    }
                }

            });
    });

    $(document)
        .on('click', '#data-edit-save', function() {
            $.get('/features/blank_edit/' + document.location.search, data, function(request) {
                is_changed = false;
                alert(request.message);
            }, 'json');
            return false;
        })
        .on('click', '#data-edit-print', function() {
            print();
        })
        .on('click', '.data-edit-sign', function() {
            var sign = $(this).val();
            var img = $(this).children('img').prop('src');
            data['sign-src'] = img;
            data['sign-class'] = 'sign-'+sign;
            $('#data-edit-sign').prop('src', img).removeAttr('class').addClass('sign-'+sign).show();
        })
        .on('dblclick', 'label.radio', function() {
            var target = $(this).children(':radio');
            var name = target.data('edit');
            target.prop('checked', false);
            data[name] = '';
        })
        .on('change', '.signature-reload', function() {
            var target = $(this).data('target');
            var name = $(this).attr('name');
            var src = $(this).val();
            var sign = $('<img/>', {
                src: src
            });
            data[name] = src;
            $(target).html(sign);
        });

    $(window)
        .on('beforeunload', function() {
            if (is_changed) {
                return 'You have unsaved changes!';
            }
        });

})(jQuery, data);
