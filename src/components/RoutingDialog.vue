<template>
  <v-row justify="center">
    <v-dialog v-model="RoutingDialog" ref="foo" max-width="500px" eager @click:outside="setFalse">
      <v-card style="background-color: white;height: 600px">
        <div style="width: 100%;height: 10%;background-color: #4B946A;display: flex">
          <v-btn dark small color="primary" width="33%" height="100%">
            <v-icon dark>mdi-truck-cargo-container</v-icon></v-btn>
          <v-btn dark small color="primary" width="33%" height="100%" @click="routingFromMyLocation()">
            <v-icon dark>mdi-car</v-icon></v-btn>
          <v-btn dark small color="primary" width="33%" height="100%">
            <v-icon dark>mdi-walk</v-icon></v-btn>
        </div>
        <div id="MapDiv" style="width: 100%;height: 82%;z-index: 0;">
          <div id="routDetail">
            <p id="routTime">{{$t('RoutingDialog.Time')}} : {{routTime}}</p>
            <v-progress-circular v-if="overlay" :size="30" :width="7"  color="green" indeterminate style="position:absolute;margin-left: 40%;"></v-progress-circular>
            <p id="routKm">{{$t('RoutingDialog.Distance')}} : {{routKm}}</p>
          </div>
          <v-btn  id="btnGoogleMap" @click="goToGoogleMap()">
            <v-icon>mdi-arrow-right-top-bold</v-icon>
          </v-btn>
          <v-btn  id="btnAddMarker" @click="routingFromMarker()">
            <v-icon>mdi-map-marker-plus</v-icon>
          </v-btn>
        </div>
        <v-card-actions style="background-color: #ff4646;height: 8%;position: relative;bottom: 0;right: 0;width: 100%;">
          <v-spacer></v-spacer>
          <v-btn color="white" text @click="setFalse" style="font-family: IranSans;right: 40%">{{$t('RoutingDialog.Close')}}</v-btn>
        </v-card-actions>
        <v-snackbar  v-model="snackbar" :timeout="3000" :color="snackColor"  rounded="pill" style="text-align: center;margin: auto;min-width: 0 !important;width: 20px;font-family: IranSans;">
          <v-icon style="float:right;">{{ snackIcon }}</v-icon>
          {{ snackText }}
        </v-snackbar>

      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import inStreetStyle from '../fa_map/mapbox-street.json'
import mapboxgl from 'mapbox-gl'
import MapboxLanguage from "@mapbox/mapbox-gl-language";
export default {
  name: "RoutingDialog",
  props:{
    RoutingDialog:false,
    latlng:"",
    routingMap:"",
  },
  data: () => ({
    map:"",
    currlat:"",
    currlng:"",
    markerLat:"",
    markerLng:"",
    coordinates:"",
    routTime:"",
    routKm:"",
    overlay:true,
    snackbar:false,
    snackText:"",
    snackIcon:"",
    snackColor:"",
  }),
  mounted() {
    var th = this;
    this.$root.$on("goToRoutingDialog",function (coordinates) {
      mapboxgl.accessToken = 'pk.eyJ1IjoiaGFkaXJlYWw5IiwiYSI6ImNsMmZ0cXNjMjBiY3UzY2xqdzE1OHIxbXEifQ.wi3bA4H8DAxUbGGi0HwQJg';
      th.routTime = "";
      th.routKm = "";
      th.map = new mapboxgl.Map({
        container: 'MapDiv',
        style: inStreetStyle,
        center: [53.6880,32.4279], // starting position
        zoom: 4, // starting zoom,
      });

    th.coordinates = coordinates;
    th.getCurrent(th.coordinates,"mounted");

    const marker1 = new mapboxgl.Marker({ color: 'black', rotation: 45,offset: [0, -50/2] })
        .setLngLat(th.coordinates)
        .addTo(th.map);
    th.map.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true,
          showUserHeading: true
        }),
        'bottom-left'
    );
    })
  },

  methods:{
    getCurrent(coordinates,from){
      var th = this;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
              th.currlat = position.coords.latitude;
              th.currlng = position.coords.longitude;

              const start = [th.currlng,th.currlat];
              async function getRoute(end) {
                const query = await fetch(`https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${start[0]},${start[1]};${end[0]},${end[1]}?alternatives=false&continue_straight=false&geometries=geojson&language=en&overview=full&steps=true&access_token=${mapboxgl.accessToken}`, { method: 'GET' });
                const json = await query.json();
                const data = json.routes[0];
                th.overlay = false;
                String.prototype.toHHMMSS = function () {
                  var sec_num = parseInt(this, 10); // don't forget the second param
                  var hours   = Math.floor(sec_num / 3600);
                  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
                  var seconds = sec_num - (hours * 3600) - (minutes * 60);

                  if (hours   < 10) {hours   = "0"+hours;}
                  if (minutes < 10) {minutes = "0"+minutes;}
                  if (seconds < 10) {seconds = "0"+seconds;}
                  return hours+':'+minutes+':'+seconds;
                }
                th.routTime = data.duration.toString().toHHMMSS();
                th.routKm = Math.round(data.distance) / 1000;
                console.log(data)
                if(data===undefined){
                  th.snackColor = "red accent-2";
                  th.snackText = th.$t("RoutingDialog.NoDirection");
                  th.snackIcon = "mdi-close-circle"
                  th.snackbar = true;
                }
                const route = data.geometry.coordinates;
                const geojson = {
                  type: 'Feature',
                  properties: {},
                  geometry: {
                    type: 'LineString',
                    coordinates: route
                  }
                };
                // if the route already exists on the map, we'll reset it using setData
                if (th.map.getSource('route')) {
                  th.map.getSource('route').setData(geojson);
                }
                else {
                  th.map.addLayer({
                    id: 'route',
                    type: 'line',
                    source: {
                      type: 'geojson',
                      data: geojson
                    },
                    layout: {
                      'line-join': 'round',
                      'line-cap': 'round'
                    },
                    paint: {
                      'line-color': '#3887be',
                      'line-width': 5,
                      'line-opacity': 0.75
                    }
                  });
                }
              }
              if(from==="mounted"){
                th.map.on('load', function () {
                  th.map.resize();
                  getRoute(coordinates);
                  th.map.flyTo({
                    center: [th.currlng, th.currlat],
                    zoom:8
                  });
                });
              }else if(from==="btnCar"){
                getRoute(coordinates);
                th.map.flyTo({
                  center: [th.currlng, th.currlat],
                  zoom:8
                });
              }


            },
            function (error) {
              th.snackColor = "red accent-2";
              th.snackText = th.$t("RoutingDialog.NoLocation");
              th.snackIcon = "mdi-close-circle"
              th.snackbar = true;
              th.setFalse();
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
            },
        );

      } else {
        alert("Geolocation is not supported by this browser.");
      }
    },
    routingFromMarker(){
      var th = this;
      th.map = new mapboxgl.Map({
        container: 'MapDiv',
        style: inStreetStyle,
        center: [53.6880,32.4279], // starting position
        zoom: 4, // starting zoom,
      });
      this.routTime = "";
      this.routKm = "";
      const marker = new mapboxgl.Marker({
        draggable: true
      })
          .setLngLat([53.6880, 32.4279])
          .addTo(this.map);
      th.map.flyTo({
        center: [53.6880, 32.4279],
        zoom:8
      });
      function onDragEnd() {
        const lngLat = marker.getLngLat();
        th.markerLng = lngLat.lng;
        th.markerLat = lngLat.lat;
      }
      marker.on('dragend', onDragEnd);
      marker.getElement().addEventListener('click', () => {
        th.overlay = true;
        const start = [th.markerLng,th.markerLat];
        async function getRoute(end) {
          const query = await fetch(`https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${start[0]},${start[1]};${end[0]},${end[1]}?alternatives=false&continue_straight=false&geometries=geojson&language=en&overview=full&steps=true&access_token=${mapboxgl.accessToken}`, { method: 'GET' });
          const json = await query.json();
          const data = json.routes[0];
          th.overlay = false;
          String.prototype.toHHMMSS = function () {
            var sec_num = parseInt(this, 10); // don't forget the second param
            var hours   = Math.floor(sec_num / 3600);
            var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
            var seconds = sec_num - (hours * 3600) - (minutes * 60);

            if (hours   < 10) {hours   = "0"+hours;}
            if (minutes < 10) {minutes = "0"+minutes;}
            if (seconds < 10) {seconds = "0"+seconds;}
            return hours+':'+minutes+':'+seconds;
          }
          th.routTime = data.duration.toString().toHHMMSS();
          th.routKm = Math.round(data.distance) / 1000;
          if(data===undefined){
            th.snackColor = "red accent-2";
            th.snackText = th.$t("RoutingDialog.NoDirection");
            th.snackIcon = "mdi-close-circle"
            th.snackbar = true;
          }
          const route = data.geometry.coordinates;
          const geojson = {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: route
            }
          };
          // if the route already exists on the map, we'll reset it using setData
          if (th.map.getSource('route')) {
            th.map.getSource('route').setData(geojson);
          }
          else {
            th.map.addLayer({
              id: 'route',
              type: 'line',
              source: {
                type: 'geojson',
                data: geojson
              },
              layout: {
                'line-join': 'round',
                'line-cap': 'round'
              },
              paint: {
                'line-color': '#3887be',
                'line-width': 5,
                'line-opacity': 0.75
              }
            });
          }
        }
          getRoute(th.coordinates);
          th.map.flyTo({
            center: [th.markerLng, th.markerLat],
            zoom:8
          });
      });

    },
    routingFromMyLocation(){
      var th = this;
      this.overlay = true;
      this.routTime = "";
      this.routKm = "";
      th.getCurrentLocation(th.coordinates,"btnCar");
      // document.getElementById("MapDiv").innerHTML = "";
      th.map = new mapboxgl.Map({
        container: 'MapDiv',
        style: inStreetStyle,
        center: [53.6880,32.4279], // starting position
        zoom: 4, // starting zoom,
      });
      const marker1 = new mapboxgl.Marker({ color: 'black', rotation: 45,offset: [0, -50/2] })
          .setLngLat(th.coordinates)
          .addTo(th.map);
      th.map.addControl(
          new mapboxgl.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true
            },
            trackUserLocation: true,
            showUserHeading: true
          }),
          'bottom-left'
      );

    },
    goToGoogleMap(){
      location.href='https://www.google.com/maps/search/?api=1&query='+this.coordinates[1]+','+this.coordinates[0];
    },
    setFalse(){
      this.$emit("setFalse",false);
    },
    }
}
</script>

<style scoped>
#routDetail{
  width: 45%;
  height: 15%;
  z-index: 500;
  position: relative;
  margin: 10px;
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 2px 0 0px gray;
}
#routTime{
  position: relative;
  top: 10px;
  float: right;
  right: 10px;
}
#routKm
{
  position: absolute;
  float: right;
  right: 10px;
  text-align: justify;
  bottom: 10px;
}

#btnGoogleMap{
  height: 50px;
  width: 50px;
  min-width: 0;
  background-color: white;
  z-index: 500;
  position: absolute;
  bottom: 100px;
  margin-left: 11px;
  border-radius: 50%;
  left: 0;
}
#btnAddMarker{
  height: 50px;
  width: 50px;
  min-width: 0;
  background-color: white;
  z-index: 500;
  position: absolute;
  bottom: 162px;
  margin-left: 11px;
  border-radius: 50%;
  left: 0;
}
.mapboxgl-ctrl-group:not(:empty){
  box-shadow: unset !important;
}
</style>
