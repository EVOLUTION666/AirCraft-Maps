mapboxgl.accessToken = 'pk.eyJ1IjoiZXZvbHV0aW9uNjY2IiwiYSI6ImNrOGdnNjV1aTAxMzczZXJ3ejY2ajJxN2cifQ.yf5VmzWQ8zFGjvjRdVye7A';

let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11'
});

function searchAirport(codeAirport) {
    return window.data.find(function (item) {
        return item[3] == codeAirport
    })
}

function addToMap(airport) {
    $('.marker').remove()

    if (airport) {
        let el = document.createElement('div');
        el.className = 'marker';

        // create the popup
        let popup = new mapboxgl.Popup({offset: 15}).setHTML(
            "Название: "  + airport[0] + "<br>ICAO: " + airport[3]
        );

        new mapboxgl.Marker(el)
            .setLngLat([airport[2], airport[1]])
            .setPopup(popup)
            .addTo(map)

        map.flyTo({
            center: [airport[2], airport[1]],
            essential: true
        });
    }
}

function getDataFlight() {
    let numberFlight = document.getElementById("fieldOfNumber").value;
    let dateStart = document.getElementById("fieldOfDateStart").value;
    let dateFinish = document.getElementById("fieldOfDateFinish").value;

    dateStart = dateStart.split('/');
    dateStop = dateFinish.split('/');

    let dateStartObj = new Date();
    dateStartObj.setFullYear(dateStart[2])
    dateStartObj.setMonth(dateStart[1] - 1)
    dateStartObj.setDate(dateStart[0])

    let dateStopObj = new Date();
    dateStopObj.setFullYear(dateStop[2])
    dateStopObj.setMonth(dateStop[1] - 1)
    dateStopObj.setDate(dateStop[0])

    let unixTimeStart = Math.floor(dateStartObj.getTime() / 1000)
    let unixTimeStop = Math.floor(dateStopObj.getTime() / 1000)

    $.ajax({
        type: 'GET',
        url: 'https://opensky-network.org/api/flights/arrival?begin=' + unixTimeStart + '&end=' + unixTimeStop + '&airport=' + $('#searchAirPort').val(),
        success: function (msg) {
            vueObj.setFlights(msg)
        }
    })
}

function showDates(airportId) {
    if (airportId == '') {
        $('#datesBox').hide()
    } else {
        $('#datesBox').show()
    }
}

let time = Date.now();

$("#fieldOfDateStart").datepicker({
    "dateFormat": 'dd/mm/yy'
});

$("#fieldOfDateFinish").datepicker({
    "dateFormat": 'dd/mm/yy'
});

let options = window.data.map(function (item) {
    return {id: item[3], text: item[0]}
});

$(document).ready(function () {
    $('#searchAirPort').select2({
        data: options
    }).on('select2:select', function (e) {
        let airPortId = e.params.data.id
        let airPort = searchAirport(airPortId)

        showDates(airPortId)
        addToMap(airPort)
    });
});

var vueObj = new Vue({
    el: '#content',
    methods: {
        setFlights: function (newFlights) {
            this.flights = newFlights
        }
    },
    data: {
        flights: [],
    }
})