var geStation = (function () {
   "use strict"
// Public
   return {
   	Initialise: function () {
       geStation.Maps.initialise ();
       $(".js-play").on("click",geStation.Animation.Play);
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
         },
      },
      Map: null,
      Animation: function () {
         return {
            Play: function () {
               
            },
            Pause: function () {
            
            },
         };
      },
   };
}());

$(document).ready(function () {geStation.Initialise();});
$(function() {
  "use strict";
  var
    Station = Backbone.Model.extend({
      defaults: function() {
        return {
          name: "empty station",
          lat: 0,
          lng: 0,
          opened: 0,
          closed: 0
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
    Stations = new StationList(),

    StationView = Backbone.View.extend({
      tagName: "li",
      template: _.template($('#station-template').html()),
      events: {

      },
      initialize: function() {
        this.listenTo(this.model, 'change', this.render);
      },
      render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
      }
    }),
    AppView = Backbone.View.extend({
      el: $("#stationapp"),
      initialize: function() {
          this.listenTo(Stations, 'add', this.addOne);
          Stations.create({
              name: 'Uckfield',
              lat: 1,
              lng: 50,
              opened: 1902,
              closed: 1980
          });
          Stations.create({
              name: 'Newick and Chailey',
              lat: 1.1,
              lng: 50.1,
              opened: 1900,
              closed: 1985
          });
          Stations.sort();
      },
      addOne: function (station) {
          var view = new StationView({ model: station });
          this.$("#bb-station-list").append(view.render().el);
          var myLatlng = new google.maps.LatLng(station.attributes.lng,station.attributes.lat);          
            var marker = new google.maps.Marker({
                position: myLatlng,
                map: geStation.Map,
                title:station.attributes.name,
                visible: false
            });
          
      },
    }),
    App = new AppView();
});