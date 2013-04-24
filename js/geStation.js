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
      localStorage: new Backbone.LocalStorage("station-backbone")
    }),
    Stations = new StationList(),

    StationsView = Backbone.View.extend({
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
        Stations.fetch();
      }
    }),
    App = new AppView();
});