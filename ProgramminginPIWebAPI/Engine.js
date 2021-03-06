﻿//The engine class sorts out the calls to the PI WEB API and does everything with the Dashboard.html page


updateServerHeader();



getCurrentServerURL();


//Declares the base URL
var baseUrl = "https://JDTSQL01/piwebapi";
var servMonEleUrl = "https://jdtsql01/piwebapi/assetdatabases/D05JhvKQzPtUy9eDHPqXqv3Qdem0i04ALk-N4rffsusiEQSkRUU1FMMDFcU0VSVkVSIE1PTklUT1JJTkc/elements";
var currentServerUrl = "";
var ramUrl = "";
var cUrl = "";
var dUrl = "";
var cpu1Url = "";
var cpu2Url = "";
var cpu3Url = "";
var cpu4Url = "";
var exValUrl = "https://jdtsql01/piwebapi/streams/A0E5JhvKQzPtUy9eDHPqXqv3QnC15Pb3R5RGAwgAMKQjVsgH11WupCmAF0BK4-t_MLgZwSkRUU1FMMDFcU0VSVkVSIE1PTklUT1JJTkdcSkRUUEkwMXxDUFUgVEVNUA/value";
var cpulisturl = "https://jdtsql01/piwebapi/streams/A0E5JhvKQzPtUy9eDHPqXqv3QnC15Pb3R5RGAwgAMKQjVsgH11WupCmAF0BK4-t_MLgZwSkRUU1FMMDFcU0VSVkVSIE1PTklUT1JJTkdcSkRUUEkwMXxDUFUgVEVNUA/recorded?startTime=*-28d";

function getCurrentServerURL() {
    var tempLocation = location.hash;
    tempLocation = tempLocation.substr(2);

    MakeAjaxRequest("GET", servMonEleUrl, function (data) {
        for (var i = 0; i < data.Items.length; i++) {
            if (data.Items[i].Name === tempLocation) {
                currentServerUrl = data.Items[i].Links.Attributes;
                //console.log("DONE " + currentServerUrl);
                //console.log(currentServerUrl);
            }

        }

    });

    //console.log("DONE " + currentServerUrl);
    setTimeout(getCurrentServerURL, 500);
    ////use ajax call to find the correct URL.
}

function getHWURL() {
    //getCurrentServerURL();

    MakeAjaxRequest("GET", currentServerUrl, function (data) {
        for (var i = 0; i < data.Items.length; i++) {
            if (data.Items[i].Name === "RAMUsage") {
                ramUrl = data.Items[i].Links.Value;
                //console.log("RAM " +ramUrl);
            }
            if (data.Items[i].Name === "CUsage") {
                cUrl = data.Items[i].Links.Value;
                //console.log("C " +cUrl);
            }
            if (data.Items[i].Name === "DUsage") {

                dUrl = data.Items[i].Links.Value;
                //console.log("D " + dUrl);
            }
            if (data.Items[i].Name === "CPUClock01") {

                cpu1Url = data.Items[i].Links.Value;
                //console.log("D " + dUrl);
            }
            if (data.Items[i].Name === "CPUClock02") {

                cpu2Url = data.Items[i].Links.Value;
                //console.log("D " + dUrl);
            }
            if (data.Items[i].Name === "CPUClock03") {

                cpu3Url = data.Items[i].Links.Value;
                //console.log("D " + dUrl);
            }
            if (data.Items[i].Name === "CPUClock04") {

                cpu4Url = data.Items[i].Links.Value;
                //console.log("D " + dUrl);
            }
        }
    });

    setTimeout(getHWURL, 3000);
}


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
This class can be used for POST, GET and PATCH operations (given the correct parameters).
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
            alert('There was an error with the request to the PI Web API. Please check connections or contact the relevant person');
        })
    });
}

/** 
The updateCPUChart function update the large CPU area within the main area of the page.
*/

function updateCPUChart() {
    MakeAjaxRequest("GET", cpulisturl, function (data) {
        // Get context with jQuery - using jQuery's .get() method.
        var salesChartCanvas = $("#salesChart").get(0).getContext("2d");
        // This will get the first returned node in the jQuery collection.
        var salesChart = new Chart(salesChartCanvas);
        //declare arrays
        var datavals = [];

        var label = [];
        for (var i = 0; i < data.Items.length; i++) {
            label.push(data.Items[i].Timestamp);
            datavals.push(data.Items[i].Value);
        }

        var salesChartData = {
            labels: label,
            datasets: [
              {
                  label: "Electronics",
                  fillColor: "rgb(210, 214, 222)",
                  strokeColor: "rgb(210, 214, 222)",
                  pointColor: "rgb(210, 214, 222)",
                  pointStrokeColor: "#c1c7d1",
                  pointHighlightFill: "#fff",
                  pointHighlightStroke: "rgb(220,220,220)",
                  //fill with Web API data
                  data: datavals
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
            bezierCurve: checkBezier(),
            //Number - Tension of the bezier curve between points
            bezierCurveTension: 0.3,
            //Boolean - Whether to show a dot for each point
            pointDot: true,
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
        setTimeout(updateCPUChart, 999);
    });

}

function updateCPUChartRandomData() {

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
        bezierCurve: checkBezier(),
        //Number - Tension of the bezier curve between points
        bezierCurveTension: 0.3,
        //Boolean - Whether to show a dot for each point
        pointDot: true,
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
    setTimeout(updateCPUChartRandomData, 3000);

}

//TODO work on this function
function getCurrentValue() {


    MakeAjaxRequest("GET", exValUrl, function (data) {



    }
);



}

function updateAllHardwareManual() {
    var randomValue = (Math.random() * 100);

    // RAM
    // TODO: these values will be replaced with values from the PIWebAPi -- depending on what server is selected display the change

    var currentRamValue = 4.8;
    var maxRamValue = 8;
    var ramUnits = "GB";


    document.getElementById("ramUsage").innerHTML = (currentRamValue + " / " + maxRamValue + " " + ramUnits);
    document.getElementById("ramUsageValue").style.width = ((currentRamValue / maxRamValue) * 100) + '%';
    document.getElementById("ramUsageValue").setAttribute("class", "progress " + checkHardwareStatus(currentRamValue, maxRamValue));


    //C:/
    //these values will be replaced with values from the PIWebAPI

    var currentCValue = 566;
    var maxCValue = 1000;
    var cUnits = "GB";

    document.getElementById("cUsage").innerHTML = (currentCValue + " / " + maxCValue + " " + cUnits);
    document.getElementById("cUsageValue").style.width = ((currentCValue / maxCValue) * 100) + '%';
    document.getElementById("cUsageValue").setAttribute("class", "progress " + checkHardwareStatus(currentCValue, maxCValue));


    //D:/
    //these values will be replaced with values from the PIWebAPI


    var currentDValue = 1433;
    var maxDValue = 5000;
    var dUnits = "GB";

    document.getElementById("dUsage").innerHTML = (currentDValue + " / " + maxDValue + " " + dUnits);
    document.getElementById("dUsageValue").style.width = ((currentDValue / maxDValue) * 100) + '%';
    document.getElementById("dUsageValue").setAttribute("class", "progress " + checkHardwareStatus(currentDValue, maxDValue));

    //Other
    //these values will be replaced with values from the PIWebAPI
    //TODO:this should be set to the correct thing remember not math.random
    var currentOtherValue = Math.round((Math.random() * 500));
    var maxOtherValue = 500;
    var otherUnits = "GB";

    document.getElementById("otherUsage").innerHTML = (currentOtherValue + " / " + maxOtherValue + " " + otherUnits);
    document.getElementById("otherUsageValue").style.width = ((currentOtherValue / maxOtherValue) * 100) + '%';
    document.getElementById("otherUsageValue").setAttribute("class", "progress " + checkHardwareStatus(currentOtherValue, maxOtherValue));



    //sets a timeout for the hardware section to update.
    setTimeout(updateAllHardwareManual, 3000);

}

// TODO: this has to pull from the web api.
function updateAllHardware() {
    var randomValue = (Math.random() * 100);
    getHWURL();
    if (ramUrl != "") {
        // RAM
        // TODO: these values will be replaced with values from the PIWebAPi -- depending on what server is selected display the change
        MakeAjaxRequest("GET", ramUrl, function (data) {


            var currentRamValue = data.Value;
            var maxRamValue = 8;
            var ramUnits = "GB";


            document.getElementById("ramUsage").innerHTML = (currentRamValue + " / " + maxRamValue + " " + ramUnits);
            document.getElementById("ramUsageValue").style.width = ((currentRamValue / maxRamValue) * 100) + '%';
            document.getElementById("ramUsageValue").setAttribute("class", "progress " + checkHardwareStatus(currentRamValue, maxRamValue));
        });
    }
    //C:/
    //these values will be replaced with values from the PIWebAPI
    if (cUrl != "") {
        MakeAjaxRequest("GET", cUrl, function (data) {

            var currentCValue = data.Value;
            var maxCValue = 1000;
            var cUnits = "GB";

            document.getElementById("cUsage").innerHTML = (currentCValue + " / " + maxCValue + " " + cUnits);
            document.getElementById("cUsageValue").style.width = ((currentCValue / maxCValue) * 100) + '%';
            document.getElementById("cUsageValue").setAttribute("class", "progress " + checkHardwareStatus(currentCValue, maxCValue));
        });
    }

    //D:/
    //these values will be replaced with values from the PIWebAPI
    if (dUrl != "") {
        MakeAjaxRequest("GET", dUrl, function (data) {


            var currentDValue = data.Value;
            var maxDValue = 5000;
            var dUnits = "GB";

            document.getElementById("dUsage").innerHTML = (currentDValue + " / " + maxDValue + " " + dUnits);
            document.getElementById("dUsageValue").style.width = ((currentDValue / maxDValue) * 100) + '%';
            document.getElementById("dUsageValue").setAttribute("class", "progress " + checkHardwareStatus(currentDValue, maxDValue));
        });
    }

    if (cpu1Url != "") {
        MakeAjaxRequest("GET", cpu1Url, function (data) {


            var cpu1 = data.Value;

            document.getElementById("cpu1").innerHTML = cpu1 + "%";
        });
    }
    if (cpu2Url != "") {
        MakeAjaxRequest("GET", cpu2Url, function (data) {


            var cpu2 = data.Value;

            document.getElementById("cpu2").innerHTML = cpu2 + "%";
        });
    }
    if (cpu3Url != "") {
        MakeAjaxRequest("GET", cpu3Url, function (data) {


            var cpu3 = data.Value;

            document.getElementById("cpu3").innerHTML = cpu3 + "%";
        });
    }
    if (cpu4Url != "") {
        MakeAjaxRequest("GET", cpu4Url, function (data) {


            var cpu4 = data.Value;

            document.getElementById("cpu4").innerHTML = cpu4 + "%";
        });
    }
    //Other
    //these values will be replaced with values from the PIWebAPI
    //TODO:this should be set to the correct thing remember not math.random
    var currentOtherValue = Math.round((Math.random() * 500));
    var maxOtherValue = 500;
    var otherUnits = "GB";

    document.getElementById("otherUsage").innerHTML = (currentOtherValue + " / " + maxOtherValue + " " + otherUnits);
    document.getElementById("otherUsageValue").style.width = ((currentOtherValue / maxOtherValue) * 100) + '%';
    document.getElementById("otherUsageValue").setAttribute("class", "progress " + checkHardwareStatus(currentOtherValue, maxOtherValue));



    //sets a timeout for the hardware section to update.
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
        alert("an error has occured with one or several of the hardware statistics");
    }
}

function createSidebarFromAFManual() {

    //create header
    var headerNode = document.createElement("LI");
    headerNode.classList.add("header");
    headerNode.innerHTML = "SERVERS";

    document.getElementById("rightConfigBar").appendChild(headerNode);

    //perform AJAX Call for AF Data

    //this is test data  - return all server names from real data.
    var data = ["JDTSQL01", "JDTPI01", "JDT-UPS-01"];


    //should be currently active rather than the first line
    //first line of data (needs to be applied to the current HTML URL also.
    var node = document.createElement("LI");
    node.classList.add("active");
    node.setAttribute("id", data[0]);
    var link = document.createElement("a");
    link.setAttribute("href", ("#/" + data[0]));
    link.setAttribute("onClick", ("switchAF(\'" + data[0] + "\')"));
    //add icons 
    var icon = document.createElement("i");
    icon.classList.add("fa");
    icon.classList.add("fa-server");
    //add span
    var span = document.createElement("span");
    span.innerHTML = data[0];
    location.hash = "/" + data[0];
    node.appendChild(link).appendChild(icon);
    document.getElementById("rightConfigBar").appendChild(node).appendChild(link).appendChild(span);


    for (var i = 1; i < data.length; i++) {
        var node = document.createElement("LI");
        node.setAttribute("id", data[i]);
        var link = document.createElement("a");
        link.setAttribute("href", ("#/" + data[i]));
        link.setAttribute("onclick", ("switchAF(\'" + data[i] + "\')"));
        //add icons 
        var icon = document.createElement("i");
        icon.classList.add("fa");
        icon.classList.add("fa-server");
        //add span
        var span = document.createElement("span");
        span.innerHTML = data[i];
        node.appendChild(link).appendChild(icon);
        document.getElementById("rightConfigBar").appendChild(node).appendChild(link).appendChild(span);
    }

}

function createSidebarFromAF() {

    //create header
    var headerNode = document.createElement("LI");
    headerNode.classList.add("header");
    headerNode.innerHTML = "SERVERS";

    document.getElementById("rightConfigBar").appendChild(headerNode);

    //perform AJAX Call for AF Data

    //this is test data  - return all server names from real data.
    MakeAjaxRequest("GET", servMonEleUrl, function (data) {
        //populate the data items

        var dataItm = [];

        for (var i = 0; i < data.Items.length; i++) {
            dataItm.push(data.Items[i].Name);
        }



        //should be currently active rather than the first line
        //first line of data (needs to be applied to the current HTML URL also.
        var node = document.createElement("LI");
        node.classList.add("active");
        node.setAttribute("id", dataItm[0]);

        var link = document.createElement("a");
        link.setAttribute("href", ("#/" + dataItm[0]));
        link.setAttribute("onClick", ("switchAF(\'" + dataItm[0] + "\')"));
        //add icons 
        var icon = document.createElement("i");
        icon.classList.add("fa");
        icon.classList.add("fa-server");
        //add span
        var span = document.createElement("span");
        span.innerHTML = dataItm[0];
        location.hash = "/" + dataItm[0];
        node.appendChild(link).appendChild(icon);
        document.getElementById("rightConfigBar").appendChild(node).appendChild(link).appendChild(span);


        for (var i = 1; i < dataItm.length; i++) {
            var node = document.createElement("LI");
            node.setAttribute("id", dataItm[i]);
            var link = document.createElement("a");
            link.setAttribute("href", ("#/" + dataItm[i]));
            link.setAttribute("onClick", ("switchAF(\'" + dataItm[i] + "\')"));
            //add icons 
            var icon = document.createElement("i");
            icon.classList.add("fa");
            icon.classList.add("fa-server");
            //add span
            var span = document.createElement("span");
            span.innerHTML = dataItm[i];
            node.appendChild(link).appendChild(icon);
            document.getElementById("rightConfigBar").appendChild(node).appendChild(link).appendChild(span);
        }
    });
}

/**
This function updates the server header with the current server selected
*/
function updateServerHeader() {
    var headerStr = location.hash;
    headerStr = headerStr.substr(2);

    document.getElementById("ServerHeader").innerHTML = headerStr;
    setTimeout(updateServerHeader, 500);
}

function checkBezier() {
    if ($("#bezierCheckbox").is(":checked")) {
        return true;
    }
    else return false;
}

function changeBezier() {
    if (checkBezier) {

        $('#bezierCheckbox').attr("checked", false).checkboxradio("refresh");

    }
    else {
        $("#bezierCheckbox").prop('checked', true).checkboxradio("refresh");

    }
}

/*
    This method switches the AF Servers 

*/
function switchAF(str) {
    //alert(str);
    //do something 
    //make the correct area active
    $("#rightConfigBar>li.active").removeClass("active");
    document.getElementById(str).classList.add("active");

    //getHWURL();

    //load in the correct area graphs / data points

}

/*
    This method changes the url of the PIWebAPI search for CPU Data and changes the timescales.
    TODO: test this with the PI Web API.
*/
function changeChartUrl(days) {

    var lastThree = cpulisturl.substr(cpulisturl.length - 3);
    //alert(cpulisturl);
    if (days < 10) {
        cpulisturl = cpulisturl.replace(lastThree, ("0" + days + "d"));
    }
    else {
        cpulisturl = cpulisturl.replace(lastThree, (days + "d"));
    }
    //alert(cpulisturl);

}
//call all methods
//These methods only works when connected to the PI web api

//------ pulled from PIWebAPI

updateCPUChart();
createSidebarFromAF();
updateAllHardware();



//------ manual Data 

//updateCPUChartRandomData();
//updateAllHardwareManual();
//createSidebarFromAFManual();

//TODO: POST METHOD FOR THE WORLD MAP MARKERS


// adding this in for testing purposes
//TODO: get this working with the PI WEB API
//MAP: change to UK.
$(function () {
    $('#world-map-markers').vectorMap({
        map: 'world_mill_en',
        normalizeFunction: 'polynomial',
        hoverOpacity: 0.7,
        hoverColor: false,
        backgroundColor: 'transparent',
        regionStyle: {
            initial: {
                fill: 'rgba(210, 214, 222, 1)',
                "fill-opacity": 1,
                stroke: 'none',
                "stroke-width": 0,
                "stroke-opacity": 1
            },
            hover: {
                "fill-opacity": 0.7,
                cursor: 'pointer'
            },
            selected: {
                fill: 'yellow'
            },
            selectedHover: {
            }
        },
        markerStyle: {
            initial: {
                fill: '#00a65a',
                stroke: '#111'
            }
        },
        markers: [
          { latLng: [53, 0], name: 'TEST SERVER' }
        ]
    });
});



