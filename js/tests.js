test( "latlngtest", function() {
  
	var coords = [
        {
            lng: -2.0,
            lat: 5.0,
        },
        {
            lng: 2.0,
            lat: 6.0,
        },
        {
            lng: -1.0,
            lat: 2.0,
        },
        {
            lng: 3.0,
            lat: 1.0,
        },
    ],

    result = geStation.Maps.calculateAverage(coords);

    equal(result.lat,3.5);
    equal(result.lng,0.5);

});