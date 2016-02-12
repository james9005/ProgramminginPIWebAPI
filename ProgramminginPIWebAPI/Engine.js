//TODO: methods need to be more general and in reference to the PI AF Structure for server overhauls

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
