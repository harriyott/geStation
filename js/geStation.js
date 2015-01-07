var geStation = (function () {
    "use strict";
    var isPlaying,
        stationIndex = 0,
        stationCount = 0,
        markerIndex = 0,
        infowindow,
        iconPlay = "fa-play",
        iconPause = "fa-pause",
        mapCenter,
        openMarker,
        currentYear;
    // Public
    return {
        Initialise: function () {
            stationIndex = 0;
            geStation.Stations = geStation.Data;
            stationCount = geStation.Stations.length;
            geStation.Maps.AverageLatLng();
            geStation.Dates.GetDateData();
            geStation.Maps.initialise();
            $(".js-play").on("click", geStation.Animation.Toggle);
            $("#stationlist").on("click", '.station_listing', geStation.Zoom.ZoomToStation);
            $("#slider").on("input", geStation.Animation.Slider);
        },
        Maps: {
            AverageLatLng: function () {
                var averages = geStation.Maps.calculateAverage(geStation.Stations);
                mapCenter = new google.maps.LatLng(averages.lng, averages.lat);
            },
            calculateAverage: function (latLngs) {
                var latLngCount,
                    currentStation,
                    averageStationLat,
                    averageStationLng,
                    maxLat = Math.max.apply( null, latLngs.map( function(a) { return a.lat; } )),
                    minLat = Math.min.apply( null, latLngs.map( function(a) { return a.lat; } )),
                    maxLng = Math.max.apply( null, latLngs.map( function(a) { return a.lng; } )),
                    minLng = Math.min.apply( null, latLngs.map( function(a) { return a.lng; } ));
                averageStationLat = (maxLat + minLat) / 2.0;
                averageStationLng =	(maxLng + minLng) / 2.0;
                return { lat: averageStationLat, lng: averageStationLng };
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
                    opened: station.opened,
                    closed: station.closed,
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
                geStation.Stations[stationIndex].marker = marker;
                $('#bb-station-list').append('<li class="station_listing" data-id="'+stationIndex+'">'+station.name+'</li>');
                stationIndex++;
                $('#slider').css('background-size', stationIndex / geStation.Stations.length * 100 + '% 100%' );
                setTimeout(geStation.Maps.addMarker, 20);

                google.maps.event.addListener(marker, 'click', function() {
					geStation.Maps.createInfoWindow(marker);
				});

            },
            createInfoWindow: function (marker) {
            	if(infowindow){
            		infowindow.close();
            	}
            	var content = '<div class="geStation-infowindow"><h2>'+marker.title+'</h2><p>Opened in '+marker.opened+'</p>';
            	if(marker.opened != marker.closed ){
            		content += '<p>Closed in '+marker.closed+'</p>';
            	}
            	content += '</div>';
	            infowindow = new google.maps.InfoWindow({
					content: content
				});
				infowindow.open(geStation.Map,marker);
			}

        },
        Data: {},
        Map: null,
        Stations: null,
        Dates: {
            GetDateData: function () {
                var maxDate = Math.max.apply( null, geStation.Stations.map( function(a) { return a.opened; } )),
                    minDate = Math.min.apply( null, geStation.Stations.map( function(a) { return a.opened; } )),
                    maxClose = Math.max.apply( null, geStation.Stations.map( function(a) { return a.closed; } ));
                if(maxClose > maxDate) {
                    maxDate = maxClose;
                }
                $('#slider').attr('min', 0).attr('max', geStation.Stations.length - 1).val(0);
            },
        },
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
                setTimeout(geStation.Animation.ShowStation, 80);
                geStation.Animation.SetStationVisibility( markerIndex, true );
                $("#slider").val(markerIndex);
                markerIndex++;
            },
            SetStationVisibility: function ( markerIdx, visibility ) {
                if ( geStation.Stations[markerIdx].marker !== undefined ) {
                    geStation.Stations[markerIdx].marker.setVisible( visibility );
                    currentYear = geStation.Stations[markerIdx].opened;
                    $('#js-current-year').text(currentYear);
                }
            },
            Slider: function () {
                isPlaying = false;
                $('#js-current-year').text( geStation.Stations[ $("#slider").val() ].opened );
                var newMarker = $('#slider').val();

                if ( newMarker > markerIndex ) {

                    for ( var i = markerIndex; i < newMarker; i++ ) {
                        geStation.Animation.SetStationVisibility( i, true );
                    };

                } else {

                    for ( var i = markerIndex; i > newMarker; i-- ) {
                        geStation.Animation.SetStationVisibility( i, false );
                    };

                }
                markerIndex = newMarker;
            }
        },
        Zoom: {
        	ZoomToStation: function () {
        		var targetStation = geStation.Stations[$(this).data('id')];
                geStation.Map.panTo(new google.maps.LatLng(targetStation.lng, targetStation.lat));
                geStation.Map.setZoom(13);
                openMarker = geStation.Stations[$(this).data('id')].marker;
                geStation.Maps.createInfoWindow(openMarker);
                if(! openMarker.visible) {
                    openMarker.icon.fillColor = '#666';
                    openMarker.setVisible(true);
                    setTimeout(geStation.Zoom.ResetStation, 5000);
                }
        	},
            ResetStation: function () {
                openMarker.setVisible(false);
                openMarker.icon.fillColor = '#f00';
                if(infowindow){
                    infowindow.close();
                }
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



