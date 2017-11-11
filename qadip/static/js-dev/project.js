jQuery( document ).ready(function($) {
    var initializeDataTable = function(table, options){
        var $table = $(table),
            baseOptions = {
                "iDisplayLength": 20,
                "scrollCollapse": true,
                "bLengthChange": false,
                "bInfo": false,
                // "scrollY": true,
                // "scrollX": true,
                "paging": false,
                "searching": false,
                "ordering": false,
                "retrieve": true,
                columnDefs: [
                  { targets: 'no-sort', orderable: false }
                ],
                drawCallback: function ( settings ) {
                  var self = this;
                  var api = this.api();
                  api.rows().eq(0).each(function(index) {
                      var row = api.row(index);
                      if ($(row.node()).hasClass('selected')) {
                          var $row_to_persist = $(row.node());
                          $(self).find('tbody:last').append($row_to_persist);
                      }
                  });
              }
            };

        if ($table.hasClass('ordering')) {
            baseOptions.ordering = true;
            baseOptions.order = [];
        }
        if ($table.hasClass('search-on')) {
            baseOptions.searching = true;
            baseOptions.language = {searchPlaceholder: "Search"};
        }
        options = $.extend(baseOptions, options || {});
        $.fn.dataTable.moment('DD/MM/YYYY');
        return $table.DataTable(options);
    };

    // datatables-simple
    var datatables_simple = $('table.datatables-simple');
    if (datatables_simple.length > 0) {
        var table = initializeDataTable(datatables_simple);
        resize_table();
    }
    function resize_table() {
        $('table tbody td:not(.show-title)').each(function(){
            var td_width = $(this).width();

            $(this).children().each(function(){
                var child_td_width = $(this).width();
                if (child_td_width > td_width) {
                    if ($(this).closest('td').hasClass('show-tooltip')) {
                        var data_o_t = $(this).attr('data-title');
                        $(this).attr('data-original-title', '');
                        if (data_o_t) {
                            $(this).attr('data-original-title', $(this).text() +'<br>'+ data_o_t);
                        }
                        else {
                            $(this).attr('data-original-title', $(this).text());
                        }
                    }
                    else {
                        $(this).attr('title', $(this).text());
                    }
                }
                else {
                    $(this).removeAttr('title');
                }
            });
        });
    }

    /* Add X-CSRFToken to ajax requests */
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    var csrftoken = getCookie('csrftoken');

    function csrfSafeMethod(method) {
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    $.ajaxSetup({
        beforeSend: function (xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        },
        error: function (xhr, status, error) {
            var obj = xhr.responseJSON;
            if (obj.details) {
                toastr.options = {"closeButton": true};
                toastr.error(obj.details);
            }
        }
    });
    /* END: Add X-CSRFToken to ajax requests */
    var beforCheck = true;

    $('form').submit(function(e) {
        $('.spinner-wrapper').show();
        beforCheck = false;

        if ($(this).is('.quick-search')) {
            var q_s_value = $(this).find('input[name="q"]');

            if ($.trim(q_s_value.val()) == '') {
                e.preventDefault();
                e.stopPropagation();
                q_s_value.val('').next('.error').remove();
                $('.spinner-wrapper').hide();
                q_s_value.after('<div class="error alert-danger">This field is required.</div>');
            }
        }
    });

    function datePicker() {
        var inputSimpleDate = $('.date');
        var startDate = $('.start-date-from, .start-date');
        var finishDate = $('.end_date, .finish-date');

        moment.locale('en', {
            week: { dow: 1 }
        });
        inputSimpleDate.datetimepicker({
            format:"DD/MM/YYYY",
            useCurrent: false
        });

        function validationDatepicker(e) {
            var parent = $('.tab-pane.active');
            var parentForm = parent.find('#add-assignment-form');
            var weekdays = parent.find('input[value="weekdays"]');
            var checkOneTime = $('input[value="one_time"]').prop('checked');
            var checkCountRepeats = $('input[value="after"]').prop('checked');

            var requestStartDateStr =  parent.find('#add-assignment-form').data('startDate');
            var requestEndDateStr = parent.find('#add-assignment-form').data('endDate');

            var conflictModal = $('.conflict-modal');
            var conflictFormIndex = conflictModal.find('.datatables-simple input[type="radio"]:checked').parents('tr').index();
            var showedConflictForm = conflictModal.find('#assignment_form_' + (conflictFormIndex + 1));

            if(conflictModal.length && conflictModal.css('display') !== 'none') {
                parent = showedConflictForm;
                requestStartDateStr =  showedConflictForm.closest('form').data('startDate');
                requestEndDateStr = showedConflictForm.closest('form').data('endDate');
            }

            if(requestStartDateStr) {
                var requestStartDateArray = requestStartDateStr.split('/');
                var requestStartDate = new Date(requestStartDateArray[2], requestStartDateArray[1] - 1, requestStartDateArray[0]);
            }

            if(requestEndDateStr) {
                var requestEndDateArray = requestEndDateStr.split('/');
                var requestEndDate = new Date(requestEndDateArray[2], requestEndDateArray[1] - 1, requestEndDateArray[0]);
            }

            startDate.each(function() {

                var that = $(this);
                var index = that.index() - 1;
                var startDate = parent.find(that);
                var startDateDatepicker = parent.find(that).data("DateTimePicker");
                var endDate = parent.find(finishDate);
                var endDateDatepicker = endDate.data("DateTimePicker");
                var day;

                if(weekdays.length && startDateDatepicker && !parent.find('#add-assignment-form').length) {

                    day = startDay(that);
                    if(day === 'sat' || day === 'sun') {
                        weekdays.prop('disabled', true).parents('.radio').addClass('disable');
                        if(weekdays.prop('checked')) {
                            parent.find('#id_frequency_0').prop('checked', true);
                            $('input[name="end_after_repeats"]').val('').closest('.form-inline').addClass('disable');
                            $('input[name="end_date"]').closest('.form-inline').addClass('disable').find('input[type="radio"]').click();
                        }
                    } else {
                        weekdays.prop('disabled', false).parents('.radio').removeClass('disable');
                    }
                }

                if(startDateDatepicker && endDate.length) {

                    if(parent.find('#add-request-form').length) {
                        if (datepickerDate(that) && (checkOneTime || checkCountRepeats)) {
                            that.data("DateTimePicker").maxDate(false);
                            endDateDatepicker.minDate(false);
                            if(e && checkOneTime) {
                                endDateDatepicker.date(e.date);
                            }
                            if(checkOneTime) {
                                $('.end-date-field').closest('.form-inline').addClass('disable');
                            }
                        } else {
                            startDateDatepicker.maxDate(endDateDatepicker.date())
                            endDateDatepicker.minDate(startDateDatepicker.date())
                        }

                    } else {
                        if(datepickerDate(endDate)) {
                            startDateDatepicker.maxDate(endDateDatepicker.date())
                        } else {
                            startDateDatepicker.maxDate(false);
                        }
                        if(datepickerDate(that)) {
                            endDateDatepicker.minDate(startDateDatepicker.date())
                        } else {
                            endDateDatepicker.minDate(false);
                        }
                    }

                    if(requestStartDate && requestEndDate) {
                        if(datepickerDate(startDate)) {
                            endDateDatepicker.minDate(datepickerDate(startDate));
                            endDateDatepicker.maxDate(requestEndDate);
                        } else {
                            endDateDatepicker.minDate(requestStartDate);
                            endDateDatepicker.maxDate(requestEndDate);
                        }

                        if(datepickerDate(endDate)) {
                            startDateDatepicker.minDate(requestStartDate);
                            startDateDatepicker.maxDate(datepickerDate(endDate));
                        } else {
                            startDateDatepicker.minDate(requestStartDate);
                            startDateDatepicker.maxDate(requestEndDate);
                        }

                    }
                }

            });
        }

        startDate.on("dp.change", function (e) {
            var that = $(this);
            var parent = $('.tab-pane.active');

            validationDatepicker(e);

            if(parent.find('#add-request-form').length && that.hasClass('datepicker-start-date')) {
                parent.find('.cpe-checked').each(function(){
                    cpeCheckbox($(this));
                });
            }
        });;

        finishDate.on("dp.change", function (e) {
            validationDatepicker();
        });

        validationDatepicker();
    }

    datePicker();

    function timePicker() {

        $('.time').datetimepicker({
            format: 'HH:mm'
        }).on("dp.change dp.update dp.error", function(e) {
            if ($.isNumeric(e.date._i) && e.date._i && e.date._i.length < 4) {
                var time = '';
                switch (e.date._i.length) {
                    case 3:
                        if (e.date._i[1] + e.date._i[2] > 59) {
                            return false;
                        }else {
                            time = '0' + e.date._i[0] + ':' + e.date._i[1] + e.date._i[2];
                        }
                        break;
                    case 2:
                        if (e.date._i[0] + e.date._i[1] > 59) {
                            return false;
                        }else {
                            time = '00:' + e.date._i[0] + e.date._i[1];
                        }
                        break;
                    case 1:
                        time = '00:0' + e.date._i[0];
                }
                $(this).find('input').val(time);
            }

        });
        $('[data-toggle="tooltip"]').tooltip();
    }

    timePicker();

    var inputDate = $('.birth_date');
    if (inputDate.length > 0) {
        inputDate.datetimepicker({
            viewMode: 'years',
            format:"DD/MM/YYYY",
            useCurrent: false
        }).on("dp.change", function(e) {
            var date_on = $(this).closest('form').find('.date-on').text().split('/');
            var ncy_offset = $(this).closest('form').find('.ncy-offset');

            function getAge(birth, date_on_v) {
               var today = new Date();

               if (!birth) {
                   return false;
               }

               if(date_on_v) {
                today = new Date(date_on[2], date_on[1]-1, date_on[0]);
               }
               var curr_date = today.getDate();
               var curr_month = today.getMonth() + 1;
               var curr_year = today.getFullYear();

               var birth_date = birth.getDate();
               var birth_month = birth.getMonth() + 1;
               var birth_year = birth.getFullYear();


               if (curr_month == birth_month && curr_date >= birth_date) return parseInt(curr_year-birth_year);
               if (curr_month == birth_month && curr_date < birth_date) return parseInt(curr_year-birth_year-1);
               if (curr_month > birth_month) return parseInt(curr_year-birth_year);
               if (curr_month < birth_month) return parseInt(curr_year-birth_year-1);
            }

            function getNcy(birth) {

                if (!birth) {
                    return false;
                }

                var today = new Date();
                var curr_year = today.getFullYear();
                var birth_year = birth.getFullYear();
                var ncy_offset_v = 0, birth_ncy = 0, curr_ncy = 0;

                if (birth.getMonth() + 1 >= 9 && birth.getDate() >= 1) {
                    birth_ncy = 1;
                }
                if (today.getMonth() + 1 >= 9 && today.getDate() >= 1) {
                    curr_ncy = 1;
                }

                if (ncy_offset.val() !== '') {
                    ncy_offset_v = parseInt(ncy_offset.val());
                }
                return curr_year - birth_year - 5 + ncy_offset_v - birth_ncy + curr_ncy;
            }

            if (getAge(e.date._d) > 1) {
                $(this).closest('form').find('.current-age').val(getAge(e.date._d));
                $(this).closest('form').find('.on-date').val(getAge(e.date._d, date_on));
                $(this).closest('form').find('.ncy-date').val(getNcy(e.date._d));
            }
            else {
                $(this).closest('form').find('.current-age').val('0');
                $(this).closest('form').find('.on-date').val('0');
                $(this).closest('form').find('.ncy-date').val('0');
            }

            if ($('input.calculated').prop("checked")) {
                if (getAge(e.date._d) >= 18) {
                    $('.age-limit').val('Adult');
                }
                else {
                    $('.age-limit').val('Child');
                }
            }
        });
    }

    function getNcy(birth) {
        if (!birth) {
            return false;
        }

        birth = birth.split('/');
        birth = new Date(birth[2], birth[1]-1, birth[0]);
        var today = new Date();
        var curr_year = today.getFullYear();
        var birth_year = birth.getFullYear();
        var ncy_offset_v = 0, birth_ncy = 0, curr_ncy = 0;
        if (birth.getMonth() + 1 >= 9 && birth.getDate() >= 1) {
            birth_ncy = 1;
        }
        if (today.getMonth() + 1 >= 9 && today.getDate() >= 1) {
            curr_ncy = 1;
        }

        if ($('.ncy-offset').val() !== '') {
            ncy_offset_v = parseInt($('.ncy-offset').val());
        }

        if ($('.current-age').val() == 0) return 0;
        return curr_year - birth_year - 5 + ncy_offset_v - birth_ncy + curr_ncy;
    }

    function getAge(birth) {
       var today = new Date();

       if (!birth) {
           return;
       }
       birth = birth.split('/');
       birth = new Date(birth[2], birth[1]-1, birth[0]);

       var curr_date = today.getDate();
       var curr_month = today.getMonth() + 1;
       var curr_year = today.getFullYear();

       var birth_date = birth.getDate();
       var birth_month = birth.getMonth() + 1;
       var birth_year = birth.getFullYear();


       if (curr_month == birth_month && curr_date >= birth_date) return parseInt(curr_year-birth_year);
       if (curr_month == birth_month && curr_date < birth_date) return parseInt(curr_year-birth_year-1);
       if (curr_month > birth_month) return parseInt(curr_year-birth_year);
       if (curr_month < birth_month) return parseInt(curr_year-birth_year-1);
    }

    $('.ncy-offset').on('keyup mouseup', function(e){
        $(this).closest('form').find('.ncy-date').val(getNcy($('input[name="date_of_birth"]').val()));
    });

    $('.following-ncy').on('change', function(e){
        if(!$(this).prop("checked")) {
            setTimeout(function() {
                $('.ncy-offset').val(0);
                $('.ncy-date').val(getNcy($('input[name="date_of_birth"]').val()));
            }, 10);
        }
    });

    $('input[name="is_adult_choice"]').on('change', function(){
        if ($(this).val() == 'child') {
            $('.age-limit').val('Child');
        }
        else if ($(this).val() == 'adult'){
            $('.age-limit').val('Adult');
        }
        else {
            if (getAge($('input[name="date_of_birth"]').val()) >= 18) {
                $('.age-limit').val('Adult');
            }
            else {
                $('.age-limit').val('Child');
            }
        }
    });

    $('.checked-radio').each(function(){
      var $this = $(this);

      $this.on('change', function(){
        if($(this).prop( "checked" )) {
          $('.checked-radio').closest('.radio').next().addClass('disable').find('input, select').attr('tabindex', '-1');
          $(this).closest('.radio').next().removeClass('disable');
          if($(this).val() == '2') {
            $(this).closest('form').find('.location-search').val('');
          }
        }
      });

      if($(this).prop( "checked" )) {
        $('.checked-radio').closest('.radio').next().addClass('disable');
        $(this).closest('.radio').next().removeClass('disable');
        if($(this).val() == '2') {
          $(this).closest('form').find('.location-search').val('');
        }
      }
    });


    function locationAutocomplete(element) {
      if (element) {

        var defaultBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(SEARCH_OPTIONS.south, SEARCH_OPTIONS.west),
            new google.maps.LatLng(SEARCH_OPTIONS.north, SEARCH_OPTIONS.east));

        var autocomplete = new google.maps.places.Autocomplete(
          element,
          {
            strictBounds: true,
            bounds: defaultBounds,
            types: ['geocode'],
            componentRestrictions: {country: SEARCH_OPTIONS.region}
          }
        );

        google.maps.event.addListener(autocomplete, 'place_changed', function() {
          if (autocomplete.getPlace().geometry) {
            var location = autocomplete.getPlace().geometry.location;
            var lat = location.lat();
            var lng = location.lng();
            var street_number = route = premise = '';

            $(element).closest('form').find('input[name="latitude"]').val(lat.toFixed(6));
            $(element).closest('form').find('input[name="longitude"]').val(lng.toFixed(6));

            $('input[name^="line"], input[name="postcode"]').each(function() {
                $(this).val('');
            });
            for (var ii = 0; ii < autocomplete.getPlace().address_components.length; ii++){
                var types = autocomplete.getPlace().address_components[ii].types.join(",");
                if (types == "premise"){
                    premise = autocomplete.getPlace().address_components[ii].long_name;
                }
                if (types == "street_number"){
                    street_number = autocomplete.getPlace().address_components[ii].long_name;
                }
                if (types == "route" || types == "point_of_interest,establishment"){
                    route = autocomplete.getPlace().address_components[ii].long_name;
                }
                if (types == "locality,political"){
                    $(element).closest('form').find('input[name="line3"]').val(autocomplete.getPlace().address_components[ii].long_name).trigger('change');
                }
                if (types == "postal_code" || types == "postal_code_prefix,postal_code"){
                    $(element).closest('form').find('input[name="postcode"]').val(autocomplete.getPlace().address_components[ii].long_name).trigger('change');
                }
                if (types == "administrative_area_level_2,political"){
                    $(element).closest('form').find('input[name="line4"]').val(autocomplete.getPlace().address_components[ii].long_name).trigger('change');
                }
            }
            $(element).closest('form').find('input[name="line2"]').val(street_number + ' ' + route).trigger('change');
            if (premise !== ''){
                $(element).closest('form').find('input[name="line1"]').val(premise).trigger('change');
            }
            else {
                $('input[name="addressRadios"]').click();
                $(element).closest('form').find('input[name="line1"]').focus().after('<div class="error alert-danger">This field is required.</div>').next('.error').remove();
                $(element).closest('form').find('input.line1-hiden').val($(element).val());
            }
            var full_address_hide = "";
            $('input[name^="line"], input[name="postcode"]').each(function() {
              full_address_hide = full_address_hide + ' ' + $(this).val();
            });
            $(element).closest('form').find('input.full-address-hiden').val(full_address_hide);
          }
          else {
            $(element).closest('form').find('input[name="latitude"], input[name="longitude"]').val('');
          }
          return false;
        });

        google.maps.event.addDomListener(element, 'keydown', function(e) {
          if (e.keyCode == 13) {
            e.preventDefault();
          }
        });
      }
    }

    $(document).on('click', '.location-search', function(){
        locationAutocomplete(this);
        $(this).on('blur', function() {
            $('.pac-container').remove();
            locationAutocomplete(this);
        });
    });

    $('input[name^="line"], input[name="postcode"]').on('keyup change', function(e) {
      var full_address = "";
      $('input[name^="line"], input[name="postcode"]').each(function(index) {
        full_address = full_address + ' ' + $(this).val();
      });

       $('input[name="full_address"]').val($.trim(full_address));
    });

    $('[name="is_automatic_full_address"]').each(function(){
        var $this = $(this);

        if($(this).prop("checked")) {
            $('input[name="full_address"]').parent().addClass('disable');
        }

      $this.on('change', function(){
        if($(this).prop("checked")) {
            $('input[name="full_address"]').parent().addClass('disable');
        }
        else {
            $('input[name="full_address"]').parent().removeClass('disable');
        }
      });
    });


    $('.weekly, .monthly, .days-wrapper').find('input[type="checkbox"]:checked').addClass('checked-day');

    function cpeCheckbox(self){
        var parent = $('.tab-pane.active');

        $('.' + self.val()).addClass(self.attr('name'));
        if(self.prop("checked")) {
            if (self.closest('form').find('#id_home_stop').val() == '' && self.closest('form').find('#id_school_stop').val() == '') {
                self.closest('form').find('.cpe-filds').not('.' + self.val()).find('.selectpicker').val('').trigger('change.select2');
            }

            setTimeout(function() {
                var parent = $('.tab-pane.active');
                var datepicker = parent.find('.datepicker-start-date');
                var selectedCheckbox = 'input[name="frequency_' + startDay(datepicker) + '"]';
                var prevSelectedCheckbox;
                var checkboxes = parent.find('.' + self.val() + '.weekdays-wrapper').find('input[type="checkbox"]');
                var daysCheckboxes = parent.find('.days-wrapper .checkbox input[type="checkbox"]');
                var serviceSelect = $('select[name="service"]');
                var serviceSelectOption = serviceSelect.find('option:selected');
                var serviceDays = $('.specific .checkbox input[type="checkbox"]');

                var conflictModal = $('.conflict-modal');
                var conflictFormIndex = conflictModal.find('.datatables-simple').find('input[type="radio"]:checked').parents('tr').index();
                var showedConflictForm = conflictModal.find('#assignment_form_' + (conflictFormIndex + 1));

                var parentForm = parent.find('#add-assignment-form');

                if(conflictModal.length && conflictModal.css('display') !== 'none') {
                    parent = showedConflictForm;
                    serviceSelect = showedConflictForm.find('select');
                    serviceSelectOption = serviceSelect.find('option:selected');
                    daysCheckboxes = parent.find('.days-wrapper .checkbox input[type="checkbox"]');
                    serviceDays = parent.find('.specific .checkbox input[type="checkbox"]');
                    parentForm = showedConflictForm.closest('form');
                }

                if(!(self.attr('name').indexOf('effective_dates') + 1)) {
                    self.closest('form').find('.cpe-filds.' + self.attr('name')).not('.' + self.val()).addClass('disable').find('input[type="text"]:not(.not-clear), input[type="number"], select:not(.outward_and_return select), textarea').not('[name="end_date"]').val('').attr('tabindex', '-1');
                }

                self.closest('form').find('.cpe-filds.' + self.attr('name')).not('.' + self.val()).find('.not-clear').attr('tabindex', '-1');

                if(self.attr('name') !== 'operating_days') {
                    if(!(self.attr('name').indexOf('effective_dates') + 1)) {
                        if(conflictModal.length && conflictModal.css('display') !== 'none') {
                            showedConflictForm.find('.cpe-filds.' + self.attr('name')).not('.' + self.val()).find('input[type="checkbox"]').prop({checked: false, disabled: false});
                        } else {
                            self.closest('form').find('.cpe-filds.' + self.attr('name')).not('.' + self.val()).find('input[type="checkbox"]').prop({checked: false, disabled: false});
                        }
                    }
                }

                self.closest('form').find('.cpe-filds.' + self.attr('name')).not('.' + self.val()).find('.selectpicker').trigger('change.select2');

                if(!(self.attr('name').indexOf('effective_dates') + 1)) {
                    $('.' + self.val()).removeClass('disable').find('input[type="text"], input[type="number"], select:not(.selectpicker), textarea').removeAttr('tabindex');
                }
                self.closest('form').find('.cpe-filds.' + self.attr('name')).find('.selectpicker').attr('disabled', false);
                self.closest('form').find('.cpe-filds.disable.' + self.attr('name')).find('.selectpicker').attr('disabled', true);

                if(datepickerDate(datepicker)) {
                    prevSelectedCheckbox = 'input[name="frequency_' + prevDay(datepicker) + '"]';
                    self.closest('form').find('.cpe-filds.' + self.attr('name')).not('.' + self.val()).find(selectedCheckbox).prop({checked: true, disabled: true}).removeClass('checked-day');

                    checkboxes.each(function() {
                        var that = $(this);
                        var name = that.attr('name');

                        if(name === 'frequency_' + prevDay(datepicker) && !$(prevSelectedCheckbox).hasClass('checked-day')) {
                            that.prop('checked', false);
                        }

                        if(that.hasClass('checked-day') && !that.prop('checked')) {
                            that.removeClass('checked-day');
                        } else if (!that.hasClass('checked-day') && that.prop('checked') && that.parent().hasClass('disable')) {
                            that.removeClass('checked-day');
                        } else if(!that.hasClass('checked-day') && that.prop('checked') && !that.prop('disabled')) {
                            that.addClass('checked-day');
                        }

                        if(!that.hasClass('checked-day')) {
                            that.prop('checked', false);
                        }

                        if(name === 'frequency_' + startDay(datepicker) && that.hasClass('checked-day')) {
                            that.parent().addClass('disable');
                        } else if (name === 'frequency_' + startDay(datepicker) && !that.hasClass('checked-day')) {
                            that.prop('checked', true).removeClass('checked-day').parent().addClass('disable');
                        } else {
                            that.parent().removeClass('disable');
                        }

                        if(that.prop('disabled')) {
                            that.prop('disabled', false)
                        }

                    });
                } else {
                    $('.weekdays-wrapper input[name^="frequency_"]').parent().removeClass('disable');
                }

                if(self.attr('value') == 'all') {
                    changeDatepickerDate(parent.find('.from-date'), parentForm.data('startDate') , function() {
                        parent.find('.from-date').addClass('disable').removeClass('not-clear').find('input').prop('disabled', true);
                    });
                    changeDatepickerDate(parent.find('.until-date'), parentForm.data('endDate') , function() {
                        parent.find('.until-date').addClass('disable').removeClass('not-clear').find('input').prop('disabled', true);
                    });
                }

                if(self.attr('value') == 'specific' && !(self.attr('name').indexOf('effective_days') + 1)) {
                    if((parent.find('.from-date').hasClass('disable') && !parent.find('.from-date').hasClass('not-clear')) && (parent.find('.until-date').hasClass('disable') && !parent.find('.until-date').hasClass('not-clear'))) {
                        clearDatepickerDate(parent.find('.from-date'), function() {
                            parent.find('.from-date').removeClass('disable').find('input').prop('disabled', false);
                        });
                        clearDatepickerDate(parent.find('.until-date'), function() {
                            parent.find('.until-date').removeClass('disable').find('input').prop('disabled', false)
                        });
                    }
                }

                if(self.attr('value') == 'everyday' && self.attr('name') == 'operating_days') {
                    selectedDays(daysCheckboxes, 'all', true);
                }

                if(self.attr('value') == 'weekdays' && self.attr('name') == 'operating_days') {
                    selectedDays(daysCheckboxes, 5, true);
                }

                if(self.attr('name').indexOf('effective_days') + 1) {

                    if(serviceSelectOption.data('service_days')) {
                        daysCheckboxes.each(function(i, item) {
                            if(serviceSelectOption.data('service_days').indexOf(i) == -1 && i < 5) {
                                parent.find('[value="weekdays"]').parent().addClass('disable');
                                if(self.attr('value') === 'weekdays') {
                                    parent.find('[value="service_days"]').click();
                                }
                                return false;
                            } else {
                                selectedDays(daysCheckboxes, 5, true);
                                parent.find('[value="weekdays"]').parent().removeClass('disable');
                            }
                        })
                    }

                }

                if(self.attr('value') == 'service_days') {
                    selectedDays(daysCheckboxes, serviceSelectOption.data('service_days'), true);
                }

                if(self.attr('value') == 'specified') {
                    daysCheckboxes.prop({'checked': false, 'disabled': false});
                }


                if(self.attr('value') == 'specific' && self.attr('name').indexOf('effective_days') + 1) {
                    daysCheckboxes.prop({'checked': false});

                    if(serviceSelectOption.data('service_days')) {
                        daysCheckboxes.each(function(i, item) {
                            if(serviceSelectOption.data('service_days').indexOf(i) == -1) {
                                $(this).prop('disabled', true);
                            } else {
                                $(this).prop('disabled', false);
                            }
                        })
                    }

                }

                if(parent.hasClass('service_create') && self.attr('value') == 'specified') {
                    daysCheckboxes.prop({'checked': false, 'disabled': false});
                }


                if(self.attr('value') == 'specified' || parent.find('.effective-days [value="specific"]').prop('checked')) {
                    if(conflictModal.length && conflictModal.css('display') !== 'none') {
                        daysCheckboxes.prop({'checked': false});
                        parent.find('.checked-day').prop('checked', true);
                    } else {
                        parent.find('.checked-day').prop('checked', true);
                    }
                }


                if((parent.find('[value="specified"]').length && !parent.find('[value="specified"]').prop('checked')) || (parent.find('.effective-days [value="specific"]').length && !parent.find('.effective-days [value="specific"]').prop('checked'))) {
                    parent.find('.checked-day').removeClass('checked-day');
                }

                //TODO: Ideally, it need to change on backend side
                $('label').find('input').closest('label').removeAttr('for');

            }, 10);

        }
        else {
            // $('.' + self.val()).addClass('disable').find('input[type="text"], input[type="number"], select:not(.outward_and_return select), textarea').val('').attr('tabindex', '-1');
            $('.' + self.val()).closest('.radio').find('.error').text('');
        }

        if (self.attr('name') == 'frequency') {
            var $form = self.closest('form');
            if (self.prop("checked") && self.val() == 'one_time') {
                var startDate = $form.find('input[name="start_date"]').val();

                $form.find('input[name="end_date"]').closest('.date').data("DateTimePicker").date(startDate);
                $form.find('input[name="end_date"]').attr('tabindex', '-1').closest('.form-inline').addClass('disable').find('input[type="radio"]').click();
                $form.find('input[name="end_after_repeats"]').val('').attr('tabindex', '-1').closest('.form-inline').addClass('disable');
            }
            else if(!parent.find('[value="one_time"]').prop('checked')){
                $form.find('input[name="end_date"], input[name="end_after_repeats"]').removeAttr('tabindex').closest('.form-inline').removeClass('disable');
                datePicker();
            }

        }

        if(parent.find(self).attr('value') == 'one_time' && parent.find(self).prop('checked')) {
            $('input[name="end_date"], input[name="end_after_repeats"]').closest('.form-inline').addClass('disable');
        }

        if(parent.find(self).attr('value') == 'after') {
            if(self.prop("checked")) {
                parent.find('input[name="end_date"]').prop('disabled', true);
            }
        }

        if(parent.find(self).attr('value') == 'end_date') {
            if(self.prop("checked")) {
                parent.find('input[name="end_date"]').prop('disabled', false);
            }
        }

    }

    function cpsCheckbox(self){
        if(self.prop("checked")) {
            $('.' + self.data('ticked')).addClass('disable').find('input[type="text"]').attr('tabindex', '-1').val('');
        }
        else {
            $('.' + self.data('ticked')).removeClass('disable');
        }
    }

    $('.cpe-checked').each(function(){
        cpeCheckbox($(this));
        $(this).on('change', function(){
            cpeCheckbox($(this));
        });
    });

    $('.cps-checkbox').each(function(){
        cpsCheckbox($(this));
        $(this).on('change', function(){
            cpsCheckbox($(this));
        });
    });

    function enbCheckbox(self){
        if(self.prop("checked")) {
            $('.' + self.data('ticked')).removeClass('disable').find('input, select, textarea').removeAttr('tabindex');
        }
        else {
            $('.' + self.data('ticked')).addClass('disable').find('input:not(.ncy-offset), select, textarea').val('').attr('tabindex', '-1');
        }
    }

    $('.enb-checkbox').each(function(){
        enbCheckbox($(this));
        $(this).on('change', function(){
            enbCheckbox($(this));
        });
    });

    $(document).on('change', 'select[name="service"]', function() {

        var selectedElement = $(this).find('option:selected');
        var parent = $(this).parents('form');

        if(selectedElement.data('is_morning') === '' && selectedElement.data('is_afternoon') === '') {

            switch(parent.data('journey-type')) {
                case 'round_trip':
                    parent.find('[value="outward_only"], [value="return_only"]').prop({'disabled': false, 'checked': false});
                    break;
                case 'outward_only':
                    parent.find('[value="return_only"]').prop('disabled', true);
                    parent.find('[value="outward_only"]').prop({'disabled': false, 'checked': true});
                    break;
                case 'return_only':
                    parent.find('[value="outward_only"]').prop('disabled', true);
                    parent.find('[value="return_only"]').prop({'disabled': false, 'checked': true});
                    break;
            }

        } else if (selectedElement.data('is_morning') === '') {
            parent.find('[value="return_only"]').prop('disabled', true);
            parent.find('[value="outward_only"]').prop({'disabled': false, 'checked': true});
        } else if (selectedElement.data('is_afternoon') === '') {
            parent.find('[value="outward_only"]').prop('disabled', true);
            parent.find('[value="return_only"]').prop({'disabled': false, 'checked': true});
        }

       $('.cpe-checked').each(function(){
           cpeCheckbox($(this));
       });

    })


    function onloadPage() {

        if($('input[value="one_time"]').prop('checked')) {
            $('input[name="end_date"], input[name="end_after_repeats"]').closest('.form-inline').addClass('disable');
        }

        if($('input[value="after"]').prop('checked')) {
            $('[name="end_date"]').prop('disabled', true);
        }

    }

    onloadPage();


    // autocomplete_input_ajax
    function autocompleteInputAjax() {
      var autocomplete_input = $('input[name="address_search"], input[name="school_search"], input[name="stop_search"], input[name="client_search"]');

      autocomplete_input.each(function(){
        var self = $(this),
            form = self.closest('form');

        self.attr('autocomplete', 'off');
        self.after('<ul class="drop_autocomplete"></ul>');

        var drop_autocomplete = self.closest('.form-group').find('.drop_autocomplete');

        self.off('keyup').on('keyup', function(){
          var form_data = 'address-search', data = {'address_search': self.val()};
          var id_input = '#id_address';
          var valueSchool = self.val();
          if (self.attr('name') == 'school_search') {
            var init = self.val().indexOf('(');
            var fin = self.val().lastIndexOf(')');
            if (self.val().substr(init+1,fin-init-1) !== '') {
                valueSchool = self.val().substr(init+1,fin-init-1);
            }
            else {
                valueSchool = self.val();
            }
            form_data = 'school-search';
            data = {'school_search': valueSchool};
            id_input = '#id_school';
          }
          else if (self.attr('name') == 'stop_search') {
            form_data = 'stop-search';
            data = {'stop_search': self.val()};
            id_input = '#id_stop_search_id';
          }
          else if (self.attr('name') == 'client_search') {
            form_data = 'client-search';
            data = {'client_search': self.val()};
            id_input = '#id_client';
          }
          if (self.val().length > 2) {
              $.ajax({
                  url: form.data(form_data) || form.attr('action'),
                  dataType: 'json',
                  delay: 250,
                  data: data,
                  success: function(e){
                      if (e.length > 0) {
                          self.closest('.form-group').addClass('drop_autocomplete_open');
                          drop_autocomplete.html('').show();
                          $.each(e, function( index, value ) {
                            if (value.fields.full_address) {
                              drop_autocomplete.append('<li data-id="'+ value.pk + '">'+value.fields.full_address+'</li>');
                              if (self.val() !== value.fields.full_address) {
                                  form.find(id_input).val('');
                              }
                            }
                            else if (value.fields.stop_choice) {
                                drop_autocomplete.append('<li data-id="'+ value.pk + '">'+value.fields.stop_choice+'</li>');
                                if (self.val() == value.fields.stop_choice) {
                                    form.find(id_input).val(value.pk);
                                    form.find('.error').text('');
                                }
                            }
                            else if (value.fields.client_choice) {
                                drop_autocomplete.append('<li data-id="'+ value.pk + '">'+value.fields.client_choice+'</li>');
                                if (self.val() == value.fields.client_choice) {
                                    form.find(id_input).val(value.pk);
                                    form.find('.error').text('');
                                }
                            }
                            else {
                              drop_autocomplete.append('<li data-id="'+ value.pk + '">'+value.fields.school_choice+'</li>');
                              if (self.val() !== value.fields.school_choice) {
                                  form.find(id_input).val('');
                              }
                            }
                          });
                      }
                      else {
                          form.find(id_input).val('');
                          drop_autocomplete.html('').hide();
                      }
                      $(drop_autocomplete).find('li').on('click', function(){
                          self.val($(this).text());
                          form.find(id_input).val($(this).data('id'));
                          self.closest('.form-group').removeClass('drop_autocomplete_open');
                          drop_autocomplete.hide();
                          var get_locations_url = get_clients_locations_url.replace(/1/, $('#id_client').val());
                          if (self.attr('name') == 'client_search' && $('#id_type').val() !== '') {
                            $.ajax({
                                url: get_locations_url,
                                dataType: 'json',
                                delay: 250,
                                data: {'request_type': $('#id_type').val()},
                                success: function(response){
                                    if (response.length == 0) {
                                        form.find('#id_pick_up_location, #id_drop_off_location').select2('destroy').empty().select2({
                                            theme: "bootstrap",
                                            width: 'auto',
                                            data: [{"id": "", "text": "---------"}]
                                        }).find('option:not([value])').attr('value', '').closest('.form-group').removeClass('disable');
                                    }
                                    else {
                                        $.each(response, function(key, val) {
                                            var responseOption = [];
                                            if (val.length > 1) {
                                                responseOption.push({"id": "", "text": "---------"});
                                                $.each(val, function(i){
                                                    responseOption.push({
                                                      "id": val[i].id,
                                                      "text": val[i].text
                                                    });
                                                });
                                                form.find('select[name="' + key + '"]').closest('.form-group').removeClass('disable');
                                            }
                                            else {
                                                if (val.length !== 0) {
                                                    $.each(val, function(i){
                                                        responseOption.push({
                                                          "id": val[i].id,
                                                          "text": val[i].text,
                                                          "selected": 'selected'
                                                        });
                                                    });
                                                    form.find('select[name="' + key + '"]').closest('.form-group').addClass('disable');
                                                }
                                                else {
                                                    responseOption.push({"id": "", "text": "---------"});
                                                    form.find('select[name="' + key + '"]').closest('.form-group').removeClass('disable');
                                                }
                                            }
                                            form.find('select[name="' + key + '"]').select2('destroy').empty().select2({
                                                theme: "bootstrap",
                                                width: 'auto',
                                                data: responseOption
                                            }).find('option:not([value])').attr('value', '');
                                        });
                                    }
                                }
                            });
                          }
                      });
                  }
              });
          }
          else {
              self.closest('.form-group').removeClass('drop_autocomplete_open');
              drop_autocomplete.hide();
              form.find(id_input).val('');
          }
        });
        self.on('change', function(){;
            if (self.attr('name') == 'client_search' && $('#id_client').val() == '' ) {
              form.find('#id_pick_up_location, #id_drop_off_location').select2('destroy').empty().select2({
                  theme: "bootstrap",
                  width: 'auto',
                  data: [{"id": "", "text": "---------"}]
              }).find('option:not([value])').attr('value', '').closest('.form-group').removeClass('disable');
            }
        });
      });
    }
    autocompleteInputAjax();

    $(document).on('click', function(e) {
      if (!$(e.target).closest('.drop_autocomplete_open').length) {
        $('.drop_autocomplete').hide().closest('.form-group').removeClass('drop_autocomplete_open');
      }
      e.stopPropagation();
    });

    function plan_chosen(self, modal) {
        if (self.prop('checked')) {
            if (self.val() == 'existing_schedule' || self.val() == 'from_template') {
                modal.find('table.datatables-simple').removeClass('disable');
            }
            else {
                modal.find('table.datatables-simple').addClass('disable');
                modal.find('table.datatables-simple input').prop('checked', false);
            }
            if (self.val() == 'auto_assign') {
                modal.find('table.datatables-simple .td_auto_plan input').prop('checked', true);
            }
        }
    }

    $(document).on('click', 'a[data-can-plan]', function (e) {
        e.preventDefault();
        var planUrl = $(this).data('plan-edit-url');

        $.ajax({
            url: planUrl,
            success: function (response) {
                var modal = $(response).modal('show');

                modal.on('shown.bs.modal', function () {
                    var tableUpdate = initializeDataTable(modal.find('table.datatables-simple'));
                    resize_table();
                });
                $(document).unbind("submit").on("submit", '.form-plan-edit', function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    $.ajax({
                        url: planUrl,
                        data: $(this).serialize(),
                        delay: 250,
                        method: $(this).attr('method'),
                        success: function (response) {
                            if (response.details) {
                              toastr.options = {"closeButton": true};
                              toastr.success(response.details);
                            }
                            if (response.redirect) {
                                window.location.href = response.redirect;
                            }
                            else {
                                location.reload();
                            }
                        },
                        error: function (xhr, status, error) {
                          var obj = xhr.responseJSON;
                          $.each(obj, function(key, val) {
                            $('.'+ key).html('');
                            $.each(val, function(index){
                                $('.'+ key).append(val[index] + '</br>');
                            });
                          });
                        }
                    });
                });
                modal.find('#id_action input').each(function(){
                    $(this).closest('label').removeAttr('for');
                    $(this).on('click', function(){
                        plan_chosen($(this), modal);
                    });
                    plan_chosen($(this), modal);
                });
            }
        });
    });

    $(window).on('load', function (e) {

      if($('#plans-content').length) {
        var table = $('#plans-list');
        var content = $('#plans-content');
        var preloader = $('.spinner-wrapper');
        var planDatepicker = $('.plans-select-date .date').data("DateTimePicker");
        var maxDate = $('.plans-select-date').data('max-date');

        preloader.show();
        planDatepicker.maxDate(new Date(moment(maxDate, 'DD/MM/YYYY', true).format()));

        function getUrlVars() {
            var vars = {};
            var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
                vars[key] = value;
            });
            return vars;
        }

        var getParametersLength = Object.keys(getUrlVars()).length;

        if (table.data('fully_planned') === 'False' || table.data('replan_needed') == 'True') {
          var url = window.location.href +  (!getParametersLength ? '?':'&') + 'generate_plans';

          $.ajax({
            url: url,
            success: function (response) {
              var tableUpdate;
              preloader.hide();
              content.html(response);
              tableUpdate = initializeDataTable($('table.datatables-simple'));
              tableUpdate.responsive.recalc();
            }
          })
        } else {
            preloader.hide();
        }

      }

    });

    //schedule plans
    $('.tabs-component-tabs a[data-url]').on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var url = $(this).data('url');
      var id = $(this).attr('href');

      $.ajax({
        url: url,
        success: function (response) {
          $(id).find('.schedule-plans-content').html(response);
          var planDatepicker;
          var datepicker = $('.plans-select-date .date');
          var maxDate = $('.plans-select-date').data('max-date');
          var table = initializeDataTable($(id).find('table.datatables-simple'));

          datepicker.datetimepicker({
              format:"DD/MM/YYYY",
              useCurrent: false
          });

          planDatepicker = $('.plans-select-date .date').data("DateTimePicker");
          planDatepicker.maxDate(new Date(moment(maxDate, 'DD/MM/YYYY', true).format()));

          resize_table();
          setTimeout(function() {
            table.responsive.recalc();
          }, 0);

          $(id).unbind('click').on('click', '.checkbox a, .plans-nav a, .paginate-wraper a', function(e){
              e.preventDefault();
              e.stopPropagation();
              $(id).find('table.datatables-simple').after('<div class="dataTables_processing">Processing...</div>');

              $.ajax({
                  url: url + $(this).attr('href'),
                  success: function(response){
                      $(id).find('.schedule-plans-content').html(response);
                      initializeDataTable($(id).find('table.datatables-simple'));
                      resize_table();
                      autocompleteInputAjax();
                      datePicker();
                  }
              });
          });

          $(id).on('click', '.btn', function(e){
            var $form = $(id).find('.plans-select-date');

            e.preventDefault();
            e.stopPropagation();
            $(id).find('table.datatables-simple').after('<div class="dataTables_processing">Processing...</div>');

            $.ajax({
                url: url,
                data: $form.serialize() + '&get_week',
                success: function(response){
                    $(id).find('.schedule-plans-content').html(response);
                    initializeDataTable($(id).find('table.datatables-simple'));
                    resize_table();
                    autocompleteInputAjax();
                    datePicker();
                }
            });
          });

        }
      })
    });

    // nav tabs ajax
    $('.nav-tabs li a[data-url]').on('click', function(e){
        var url = $(this).data('url');
        var id = $(this).attr('href');
        var parent = $('.tab-pane.active');

        $('.ajax-content').attr('id', id.replace('#', '')).find('.wrapper-table').html('');
        $.ajax({
            url: url,
            success: function(response){
                $(id).addClass('active');
                $(id).find('.wrapper-table').html(response);
                autocompleteInputAjax();
                var table = initializeDataTable($(id).find('table.datatables-simple'));
                resize_table();
                setTimeout(function() {
                  table.responsive.recalc();
                }, 0);
                $(id).unbind('click').on('click', '.sorting_disabled a, .checkbox a, .paginate-wraper a', function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    $(id).find('table.datatables-simple').after('<div class="dataTables_processing">Processing...</div>');
                    $.ajax({
                        url: url + $(this).attr('href'),
                        success: function(response){
                            $(id).find('.wrapper-table').html(response);
                            initializeDataTable($(id).find('table.datatables-simple'));
                            resize_table();
                            autocompleteInputAjax();
                            datePicker();
                        }
                    });
                });

                $(id).find('.enb-checkbox').each(function(){
                    enbCheckbox($(this));
                    $(this).on('change', function(){
                        enbCheckbox($(this));
                    });
                });

                $(id).find('.cpe-checked').each(function(){
                    cpeCheckbox($(this));
                    $(this).on('change', function(){
                        cpeCheckbox($(this));
                    });
                });

                $(id).find('.selectpicker').select2({
                  theme: "bootstrap",
                  width: 'auto'
                });

                $(id).find('.add-assigment-btn').click(function(e) {
                    var allDates = $('input[value="all"]');
                    var requestStartDate =  datepickerDate("#add-request-form .start-date-from");
                    var requestEndDate = datepickerDate("#add-request-form .end_date");

                    if (!datepickerDate(".from-date") && datepickerDate(".until-date")) {
                        changeDatepickerDate('.from-date', requestStartDate);
                    } else if (datepickerDate(".from-date") && !datepickerDate(".until-date")) {
                        changeDatepickerDate('.until-date', requestEndDate);
                    } else if(!datepickerDate(".until-date") && !datepickerDate(".until-date")) {
                        allDates.prop('checked', true);
                        cpeCheckbox($(id).find(allDates));
                    }

                });
                datePicker();
            }
        });
    });

    $('.search-tables').on( 'keyup', function () {
        initializeDataTable($('.tab-pane.active').find('table.datatables-simple')).search(this.value).draw();
    });

    $('.beforeunload-form').on('change', 'input, select, textarea', function() {
        function confirmWinClose () {
            if (beforCheck) {
                return 'Are you sure you want to leave?';
            }
            return undefined;
        }
        window.onbeforeunload = confirmWinClose;
    });

    $(document).on("change", 'table td.checkbox-td input', function(e){
        $(this).closest('tr').toggleClass('current', this.checked);
        $(this).closest('form').find('.btn[type="submit"]').attr('disabled', ! $('td.checkbox-td input').filter(':checked').length);
    });

    $(document).on("submit", '.ajax-form-simple', function(e){
        var $form = $(this);
        e.preventDefault();
        e.stopPropagation();

        function ajaxSimple(){
            // if ($form.is('#add-request-form')) {

            // }
            $form.find('.cpe-filds.disable').find('.selectpicker').attr('disabled', false);
            $.ajax({
                url: $form.attr('action'),
                data: $form.serialize(),
                delay: 250,
                method: $form.attr('method'),
                success: function(response){
                    $form.find('.error').html('');
                    if ($form.hasClass('school-form') || $form.hasClass('guardian-form') || $form.hasClass('stop-form')) {
                        if ($(response).hasClass('conflict-modal')) {
                            $('.spinner-wrapper').hide();
                            $('#modal-assign')
                                .modal('show')
                                .html(response);
                            initializeDataTable($('#modal-assign').find('table.datatables-simple')).draw();
                        }
                        else {
                            $form.closest('.wrapper-table').find('.school-form-wrapper, .guardian-form-wrapper, .content-form-wrapper').removeClass('hidden').html(response);
                            $('.tab-pane.active').find('tr').removeClass('edit-tr');
                            $('.tab-pane.active').find('tr.current').addClass('edit-tr');
                            $form.find('.error').html('');
                            $form.find('.drop_autocomplete').remove();
                            initializeDataTable($('.wrapper-table').find('table.assignment-table')).draw();
                            resize_table();
                        }
                    }
                    else if ($form.hasClass('archive-school') || $form.hasClass('archive-guardian') || $form.hasClass('archive-stop')) {
                        // toastr.options = {"closeButton": true};
                        // toastr.success(response.details);
                        $form.closest('.archive-btn').find('button[type="submit"]').attr('disabled', false);
                        $form.find('button[type="submit"]').attr('disabled', true);
                        $form.closest('.wrapper-table').find('tr.edit-tr').toggleClass('selected');
                        initializeDataTable($('.tab-pane.active').find('table.datatables-simple')).draw();
                    }
                    else {
                        $form.closest('.wrapper-table').html(response);
                        initializeDataTable($('.tab-pane.active').find('table.datatables-simple'));
                        resize_table();
                    }

                    if (response.details) {
                      toastr.options = {"closeButton": true};
                      toastr.success(response.details);
                    }
                    else if (response.redirect) {
                        window.location.href = response.redirect;
                    }

                    $('.spinner-wrapper').hide();
                    datePicker();
                    timePicker();
                    autocompleteInputAjax();
                    checkName($('.tab-pane.active').find('.check-name'), $('.tab-pane.active').find('.check-name').attr('name'));
                    $('.tab-pane.active').find('.enb-checkbox').each(function(){
                        enbCheckbox($(this));
                        $(this).on('change', function(){
                            enbCheckbox($(this));
                        });
                    });
                    $('.tab-pane.active').find('.cpe-checked').each(function(){
                        cpeCheckbox($(this));
                        $(this).on('change', function(){
                            cpeCheckbox($(this));
                        });
                    });
                    $('.tab-pane.active').find('.selectpicker').select2({
                      theme: "bootstrap",
                      width: 'auto'
                    });

                    $('.start-date').on('dp.change', function() {
                        $('.tab-pane.active').find('.cpe-checked').each(function(){
                            cpeCheckbox($(this));
                            $(this).on('change', function(){
                                cpeCheckbox($(this));
                            });
                        });
                    })
                },
                error: function (xhr, status, error) {
                  var obj = xhr.responseJSON;
                  $form.find('.error').html('');
                  setTimeout(function() {
                        $('.spinner-wrapper').hide();

                        $.each(obj, function(key, val) {
                            $form.find('[name="'+ key +'"]').each(function() {
                                $(this).closest('.form-group, .radio .radio').find('.error').html('');
                                $(this).closest('.form-group, .radio .radio').find('.error').html(val);
                            });
                        });

                        if($('.conflict-modal').css('display') !== 'none') {
                            var tabel = $('.conflict-modal .datatables-simple');

                            tabel.find('tr .conflict-warning').removeClass('show');

                            $.each(obj, function(i, object) {
                                $.each(object, function(key) {
                                    tabel.find('tr').find('th .conflict-warning').addClass('show');
                                    tabel.find('tr').eq(i + 1).find('td .conflict-warning').addClass('show');
                                    if(key === '__all__') {
                                        $form.find('#assignment_form_' + (i + 1)).find('[name="' + key + '"]').each(function() {
                                            $(this).closest('.form-group, .radio .radio').find('.error').html('');
                                            $(this).closest('.form-group, .radio .radio').find('.error').html(object[key]);
                                        });
                                    } else {
                                        $form.find('[name="form-' + i + '-' + key + '"]').each(function() {
                                            $(this).closest('.form-group, .radio .radio').find('.error').html('');
                                            $(this).closest('.form-group, .radio .radio').find('.error').html(object[key]);
                                        });
                                    }
                                })
                            });
                        }

                        $form.find('.drop_autocomplete').remove();
                        autocompleteInputAjax();
                        onloadPage();
                  }, 500);

                  if($form.attr('id') !== 'add-assignment-form') {
                    $('.tab-pane.active').find('.enb-checkbox').each(function(){
                        enbCheckbox($(this));
                        $(this).on('change', function(){
                            enbCheckbox($(this));
                        });
                    });
                    $('.tab-pane.active').find('.cpe-checked').each(function(){
                        cpeCheckbox($(this));
                        $(this).on('change', function(){
                            cpeCheckbox($(this));
                        });
                    });
                  }

                  if (obj.details) {
                    toastr.options = {"closeButton": true};
                    toastr.error(obj.details);
                  }
                }
            });
        }

        if ($form.find('button[type="submit"]').hasClass('remove-btn')) {
            swal({
              title: "Remove selected locations?",
              type: "warning",
              showCancelButton: true,
              confirmButtonClass: "btn-danger",
              confirmButtonText: "Yes, remove!"
            },
            function(){
                ajaxSimple();
            });
        }
        else {
            $('.spinner-wrapper').show();
            ajaxSimple();
        }
    });

    $(document).on('keydown', 'input[name="location_search"]', function(e) {
          if (e.keyCode == 13) {
            e.preventDefault();
            e.stopPropagation();
            $('.search-ajax').click();
          }
    });

    $(document).on('keydown', 'input[name="guardian_search"]', function(e) {
          if (e.keyCode == 13) {
            e.preventDefault();
            e.stopPropagation();
            $('.search-guardians-ajax').click();
          }
    });

    $(document).on("click", '.search-ajax', function(e){
        var $form = $(this).closest('form');

        $.ajax({
            url: $form.data('location-search'),
            dataType: 'json',
            delay: 250,
            data: {"location_search": $form.find('#id_location_search').val()},
            success: function(response){
                var dataSet = [];
                var table = $form.find('table.location-table').removeClass('hidden').DataTable({
                    "iDisplayLength": 10,
                    "scrollCollapse": true,
                    "bLengthChange": false,
                    "processing": false,
                    "serverSide": false,
                    "bInfo": false,
                    "retrieve": true,
                    // "scrollX": false,
                    // "scrollY": true,
                    "searching": false,
                    "sDom": 'pt',
                    "paging": true,
                    "columnDefs": [{
                        "targets": [0],
                        "searching": false,
                        "ordering": false,
                        "orderable": false,
                        "className": "checkbox-td"
                    }],
                    fnDrawCallback: function (oSettings) {
                        var pgr = $(oSettings.nTableWrapper).find('.dataTables_paginate');
                        if (oSettings._iDisplayLength >= oSettings.fnRecordsDisplay()) {
                            pgr.hide();
                        } else {
                            pgr.show();
                        }
                    }
                });
                $form.find('table.location-table').closest('.dataTables_wrapper').show();
                $form.find('input[name="location"]').val('');
                table.clear();

                $.each(response, function(i){
                    if (i.length > 0) {
                        $('input[name="'+i+'"]').next('.error').html(response.location_search);
                        $form.find('table.location-table').addClass('hidden').closest('.dataTables_wrapper').hide();
                        table.clear();
                    }
                    else {
                        table.row.add(['<input type="radio" value="'+response[i].pk+'">', response[i].fields.location_type, '<a href="'+response[i].fields.url+'">'+response[i].fields.full_address+'</a>']);
                        table.draw();
                    }
                });

                if (response.length === 0) {
                    $('input[name="location_search"]').next('.error').html('Locations are not found');
                    $form.find('table.location-table').addClass('hidden').closest('.dataTables_wrapper').hide();
                    table.clear();
                }
                else if(response.length > 0) {
                    $('input[name="location_search"]').next('.error').html('');
                }

                $(document).on("change", 'table input[type="radio"]', function(e){
                    $form.find('input[name="location"]').val($(this).val());
                });

            }
        });
    });

    $(document).on("click", '.search-guardians-ajax', function(e){
        var $form = $(this).closest('form');

        $.ajax({
            url: $form.data('guardian-search'),
            dataType: 'json',
            delay: 250,
            data: {"guardian_search": $form.find('#id_guardian_search').val()},
            success: function(response){
                var dataSet = [];
                var table = $form.find('table.guardian-table').removeClass('hidden').DataTable({
                    "iDisplayLength": 10,
                    "scrollCollapse": true,
                    "bLengthChange": false,
                    "processing": false,
                    "serverSide": false,
                    "bInfo": false,
                    "retrieve": true,
                    // "scrollX": false,
                    // "scrollY": true,
                    "searching": false,
                    "sDom": 'pt',
                    "paging": true,
                    "columnDefs": [{
                        "targets": [0],
                        "searching": false,
                        "ordering": false,
                        "orderable": false,
                        "className": "checkbox-td"
                    }],
                    fnDrawCallback: function (oSettings) {
                        var pgr = $(oSettings.nTableWrapper).find('.dataTables_paginate');
                        if (oSettings._iDisplayLength >= oSettings.fnRecordsDisplay()) {
                            pgr.hide();
                        } else {
                            pgr.show();
                        }
                    }
                });
                $form.find('table.guardian-table').closest('.dataTables_wrapper').show();
                $form.find('input[name="guardian"]').val('');
                table.clear();

                $.each(response, function(i){
                    if (i.length > 0) {
                        $('input[name="'+i+'"]').next('.error').html(response.guardian_search);
                        $form.find('table.guardian-table').addClass('hidden').closest('.dataTables_wrapper').hide();
                        table.clear();
                    }
                    else {
                        table.row.add(['<input type="radio" value="'+response[i].pk+'">', response[i].fields.title, response[i].fields.first_name, response[i].fields.surname, response[i].fields.current_address]);
                        table.draw();
                    }
                });

                if (response.length === 0) {
                    $('input[name="guardian_search"]').next('.error').html('Guardians are not found');
                    $form.find('table.guardian-table').addClass('hidden').closest('.dataTables_wrapper').hide();
                    table.clear();
                }
                else if(response.length > 0) {
                    $('input[name="guardian_search"]').next('.error').html('');
                }

                $(document).on("change", 'table input[type="radio"]', function(e){
                    $form.find('input[name="guardian"]').val($(this).val());
                });

            }
        });
    });

    $(document).on("change", 'table input[type="radio"]', function(e){
        var table = $(this).closest('table');
        table.find('input[type="radio"]').each(function(){
            table.find('input[type="radio"]').prop('checked', false);
            table.find('tr').removeClass('current');
        });
        $(this).prop('checked', true).closest('tr').toggleClass('current');
    });

    $(document).on("submit", '.ajax-form-location', function(e){
        var $form = $(this);

        e.preventDefault();
        e.stopPropagation();
        if ($form.find('.line1-hiden').val() == '') {
            $form.find('.line1-hiden, .full-address-hiden').val($form.find('.location-search').val());
        }
        $.ajax({
            url: $form.attr('action'),
            data: $form.serialize(),
            delay: 250,
            method: $form.attr('method'),
            success: function(response){
                $('.modal').modal('hide');
                $('.modal-backdrop').remove();
                $form.closest('.wrapper-table').html(response);
                initializeDataTable($('.tab-pane.active').find('table.datatables-simple'));
                resize_table();
                $('.spinner-wrapper').hide();
            },
            error: function (xhr, status, error) {
              var obj = xhr.responseJSON;
              $form.find('.error').html('');
              $form.find('.line1-hiden, .full-address-hiden').val('');
              $.each(obj, function(key, val) {
                $form.find('[name="'+ key +'"]').each(function() {
                  $(this).closest('.form-group').find('.error').html('');
                  $(this).closest('.form-group').find('.error').html(val);
                });
                if (key == 'line1') {
                    $form.find('.location-search').closest('.form-group').find('.error').html(val);
                }
              });
            }
        });
    });

    $(document).on("submit", '.ajax-form-guardians', function(e){
        var $form = $(this);
        e.preventDefault();
        e.stopPropagation();
        $.ajax({
            url: $form.attr('action'),
            data: $form.serialize(),
            delay: 250,
            method: $form.attr('method'),
            success: function(response){
                $('.modal').modal('hide');
                $('.modal-backdrop').remove();
                // $form.closest('.wrapper-table').html(response);
                $form.closest('.wrapper-table').find('.guardian-form-wrapper').removeClass('hidden').html(response);
                // initializeDataTable($('.tab-pane.active').find('table.datatables-simple'));
                // resize_table();

                $('.spinner-wrapper').hide();
            },
            error: function (xhr, status, error) {
              var obj = xhr.responseJSON;
              $form.find('.error').html('');
              $form.find('.line1-hiden, .full-address-hiden').val('');
              $.each(obj, function(key, val) {
                $form.find('[name="'+ key +'"]').each(function() {
                  $(this).closest('.form-group').find('.error').html('');
                  $(this).closest('.form-group').find('.error').html(val);
                });
                if (key == 'line1') {
                    $form.find('.location-search').closest('.form-group').find('.error').html(val);
                }
              });
            }
        });
    });

    $(document).on('show.bs.modal', '.modal', function () {
        var that = $(this);
        
        that.find('form').each(function(index){
            that.find('div input[type="text"], div select').each(function(){
                that.val('');
            });
            that.find('.error').text('');
            that.find('.dataTables_wrapper').hide();
        });

        if(that.hasClass('modal-archive-schedule')) {
          $(this).find('input[type="radio"]').on('change', function () {
            if($(this).val() === 'remove') {
              that.find('select').attr('disabled', true).val('');
            } else {
              that.find('select').attr('disabled', false);
            }
          })
        }
    });

    $('#modal-archive-schedule').on('show.bs.modal', '.modal', function () {
      console.log(this);
        $(this).find('form').each(function(index){
            $(this).find('div input[type="text"], div select').each(function(){
                $(this).val('');
            });
            $(this).find('.error').text('');
            $(this).find('.dataTables_wrapper').hide();
        });
    });

    $(document).on('click', 'label.link input', function () {
        $(this).closest('a')[0].click();
    }).on('click', '.add-school-btn, .edit-guardian-btn, .add-stop-btn', function(){
        var school_form_wrapper = $(this).closest('.wrapper-table').find('.school-form-wrapper, .guardian-form-wrapper, .content-form-wrapper');
        var table = $(this).closest('.wrapper-table').find('.school-form, .guardian-form, .stop-form-table');

        if ($(this).hasClass('cancel')) {
            school_form_wrapper.addClass('hidden');
        } else {
            school_form_wrapper.removeClass('hidden');
        }
        school_form_wrapper.find('input[type="text"], input[type="number"], select, input[name="selected_pass"], input[name="selected_journey"], input[name="selected_exclusion"], textarea').val('');
        school_form_wrapper.find('input[type="checkbox"], input[type="radio"]:not(".not-reset")').prop('checked', false);
        $('input[type=radio].not-reset').prop('checked', function () {
            return this.getAttribute('checked') == '';
        });
        school_form_wrapper.find('input[name=services_covered][value=not_specified]').prop('checked', true);
        school_form_wrapper.find('input[name=type][value=home_to_school], input[name=frequency][value=every_day]').prop('checked', true);
        school_form_wrapper.find('.default-val').each(function(){
          $(this).val($(this).data('default'));
        });
        school_form_wrapper.find('.selected-school').addClass('hidden');
        school_form_wrapper.find('#id_selected_school').remove();
        table.find('input[type="radio"]').each(function(){
            table.find('input[type="radio"]').prop('checked', false);
            table.find('tr').removeClass('current');
        });
        table.find('button[type="submit"]').attr('disabled', true);

        $('.tab-pane.active').find('.date').each(function(){
          $(this).data("DateTimePicker").clear();
        });

        school_form_wrapper.find('.error').html('');
        school_form_wrapper.find('.selectpicker').val('').trigger('change.select2');
        school_form_wrapper.find('#id_home_stop, #id_school_stop').select2('destroy').empty().select2({
            theme: "bootstrap",
            width: 'auto',
            data: [{"id": "", "text": "---------", "selected": 'selected'}]
        }).find('option:not([value])').attr('value', '');

        checkName($('.tab-pane.active').find('.check-name'), $('.tab-pane.active').find('.check-name').attr('name'));

        school_form_wrapper.find('.cpe-checked').each(function(){
            cpeCheckbox($(this));
        });

        $('.start-date').on('dp.change', function() {
            school_form_wrapper.find('.cpe-checked').each(function(){
                cpeCheckbox($(this));
            });
        })

        datePicker();
    });

    $(document).on('change', 'select.location-type', function () {
        if ($.inArray(parseInt($(this).val()), $(this).closest('form').data('address-locations')) > -1) {
            $(this).closest('form').find('input[name="name"]').attr('tabindex', '-1').val('').closest('.form-group').addClass('disable');
        }
        else {
            $(this).closest('form').find('input[name="name"]').removeAttr('tabindex').closest('.form-group').removeClass('disable');
        }
    }).on('click', 'button[type="submit"]', function(e){
        $(document).find('form#' + $(this).data("form")).submit();
    }).on('click', '.archive-btns button', function(e){
        $(document).find('form#' + $(this).data("form")).submit();
        $(document).find('.archive-btns button').attr('disabled', false);
        $(this).attr('disabled', true);
    });

    $('.archived-element-list input').each(function(){
        var archived_services = $(this).closest('.archived-element-list').data('archived-elements');
        if (archived_services && $.inArray(parseInt($(this).val()), archived_services) > -1) {
            $(this).prop("checked", false).closest('label').css('text-decoration', 'line-through');
        }
    }).on('change', function(){
        var archived_services = $(this).closest('.archived-element-list').data('archived-elements');
        if (archived_services && $.inArray(parseInt($(this).val()), archived_services) > -1) {
            if (!$(this).prop("checked")) {
                $(this).closest('label').css('text-decoration', 'line-through');
            }
            else {
                $(this).closest('label').css('text-decoration', 'none');
            }
        }
        else {
            $(this).closest('label').css('text-decoration', 'none');
        }
    });

    function fixHeight(element) {
        if (element.length == 0) {
          return;
        }
        var height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
        height = height - element.offset().top;
        element.css("height", (height) + "px");
    }

    $(window).bind("load resize", function() {
        fixHeight($(".sidebar .body"));
        fixHeight($(".wrapper-scroll"));
    });

    $(document).on('keydown', 'input[type="number"]', function (e) {
      if (e.keyCode == 69) {
        e.preventDefault();
      }
    });

    $('.selectpicker').select2({
      theme: "bootstrap",
      width: 'auto'
    });

    var open_tab_btn = $('.panes-form').find('.open-tab-btn').val();
    if (open_tab_btn) {
        open_tab_btn = open_tab_btn.split(',');

        if (open_tab_btn.length > 1) {
            $.each(open_tab_btn , function(i) {
                $('.nav-tabs a[href="#' + $.trim(open_tab_btn[i+1]) + '"]').css('background', '#f3d9d9');
            });
        }
        $('.nav-tabs a[href="#' + $.trim(open_tab_btn[0]) + '"]').click();
    }
    $('select').each(function(){
        var self = $(this);
        var arrDisable = $(this).data('disabled');
        if (arrDisable) {
            self.find('option').each(function(){
                var option = $(this);
                var valOption = $(this).val();
                $.each(arrDisable , function(i, val) {
                    if (valOption == val) {
                        option.attr('disabled', 'disabled');
                    }
                });
            });
        }
    });

    function service_time(self) {
        if(self.prop("checked") && self.val() == 'all_day') {
            $('.reciprocal').addClass('disable').find('input').prop('checked', false).attr('tabindex', '-1');
            $('.reciprocal').find('select').val('').trigger('change.select2').attr('tabindex', '-1');
        }
        else {
            $('.reciprocal').removeClass('disable').find('input, select').removeAttr('tabindex');
        }
    }

    $('#id_service_time input').each(function(){
        service_time($(this));
        $(this).on('change', function(){
            service_time($(this));
        });
    });
    $('#id_service_time input').on('change', function(){
        if ($(this).prop("checked") && $(this).val() !== 'all_day') {
            $('.reciprocal').removeClass('disable').find('input, select').removeAttr('tabindex');

            var service_id = $(this).closest('.radio').data('service-pk') || '';
            $.ajax({
                url: $(this).closest('.radio').data('url'),
                method: 'POST',
                data: {"working_hours": $(this).val(), "service_id": service_id},
                success: function(response){
                    var reciprocalOption = [];
                    reciprocalOption.push({"id": "", "text": "---------", "disabled": false});
                    $.each(response, function(i){
                        reciprocalOption.push({
                          "id": response[i].id,
                          "text": response[i].text,
                          "disabled": response[i].disabled
                        });
                    });
                    $('.reciprocal select').select2('destroy').empty().select2({
                        theme: "bootstrap",
                        width: 'auto',
                        data: reciprocalOption
                    });
                }
            });
        }
        else {
            $('.reciprocal select').select2('destroy').empty().select2({
                theme: "bootstrap",
                width: 'auto',
                data: [{"id": "", "text": "---------", "disabled": false}]
            });
            $('.reciprocal').find('.enb-checkbox').each(function(){
                enbCheckbox($(this));
            });
        }
    });
    $('[data-toggle="tooltip"]').tooltip();

    var flagJourney = false;
    $(document).on('change', '.journey-type input', function(){
        var journeyTypeVal = $(this).val();
        var form = $(this).closest('form');
        var data = {"get_timetable_stops_allowed": true, "service_id": form.find('#id_service').val()};
        if (journeyTypeVal == 'home_to_school') {
            data = {"get_home_and_school_stops": true, "service_id": form.find('#id_service').val(), "school_id": form.find('#id_school').val()};
            flagJourney = false;
        }
        else {
            form.find('#id_home_stop, #id_school_stop').val('').trigger('change.select2');
        }
        if (form.find('#id_service').val() !== '' || form.find('#id_school').val() !== '') {
            $.ajax({
                url: $(this).closest('form').attr('action'),
                method: 'POST',
                data: data,
                success: function(response){
                    if (response.length == 0) {
                        // form.find('.selectpicker').select2('destroy').empty().select2({
                        //     theme: "bootstrap",
                        //     width: 'auto',
                        //     data: [{"id": '', "text": "---------"}]
                        // }).find('option:not([value])').attr('value', '');
                    }
                    else {
                        if (journeyTypeVal !== 'home_to_school') {
                            var responseOption = [];
                            responseOption.push({"id": '', "text": "---------"});
                            $.each(response, function(i){
                                responseOption.push({
                                  "id": response[i].id,
                                  "text": response[i].text
                                });
                            });
                            form.find('.outward_and_return select').each(function(){
                                if (!flagJourney) {
                                    $(this).select2('destroy').empty().select2({
                                        theme: "bootstrap",
                                        width: 'auto',
                                        data: responseOption
                                    }).find('option:not([value])').attr('value', '');
                                }
                                else {
                                    if ($(this).val() == '') {
                                        $(this).select2('destroy').empty().select2({
                                            theme: "bootstrap",
                                            width: 'auto',
                                            data: responseOption
                                        }).find('option:not([value])').attr('value', '');
                                    }
                                }
                            });
                            flagJourney = true;
                        }
                        else {
                            $.each(response, function(key, val) {
                                var responseOption = [];
                                responseOption.push({"id": '', "text": "---------"});
                                $.each(val, function(i){
                                    responseOption.push({
                                      "id": val[i].id,
                                      "text": val[i].text
                                    });
                                });
                                form.find('select[name="' + key + '"]').select2('destroy').empty().select2({
                                    theme: "bootstrap",
                                    width: 'auto',
                                    data: responseOption
                                }).find('option:not([value])').attr('value', '');
                            });
                        }
                    }
                }
            });
        }
        else {
            form.find('.outward_and_return select').select2('destroy').empty().select2({
                theme: "bootstrap",
                width: 'auto',
                data: [{"id": "", "text": "---------"}]
            }).find('option:not([value])').attr('value', '');
        }
    });
    $(document).on('change', '#id_service.ajax, #id_school.ajax', function(){
        var self = $(this);
        var form = $(this).closest('form');
        var data = {"get_timetable_stops_allowed": true, "service_id": form.find('#id_service').val()};

        if (form.find('input[name=type][value=home_to_school]').prop("checked")) {
            data = {"get_home_and_school_stops": true, "service_id": form.find('#id_service').val(), "school_id": form.find('#id_school').val()};
        }
        $.ajax({
            url: $(this).closest('form').attr('action'),
            method: 'POST',
            data: data,
            success: function(response){
                if (response.length == 0) {
                    form.find('.cpe-filds select').select2('destroy').empty().select2({
                        theme: "bootstrap",
                        width: 'auto',
                        data: [{"id": '', "text": "---------"}]
                    }).find('option:not([value])').attr('value', '');
                }
                else {
                    if (form.find('input[name=type][value=home_to_school]').prop("checked")) {
                        $.each(response, function(key, val) {
                            var responseOption = [];
                            responseOption.push({"id": "", "text": "---------"});
                            $.each(val, function(i){
                                responseOption.push({
                                  "id": val[i].id,
                                  "text": val[i].text
                                });
                            });
                            if (self[0].name == 'school' && $('#id_home_stop').val() !== '') {
                                key = 'school_stop';
                                $('#id_home_stop').trigger('change.select2');
                            }
                            form.find('select[name="' + key + '"]').select2('destroy').empty().select2({
                                theme: "bootstrap",
                                width: 'auto',
                                data: responseOption
                            }).find('option:not([value])').attr('value', '');
                        });
                        if (self[0].name == 'school' && $('#id_home_stop').val() !== '') {
                            form.find('#id_outward_to, #id_return_from').select2('destroy').empty().select2({
                                theme: "bootstrap",
                                width: 'auto',
                                data: [{"id": "", "text": "---------"}]
                            }).find('option:not([value])').attr('value', '');
                        }
                        else {
                            form.find('.outward_and_return select').select2('destroy').empty().select2({
                                theme: "bootstrap",
                                width: 'auto',
                                data: [{"id": "", "text": "---------"}]
                            }).find('option:not([value])').attr('value', '');
                        }
                    }else {
                        if (self[0].name == 'service') {
                            var responseOption = [];
                            responseOption.push({"id": '', "text": "---------"});
                            $.each(response, function(i){
                                responseOption.push({
                                  "id": response[i].id,
                                  "text": response[i].text
                                });
                            });
                            form.find('.outward_and_return select').select2('destroy').empty().select2({
                                theme: "bootstrap",
                                width: 'auto',
                                data: responseOption
                            }).find('option:not([value])').attr('value', '');
                        }
                    }
                }
            }
        });
    });
    $(document).on('change', '#id_school_stop.ajax', function(){
        var form = $(this).closest('form');
        var data = {"get_timetable_stops_by_school": true, "service_id": form.find('#id_service').val(), "school_id": form.find('#id_school_stop').val()};
        $.ajax({
            url: $(this).closest('form').attr('action'),
            method: 'POST',
            data: data,
            success: function(response){
                if (response.length == 0) {
                    form.find('#id_outward_to, #id_return_from').select2('destroy').empty().select2({
                        theme: "bootstrap",
                        width: 'auto',
                        data: [{"id": "", "text": "---------"}]
                    }).find('option:not([value])').attr('value', '');
                }
                else {
                    $.each(response, function(key, val) {
                        if (val.id) {
                            var responseOption = [];
                                responseOption.push({"id": "", "text": "---------"});
                                responseOption.push({
                                  "id": val.id,
                                  "text": val.text,
                                  "selected": 'selected'
                                });
                            form.find('select[name="' + key + '"]').select2('destroy').empty().select2({
                                theme: "bootstrap",
                                width: 'auto',
                                data: responseOption
                            }).find('option:not([value])').attr('value', '');
                        }
                        else {
                            form.find('select[name="' + key + '"]').select2('destroy').empty().select2({
                                theme: "bootstrap",
                                width: 'auto',
                                data: [{"id": "", "text": "---------"}]
                            }).find('option:not([value])').attr('value', '');
                        }
                    });
                }
            }
        });
    });
    $(document).on('change', '#id_home_stop.ajax', function(){
        var form = $(this).closest('form');
        var data = {"get_timetable_stops_by_home": true, "service_id": form.find('#id_service').val(), "home_id": form.find('#id_home_stop').val()};
        $.ajax({
            url: $(this).closest('form').attr('action'),
            method: 'POST',
            data: data,
            success: function(response){
                if (response.length == 0) {
                    form.find('#id_outward_from, #id_return_to').select2('destroy').empty().select2({
                        theme: "bootstrap",
                        width: 'auto',
                        data: [{"id": "", "text": "---------"}]
                    }).find('option:not([value])').attr('value', '');
                }
                else {
                    $.each(response, function(key, val) {
                        if (val.id) {
                            var responseOption = [];
                                responseOption.push({"id": "", "text": "---------"});
                                responseOption.push({
                                  "id": val.id,
                                  "text": val.text,
                                  "selected": 'selected'
                                });
                            form.find('select[name="' + key + '"]').select2('destroy').empty().select2({
                                theme: "bootstrap",
                                width: 'auto',
                                data: responseOption
                            }).find('option:not([value])').attr('value', '');
                        }
                        else {
                            form.find('select[name="' + key + '"]').select2('destroy').empty().select2({
                                theme: "bootstrap",
                                width: 'auto',
                                data: [{"id": "", "text": "---------"}]
                            }).find('option:not([value])').attr('value', '');
                        }
                    });
                }
            }
        });
    });

    function requestForm(self) {
        var form = self.closest('form');
        var get_locations_url = get_clients_locations_url.replace(/1/, $('#id_client').val());
        if ($('#id_client_search').val() !== '') {
            $.ajax({
                url: get_locations_url,
                dataType: 'json',
                delay: 250,
                data: {'request_type': $('#id_type').val()},
                success: function(response){
                    if (response.length == 0) {
                        form.find('#id_pick_up_location, #id_drop_off_location').select2('destroy').empty().select2({
                            theme: "bootstrap",
                            width: 'auto',
                            data: [{"id": "", "text": "---------"}]
                        }).find('option:not([value])').attr('value', '').closest('.form-group').removeClass('disable');
                    }
                    else {
                        $.each(response, function(key, val) {
                            var responseOption = [];
                            if (val.length > 1) {
                                responseOption.push({"id": "", "text": "---------"});
                                $.each(val, function(i){
                                    responseOption.push({
                                      "id": val[i].id,
                                      "text": val[i].text
                                    });
                                });
                                form.find('select[name="' + key + '"]').closest('.form-group').removeClass('disable');
                            }
                            else {
                                if (val.length !== 0) {
                                    $.each(val, function(i){
                                        responseOption.push({
                                          "id": val[i].id,
                                          "text": val[i].text,
                                          "selected": 'selected'
                                        });
                                    });
                                    form.find('select[name="' + key + '"]').closest('.form-group').addClass('disable');
                                }
                                else {
                                    responseOption.push({"id": "", "text": "---------"});
                                    form.find('select[name="' + key + '"]').closest('.form-group').removeClass('disable');
                                }
                            }
                            form.find('select[name="' + key + '"]').select2('destroy').empty().select2({
                                theme: "bootstrap",
                                width: 'auto',
                                data: responseOption
                            }).find('option:not([value])').attr('value', '');
                        });
                    }
                }
            });
        }
    }


    $('.check-one option').each(function(){
        if($(this).val() && $(this).parent().find('option').length < 3){
            $(this).prop('selected', true).closest('.form-group').addClass('disable');
        }
    });

    $(document).on('change', '.request-type-ajax', function(){
        requestForm($(this));
    });
    var elementName;
    function checkName(element, element_name){
      if (element_name) {
        elementName = element_name;
      }
      element.each(function(){
        if (!$(this).closest('.radio').find('input[type="radio"]').prop("checked")) {
          $(this).removeAttr('name').val('');
        }
      });
      element.closest('.radio').find('input[type="radio"]').on('change', function(){
        element.removeAttr('name').val('');
        $(this).closest('.radio').find(element).attr('name', elementName);
      });
    }
    checkName($('.check-name'), $('.check-name').attr('name'));

    $(document).on('change', '.filter-radio', function(){
        if ($(this).val() == 'today') {
            $(this).closest('form').find('.date').data("DateTimePicker").date(new Date());
        }
        else if ($(this).val() == 'start_date') {
            var inputDate = $(this).closest('form').find('.date').data('startdate');
            $(this).closest('form').find('.date').data("DateTimePicker").date(inputDate);
        }
    });

    $(document).on('click', '#schedule-tabs a', function () {
      var activeTab = $($(this).attr('href'));
      var table = activeTab.find('table.datatables-simple');

      if(table.length) {
        setTimeout(function () {
          var tableUpdate = initializeDataTable(table);
          tableUpdate.responsive.recalc();
        }, 1000)
      }

      if(activeTab.find('.google-map').length) {
        setTimeout(function () {
          var map = window.__SCHEDULE_MAP__;
          var center = map.getCenter();

          google.maps.event.trigger(map, "resize");
          map.setCenter(center);
        }, 1000);
      }

    })
});

function startDay(el) {
    var days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    if($(el).length) {
        var day = $(el).data("DateTimePicker").viewDate()._d.getDay()
        return days[day]
    }

    return false;
}

function prevDay(el) {
    var daysName = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

    if($(el).length  && $(el).data("DateTimePicker").date()._i) {
        prevDate = $(el).data("DateTimePicker").date()._i.split('/');
        var years = prevDate[2];
        var mounths = prevDate[1];
        var days = prevDate[0];
        var day = new Date(years, mounths - 1, days).getDay();

        return daysName[day]
    }

    return false;
}

function datepickerDate(datepicker) {
    if($(datepicker).length) {
        return $(datepicker).data("DateTimePicker").date();
    }

    return false;
}

function clearDatepickerDate(datepicker, callback) {
    if($(datepicker).length) {
        $(datepicker).data("DateTimePicker").date(null);
    }
    if(callback) {
        callback();
    }
}

function changeDatepickerDate(datepicker, date, callback) {

    if($(datepicker).length) {
        if(typeof date !== 'string') {
            $(datepicker).data("DateTimePicker").date(date);
        } else {
            var newDate = date.split('/');
            $(datepicker).data("DateTimePicker").date(new Date(newDate[2], newDate[1] - 1, newDate[0]));
        }
    }

    if(callback) {
        callback();
    }
}

function selectedDays(days, count, disabled) {
    var allDays = days;
    var selectedDaysCount;

    if(count === 'all') {
        selectedDaysCount = allDays.length;
    } else {
        selectedDaysCount = count
    }

    if(allDays.length) {
        if(Array.isArray(count)) {

            allDays.prop('checked', false);

            allDays.each(function(i, item) {
                if(count.indexOf(i) == -1) {
                    $(this).prop({ checked: false, disabled: false });
                } else {
                    $(this).prop({ checked: true, disabled: disabled });
                }
            })

        }
        else {
            allDays.each(function(index) {
                if(index < selectedDaysCount) {
                    $(this).prop({ checked: true, disabled: disabled });
                } else {
                    $(this).prop({ checked: false, disabled: false });
                }
            })
        }
    }

}
