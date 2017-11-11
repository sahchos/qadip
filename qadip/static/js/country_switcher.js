$(document).ready(function () {
    $('#id_phone_code').on('change', function () {
        var code = $('option:selected', this).text().replace().replace(/[^0-9]/g, '');
        $('#text_into_id_phone_number').html('+' + code);
        $('#text_before_id_phone_number').html('+' + code);
    }).trigger('change');
});
