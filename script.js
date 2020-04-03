import Vue from 'vue'
import UIkit from 'uikit'
import vSelect from "vue-select"
import mapboxgl from 'mapbox-gl'
import Axios from 'axios'
import './style.sass'
import vDatepicker from 'vuejs-datepicker';

require('./data.js')
mapboxgl.accessToken = 'pk.eyJ1IjoiZXZvbHV0aW9uNjY2IiwiYSI6ImNrOGdnNjV1aTAxMzczZXJ3ejY2ajJxN2cifQ.yf5VmzWQ8zFGjvjRdVye7A';

let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11'
});

let defaultOptionAirport = {id: null, text: '- Выбрать -'}
let airportOptions = window.data.map(function (item) {
    return {id: item[3], text: item[0]}
})

airportOptions.unshift(defaultOptionAirport)

new Vue({
    el: '#content',
    components: {vSelect, vDatepicker},
    watch: {
        selectedAirportCode: function () {
            if (this.selectedAirportCode) {
                let airport = this.searchAirport(this.selectedAirportCode)
                this.addToMap(airport)
            }
        }
    },
    methods: {
        getDataFlight: function () {
            let unixTimeStart = Math.floor(this.dateStart.getTime() / 1000)
            let unixTimeFinish = Math.floor(this.dateFinish.getTime() / 1000)
            let selfVue = this
            this.load = true

            Axios.get('https://opensky-network.org/api/flights/departure?begin=' + unixTimeStart + '&end=' + unixTimeFinish + '&airport=' + this.selectedAirportCode)
                .then(function (response) {
                    selfVue.flights = response.data
                    UIkit.notification('Данные получены', {status: 'success'})
                    selfVue.load = false
                }).catch(function (error) {
                    selfVue.load = false
                    UIkit.notification('Ничего не найдено', {status: 'danger'});
                })
        },
        showPath: function (flight) {
            this.load = true
            let timeFlight = flight.firstSeen ? flight.firstSeen : flight.lastSeen
            timeFlight = timeFlight ? timeFlight : 0
            let selfVue = this

            if (map.getSource('route') != undefined) {
                map.removeLayer('route')
                map.removeSource('route')
            }

            Axios.get('https://opensky-network.org/api/tracks/all?icao24=' + flight.icao24 + '&time=' + timeFlight)
                .then(function (response) {
                    let coordinates = []
                    response.data.path.forEach(function (item) {
                        coordinates.push([item[2], item[1]])
                    })

                    map.addSource('route', {
                        'type': 'geojson',
                        'data': {
                            'type': 'Feature',
                            'properties': {},
                            'geometry': {
                                'type': 'LineString',
                                'coordinates': coordinates
                            }
                        }
                    });

                    map.addLayer({
                        'id': 'route',
                        'type': 'line',
                        'source': 'route',
                        'layout': {
                            'line-join': 'round',
                            'line-cap': 'round'
                        },
                        'paint': {
                            'line-color': 'green',
                            'line-width': 8
                        }
                    });


                    UIkit.notification('Маршруты получен', {status: 'success'})
                    selfVue.load = false
                }).catch(function () {
                    selfVue.load = false
                })
        },
        searchAirport: function (codeAirport) {
            return window.data.find(function (item) {
                return item[3] == codeAirport
            })
        },
        setFlights: function (newFlights) {
            this.flights = newFlights
        },
        getAirportNameByCode: function (codeAirport) {
            let airport = this.searchAirport(codeAirport)
            return airport ? airport[0] : 'Неизвестно'
        },
        showMoreInfo: function (airportId) {
            this.showMore = airportId != ''
        },
        addToMap: function (airport) {
            if (airport) {
                const elements = document.getElementsByClassName("marker");
                while (elements.length > 0) elements[0].remove();

                let el = document.createElement('div')
                el.className = 'marker';

                // create the popup
                let popup = new mapboxgl.Popup({offset: 15}).setHTML(
                    "Название: " + airport[0] + "<br>ICAO: " + airport[3]
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
    },
    data: {
        dateStart: null,
        dateFinish: null,
        flights: [],
        showMore: false,
        selectedAirportCode: null,
        optionsAirports: airportOptions,
        load: false,
        showSearch: true
    }
})