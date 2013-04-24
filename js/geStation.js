﻿$(function() {
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
              opened: 1900,
              closed: 1980
          });
          Stations.create({
              name: 'Newick and Chailey',
              lat: 1.1,
              lng: 50.1,
              opened: 1900,
              closed: 19850
          });
      },
      addOne: function (station) {
          var view = new StationView({ model: station });
          this.$("#bb-station-list").append(view.render().el);
      },
    }),
    App = new AppView();
});