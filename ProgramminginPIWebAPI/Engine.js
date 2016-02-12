function getJsonData(webAPIURL) {

    $.ajax({
        headers: { "Content-Type": "application/json; charset=utf-8", },
        url: 'https://JDTSQL01/piwebapi',
        dataType: 'json',
        type: 'GET',
    }).done(function (response) {
                
       return response
    });
});