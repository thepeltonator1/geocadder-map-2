// select sheet name from the dropdown menu
var select = document.getElementById("elections-names");
var currentSheet = "Sheet1";

const endpoint = `https://sheets.googleapis.com/v4/spreadsheets/1_qfi1gYWXBNLsPQ5lah-6orlpUEK1VhtWN2UzLbjQCA?key=AIzaSyBLXEpytk-oR9ihfTTT6oZiJJ_vd1WytBM`;
fetch(endpoint)
  .then((response) => response.json())
  .then((data) => {
    const sheetNames = data.sheets.map((sheet) => sheet.properties.title);
    // });
  });

// Create a new Leaflet map centered on the continental US
// var map = L.map("map", { zoomControl: false }).setView([37.8, -96], 3);
var map = L.map("map").setView([37.8, -96], 3);
// This is the Carto Positron basemap
var basemap = L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 20,
  }
);
var attribution = map.attributionControl;
attribution.setPrefix(
  'created by <a style="background-color:#2a92bb; color:white; padding:3px;" target="_blank" href=http://www.geocadder.bg/en>GEOCADDER</a>'
);
basemap.addTo(map);

// Define cluster icons for layer1
var clusterIconOne = L.divIcon({
  className: "custom-cluster-icon-1",
  html: "<div><span>1</span></div>",
  iconSize: L.point(40, 40, true),
});

// Define cluster icons for layer2
var clusterIconTwo = L.divIcon({
  className: "custom-cluster-icon-2",
  html: "<div><span>2</span></div>",
  iconSize: L.point(40, 40, true),
});

var jobOpeningVisible = true;
var schoolsVisible = true;
var lyrMarkerJobOpeningsCluster = L.markerClusterGroup({
  showCoverageOnHover: false,
  iconCreateFunction: function (cluster) {
    return clusterIconOne;
  },
});
var lyrMarkerSchoolsCluster = L.markerClusterGroup({
  showCoverageOnHover: false,
  iconCreateFunction: function (cluster) {
    return clusterIconTwo;
  },
});

// added initial zoom
// var zoomHome = L.Control.zoomHome();
// zoomHome.setHomeCoordinates([47.64704957121617, -117.40599369301589]);
// // zoomHome.setHomeZoom(9);
// zoomHome.addTo(map);

// adding custom button for toggling the legend
L.easyButton(
  '<img src="data/legend-icon-toggling.png">',
  function (btn) {
    if ($("div.legend").css("display") === "block") {
      $("div.legend").css("display", "none");
    } else {
      $("div.legend").css("display", "block");
    }
  },
  "Toggle legend"
).addTo(map);
// end adding custom button for toggling the legend

// start loading Job Openings points

function drawPoints() {
  $.getJSON(
    "https://sheets.googleapis.com/v4/spreadsheets/1uzopEjewC2NW9-V8cPnYwJw9PiDC43jSn0N24AYGcXs/values/JobOpenings!A2:G3000?majorDimension=ROWS&key=AIzaSyBLXEpytk-oR9ihfTTT6oZiJJ_vd1WytBM",
    function (response) {
      // lyrMarkerCluster.clearLayers();
      response.values.forEach(drawMarker);

      function drawMarker(element) {
        var id = element[0];
        var city = element[1];
        var state = element[2];
        var schoolName = element[3];

        var latitude = element[4];
        var longitude = element[5];

        var website = element[6];

        // var companyName = element[0];

        var accountType = element[1];
        var accountTypeSmallLetters = accountType
          .toLowerCase()
          .replace(/\s/g, "-");
        accountTypeSmallLetters = accountTypeSmallLetters
          .replaceAll(",", "")
          .replaceAll("/", "-");

        var popupContent = '<div class="agency-details">';

        popupContent += "<div><b>" + schoolName + "</b></div><hr>";
        popupContent +=
          "<div><span class='popup-title'>City: </span><span class='popup-value'>" +
          city +
          "</span></div>";
        popupContent +=
          "<div><span class='popup-title'>State: </span><span class='popup-value'>" +
          state +
          "</span></div>";

        popupContent +=
          "<p class='website-link'><i class='fa fa-external-link' aria-hidden='true'></i> <a target='_blank' href='" +
          website +
          "'>" +
          website +
          "</a></p>";

        popupContent += "</div>";

        var ipbIcon = L.icon({
          iconUrl: "images/dentist.svg",
          iconSize: [18, 18],
          popupAnchor: [3, -10],
        });

        point = L.marker([latitude, longitude], { icon: ipbIcon })
          // .addTo(map)
          .bindPopup(popupContent);
        point.setLatLng([latitude, longitude]).update();
        // $(point._icon).addClass(accountTypeSmallLetters);
        $(point._icon).attr("data-first-type", "first-jobopenings");
        $(point._icon).attr("data-first-type-visible", "true");
        lyrMarkerJobOpeningsCluster.addLayer(point);
      }

      map.fitBounds(lyrMarkerJobOpeningsCluster.getBounds());
      $(".leaflet-control-zoomhome-home").click(function () {
        map.fitBounds(lyrMarkerJobOpeningsCluster.getBounds());
      });
    }
  );
}

drawPoints();
// end loading Job Openings points

// start loading Schools points
function drawSchoolsPoints() {
  $.getJSON(
    "https://sheets.googleapis.com/v4/spreadsheets/1uzopEjewC2NW9-V8cPnYwJw9PiDC43jSn0N24AYGcXs/values/Schools!A2:G3000?majorDimension=ROWS&key=AIzaSyBLXEpytk-oR9ihfTTT6oZiJJ_vd1WytBM",
    function (response) {
      // lyrMarkerCluster.clearLayers();
      response.values.forEach(drawMarker);

      function drawMarker(element) {
        var id = element[0];
        var state = element[1];
        var schoolName = element[2];

        var latitude = element[3];
        var longitude = element[4];

        var accountType = element[1];
        var accountTypeSmallLetters = accountType
          .toLowerCase()
          .replace(/\s/g, "-");
        accountTypeSmallLetters = accountTypeSmallLetters
          .replaceAll(",", "")
          .replaceAll("/", "-");

        var popupContent = '<div class="agency-details">';

        popupContent += "<div><b>" + schoolName + "</b></div><hr>";

        popupContent +=
          "<div><span class='popup-title'>State: </span><span class='popup-value'>" +
          state +
          "</span></div>";

        popupContent += "</div>";

        var schoolsIcon = L.icon({
          iconUrl: "images/schools.svg",
          iconSize: [18, 18],
          popupAnchor: [3, -10],
        });

        point = L.marker([latitude, longitude], { icon: schoolsIcon })
          // .addTo(map)
          .bindPopup(popupContent);
        point.setLatLng([latitude, longitude]).update();
        // $(point._icon).addClass(accountTypeSmallLetters);
        $(point._icon).attr("data-first-type", "first-schools");
        $(point._icon).attr("data-first-type-visible", "true");
        lyrMarkerSchoolsCluster.addLayer(point);
      }

      map.fitBounds(lyrMarkerSchoolsCluster.getBounds());
      $(".leaflet-control-zoomhome-home").click(function () {
        map.fitBounds(lyrMarkerSchoolsCluster.getBounds());
      });
    }
  );
}

drawSchoolsPoints();
// end loading Schools points

lyrMarkerJobOpeningsCluster.addTo(map);
lyrMarkerSchoolsCluster.addTo(map);

// start adding US and Canada states polygons
// These are declared outisde the functions so that the functions can check if they already exist
var polygonLayer;
// var pointGroupLayer;

// http request to Google Sheets API
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
  if (xhttp.readyState == 4 && xhttp.status == 200) {
    var googleSheetsData = JSON.parse(xhttp.responseText);

    // here we take all columns data for each record from the Google Sheets table
    var googleSheetsDataLength = googleSheetsData["values"].length;
    var googleSheetsRecordsArray = [];
    for (i = 0; i < googleSheetsDataLength; i++) {
      googleSheetsRecordsArray.push(googleSheetsData["values"][i]);
    }

    /// legend ////
    var legendPolygonsItemsAll = [
      {
        range: "Job Openings",
        icon: "dentist",
      },
      {
        range: "Schools",
        icon: "schools",
      },
    ];

    var legend = L.control({ position: "bottomleft" });

    legend.onAdd = function (map) {
      var div = L.DomUtil.create("div", "info legend");
      var labels = [];

      labels.push('<p class="legend-title">Legend</p>');

      for (var i = 0; i < legendPolygonsItemsAll.length; i++) {
        labels.push(
          '<div style="width: 20px; height: 20px; background-color: #EFEEE9;" class="legend-industry-logo"><img src="images/' +
            legendPolygonsItemsAll[i].icon +
            '.svg"></div><b>' +
            legendPolygonsItemsAll[i].range +
            "</b>"
        );
      }

      div.innerHTML = labels.join("<br>");
      // });

      return div;
    };

    legend.addTo(map);
    // end adding legend

    (function addPolygons(googleSheetsData) {
      // The polygons are styled slightly differently on mouse hovers
      var poylygonStyle = { color: "#AF9F30", weight: 1, fillOpacity: 0.3 };
      // var polygonHoverStyle = { "color": "#e6250b", "fillColor": "#969393", "weight": 3 };
      var polygonHoverStyle = { color: "#5d6162", weight: 3, fillOpacity: 0.7 };

      function getColorValue(feature, googleSheetsRecordsArray) {
        var color = "#94B0B2";
        for (var i = 1; i < googleSheetsDataLength; i++) {
          if (googleSheetsRecordsArray[i][1] == feature.properties["postal"]) {
            if (googleSheetsRecordsArray[i][0] === "Albert Arceo") {
              color = "#CA7E55";
            } else {
              color = "#FFB388";
            }
          }
        }
        return color;
      }

      $.getJSON("data/states.geojson", function (data) {
        // add GeoJSON layer to the map once the file is loaded
        var datalayer = L.geoJson(data, {
          style: function (feature) {
            return {
              // fillColor: "#f5a4f2",
              fillColor: "#AF9F30",
              color: "#695d5d",
              weight: 1,
              opacity: 1,
              fillOpacity: 0.3,
            };
          },
          onEachFeature: function (feature, layer) {
            layer.on({
              mouseout: function (e) {
                e.target.setStyle(poylygonStyle);
              },
              mouseover: function (e) {
                e.target.setStyle(polygonHoverStyle);
              },
              click: function (e) {
                // This zooms the map to the clicked polygon
                //   map.fitBounds(e.target.getBounds());

                var popupContent =
                  "<b>State:</b> " + feature.properties["name_en"];

                feature.properties["postal"] ==
                  layer.bindPopup(popupContent).openPopup();
              },
            });
          },
        }).addTo(map);

        var isStatesLayerVisible = true;
        $("input[type='checkbox'][name='filter-by-first-type-input']").click(
          function () {
            var currentSelection = $(this).val();
            if (currentSelection === "first-states") {
              if (isStatesLayerVisible) {
                map.removeLayer(datalayer);
                isStatesLayerVisible = false;
              } else {
                map.addLayer(datalayer);
                isStatesLayerVisible = true;
              }
            }
          }
        );

        // map.fitBounds(datalayer.getBounds());
        // zoomHome.setHomeBounds(datalayer.getBounds());
      });
    })();
  }
  var statesPolygonsSvg = $(
    "#map > div.leaflet-pane.leaflet-map-pane > div.leaflet-pane.leaflet-overlay-pane > svg > g"
  );
  $(statesPolygonsSvg).attr("data-first-type", "first-states");
  $(statesPolygonsSvg).attr("data-first-type-visible", "true");
};

getGoogleSheetsData(currentSheet);

function getGoogleSheetsData(currentSheet) {
  $("div.legend").remove();
  xhttp.open(
    "GET",
    "https://sheets.googleapis.com/v4/spreadsheets/15ieTcjaOYBTZwKXORF6U9lzM3fy3W1ksdJEO5ULf9vw/values/SalesTerritories!A1:C1000?majorDimension=ROWS&key=AIzaSyAa1QRolec0JUw0cTlZepNhPGzr0MakyIg",
    true
  );

  xhttp.send();
}
// end loading US and Canada states polygons

//////////////// open/close dropdown menu for  filter
var checkList = document.getElementById("list1");
checkList.getElementsByClassName("anchor")[0].onclick = function (evt) {
  if (checkList.classList.contains("visible"))
    checkList.classList.remove("visible");
  else checkList.classList.add("visible");
};
//////////////

// filter
$("input[type='checkbox'][name='filter-by-first-type-input']").click(
  function () {
    var currentSelection = $(this).val();

    if ($(this).is(":checked")) {
      if (currentSelection === "first-jobopenings") {
        map.addLayer(lyrMarkerJobOpeningsCluster);
      }
      if (currentSelection === "first-schools") {
        map.addLayer(lyrMarkerSchoolsCluster);
      }
    } else {
      if (currentSelection === "first-jobopenings") {
        map.removeLayer(lyrMarkerJobOpeningsCluster);
      }

      if (currentSelection === "first-schools") {
        map.removeLayer(lyrMarkerSchoolsCluster);
      }
    }
  }
);
// end filter
