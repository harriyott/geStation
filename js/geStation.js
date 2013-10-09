var geStation = (function () {
    "use strict";
    var isPlaying,
        stationIndex = 0;
    // Public
    return {
        Initialise: function () {
            geStation.Maps.initialise();
            $(".js-play").on("click", geStation.Animation.Play);
        },
        Maps: {
            initialise: function () {
                var mapOptions = {
                    center: new google.maps.LatLng(54.226708, -2.790527),
                    zoom: 6,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                geStation.Map = new google.maps.Map(document.getElementById("map-canvas"),
                    mapOptions);
            }
        },
        Data: {},
        Map: null,
        Stations: null,
        Animation: {
            Play: function () {
                isPlaying = true;
                geStation.Animation.ShowStation();
            },
            Pause: function () {
                isPlaying = false;
            },
            ShowStation: function () {
                if (geStation.Stations.length === stationIndex) {
                    return;
                }
                setTimeout(geStation.Animation.ShowStation, 500);
                geStation.Stations.at(stationIndex).marker.setVisible(true);
                stationIndex++;
            }
        }
    };
}());

$(document).ready(function () { geStation.Initialise(); });
$(function () {
    "use strict";
    var
      Station = Backbone.Model.extend({
          defaults: function () {
              return {
                  name: "empty station",
                  lat: 0,
                  lng: 0,
                  opened: 0,
                  closed: 0,
                  marker: null
              };
          }
      }),
      StationList = Backbone.Collection.extend({
          model: Station,
          localStorage: new Backbone.LocalStorage("station-backbone"),
          comparator: function (item) {
              return item.get('opened');
          }
      }),
      stations = new StationList(),

      StationView = Backbone.View.extend({
          tagName: "li",
          template: _.template($('#station-template').html()),
          events: {

          },
          initialize: function () {
              this.listenTo(this.model, 'change', this.render);
          },
          render: function () {
              this.$el.html(this.template(this.model.toJSON()));
              return this;
          }
      }),
      AppView = Backbone.View.extend({
          el: $("#stationapp"),
          initialize: function () {
              this.listenTo(stations, 'add', this.addOne);
              geStation.Data.CreateStations(stations);
              stations.sort();
          },
          addOne: function (station) {
              var view = new StationView({ model: station });
              this.$("#bb-station-list").append(view.render().el);
              var myLatlng = new google.maps.LatLng(station.attributes.lng, station.attributes.lat);
              var marker = new google.maps.Marker({
                  position: myLatlng,
                  map: geStation.Map,
                  title: station.attributes.name,
                  visible: false
              });
              station.marker = marker;
          },
      }),
      app = new AppView();
    geStation.Stations = stations;
});