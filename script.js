/**
 * ---------------------------------------
 * This demo was created using amCharts 4.
 *
 * For more information visit:
 * https://www.amcharts.com/
 *
 * Documentation is available at:
 * https://www.amcharts.com/docs/v4/
 * ---------------------------------------
 */

// Create map instance
var chart = am4core.create("chartDiv", am4maps.MapChart);

// Set map definition
chart.geodata = am4geodata_worldLow;

// Set projection
chart.projection = new am4maps.projections.Miller();

// Create map polygon series
var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

// Make map load polygon (like country names) data from GeoJSON
polygonSeries.useGeodata = true;

// Configure series
var polygonTemplate = polygonSeries.mapPolygons.template;
polygonTemplate.tooltipText = "{name}";
polygonTemplate.fill = am4core.color("#74B266");

// Remove Antarctica
polygonSeries.exclude = ["AQ"];

// Add some data
polygonSeries.data = [{
    "id": "US",
    "name": "United States",
    "value": 100
}, {
    "id": "FR",
    "name": "France",
    "value": 50
}];

// Create image series
var imageSeries = chart.series.push(new am4maps.MapImageSeries());

// Create a circle image in image series template so it gets replicated to all new images
var imageSeriesTemplate = imageSeries.mapImages.template;
var circle = imageSeriesTemplate.createChild(am4core.Circle);
circle.radius = 8;
circle.fill = am4core.color("#e03e96");
circle.stroke = am4core.color("#FFFFFF");
circle.strokeWidth = 3;
circle.nonScaling = true;
circle.tooltipText = "{title}";

// Set property fields
imageSeriesTemplate.propertyFields.latitude = "latitude";
imageSeriesTemplate.propertyFields.longitude = "longitude";

// Add data for the three cities
imageSeries.data = [];

// Add line series
var lineSeries = chart.series.push(new am4maps.MapLineSeries());
lineSeries.mapLines.template.strokeWidth = 4;
lineSeries.mapLines.template.stroke = am4core.color("#e03e96");

lineSeries.data = [{
    "multiGeoLine": [
        [
            {"latitude": 48.856614, "longitude": 2.352222},
            {"latitude": 40.712775, "longitude": -74.005973}
        ]
    ]
}];

function getDataFlight() {
    let numberFlight = document.getElementById("fieldOfNumber").value;
    let dateStart = document.getElementById("fieldOfDateStart").value;
    let dateFinish = document.getElementById("fieldOfDateFinish").value;

    dateStart = dateStart.split('/');
    dateFinish = dateFinish.split('/');

    let unixTimeStart = new Date(dateStart[2], dateStart[1], dateStart[0]) / 1000;
    let unixTimeStop = new Date(dateFinish[2], dateFinish[1], dateFinish[0]) / 1000;


    $.ajax({
        type: 'GET',
        url: ' https://opensky-network.org/api/flights/all?begin=' + unixTimeStart + '&end=' + unixTimeStop,
        success: function (msg) {
            console.log(msg)
        }
    })

}

let time = Date.now();

$("#fieldOfDateStart").datepicker({
    "dateFormat": 'dd/mm/yy'
});
$("#fieldOfDateFinish").datepicker({
    "dateFormat": 'dd/mm/yy'
});