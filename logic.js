// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + "Magnitude"+"<br>"+ feature.properties.mag +
      "</h3><hr><p>" + "<B>" + "Time" +"</B>"+ "<br>" + new Date(feature.properties.time) + "</p>"
      + "<b>" + "Location" + "</b>" + "<br>" +feature.properties.place );
  }

  function getColor(d){
    return d > 8 ? "#8c79c8":
    d  > 5.8 ? "#8784c4":
    d > 5.5 ? "#838fbf":
    d  > 5.2 ? "#7e9bbb":
    d > 4.9 ? "#7aa6b6":
    d > 4.6 ? "#75b1b2":
    d > 4.5 ? "#71bcae":
             "#6dc7a9";
  }


  function getRadius(value){
    return value*20000
  }


  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,

    pointToLayer: function (feature, latlng) {
      return new L.circle(latlng,
        {radius: getRadius(feature.properties.mag),
        fillColor: getColor(feature.properties.mag),
        fillOpacity: .80,
        color: getColor(feature.properties.mag), 
        stroke: true,
        weight: .8
    })
  }
  });

//console.log(earthquakeData)
  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      6.9350, 126.049
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });
  

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  var legend = L.control({position: 'bottomright'});

  function getColor(d){
    return d > 8 ? "#8c79c8":
    d  > 5.8 ? "#8784c4":
    d > 5.5 ? "#838fbf":
    d  > 5.2 ? "#7e9bbb":
    d > 4.9 ? "#7aa6b6":
    d > 4.6 ? "#75b1b2":
    d > 4.5 ? "#6dc7a9":
             "#6dc7a9";
  };

  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
          quake = [4.5, 4.6, 4.9, 5.2, 5.5, 5.8, 8],
          labels = [];
  
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < quake.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(quake[i] + 1) + '"></i> ' +
              quake[i] + (quake[i + 1] ? '&ndash;' + quake[i + 1] + '<br>' : '+');
              
      }
  
      return div;
  };
  
  legend.addTo(myMap);

};
