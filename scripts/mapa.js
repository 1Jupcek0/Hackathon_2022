google.maps.event.addDomListener(window, 'load', init);

let map;

function init() {
    let mapOptions = {
        zoom: 10,

        center: new google.maps.LatLng(50.384233, 15.798555),

        styles: [{ "featureType": "all", "elementType": "labels.text", "stylers": [{ "color": "#878787" }] }, { "featureType": "all", "elementType": "labels.text.stroke", "stylers": [{ "visibility": "off" }] }, { "featureType": "landscape", "elementType": "all", "stylers": [{ "color": "#f9f5ed" }] }, { "featureType": "road.highway", "elementType": "all", "stylers": [{ "color": "#f5f5f5" }] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#c9c9c9" }] }, { "featureType": "water", "elementType": "all", "stylers": [{ "color": "#aee0f4" }] }]
    };

    let mapElement = document.getElementById('map');

    map = new google.maps.Map(mapElement, mapOptions);

    google.maps.event.addListener(marker, 'click', showInfo());
}

let markerArr = [];
let mainMark;

function addAnsONMP(arrPoints) {
    remMainMark();

    map.panTo({ lat: 50.384233, lng: 15.798555 });
    map.setZoom(10);

    markerArr.forEach(mark => {
        mark.setMap(null);
    });

    arrPoints.forEach(element => {
        let marker = new google.maps.Marker({
            position: new google.maps.LatLng(element[1], element[0]),
            map: map
        });
        markerArr.push(marker);
    });
}

function remMainMark() {
    if (mainMark != null) {
        mainMark.setAnimation(null);
        mainMark.setMap(null);
    }
}

let activeDom;

function addClickFunctionOnAns(newDom, cord) {
    newDom.addEventListener('click', event => {

        if (activeDom != null) {

            activeDom.className = 'ansMap';

        }

        activeDom = newDom;

        activeDom.className += " " + "ansMapActive";

        remMainMark()

        markerArr.forEach(mark => {
            mark.setMap(null);
        });

        let marker = new google.maps.Marker({
            position: new google.maps.LatLng(cord[1], cord[0]),
            map: map
        });

        mainMark = marker;

        if (map.getZoom() < 13) {
            map.setZoom(13);
        }
        map.panTo({ lat: cord[1], lng: cord[0] });
    })
}