var geStation = (function () {
    "use strict";
    var isPlaying,
    	chosenStation,
        currentCenter = new google.maps.LatLng(54.226708, -2.790527),
        stationIndex = 0,
        stationCount = 0,
        markerIndex = 0,
        iconPlay = "icon-play",
        iconPause = "icon-pause";
    // Public
    return {
        Initialise: function () {
            stationIndex = 0;
            geStation.Stations = geStation.Data;
            stationCount = geStation.Stations.length;
            geStation.Maps.initialise();
            $(".js-play").on("click", geStation.Animation.Toggle);
            $("#stationlist").on("click", '.station_listing', geStation.Zoom.ZoomToStation);
        },
        Maps: {
            initialise: function () {
                var mapOptions = {
                    center: currentCenter,
                    zoom: 6,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                geStation.Map = new google.maps.Map(document.getElementById("map-canvas"),
                    mapOptions);
                setTimeout(geStation.Maps.addMarker,200);
            },
            addMarker: function () {
                if (stationIndex === stationCount) {
                    return;
                }
                var station = geStation.Stations[stationIndex];
                var myLatlng = new google.maps.LatLng(station.lng, station.lat);
                var marker = new google.maps.Marker({
                    position: myLatlng,
                    map: geStation.Map,
                    title: station.name,
                    visible: false,
                    icon: {
                    	path: google.maps.SymbolPath.CIRCLE,
                    	scale:4,
                    	strokeColor:'#fff',
                    	fillColor:'#f00',
                    	fillOpacity: 0.6,
                    	strokeWeight:1
                    }
                });
                geStation.Markers[stationIndex] = marker;
                $('#bb-station-list').append('<li class="station_listing" id="station'+stationIndex+'">'+station.name+'</li>');
                stationIndex++;
                setTimeout(geStation.Maps.addMarker, 20);
            }
        },
        Data: {},
        Map: null,
        Markers: [],
        Stations: null,
        Animation: {
            Toggle: function () {
            	isPlaying = !isPlaying;
            	if(isPlaying) {
            		geStation.Animation.ShowStation();
                }
                var addClass = isPlaying ? iconPause : iconPlay;
                var removeClass = isPlaying ? iconPlay : iconPause;
                $(".js-play i").addClass(addClass).removeClass(removeClass);
            },
            ShowStation: function () {
                if (geStation.Stations.length === markerIndex || !isPlaying) {
                    return;
                }
                setTimeout(geStation.Animation.ShowStation, 200);
                geStation.Markers[markerIndex].setVisible(true);
                $('#js-current-year').text(geStation.Stations[markerIndex].opened);
                markerIndex++;
            }
        },
        Zoom: {
        	ZoomToStation: function () {
        		chosenStation = $(this).attr('id').replace("station", "");
                currentCenter = new google.maps.LatLng(geStation.Stations[chosenStation].lng, geStation.Stations[chosenStation].lat);
                geStation.Map.panTo(currentCenter);
                geStation.Map.setZoom(13);
        	},
        }
    };
}());
$(document).ready(function () { 		
	geStation.Initialise();
});

