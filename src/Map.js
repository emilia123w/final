import React, { Component } from 'react';
import LocationList from "./LocationList";


class Map extends Component{

constructor(props){
  super(props);
  this.state = {
      alllocations: require("./miejsca.json"),
      map: "",
      infowindow: "",
      prevmarker: ""
    };

   this.initMap = this.initMap.bind(this);
   this.openInfoWindow = this.openInfoWindow.bind(this);
   this.closeInfoWindow = this.closeInfoWindow.bind(this)
}

componentDidMount() {

        window.initMap = this.initMap;

        loadMap('https://maps.googleapis.com/maps/api/js?key=AIzaSyCG28KPn4R6JOIXEgxygKcI9itTNQUIY9M&v=3&callback=initMap')
    }

    initMap(){
      var styles=[
        {featureType: 'water',
        stylers:[
          {color: '#d142f4'}
        ]},
        {featureType: 'water',
        stylers:[
          {color: '#d142f4'}
        ]}
      ]
      var self=this;
      var mapId = document.getElementById('map');
      mapId.style.height = window.innerHeight + "px";

    var map= new window.google.maps.Map(mapId,{
     center: {lat: 51.180042, lng: 20.869293},
   zoom:9,
   styles:styles,
   mapTypeControl: false});

   var InfoWindow = new window.google.maps.InfoWindow({});

   window.google.maps.event.addListener(InfoWindow, "closeclick", function() {
         self.closeInfoWindow();
       });

       this.setState({
           'map': map,
           'infowindow': InfoWindow

       });
       window.google.maps.event.addDomListener(window, "resize", function() {
      var center = map.getCenter();
      window.google.maps.event.trigger(map, "resize");
      self.state.map.setCenter(center);
    });

    window.google.maps.event.addListener(map, "click", function() {
      self.closeInfoWindow();
    });

    var alllocations = [];
    this.state.alllocations.forEach(function(location) {
      var longname = location.name + " - " + location.type;
      var marker = new window.google.maps.Marker({
        position: new window.google.maps.LatLng(
          location.latitude,
          location.longitude
        ),
        animation: window.google.maps.Animation.DROP,
        map: map
      });
      marker.addListener("click", function() {
       self.openInfoWindow(marker);
     });

     location.longname = longname;
     location.marker = marker;
     location.display = true;
     alllocations.push(location);
   });
   this.setState({
     alllocations: alllocations
   });
 }
 openInfoWindow(marker) {

    this.closeInfoWindow();
    this.state.infowindow.open(this.state.map, marker);
    marker.setAnimation(window.google.maps.Animation.BOUNCE);
    this.setState({
      prevmarker: marker
    });
    this.state.infowindow.setContent('loading data...');
    this.state.map.setCenter(marker.getPosition());
    this.state.map.panBy(0, -200);
    this.getMarkerInfo(marker);

  }
  getMarkerInfo(marker) {
     var self = this;

     // Add the api keys for yelp
     var clientId = 'EYLWMPA4BKMJ20A4C5OD5UOQW1X0XQJKQJ1F4JC01EL0JOAG'
     var clientSecret = "QLOVEWHGZ0CH3RU3BV21HGKQLONYMLTE2LURXOU3X30HUML4";
     var url =
      "https://api.foursquare.com/v2/venues/search?client_id="
      + clientId + "&client_secret="
       + clientSecret + "&v=20130815&ll="
       + marker.getPosition().lat()
        + "," + marker.getPosition().lng()
        + "&limit=1";
    fetch(url)
      .then(function(response) {
        if (response.status !== 200) {
          self.state.infowindow.setContent("Data not loaded");
          return;
        }
        response.json().then(function (data) {
                               var location_data = data.response.venues[0];
                               var verified = '<b>Verified Location: </b>' + (location_data.verified ? 'Yes' : 'No') + '<br>';
                               var checkinsCount = '<b>CheckIn: </b>' + location_data.stats.checkinsCount + '<br>';
                               var usersCount = '<b>Users: </b>' + location_data.stats.usersCount + '<br>';
                               var tipCount = '<b>Tips: </b>' + location_data.stats.tipCount + '<br>';
                               var readMore = '<a href="https://foursquare.com/v/'+ location_data.id +'" target="_blank">Read More on Foursquare Website</a>'
                               self.state.infowindow.setContent(checkinsCount + usersCount + tipCount + verified + readMore);
                           });
                  }
              )
              .catch(function (err) {
                  self.state.infowindow.setContent("Something went wrong");
              });
      }



closeInfoWindow() {
    if (this.state.prevmarker) {
      this.state.prevmarker.setAnimation(null);
    }
    this.setState({
      prevmarker: ""
    });
    this.state.infowindow.close();
  }






  render() {
       return (
           <div>
           <LocationList
          key="100"
          alllocations={this.state.alllocations}
          openInfoWindow={this.openInfoWindow}
          closeInfoWindow={this.closeInfoWindow}
        />

               <div id="map"></div>
           </div>
         )
       }
}

function loadMap(src) {
    var ref = window.document.getElementsByTagName("script")[0];
    var script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    script.onerror = function () {
        document.write("Google Maps can't be loaded");
    };
    ref.parentNode.insertBefore(script, ref);
}

  export default Map;
