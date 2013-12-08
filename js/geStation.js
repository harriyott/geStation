var geStation = (function () {
    "use strict";
    var isPlaying,
        stationIndex = 0,
        stationCount = 0,
        markerIndex = 0,
        iconPlay = "fa-play",
        iconPause = "fa-pause",
        mapCenter;
    // Public
    return {
        Initialise: function () {
            stationIndex = 0;
            geStation.Stations = geStation.Data;
            stationCount = geStation.Stations.length;
            geStation.Maps.AverageLatLng();
            geStation.Maps.initialise();
            $(".js-play").on("click", geStation.Animation.Toggle);
            $("#stationlist").on("click", '.station_listing', geStation.Zoom.ZoomToStation);
        },
        Maps: {
            AverageLatLng: function () {
            	var latLngCount,
            		currentStation,
            		averageStationLat = 0,
            		averageStationLng = 0;
            	for (latLngCount = 0; latLngCount < geStation.Stations.length; ++latLngCount) {
            		currentStation = geStation.Stations[latLngCount];
            		averageStationLat = averageStationLat + currentStation.lat * 3.14 / 180;
            		averageStationLng = averageStationLng + currentStation.lng * 3.14 / 180;
            	}
            	averageStationLat = (averageStationLat / geStation.Stations.length) * 180 / 3.14;
				averageStationLng = (averageStationLng / geStation.Stations.length) * 180 / 3.14;
            	mapCenter = new google.maps.LatLng(averageStationLng, averageStationLat);
            },
            initialise: function () {
                var mapOptions = {
                    center: mapCenter,
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
                $('#bb-station-list').append('<li class="station_listing" data-id="'+stationIndex+'">'+station.name+'</li>');
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
                setTimeout(geStation.Animation.ShowStation, 20);
                geStation.Markers[markerIndex].setVisible(true);
                $('#js-current-year').text(geStation.Stations[markerIndex].opened);
                markerIndex++;
            }
        },
        Zoom: {
        	ZoomToStation: function () {
        		var targetStation = geStation.Stations[$(this).data('id')];
                geStation.Map.panTo(new google.maps.LatLng(targetStation.lng, targetStation.lat));
                geStation.Map.setZoom(13);
        	}
        }
    };
}());
$(document).ready(function () { 		
	geStation.Initialise();
});

google.maps.event.addDomListener(window, "resize", function() {
    var currentCenter = geStation.Map.getCenter();
    google.maps.event.trigger(geStation.Map, "resize");
    geStation.Map.panTo(currentCenter);
});

