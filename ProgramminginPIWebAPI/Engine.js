function getJsonData(webAPIURL) {

    $.ajax({
        headers: { "Content-Type": "application/json; charset=utf-8", },
        url: webAPIURL,
        dataType: 'json',
        type: 'GET',
    }).done(function (response) {
        return response
    });
}
