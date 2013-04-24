$(function() {
  "use strict";
  var Station = Backbone.Model.extend({
    defaults: function() {
      return {
        name: "empty station",
        lat: 0,
        lng: 0,
        opened: 0,
        closed: 0
      };
    }
  });
  var StationList = Backbone.Collection.extend ({
    model: Station,
    localStorage: new Backbone.LocalStorage("station-backbone")
  });
  var Stations = new StationList;
});