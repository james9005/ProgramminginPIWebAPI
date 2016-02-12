//The engine class sorts out the calls to the PI WEB API.

//Declares the base URL
var baseUrl = "https://JDTSQL01/piwebapi";


/**
This gets the Server names from the AF Server database for the monitoring (and displays them in the select box).
*/
function getAFServers(webAPIURL) {

    MakeAjaxRequest('GET', webAPIURL, function (data) {

        for (var i = 0; i < data.Items.length; i++) {
            document.getElementById("select").innerHTML += "<option id =" + i + ">" + data.Items[i].Name + "</option>";
        }

    });
}





/**
The Make Ajax Request returns a data object (JSON format) back to the caller
*/
function MakeAjaxRequest(type, url, SuccessCallBack, data) {
    $.ajax({
        type: type,
        url: url,
        cache: false,
        async: true,
        data: data,
        contentType: "application/json",
        success: SuccessCallBack,
        error: (function (error, variable) {
            console.log(error);
            alert('There was an error with the request');
        })
    });
}
