(function(url, url_error) {

    if ($.type(url) == 'undefined') return;

    var tracking_data = setDefault();

    var geolocationErrors = {
        1: 'Permission denied',
        2: 'Position unavailable',
        3: 'Request timeout',
        4: 'Not support'
    };

    var geolocationOptions = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    function geolocationSuccess(position) {
        tracking_data.location = [position.coords.latitude, position.coords.longitude].join(',');
    }

    function geolocationError(error) {
        if (error.code == 1) {
            location.href = url_error;
        }
    }

    function setDefault() {
        return {
            mouse_click: 0,
            mouse_event: 0,
            key_press: 0,
            key_input: 0,
            location: ''
        };
    }

    function send_pack() {
        if (tracking_data.mouse_click || tracking_data.mouse_event || tracking_data.key_press || tracking_data.key_input) {
            $.ajax({
                async: false,
                url: url,
                type: "POST",
                dataType : 'json',
                data: tracking_data
            });
        }
        tracking_data = setDefault();
    }

    (function timeout() {
        setTimeout(function() {
            send_pack();
            timeout();
        }, ((Math.random()*2)+1)*60*1000);
    })();

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError, geolocationOptions);

        $(document)
            .on('mousedown',                    function() { tracking_data.mouse_click++; })
            .on('mousedown', ':input, a',       function() { tracking_data.mouse_event++; })
            .on('keypress',                     function() { tracking_data.key_press++; })
            .on('keypress', 'input, textarea',  function() { tracking_data.key_input++; });

        $(window)
            .on('beforeunload', send_pack);

    } else {
        geolocationError(4);
    }

})(tracking_url, tracking_url_error);
