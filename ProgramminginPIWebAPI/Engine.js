//The engine class sorts out the calls to the PI WEB API.

/**
TODO: add method to be able to change the hardware statistics at pseduorandom (just like the charts JS Call.)
 
*/

/**
TODO: add method to change the color of the progress group (based on the percentage of the current data) 
--- <50% = green
--- <75% && >50% = yellow
--- >75% = red
--- display warning if over 95%

*/

//TODO: change the hardware section to do something when clicked (50% complete) --

//TODO: 



//Declares the base URL
var baseUrl = "https://JDTSQL01/piwebapi";


/**
This gets the Server names from the AF Server database for the monitoring (and displays them in a select box with the id of select).
TODO: change this method to actually do something.... the MakeAjaxRequest almost makes it redundant as most things can be implemented via <Script> tags.
*/
function getAFServers(webAPIURL) {

    MakeAjaxRequest('GET', (baseUrl + webAPIURL), function (data) {

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



//TODO: GET THE CHART FUNCTION WORKING WITH PIWEB API (pulling from GET request)
/** 
The updateCPUChart function update the large CPU area within the main area of the page.
*/
$(
    function updateCPUChart() {

        // Get context with jQuery - using jQuery's .get() method.
        var salesChartCanvas = $("#salesChart").get(0).getContext("2d");
        // This will get the first returned node in the jQuery collection.
        var salesChart = new Chart(salesChartCanvas);

        var salesChartData = {
            labels: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00"],
            datasets: [
              {
                  label: "Electronics",
                  fillColor: "rgb(210, 214, 222)",
                  strokeColor: "rgb(210, 214, 222)",
                  pointColor: "rgb(210, 214, 222)",
                  pointStrokeColor: "#c1c7d1",
                  pointHighlightFill: "#fff",
                  pointHighlightStroke: "rgb(220,220,220)",
                  //fill with random data.
                  data: [(Math.random() * 100), (Math.random() * 100), (Math.random() * 100), (Math.random() * 100), (Math.random() * 100), (Math.random() * 100), (Math.random() * 100)]
              },
              {
                  label: "Digital Goods",
                  fillColor: "rgba(60,141,188,0.9)",
                  strokeColor: "rgba(60,141,188,0.8)",
                  pointColor: "#3b8bba",
                  pointStrokeColor: "rgba(60,141,188,1)",
                  pointHighlightFill: "#fff",
                  pointHighlightStroke: "rgba(60,141,188,1)",
                  //fill with random data
                  data: [(Math.random() * 100), (Math.random() * 100), (Math.random() * 100), (Math.random() * 100), (Math.random() * 100), (Math.random() * 100), (Math.random() * 100)]
              }
            ]
        };

        var salesChartOptions = {
            //Boolean - If we should show the scale at all
            showScale: true,
            //Boolean - Whether grid lines are shown across the chart
            scaleShowGridLines: false,
            //String - Colour of the grid lines
            scaleGridLineColor: "rgba(0,0,0,.05)",
            //Number - Width of the grid lines
            scaleGridLineWidth: 1,
            //Boolean - Whether to show horizontal lines (except X axis)
            scaleShowHorizontalLines: true,
            //Boolean - Whether to show vertical lines (except Y axis)
            scaleShowVerticalLines: true,
            //Boolean - Whether the line is curved between points
            bezierCurve: true,
            //Number - Tension of the bezier curve between points
            bezierCurveTension: 0.3,
            //Boolean - Whether to show a dot for each point
            pointDot: false,
            //Number - Radius of each point dot in pixels
            pointDotRadius: 4,
            //Number - Pixel width of point dot stroke
            pointDotStrokeWidth: 1,
            //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
            pointHitDetectionRadius: 20,
            //Boolean - Whether to show a stroke for datasets
            datasetStroke: true,
            //Number - Pixel width of dataset stroke
            datasetStrokeWidth: 2,
            //Boolean - Whether to fill the dataset with a color
            datasetFill: true,
            //String - A legend template
            legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%=datasets[i].label%></li><%}%></ul>",
            //Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
            maintainAspectRatio: true,
            //Boolean - whether to make the chart responsive to window resizing
            responsive: true,
            animation: false
        };

        //Create the line chart
        salesChart.Line(salesChartData, salesChartOptions);
        //update the chart with random data ever 3000 ms (3 seconds).
        //TODO: change this to a WEB API call rather than that of random data.
        //TODO: work out the timing of the pi web API so this doesnt look stupid. (looking at about 3 minutes maybe?).
        setTimeout(updateCPUChart, 3000);

    }

);



function printHardware(buttonStr) {

    alert("you pressed the " + buttonStr);

}

//make this update hardware rather than just ram
//function updateRamHw() {



//    var randomValue = (Math.random() * 100);
//    //alert(checkHardwareStatus(randomValue));
//    document.getElementById("ramUsageValue").style.width = randomValue + '%';
//    document.getElementById("ramUsageValue").setAttribute("class", "progress " + checkHardwareStatus(randomValue));

//    setTimeout(updateRamHw, 3000);
//}

function updateAllHardware() {
    var randomValue = (Math.random() * 100);

    // RAM
    // TODO: these values will be replaced with values from the PIWebAPi -- depending on what server is selected display the change

    var currentValue = 501;
    var maxValue = 1000;
    var units = "GB";


    document.getElementById("ramUsage").innerHTML = (currentValue + " / " + maxValue + " " + units);
    document.getElementById("ramUsageValue").style.width = ((currentValue / maxValue) * 100) + '%';
    document.getElementById("ramUsageValue").setAttribute("class", "progress " + checkHardwareStatus(currentValue,maxValue));


    //C:/
    //these values will be replaced with values from the PIWebAPI



    //D:/
    //these values will be replaced with values from the PIWebAPI



    //Other
    //these values will be replaced with values from the PIWebAPI

    setTimeout(updateAllHardware, 3000);

}

/**
The checkHardwareStatus looks at the percent of the passed paramaters
*/
function checkHardwareStatus(current, max) {

    var percent = ((current / max) * 100);
    if (percent <= 50) {
        return "progress-bar-green";
    }
    else if (percent > 50 && percent < 75) {
        return "progress-bar-yellow";
    }
    else if (percent >= 75) {
        return "progress-bar-red";
    }
    else {
        alert("an error has occured");
    }
}
updateAllHardware();
//updateRamHw();