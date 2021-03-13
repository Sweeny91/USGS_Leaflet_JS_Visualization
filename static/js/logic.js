// Logic Goes Here

// import geojson file and store in constant variable
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// store leaflet base tile layer in map variable
let map = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    titleSize: 600,
    maxZoom: 10,
    zoomOffset: 0,
    id: "mapbox/streets-v11",
    accessToken: MAP_KEY
});

// center map with KC coordinates
let myMap = L.map("mapid", {
    center: [39.0997, -94.5786], // Kansas City, Missouri, made to be center of map
    zoom: 2.5,
});

// add center and zoom attribute to map
map.addTo(myMap);

// read in geojson file
d3.json(url, d => {
    L.geoJson(d, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: chooseStyle,

        onEachFeature: function(feature, layer) {
            layer.bindPopup("<div class=header><b><u>EARTHQUAKE INFO:</u></b></div><b>Magnitude: </b>" + feature.properties.mag + "<br> <b>Location: </b>" + feature.properties.place);
        }
    }).addTo(myMap);

    // functions to implement dynamic markers in which change with respect to event intensity
    function chooseStyle(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: chooseColor(feature.properties.mag),
            color: chooseColor(feature.geometry.coordinates[2]),
            radius: chooseSize(feature.properties.mag),
            stroke: true,
            weight: .5
        };
    }

    function chooseSize(mag) {
        return mag * 3;
    };

    function chooseColor(mag) {
        switch (true) {
            case mag > 5:
                return "#F00505";
            case mag > 4:
                return "#FF2C05";
            case mag > 3:
                return "#FD6104";
            case mag > 2:
                return "#FD9A01";
            case mag > 1:
                return "#FFCE03";
            default:
                return "#FEF001";
        }
    }

    // Create Legend and add to map
    let legend = L.control({
        position: "bottomleft"
    });

    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "legend");

        let intensity = [0, 1, 2, 3, 4, 5];
        let colors = ["#FEF001", "#FFCE03", "#FD9A01", "#FD6104", "#FF2C05", "#F00505"];

        let legendInfo = "<h4><u>LEGEND:</u></h4>"
        div.innerHTML = legendInfo
        for (let i = 0; i < colors.length; i++) {
            div.innerHTML +=
                "<i style='background: " + colors[i] + "'></i> " +
                intensity[i] + (intensity[i + 1] ? "&ndash;" + intensity[i + 1] + " Magnitude <br>" : "+ Magnitude");
        }
        return div;

    };
    legend.addTo(myMap);
});