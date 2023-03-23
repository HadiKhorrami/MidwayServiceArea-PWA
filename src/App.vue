<template>
 <v-app style="height: 100%; width: 100%;position: fixed;display: block;-ms-overflow-style: -ms-autohiding-scrollbar" >
   <NavigationDrawer :drawer="drawer" :area-names="areaNames" :isRight="isRight" @setFalse="drawer=false"/>
   <ServiceAreaDetailsDialog  :ServiceAreaDetailsDialog="ServiceAreaDetailsDialog" :slideArray="slideArray" :detail="detail" :saveColor="saveColor" :services="services" :ratingArray="ratingArray" :areaname="areaname" :managerName="managerName" :axis="axis" :km="km" @setFalse="ServiceAreaDetailsDialog=false"/>
   <AreaSubServices  :AreaSubServices="AreaSubServices" :subServiceArray="subServiceArray" :headerColor="headerColor"/>
   <RoutingDialog :RoutingDialog="RoutingDialog" :latlng="latlng" @setFalse="RoutingDialog=false"/>
   <SearchResultSheet :SearchResultSheet="SearchResultSheet" :searchResultArray="searchResultArray" :currlat="currlat" :currlng="currlng" @setFalse="SearchResultSheet=false"/>

    <div id="mapdiv">
      <v-btn id="btnSearchResult" v-if="btnSearchResult" @click="searchSheetResult()">
        <v-icon color="green">mdi-magnify-expand</v-icon>
      </v-btn>
      <v-btn  id="btnLayer" @click="changeLayer()">
        <v-icon v-text="mdiLayers"></v-icon>
      </v-btn>
      <v-progress-circular id="mainProgress" v-if="overlay" :size="70" :width="7" color="pink" indeterminate></v-progress-circular>
      <v-icon v-if="refresh" style="height: 50px;width: 50px;z-index: 500;margin: auto;color: #ff5252;font-size: 100px;" @click="setRefresh()">mdi-refresh</v-icon>
      <v-overflow-btn :items="areaNames" item-value="id" item-text="name" @change="changeProgress" style="width:70%;z-index: 500;font-family: IranSans;position: absolute;top:10px;margin-left: 15%;border-radius: 10px" class="my-2" id="overflow"
                      v-bind:label="$t('OverFlowSearch')" editable  filled background-color="white" append-icon="mdi-magnify" append-outer-icon="mdi-menu" @click:append-outer="drawer=!drawer;drawer=true;QiblaDialog=false;ServiceAreaDetailsDialog=false;RoutingDialog=false;AreaSubServices=false;setManagerLoginText()"></v-overflow-btn>
      <v-btn id="btnQibla" @click="getCurrentLocation(true);QiblaDialog=!QiblaDialog;QiblaDialog=true;drawer=false" :color="btnQiblaColor">
        <v-img v-bind:src="require('./assets/kabe.png')" style="width: 18px; height: 18px;min-width: 0"></v-img>
      </v-btn>
      <v-snackbar  v-model="snackbar" :timeout="3000" :color="snackColor"  rounded="pill" style="text-align: center;margin: auto;min-width: 0 !important;width: 20px;font-family: IranSans;">
        <v-icon style="float:right;">{{ snackIcon }}</v-icon>
        {{ snackText }}
      </v-snackbar>
    <BottomNavigation :areaNames="areaNames" :favoriteAreas="favoriteAreas" :ServiceAreaDetailsDialog="ServiceAreaDetailsDialog" :services="services"/>
  </div>
      <router-view></router-view>
</v-app>
</template>

<style>
.v-application--is-ltr .v-expansion-panel-header__icon{
  position: absolute !important;
  left: 20px !important;
}
.theme--light.v-expansion-panels .v-expansion-panel-header .v-expansion-panel-header__icon .v-icon{
  color: white !important;
}
.v-sheet.v-card{
  position: unset !important;
}
.mapboxgl-ctrl-group:not(:empty){
  box-shadow: unset !important;
}
.v-progress-circular {
  margin: 1rem;
  height: 70px;
  width: 70px;
  z-index: 10;
  position: relative;
  top: 35%;
  left: 20%;
}
#btnSearchResult{
  height: 50px;
  width: 50px;
  min-width: 0;
  background-color: white;
  z-index: 500;
  position: absolute;
  bottom: 165px;
  margin-left: 11px;
  border-radius: 50%;
  left: 0;
}
#btnLayer{
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
#btnQibla{
  height: 50px;
  width: 50px;
  min-width: 0;
  z-index: 500;
  position: absolute;
  margin-left: 11px;
  border-radius: 50%;
  right: 10px;
  top: 90px;
}
@font-face {
  font-family: "IranSans";
  src: url("./assets/fonts/IRANSANS.TTF");
  font-weight: normal;
  font-style: normal;
}
#mapdiv{
  height: 95%;
  width: 100%;
  position: fixed;
  display: inline-flex;
  z-index: 0;
}
#popupDiv{
  background-color: white;
  height: 160px;
  width: 250px;
  position: relative;
  border-radius: 15px;
}
#name{
  color: white;
  float: right;
  margin-right: 10px;
  font-size: small;
  text-align: right;
}
#side{
  color: white;
  float: right;
  margin-top: 10px;
  margin-right: 10px;
  margin-bottom: 10px;
  font-size: small;
  text-align: right;
}
#distanceDiv {
  height: 30%;
  width: 60%;
  background-color: #ffc2c2;
  position: relative;
  z-index: 500;
  margin: 45px 100px auto 10px;
  border-radius: 10px;
  float: right;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
  padding: 5px;
}
#distance {
  text-align: right;
  bottom: 5px;
  font-size: small;
  color: #FFFFFF;
  float: right;
  margin-bottom: 10px;
  margin-right: 10px;
}
#directions{
  position: relative;
  top: 150px;
  text-align: right;
  font-size: small;
  width: -moz-fit-content;
  width: 100px;
  float: right;
  background-color: burlywood;
  text-align: center;
  border-radius: 5px;
}
#moreinfo{
  position: relative;
  top: 150px;
  text-align: left;
  font-size: small;
  margin-left: 10px;
  width: -moz-fit-content;
  width: 100px;
  text-align: center;
  background-color: burlywood;
  border-radius: 5px;
}
.directions-control.directions-control-directions{
  display: none;
}
.leaflet-top{
  top:120px !important;
}
.v-snack__content{
  text-align: center !important;
}
.v-application--is-ltr .v-input__append-outer{
  height: 56px;
  width: 40px;
  background-color: white;
  margin-left: 5px !important;
}
.v-input__append-outer .v-icon, .v-input__prepend-outer .v-icon{
  color: #666666 !important;
  margin-top: 30px;
}
.v-overflow-btn .v-input__append-outer{
  margin-top: 0px !important;
}
#list-item{
  color: black;
  font-size: 12px !important;
}
.custom-shape-divider-top-1648540781 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  overflow: hidden;
  line-height: 0;
}

.custom-shape-divider-top-1648540781 svg {
  position: relative;
  display: block;
  width: calc(100% + 1.3px);
  height: 150px;
}

.custom-shape-divider-top-1648540781 .shape-fill {
  fill: #06978A;
}

/** For mobile devices **/
@media (max-width: 767px) {
  .custom-shape-divider-top-1648540781 svg {
    width: calc(100% + 1.3px);
    height: 283px;
  }
}
.mapboxgl-ctrl-group {
  border-radius: 50%;
  height: 50px;
  width: 50px;
}
.mapboxgl-ctrl-bottom-left{
  bottom: 30px;
  left: 3px;
}
.mapboxgl-ctrl-group button{
  height: 50px;
  width: 50px;
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.15), 0px 2px 2px 0px rgba(0, 0, 0, 0.01), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
}
/*.mapboxgl-ctrl-group:not(:empty){*/
/*  box-shadow: unset !important;*/
/*}*/
.mapboxgl-popup-close-button{
  height: 30px !important;
  width: 30px !important;
  position: relative;
  background-color: lightcoral;
  border-radius: 50%;
  margin: 5px;
  display: none;
}
.mapboxgl-popup-content{
  width: fit-content;
}
.v-overflow-btn .v-input__append-outer, .v-overflow-btn .v-input__prepend-outer{
  border-radius: 10px;
}
.fa{
  font-size: smaller;
}
.v-application--is-ltr .v-text-field--reverse .v-label{
  font-size: small !important;
}
.v-textarea.v-text-field--enclosed.v-text-field--outlined:not(.v-input--dense) .v-label{
  padding-right: 10px;
}
.leaflet-top, .leaflet-bottom{
  z-index: 500 !important;
}
.v-text-field > .v-input__control > .v-input__slot > .v-text-field__slot{
  margin-right:0px !important ;
}
.v-application p {
  margin-bottom: 0;
}
.v-text-field .v-input__prepend-inner, .v-text-field .v-input__append-inner{
  display: block !important;
}
#mainProgress{
  margin-left: 40%;
  margin-top: 300px;
}
#popupClose{
  font-size: x-large;
  color: white;
}
</style>
<script>
import BottomNavigation from './components/BottomNavigation.vue'
import NavigationDrawer from './components/NavigationDrawer.vue'
import ServiceAreaDetailsDialog from './components/ServiceAreaDetailsDialog.vue'
import RoutingDialog from './components/RoutingDialog.vue'
import AreaSubServices from './components/AreaSubServices.vue'
import QiblaDialog from './components/QiblaDialog.vue'
import SearchResultSheet from './components/SearchResultSheet.vue'
import axios from 'axios'
import image1 from './assets/round_local_parking_black_24.png'
import image2 from './assets/round_location_on_black_36.png'
import inSatelliteStyle from './fa_map/mapbox-satellite.json';
import inStreetStyle   from './fa_map/mapbox-street.json';
import sat   from './fa_map/sat.json';
import '../node_modules/vue-range-slider/dist/vue-range-slider.css';
import RangeSlider from 'vue-range-slider'
import * as turf from '../node_modules/@turf/turf'
import * as d3 from "d3";
import { mdiLayers } from '@mdi/js';
import $ from "jquery";
import mapboxgl from 'mapbox-gl';
import MapboxLanguage from '@mapbox/mapbox-gl-language';

let wkt = null;
export default {
  props:{
    ServiceAreaDetailsDialog:false,
    AreaSubServices:false,
    AddAreaImagesDialog:false,
    RoutingDialog:false,
    SearchSheet:false,
    SearchResultSheet:false,
    overFlowReverse:true,
    drawer:false,
    QiblaDialog:false,
    isEager:true,
    slideArray:[],
    latlng:[],
    routingMap:"",
  },
  data: () => ({
    accessToken:'pk.eyJ1IjoiaGFkaXJlYWw5IiwiYSI6ImNsMmZ0cXNjMjBiY3UzY2xqdzE1OHIxbXEifQ.wi3bA4H8DAxUbGGi0HwQJg',
    mapStyle:'mapbox://styles/mapbox/streets-v11',
    map:"",
    latlngArray:[],
    pointArray:[],
    slideArray:[],
    ratingArray:[],
    services : [],
    serviceTypes:[],
    selectedTypes: [],
    favoriteAreas:[],
    areaNames:[],
    searchResultArray:[],
    areaCoordinates:[],
    urlResponse:[],
    subServiceArray:[],
    otherlatlng:[],
    detail:{},
    headerColor:"",
    refresh:false,
    drawer:false,
    Layersheet:false,
    mdiLayers:mdiLayers,
    isReserve:true,
    QiblaDialog:false,
    streetLayer:true,
    satellitetLayer:false,
    overlay:true,
    SearchMapDialog : false,
    isRight:false,
    btnSearchResult:false,
    btnQibla:false,
    latlng:"",
    currlat:"",
    currlng:"",
    /////////////
    areaname:"",
    managerName:"",
    axis:"",
    km:"",
    /////////////
    sprite:"",
    glyphs :"",
    setorgSatellite :"",
    composite :"",
    /////////////
    wmsGetMapUrl:'https://restareas.rmto.ir/api/jsonws/MidwayServiceArea-portlet.midwayareainfo/get-wms-map-url',
    geoJsonSource:{
      type: 'geojson',
      id:"midwayArea",
      data: "",
      cluster: true,
      clusterMaxZoom: 6, // Max zoom to cluster points on
      clusterRadius: 50
    },
    areaDetail:{
      midwayServiceAreaTypeName:"",
      name:"",
      side:"",
    },
    response:"",
    areaResponse:"",
    saveColor:"",
    btnQiblaColor:"white",
    searchRadius:"",
    snackbar: false,
    snackText: "",
    snackIcon: "",
    snackColor: ""
  }),
  name: "MyAwesomeMap",
  components: {
    BottomNavigation,
    NavigationDrawer,
    ServiceAreaDetailsDialog,
    QiblaDialog,
    RoutingDialog,
    AreaSubServices,
    SearchResultSheet
  },
  mounted() {
    var th = this;
    mapboxgl.accessToken = 'pk.eyJ1IjoiaGFkaXJlYWw5IiwiYSI6ImNsMmZ0cXNjMjBiY3UzY2xqdzE1OHIxbXEifQ.wi3bA4H8DAxUbGGi0HwQJg';
    mapboxgl.setRTLTextPlugin('https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js');
    this.setPersianMap();
    this.LoadMarkers(inStreetStyle);
    if(th.$i18n.locale==='en'){
      this.isRight = false;
      $('.v-sheet.v-card:not(.v-sheet--outlined)').css('float','left');
      $('.v-sheet.v-card:not(.v-sheet--outlined)').css('position','absolute');
      $('.v-sheet.v-card:not(.v-sheet--outlined)').css('left','0');
      $('.SearchRadius').css('left','30px');
      $('.SearchRadius').css('right','auto');
      $('.SearchRadius').css('position','absolute');
      $('.SearchRadius').css('direction','ltr');
      $('#when_change_range').css('marginLeft','160px');
      $('#when_change_range1').css('left','180px');
      $('#when_change_range1').css('width','45%');
      $('#text_for_show_range').css('marginLeft','240px');
      $('#text_for_show_range1').css('float','right');
      $('#text_for_show_range1').css('left','40px');
      $('.itemTitle').css('left','35px');
      $('.itemTitle').css('position','relative');
      $('.textField').css('direction','ltr');
    }else
    if(th.$i18n.locale==='fa'){
      this.isRight = true;
      $('.v-sheet.v-card:not(.v-sheet--outlined)').css('float','right');
      $('.v-sheet.v-card:not(.v-sheet--outlined)').css('position','absolute');
      $('.v-sheet.v-card:not(.v-sheet--outlined)').css('right','0');
      $('.SearchRadius').css('right','30px');
      $('.SearchRadius').css('left','auto');
      $('.SearchRadius').css('position','absolute');
      $('.SearchRadius').css('direction','rtl');
      $('.VueSlideBar').css('left','0px');
      $('#itemTitle').css('left','auto');
      $('.textField').css('direction','rtl');
    }
    $('.v-application--is-ltr .v-text-field .v-label').css('fontSize','small')
    this.getCurrentLocation();
    this.searchResult();
    this.openServiceDetail();
    this.setReverse();
    this.getMidWayServiceAreaTypes();
    this.getPersonWithPicture();
  },
  methods: {
    route() {
      this.$router.push({ name: 'LoginForm' })
    },
    setPersianMap(){
      this.sprite =  "https://portal.psoihim.ir/geoDataManagement-portlet/sprite?n=mapbox-sprite-v1-streets-v9&t=";
      this.glyphs = "https://portal.psoihim.ir/geoDataManagement-portlet/glyphs?n=mapbox-glyphs-v1&f={fontstack}&r={range}";
      this.setorgSatellite = "https://portal.psoihim.ir/geoDataManagement-portlet/tms?layer=satraSat1&z={z}&x={x}&y={y}";
      this.composite = "https://portal.psoihim.ir/geoDataManagement-portlet/tms?layer=mapbox.mapbox-streets-v8&z={z}&x={x}&y={y}";
      inSatelliteStyle.sprite = this.sprite;
      inSatelliteStyle.glyphs = this.glyphs;
      // inSatelliteStyle.sources.setorgSatellite.tiles = this.setorgSatellite;
      // inSatelliteStyle.sources.composite.tiles = this.composite;

      inStreetStyle.sprite = this.sprite;
      inStreetStyle.glyphs = this.glyphs;

      sat.sprite = this.sprite;
      sat.glyphs = this.glyphs;
      // inStreetStyle.sources.composite.tiles = this.composite;

    },
    LoadMarkers(mapStyle){
      this.overlay = true;

      var map = new mapboxgl.Map({
        container: 'mapdiv',
        // style: mapStyle,
        center: [53,32], // starting position
        zoom: 4, // starting zoom
      });

      map.addControl(
          new mapboxgl.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true
            },
            trackUserLocation: true,
            showUserHeading: true
          }),
      'bottom-left',
      );
      var th = this;
      const formData = new FormData();
      formData.append('cmd', "{'/MidwayServiceArea-portlet.midwayareainfo/get-wms-map-url':{}}");
      axios.post('https://restareas.rmto.ir/api/jsonws/invoke', formData,{timeout:15000}
      ).then(response => {
        this.overlay = false;
        this.response = response;
        document.cookie = "response="+ response.data;
        try {
          map.on('styledata', function(e) {
            if(!map.getSource('midwayArea')){
              map.addSource('midwayArea', {
                type: 'geojson',
                data: response.data,
                cluster: true,
                clusterMaxZoom: 6, // Max zoom to cluster points on
                clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
              });
              map.loadImage(
                  image1,
                  function (error, image) {
                    if (error) throw error;
                    map.addImage('img-26', image);
                  });
              map.loadImage(
                  image2,
                  function (error, image) {
                    if (error) throw error;
                    map.addImage('img-28', image);
                  });
            }

          });
          map.on('sourcedata',function(e){
            if(e.sourceId === 'midwayArea'){
              if(!map.getLayer('clusters')){
                map.addLayer({
                  id: 'clusters',
                  type: 'circle',
                  source: 'midwayArea',
                  filter: ['has', 'point_count'],
                  paint: {'circle-color': ['step', ['get', 'point_count'], '#06978A', 100, '#06978A', 750, '#06978A'],
                    'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40]
                  }
                })
              }
              if(!map.getLayer('cluster-count')){
                map.addLayer({
                  id: 'cluster-count',
                  type: 'symbol',
                  source: 'midwayArea',
                  filter: ['has', 'point_count'],
                  layout: {
                    'text-field': '{point_count_abbreviated}',
                    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                    'text-size': 12,
                  },
                  paint: {
                    "text-color": "#ffffff"
                  }
                });
              }
              if(!map.getLayer('unclustered-point')){
                map.addLayer({
                  id: 'unclustered-point',
                  type: 'symbol',
                  source: 'midwayArea',
                  layout: {'icon-image': ['concat', 'img-', ['get', 'midwayserviceareatypeid']], 'icon-size': 0.5},
                  filter: ['!', ['has', 'point_count']]
                });
              }
              if(!map.getLayer('search-radius')){
                map.addLayer({
                  id: 'search-radius',
                  source: {
                    type: 'geojson',
                    data: { "type": "FeatureCollection", "features": [] }
                  },
                  type: 'fill',
                  paint: {
                    'fill-color': '#6dff44',
                    'fill-opacity': 0.5
                  }
                });
              }
            }
          });
        }catch (e) {
          alert(e)
        }

        map.setStyle(inStreetStyle)
        this.setURLResponse();
      }).catch(error => {
        this.overlay = false;
        this.refresh = true;
        this.snackColor = "red accent-2";
        this.snackText = this.$t("SnackBar.NetworkError");
        this.snackIcon = "mdi-close-circle";
        this.snackbar = true;
        this.errorMessage = error.message;
        console.error("There was an error!", error);
      });

      map.on('click','clusters',(e) => {
        console.log('e')
        var features =map.queryRenderedFeatures(e.point, {
          layers: ['clusters']
        });
        console.log(features)
        var clusterId = features[0].properties.cluster_id;
        map.getSource('midwayArea').getClusterExpansionZoom(
            clusterId,
            function (err, zoom) {
              if (err) return;
              map.easeTo({
                center: features[0].geometry.coordinates,
                zoom: zoom
              });
            }
        );
      });

      map.on('click','unclustered-point',(e) => {
        this.$root.$emit('closeDialog', true);
        th.ServiceAreaDetailsDialog = false;
        th.RoutingDialog = false;
        th.AreaSubServices = false;
        th.overlay = true;
        th.drawer=false;
        map.flyTo({
          center: e.features[0].geometry.coordinates
        });
        console.log(e.features[0].properties.midwayserviceareainfoid)
        const formData = new FormData();
        formData.append('id', e.features[0].properties.midwayserviceareainfoid);
        formData.append('locale', "fa_IR");
        formData.append('dateInMiliseconds', true);
        formData.append('cmd', "{'/MidwayServiceArea-portlet.midwayareainfo/get-mid-way-service-area-with-documents-and-services-and-rate':{}}");
        axios.post('https://restareas.rmto.ir/api/jsonws/invoke', formData,{timeout:20000}
        ).then(response => {
          console.log(response)
          th.overlay = false
          th.slideArray = [];
          th.services = [];
          th.latlng = response.data[0].geomWKT.substring(13,response.data[0].geomWKT.length-2);
          th.latlng = this.latlng.split(" ");
          th.latlng[0]=parseFloat(this.latlng[0]);
          th.latlng[1]=parseFloat(this.latlng[1]);
          th.areaDetail.midwayServiceAreaTypeName = response.data[0].midwayServiceAreaTypeName;
          th.areaDetail.side = response.data[0].side;
          th.areaDetail.name = response.data[0].name;
          th.services = response.data[0].services
          th.areaResponse = response
          var detail = {
            "name":response.data[0].name,
            "grade":response.data[0].grade,
            "averageRating":response.data[0].averageRating,
            "emailAddress":response.data[0].emailAddress,
            "managerName":response.data[0].managerName,
            "investorMobileNumber":response.data[0].investorMobileNumber,
            "axis":response.data[0].axis,
            "km":response.data[0].km,
            "midwayServiceAreaTypeName":response.data[0].midwayServiceAreaTypeName,
            "midwayServiceAreaInfoId":response.data[0].midwayServiceAreaInfoId,
          }
          th.detail = detail;

          map.flyTo({
            center: [th.latlng[0], th.latlng[1]]
          })
          var distance = turf.distance([th.currlng,th.currlat], [th.latlng[0],th.latlng[1]], {units: 'kilometers'});
          const popup = new mapboxgl.Popup({ closeOnClick: true,offset: 25 })
              .setLngLat([this.latlng[0], this.latlng[1]])
              .setHTML('<div id="popupDiv">' +

                  '<div style="width: 100%;height: 90%;background-color: #ef8787;border-radius: 5px;position: absolute;top: 0;display: grid">' +
                  '<i id="popupClose" class="mdi mdi-close"></i>'+
                  '<p id="name"></p>'+
                  '<p id="side"></p>'+
                  '<p id="distance"></p>'+
                  '</div>'+
                  '<p id="directions"></p>'+
                  '<p id="moreinfo"></p>'+
                  '</div>')
              .addTo(map);

          $('#popupClose').on('click',function (){
            popup.remove();
          })

          if(th.$i18n.locale==='fa' && th.areaDetail.midwayServiceAreaTypeName==='مجتمع رفاهی') {
            document.getElementById('name').innerText = 'مجتمع رفاهی' + " " + th.areaDetail.name
          }else if(th.$i18n.locale==='fa' && th.areaDetail.midwayServiceAreaTypeName==='تیرپارک') {
            document.getElementById('name').innerText = 'تیرپارک' + " " + th.areaDetail.name
          }else if(th.$i18n.locale==='en' && th.areaDetail.midwayServiceAreaTypeName==='مجتمع رفاهی') {
            document.getElementById('name').innerText = th.areaDetail.name + " " + 'Service Rest Area'
          }else if(th.$i18n.locale==='en' && th.areaDetail.midwayServiceAreaTypeName==='تیرپارک') {
            document.getElementById('name').innerText = th.areaDetail.name + " " +  'Tir Park'
          }
          if(th.$i18n.locale==='fa' && th.areaDetail.side===1) {
            document.getElementById('side').innerText = this.$t('AreaDetail.Side') + ":" + "راست"
          }else if(th.$i18n.locale==='fa' && th.areaDetail.side===2) {
            document.getElementById('side').innerText = this.$t('AreaDetail.Side') + ":" + "چپ"
          }else if(th.$i18n.locale==='en' && th.areaDetail.side===1) {
            document.getElementById('side').innerText = this.$t('AreaDetail.Side') + ":" + "right"
          }else if(th.$i18n.locale==='en' && th.areaDetail.side===2) {
            document.getElementById('side').innerText = this.$t('AreaDetail.Side') + ":" + "left"
          }
          document.getElementById('distance').innerText = this.$t('AreaDetail.DistanceToYou') + " " + parseInt(distance)+ " " + this.$t('AreaDetail.Kilometers')
          document.getElementById('directions').innerText = this.$t('AreaDetail.Directions')
          document.getElementById('moreinfo').innerText = this.$t('AreaDetail.MoreInfo')
          this.setReverse();
          this.moreInfoClick();
          this.routingClick(this.latlng);
          this.getMidwayServiceAreaRatings(response.data[0].midwayServiceAreaInfoId);


        }).catch(error => {
          this.errorMessage = error.message;
          this.overlay = false;
          this.snackColor = "red accent-2";
          this.snackText = this.$t("SnackBar.NetworkError");
          this.snackIcon = "mdi-close-circle";
          this.snackbar = true;
          console.error("There was an error!", error);
        });
      });
      map.on('render', function () {
        if (map.isSourceLoaded("midwayArea")) {
          var layers =map.getStyle().layers;
          if(layers.length >=3 ) {
            if(layers[layers.length-1].id !== "unclustered-point" ||  layers[layers.length-2].id !== "cluster-count"
                || layers[layers.length-3].id !== "clusters") {
              if (map.getLayer("clusters")) {
                map.moveLayer("clusters");
              }
              if (map.getLayer("cluster-count")) {
                map.moveLayer("cluster-count");
              }
              if (map.getLayer("unclustered-point")) {
                map.moveLayer("unclustered-point");
              }
            }
          }
        }
      });
      this.map = map;

    },
    setReverse(){
      if(this.$i18n.locale==='en'){
        $('#name').css('text-align','left');
        $('#side').css('text-align', 'left');
        $('#name').css('marginLeft', '20px');
        $('#side').css('marginLeft', '20px');
        // $('#side').attr('style', 'margin-left: 30px');
        $('.theme--light.v-input').css('direction','rtl');
        $('.theme--light.v-overflow-btn.theme--light.v-overflow-btn > .v-input__control > .v-input__slot').css('direction','ltr');
        $('.v-application--is-ltr .v-input__append-outer').css('marginRight','5px');
        $('.v-application--is-ltr .v-list-item__action:first-child, .v-application--is-ltr .v-list-item__icon:first-child').css('right','auto')
        $('.textField').css('direction','ltr')
        $('.textarea').css('direction','ltr')
        $('.combobox').css('direction','ltr')
        $('#result').css('text-align','left');
      } else if(this.$i18n.locale==='fa'){
        $('#name').css('text-align','right');
        $('#side').css('text-align','right');
        $('#overflow').css('direction','ltr');
        $('.theme--light.v-overflow-btn.theme--light.v-overflow-btn > .v-input__control > .v-input__slot').css('direction','rtl');
        $('#result').css('text-align','right');
      }
    },
    changeLayer(){
      this.drawer = false;
      this.btnSearchResult = false;
      if(this.streetLayer===true){
        this.streetLayer=false;
        this.ServiceAreaDetailsDialog=false;
        this.satellitetLayer=true
        this.map.setStyle(sat);
      }else if(this.satellitetLayer===true){
        this.satellitetLayer=false;
        this.ServiceAreaDetailsDialog=false;
        this.streetLayer=true;
        this.map.setStyle(inStreetStyle);
      }
    },
    getCurrentLocation(fromQibla){
      var th = this;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
              th.currlat = position.coords.latitude;
              th.currlng = position.coords.longitude;
              if(fromQibla && th.btnQibla===false){
                th.showQibla();
                th.btnQiblaColor = "#00FF00";
                th.btnQibla=true;
              }else if(fromQibla && th.btnQibla===true && th.map.getSource('route')){
                  th.map.removeLayer('route');
                  th.map.removeSource('route');
                  th.btnQiblaColor = "white";
                  th.btnQibla=false;
              }
            },
            function (error) {
              th.snackColor = "red accent-2";
              th.snackText = th.$t("SnackBar.TurnOnLocation");
              th.snackIcon = "mdi-close-circle";
              th.snackbar = true;
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
            }
        );
        console.log(th.currlat)
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    },
    moreInfoClick(){
      var th = this;
      $('#moreinfo').on('click',function (){
        if (th.$i18n.locale === 'fa') {
          if (th.detail.midwayServiceAreaTypeName === "مجتمع رفاهی" && th.detail.grade === 1) {
            th.areaname = th.$t('ServiceAreaDetailsDialog.ServiceArea') + " " + th.detail.name + " " + "(" + 'درجه یک' + ")";
          } else if (th.detail.midwayServiceAreaTypeName === "مجتمع رفاهی" && th.detail.grade === 2) {
            th.areaname = th.$t('ServiceAreaDetailsDialog.ServiceArea') + " " + th.detail.name + " " + "(" + 'درجه دو' + ")";
          } else if (th.detail.midwayServiceAreaTypeName === "مجتمع رفاهی" && th.detail.grade === 3) {
            th.areaname = th.$t('ServiceAreaDetailsDialog.ServiceArea') + " " + th.detail.name + " " + "(" + 'درجه سه' + ")";
          } else if (th.detail.midwayServiceAreaTypeName === "مجتمع رفاهی" && th.detail.grade === 4) {
            th.areaname = th.$t('ServiceAreaDetailsDialog.ServiceArea') + " " + th.detail.name + " " + "(" + 'درجه چهار' + ")";
          }
          if (th.detail.midwayServiceAreaTypeName === "تیرپارک" && th.detail.grade === 1) {
            th.areaname = th.$t('ServiceAreaDetailsDialog.TirPark') + " " + th.detail.name + " " + "(" + 'درجه یک' + ")";
          } else if (th.detail.midwayServiceAreaTypeName === "تیرپارک" && th.detail.grade === 2) {
            th.areaname = th.$t('ServiceAreaDetailsDialog.TirPark') + " " + th.detail.name + " " + "(" + 'درجه دو' + ")";
          } else if (th.detail.midwayServiceAreaTypeName === "تیرپارک" && th.detail.grade === 3) {
            th.areaname = th.$t('ServiceAreaDetailsDialog.TirPark') + " " + th.detail.name + " " + "(" + 'درجه سه' + ")";
          } else if (th.detail.midwayServiceAreaTypeName === "تیرپارک" && th.detail.grade === 4) {
            th.areaname = th.$t('ServiceAreaDetailsDialog.TirPark') + " " + th.detail.name + " " + "(" + 'درجه چهار' + ")";
          }
          th.managerName = th.$t('ServiceAreaDetailsDialog.ManagerName') + " " + ":" + " " + th.detail.managerName;
          th.axis = th.$t('ServiceAreaDetailsDialog.Axis') + " " + ":" + " " + th.detail.axis;
          th.km = th.$t('ServiceAreaDetailsDialog.Kilometers') + " " + ":" + " " + th.detail.km;
        } else
        if (th.$i18n.locale === 'en') {
          if (th.detail.midwayServiceAreaTypeName === "مجتمع رفاهی" && th.detail.grade === 1) {
            th.areaname = th.detail.name + " " + th.$t('ServiceAreaDetailsDialog.ServiceArea') + " " + "(" + 'grade 1' + ")";
          } else if (th.detail.midwayServiceAreaTypeName === "مجتمع رفاهی" && th.detail.grade === 2) {
            th.areaname = th.detail.name + " " + th.$t('ServiceAreaDetailsDialog.ServiceArea') + " " + "(" + 'grade 2' + ")";
          } else if (th.detail.midwayServiceAreaTypeName === "مجتمع رفاهی" && th.detail.grade === 3) {
            th.areaname = th.detail.name + " " + th.$t('ServiceAreaDetailsDialog.ServiceArea') + " " + "(" + 'grade 3' + ")";
          } else if (th.detail.midwayServiceAreaTypeName === "مجتمع رفاهی" && th.detail.grade === 4) {
            th.areaname = th.detail.name + " " + th.$t('ServiceAreaDetailsDialog.ServiceArea') + " " + "(" + 'grade 4' + ")";
          }
          if (th.detail.midwayServiceAreaTypeName === "تیرپارک" && th.detail.grade === 1) {
            th.areaname = th.detail.name + " " + th.$t('ServiceAreaDetailsDialog.TirPark') + " " + "(" + 'grade 1' + ")";
          } else if (th.detail.midwayServiceAreaTypeName === "تیرپارک" && th.detail.grade === 2) {
            th.areaname = th.detail.name + " " + th.$t('ServiceAreaDetailsDialog.TirPark') + " " + "(" + 'grade 2' + ")";
          } else if (th.detail.midwayServiceAreaTypeName === "تیرپارک" && th.detail.grade === 3) {
            th.areaname = th.detail.name + " " + th.$t('ServiceAreaDetailsDialog.TirPark') + " " + "(" + 'grade 3' + ")";
          } else if (th.detail.midwayServiceAreaTypeName === "تیرپارک" && th.detail.grade === 4) {
            th.areaname = th.detail.name + " " + th.$t('ServiceAreaDetailsDialog.TirPark') + " " + "(" + 'grade 4' + ")";
          }
          th.managerName = th.$t('ServiceAreaDetailsDialog.ManagerName') + " " + ":" + " " + th.detail.managerName;
          th.axis = th.$t('ServiceAreaDetailsDialog.Axis') + " " + ":" + " " + th.detail.axis;
          th.km = th.$t('ServiceAreaDetailsDialog.Kilometers') + " " + ":" + " " + th.detail.km;

          $('#areaname').css('text-align', 'left');
          $('#managerName').css('text-align', 'left');
          $('#axis').css('text-align', 'left');
          $('#km').css('text-align', 'left');
          $('#ratingText').css('text-align', 'left');
          $('#contactManager').css('text-align', 'left');
          $('#contactManager').css('direction', 'ltr');
          $('#rating').css('float', 'left');
          $('#rating').css('marginLeft', '10px');
        }
        for(var i = 0;i<th.areaResponse.data[0].documents.length;i++){
          var image = new Image();
          image.src = 'data:image/png;base64,' + th.areaResponse.data[0].documents[i].base64File;
          th.slideArray.push(image.src);
        }
        th.saveColor = '';
        th.$root.$emit('closeDialog', true);
        th.favoriteAreas.forEach(e =>{
          if(parseInt(e)===th.detail.midwayServiceAreaInfoId){
            th.saveColor = 'green'
          }
        })
        th.services.forEach(e=>{
          if(th.$i18n.locale==='en') {
            $('.serviceTitle').css('float','left');
            $('.v-rating').css('float','right');
            if (e.serviceTitle === "نمازخانه") {
              e.serviceTitle = "Prayer Room"
            }
            if (e.serviceTitle === "واحدهای تجاری") {
              e.serviceTitle = "Shopping Center"
            }
            if (e.serviceTitle === "رستوران") {
              e.serviceTitle = "Restaurant"
            }
            if (e.serviceTitle === "جایگاه سوخت") {
              e.serviceTitle = "Petrol Station"
            }
            if (e.serviceTitle === "خدمات ارتباطی") {
              e.serviceTitle = "Connection services"
            }
            if (e.serviceTitle === "خدمات اقامتی") {
              e.serviceTitle = "Residental Units"
            }
            if (e.serviceTitle === "خدمات بانکی") {
              e.serviceTitle = "Bank"
            }
            if (e.serviceTitle === "سرویس های بهداشتی") {
              e.serviceTitle = "W.C."
            }
            if (e.serviceTitle === "پارکینگ") {
              e.serviceTitle = "Parkings"
            }
            if (e.serviceTitle === "خدمات ورزشی") {
              e.serviceTitle = "Sport Services"
            }
            if (e.serviceTitle === "خدمات درمانی") {
              e.serviceTitle = "Therapeutic Unit"
            }
            if (e.serviceTitle === "امکانات رفاهی") {
              e.serviceTitle = "Rest Facilities"
            }
            if (e.serviceTitle === "مجتمع رفاهی") {
              e.serviceTitle = "Service Area"
            }
            if (e.serviceTitle === "تیرپارک") {
              e.serviceTitle = "TirPark"
            }
            if (e.serviceTitle === "خدمات ایمنی") {
              e.serviceTitle = "Safety Services"
            }
            if (e.serviceTitle === "خدمات خودرویی") {
              e.serviceTitle = "Car Service"
            }
          }
        })
        th.RoutingDialog=false;
        th.AreaSubServices = false;
        th.drawer=false;
        th.getPersonWithPicture();
        th.ServiceAreaDetailsDialog=!th.ServiceAreaDetailsDialog;
        th.ServiceAreaDetailsDialog=true;
      })
    },
    routingClick(coordinates){
      var th = this;
      $('#directions').on('click',function (){
        th.$root.$emit("goToRoutingDialog",coordinates);
        th.RoutingDialog=!th.RoutingDialog;
        th.RoutingDialog=true;
      })
    },
    addServiceTypesToDiv() {
      var th = this;
      $("#services").empty();
      for (var i = 0; i < this.services.length; i++) {
        var div = document.createElement("div");
        let label = document.createElement("label");
        let img = document.createElement("img");
        div.style.width = "70px"
        div.style.height = "80px"
        div.style.display = "inline-block"
        div.style.marginTop = "10px"
        div.style.marginRight = "20px"
        div.style.position = "relative"
        div.id = this.services[i].midwayServiceAreaServicesId;
        div.className = "servicetype";
        div.style.borderRadius = "3px";
        label.textContent = this.services[i].serviceTitle;
        label.style.fontFamily = "IranSans";
        label.style.fontSize = "10px";
        label.style.display = "flex";
        label.style.justifyContent = "center";
        label.style.marginTop = "60px";
        label.style.bottom = "0";
        label.style.color = "black";
        label.style.textAlign = "center"
        label.id = this.services[i].midwayServiceAreaServicesId;
        img.src = "data:application;base64," + this.services[i].documents[0].base64File;
        img.style.width = "100px"
        img.style.width = "50px"
        img.style.display = "flex"
        img.style.marginLeft = "10px"
        img.style.position = "absolute"
        img.style.top = "0"
        img.id = this.services[i].midwayServiceAreaServicesId;
        div.appendChild(label);
        div.appendChild(img);
        document.getElementById("services").appendChild(div);
      }
      $(".servicetype").on("click",function (e){
        console.log(e.target.id)
              th.getSubServices(e.target.id);
              th.AreaSubServices = !th.AreaSubServices;
              th.AreaSubServices = true;
            })
    },
    setURLResponse(){
      this.areaCoordinates = [];
      this.areaNames = [];

      axios.post(this.response.data, null,
      ).then(response => {
        for(var i = 0;i<response.data.features.length;i++){
          this.areaNames.push({
            "name":response.data.features[i].properties.areaname,
            "id":response.data.features[i].properties.midwayserviceareainfoid,
            "typeid":response.data.features[i].properties.midwayserviceareatypeid,
            "side":response.data.features[i].properties.side,
            "coordinates":response.data.features[i].geometry.coordinates,
          })
          this.areaCoordinates.push(response.data.features[i].geometry.coordinates);
        }
        this.urlResponse = response.data.features;
        console.log(response)
      }).catch(error => {
        this.errorMessage = error.message;
        console.error("There was an error!", error);
      });
    },
    changeProgress(value){
      var th = this;
      this.urlResponse.forEach(e => {
        if(value===e.properties.midwayserviceareainfoid){
          th.map.flyTo({
            center: e.geometry.coordinates,
            zoom:12
          });
        }
      })
    },
    getPersonWithPicture(){
      if(this.getCookie("phone")!='undefined' && this.getCookie("phone") != undefined) {
        const formData = new FormData();
        formData.append('mobileNumber', this.getCookie("phone"));
        formData.append('cmd', "{'/MidwayServiceArea-portlet.person/get-person-with-picture':{}}");
        axios.post('https://restareas.rmto.ir/api/jsonws/invoke', formData,
        ).then(response => {
          this.favoriteAreas = response.data[0].interestedAreas.split(",");
          document.cookie = "userId=" + response.data[0].userId
          console.log(response)
          console.log(this.favoriteAreas)
        }).catch(error => {
          this.errorMessage = error.message;
          console.error("There was an error!", error);
        });
      }
    },
    getCookie(name) {
      let cookie = {};
      document.cookie.split(';').forEach(function(el) {
        let [k] = el.split('=');
        cookie[k.trim()] = el.substring(k.length + 1);
      })
      return cookie[name];
    },
    getMidwayServiceAreaRatings(id){
      this.ratingArray = [];
      const formData = new FormData();
      formData.append('userId', this.getCookie("phone"));
      formData.append('midwarServiceAreaInfoId', id);
      formData.append('locale', "fa_IR");
      formData.append('cmd', "{'/MidwayServiceArea-portlet.midwayarearating/get-midway-service-area-rating':{}}");
      axios.post('https://restareas.rmto.ir/api/jsonws/invoke', formData,
      ).then(response => {
        response.data.forEach(e=>{
          if(e.midwayServiceAreaInfoId===id){
            e["islike"] = false;
            e["isdislike"] = false;
            this.ratingArray.push(e)
          }
        })
        console.log(response)
        console.log(this.ratingArray)
      }).catch(error => {
        this.errorMessage = error.message;
        this.snackColor = "red accent-2";
        this.snackText = this.$t("SnackBar.NetworkError");
        this.snackIcon = "mdi-close-circle";
        this.snackbar = true;
        console.error("There was an error!", error);
      });
    },
    getSubServices(id){
      this.subServiceArray = [];
      const formData = new FormData();
      formData.append('companyId', "20155");
      formData.append('areaId', this.detail.midwayServiceAreaInfoId);
      formData.append('locale', "fa_IR");
      formData.append('cmd', "{'/MidwayServiceArea-portlet.midwayareatype/get-sub-services':{}}");
      axios.post('https://restareas.rmto.ir/api/jsonws/invoke', formData,
      ).then(response => {
        console.log(id)
        console.log(response.data)
        for(var i = 0;i<response.data.length;i++){
          if (response.data[i].selected && response.data[i].selected === true) {
            response.data[i]["color"] = "green"
          } else {
            response.data[i]["color"] = "red"
          }
          if('selected' in response.data[i] && response.data[i].parentMidwayServiceAreaServicesId===parseInt(id)){
            this.subServiceArray.push(response.data[i])
           }
        }
        console.log(this.subServiceArray)
      }).catch(error => {
        this.errorMessage = error.message;
        this.snackColor = "red accent-2";
        this.snackText = this.$t("SnackBar.NetworkError");
        this.snackIcon = "mdi-close-circle";
        this.snackbar = true;
        console.error("There was an error!", error);
      });
    },
    getMidWayServiceAreaTypes() {
      var th = this;
      const formData = new FormData();
      formData.append('locale', "fa_IR");
      formData.append('dateInMiliseconds', "true");
      formData.append('cmd', "{'/MidwayServiceArea-portlet.midwayareatype/get-mid-way-service-area-types-with-documents':{}}");
      axios.post('https://restareas.rmto.ir/api/jsonws/invoke', formData,
      ).then(response => {

        for (let i = 0; i < response.data.length; i++) {
          if (response.data[i].parentMidwayServiceAreaServicesId === response.data[i].midwayServiceAreaTypeId) {
            this.serviceTypes.push(response.data[i])
          }
        }
        // this.addServiceTypesToDiv();
        console.log(th.selectedTypes)
        // $(".type").on('click', function (e) {
        //   if(e.currentTarget.style.backgroundColor==="rgb(255, 255, 255)" || e.currentTarget.style.backgroundColor==="white"){
        //     e.currentTarget.style.backgroundColor="rgb(127, 190, 181)";
        //     th.selectedTypes.push(e.currentTarget.id)
        //   }else{
        //     e.currentTarget.style.backgroundColor="rgb(255, 255, 255)"
        //     for(var j=0;j<th.selectedTypes.length;j++){
        //       if(th.selectedTypes[j] === e.currentTarget.id){
        //         th.selectedTypes.splice(j,1);
        //       }
        //     }
        //   }
        // });
      })
          .catch(error => {
            this.errorMessage = error.message;
            this.snackColor = "red accent-2";
            this.snackText = this.$t("SnackBar.NetworkError");
            this.snackIcon = "mdi-close-circle";
            this.snackbar = true;
            console.error("There was an error!", error);
          });
    },
    makeRadius(lngLatArray, radiusInMeters) {
        var point = turf.point(lngLatArray);
        var buffered = turf.buffer(point, radiusInMeters, { units: 'kilometers' });
        console.log(buffered)
        return buffered;
      },
    searchResult(){
      var th = this;
      this.$root.$on('goToApp', (coordinates) => {
        th.$root.$emit("goToRoutingDialog",coordinates);
        th.RoutingDialog=!th.RoutingDialog;
        th.RoutingDialog=true;
      })

      this.$root.$on('NearMe', (radius) => {
          if (th.map.getSource('route')) {
            th.map.removeLayer('route');
            th.map.removeSource('route');
          }
        if (th.map.getSource('search-radius')) {
          th.map.removeSource('search-radius');
        }
          th.searchResultArray=[];
          th.btnSearchResult = true;
          var searchRadius = th.makeRadius([th.currlng, th.currlat], radius);
          th.map.getSource('search-radius').setData(searchRadius);
          console.log(th.areaCoordinates)
          var featuresInBuffer = th.checkAreaInSearch(th.areaCoordinates, searchRadius);

          console.log(featuresInBuffer)
          console.log(th.searchResultArray)

          for (var i in th.areaNames) {
            var distanceToStart = turf.distance([th.currlng,th.currlat], [th.areaNames[i].coordinates[0],th.areaNames[i].coordinates[1]], {units: 'kilometers'});
            th.areaNames[i]["distanceToStart"] = distanceToStart;
            for (var j in featuresInBuffer) {
              if (th.areaNames[i].coordinates === featuresInBuffer[j]) {
                th.searchResultArray.push(th.areaNames[i])
              }
            }
          }
          th.searchResultArray.sort(function(a, b) {
            return parseFloat(a.distanceToStart) - parseFloat(b.distanceToStart);
          });
        for(var i in th.searchResultArray){

          if(th.$i18n.locale==='fa' && th.searchResultArray[i].typeid===28){
            th.searchResultArray[i].name = 'مجتمع رفاهی' + ' ' + th.searchResultArray[i].name;
          }else if(th.$i18n.locale==='fa' && th.searchResultArray[i].typeid===26){
            th.searchResultArray[i].name = 'تیرپارک' + ' ' + th.searchResultArray[i].name;
          }else if(th.$i18n.locale==='en' && th.searchResultArray[i].typeid===28){
            th.searchResultArray[i].name = th.searchResultArray[i].name + " " + 'Service Rest Area'
          }else if(th.$i18n.locale==='en' && th.searchResultArray[i].typeid===26){
            th.searchResultArray[i].name = th.searchResultArray[i].name + " " + 'Tir Park'
          }

          if(th.$i18n.locale==='fa' && th.searchResultArray[i].side===1) {
            th.searchResultArray[i].side = th.$t('AreaDetail.Side') + ":" + "راست"
          }else if(th.$i18n.locale==='fa' && th.searchResultArray[i].side===2) {
            th.searchResultArray[i].side = th.$t('AreaDetail.Side') + ":" + "چپ"
          }else if(th.$i18n.locale==='en' && th.searchResultArray[i].side===1) {
            th.searchResultArray[i].side = th.$t('AreaDetail.Side') + ":" + "right"
          }else if(th.$i18n.locale==='en' && th.searchResultArray[i].side===2) {
            th.searchResultArray[i].side = th.$t('AreaDetail.Side') + ":" + "left"
          }
          th.searchResultArray[i].typeid=0;
          th.searchResultArray[i]["distance"] = turf.distance([th.currlng,th.currlat], [th.searchResultArray[i].coordinates[0],th.searchResultArray[i].coordinates[1]], {units: 'kilometers'});
        }
          console.log(th.searchResultArray)
          th.map.flyTo({center: [th.currlng, th.currlat], zoom: 6});
          th.SearchResultSheet = !th.SearchResultSheet;
          th.SearchResultSheet = true;
      })

      // this.$root.$off("Near");
      // this.$root.$off('otherlatlng');
      this.$root.$on('Near', (otherlatlng,radius) => {
          if (th.map.getSource('route')) {
            th.map.removeLayer('route');
            th.map.removeSource('route');
          }
          if (th.map.getSource('search-radius')) {
            th.map.removeSource('search-radius');
          }
          th.searchResultArray=[];
          th.btnSearchResult = true;
          var searchRadius = th.makeRadius([parseInt(otherlatlng[0]), parseInt(otherlatlng[1])],radius);
          th.map.getSource('search-radius').setData(searchRadius);
          var featuresInBuffer = th.checkAreaInSearch(th.areaCoordinates, searchRadius);

          for (var i in th.areaNames) {
            for (var j in featuresInBuffer) {
              if (th.areaNames[i].coordinates === featuresInBuffer[j]) {
                th.searchResultArray.push(th.areaNames[i])
              }
            }
          }
        for(var i in th.searchResultArray){

          if(th.$i18n.locale==='fa' && th.searchResultArray[i].typeid===28){
            th.searchResultArray[i].name = 'مجتمع رفاهی' + ' ' + th.searchResultArray[i].name;
          }else if(th.$i18n.locale==='fa' && th.searchResultArray[i].typeid===26){
            th.searchResultArray[i].name = 'تیرپارک' + ' ' + th.searchResultArray[i].name;
          }else if(th.$i18n.locale==='en' && th.searchResultArray[i].typeid===28){
            th.searchResultArray[i].name = th.searchResultArray[i].name + " " + 'Service Rest Area'
          }else if(th.$i18n.locale==='en' && th.searchResultArray[i].typeid===26){
            th.searchResultArray[i].name = th.searchResultArray[i].name + " " + 'Tir Park'
          }

          if(th.$i18n.locale==='fa' && th.searchResultArray[i].side===1) {
            th.searchResultArray[i].side = th.$t('AreaDetail.Side') + ":" + "راست"
          }else if(th.$i18n.locale==='fa' && th.searchResultArray[i].side===2) {
            th.searchResultArray[i].side = th.$t('AreaDetail.Side') + ":" + "چپ"
          }else if(th.$i18n.locale==='en' && th.searchResultArray[i].side===1) {
            th.searchResultArray[i].side = th.$t('AreaDetail.Side') + ":" + "right"
          }else if(th.$i18n.locale==='en' && th.searchResultArray[i].side===2) {
            th.searchResultArray[i].side = th.$t('AreaDetail.Side') + ":" + "left"
          }
          th.searchResultArray[i].typeid=0;
          th.searchResultArray[i]["distance"] = turf.distance([th.currlng,th.currlat], [th.searchResultArray[i].coordinates[0],th.searchResultArray[i].coordinates[1]], {units: 'kilometers'});
        }
          console.log(th.searchResultArray)
          th.map.flyTo({center: [otherlatlng[0], otherlatlng[1]], zoom: 6});
          th.SearchResultSheet = !th.SearchResultSheet;
          th.SearchResultSheet = true;
      })

      this.$root.$off("Between");
      this.$root.$off("firstlatlng");
      this.$root.$off("secondlatlng");

      this.$root.$on('Between', (searchPlace) => {
          this.$root.$on('firstlatlng', (firstlatlng) => {
            this.$root.$on('secondlatlng', (secondlatlng) => {
              if (th.map.getSource('search-radius')) {
                th.map.removeLayer('search-radius');
                th.map.removeSource('search-radius');
              }
              th.searchResultArray = [];
              th.btnSearchResult = true;
              async function getRoute(start, end) {
                const query = await fetch(`https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${parseInt(start[0])},${parseInt(start[1])};${parseInt(end[0])},${parseInt(end[1])}?alternatives=false&continue_straight=false&geometries=geojson&language=en&overview=full&steps=true&access_token=${mapboxgl.accessToken}`, {method: 'GET'});
                const json = await query.json();
                const data = json.routes[0];
                const route = data.geometry.coordinates;
                const geojson = {
                  type: 'Feature',
                  properties: {},
                  geometry: {
                    type: 'LineString',
                    coordinates: route
                  }
                };

                for(var i in th.areaNames){
                  var distance = turf.pointToLineDistance(th.areaNames[i].coordinates, geojson, {units: 'kilometers'});
                  if (distance<1) {
                        var distanceToStart = turf.distance([parseInt(start[0]),parseInt(start[1])], [th.areaNames[i].coordinates[0],th.areaNames[i].coordinates[1]], {units: 'kilometers'});
                        th.areaNames[i]["distanceToStart"] = distanceToStart;
                        th.searchResultArray.push(th.areaNames[i])
                      }
                }
                const removeDupliactes = (values) => {
                  let concatArray = values.map(eachValue => {
                    return Object.values(eachValue).join('')
                  })
                  let filterValues = values.filter((value, index) => {
                    return concatArray.indexOf(concatArray[index]) === index

                  })
                  return filterValues
                }
                removeDupliactes(th.searchResultArray);


                th.searchResultArray.sort(function(a, b) {
                  return parseFloat(a.distanceToStart) - parseFloat(b.distanceToStart);
                });
                for(var i in th.searchResultArray){

                  if(th.$i18n.locale==='fa' && th.searchResultArray[i].typeid===28){
                    th.searchResultArray[i].name = 'مجتمع رفاهی' + ' ' + th.searchResultArray[i].name;
                  }else if(th.$i18n.locale==='fa' && th.searchResultArray[i].typeid===26){
                    th.searchResultArray[i].name = 'تیرپارک' + ' ' + th.searchResultArray[i].name;
                  }else if(th.$i18n.locale==='en' && th.searchResultArray[i].typeid===28){
                    th.searchResultArray[i].name = th.searchResultArray[i].name + " " + 'Service Rest Area'
                  }else if(th.$i18n.locale==='en' && th.searchResultArray[i].typeid===26){
                    th.searchResultArray[i].name = th.searchResultArray[i].name + " " + 'Tir Park'
                  }

                  if(th.$i18n.locale==='fa' && th.searchResultArray[i].side===1) {
                    th.searchResultArray[i].side = th.$t('AreaDetail.Side') + ":" + "راست"
                  }else if(th.$i18n.locale==='fa' && th.searchResultArray[i].side===2) {
                    th.searchResultArray[i].side = th.$t('AreaDetail.Side') + ":" + "چپ"
                  }else if(th.$i18n.locale==='en' && th.searchResultArray[i].side===1) {
                    th.searchResultArray[i].side = th.$t('AreaDetail.Side') + ":" + "right"
                  }else if(th.$i18n.locale==='en' && th.searchResultArray[i].side===2) {
                    th.searchResultArray[i].side = th.$t('AreaDetail.Side') + ":" + "left"
                  }
                  th.searchResultArray[i].typeid=0;
                  th.searchResultArray[i]["distance"] = turf.distance([th.currlng,th.currlat], [th.searchResultArray[i].coordinates[0],th.searchResultArray[i].coordinates[1]], {units: 'kilometers'});
                }
                console.log(th.searchResultArray)
                // if the route already exists on the map, we'll reset it using setData
                if (th.map.getSource('route')) {
                  th.map.getSource('route').setData(geojson);
                } else {
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
                      'line-color': 'green',
                      'line-width': 5,
                      'line-opacity': 0.75
                    }
                  });
                }
              }
              getRoute(firstlatlng, secondlatlng)
              th.map.flyTo({center: [parseInt(firstlatlng[0]), parseInt(firstlatlng[1])], zoom: 6});
              th.SearchResultSheet = !th.SearchResultSheet;
              th.SearchResultSheet = true;
            })
          })
      })
      this.$root.$emit("goToSearchResultSheet",true);

    },
    showQibla(){
      this.map.addSource('route', {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          'properties': {},
          'geometry': {
            'type': 'LineString',
            'coordinates': [
              [this.currlng, this.currlat],
              [39.8262, 21.4225],
            ]
          }
        }
      });
      this.map.addLayer({
        'id': 'route',
        'type': 'line',
        'source': 'route',
        'layout': {
          'line-join': 'round',
          'line-cap': 'round'
        },
        'paint': {
          'line-color': 'green',
          'line-width': 8
        }
      });
      this.map.flyTo({
        center: [this.currlng, this.currlat],
        zoom:10
      });
    },
    openServiceDetail(){
      var th = this;
      this.$root.$on('goToServiceDetail', (favoriteAreas) => {
          th.$root.$on('favoriteResponse', (response) => {
          th.slideArray = [];
          th.services = [];
          th.services = response.data[0].services
          var detail = {
            "name":response.data[0].name,
            "grade":response.data[0].grade,
            "averageRating":response.data[0].averageRating,
            "emailAddress":response.data[0].emailAddress,
            "managerName":response.data[0].managerName,
            "investorMobileNumber":response.data[0].investorMobileNumber,
            "axis":response.data[0].axis,
            "km":response.data[0].km,
            "midwayServiceAreaTypeName":response.data[0].midwayServiceAreaTypeName,
            "midwayServiceAreaInfoId":response.data[0].midwayServiceAreaInfoId,
          }
          th.detail = detail;

            if (th.$i18n.locale === 'fa') {
              if (detail.midwayServiceAreaTypeName === "مجتمع رفاهی" && detail.grade === 1) {
                th.areaname = th.$t('ServiceAreaDetailsDialog.ServiceArea') + " " + detail.name + " " + "(" + 'درجه یک' + ")";
              } else if (detail.midwayServiceAreaTypeName === "مجتمع رفاهی" && detail.grade === 2) {
                th.areaname = th.$t('ServiceAreaDetailsDialog.ServiceArea') + " " + detail.name + " " + "(" + 'درجه دو' + ")";
              } else if (detail.midwayServiceAreaTypeName === "مجتمع رفاهی" && detail.grade === 3) {
                th.areaname = th.$t('ServiceAreaDetailsDialog.ServiceArea') + " " + detail.name + " " + "(" + 'درجه سه' + ")";
              } else if (detail.midwayServiceAreaTypeName === "مجتمع رفاهی" && detail.grade === 4) {
                th.areaname = th.$t('ServiceAreaDetailsDialog.ServiceArea') + " " + detail.name + " " + "(" + 'درجه چهار' + ")";
              }
              if (detail.midwayServiceAreaTypeName === "تیرپارک" && detail.grade === 1) {
                th.areaname = th.$t('ServiceAreaDetailsDialog.TirPark') + " " + detail.name + " " + "(" + 'درجه یک' + ")";
              } else if (detail.midwayServiceAreaTypeName === "تیرپارک" && detail.grade === 2) {
                th.areaname = th.$t('ServiceAreaDetailsDialog.TirPark') + " " + detail.name + " " + "(" + 'درجه دو' + ")";
              } else if (detail.midwayServiceAreaTypeName === "تیرپارک" && detail.grade === 3) {
                th.areaname = th.$t('ServiceAreaDetailsDialog.TirPark') + " " + detail.name + " " + "(" + 'درجه سه' + ")";
              } else if (detail.midwayServiceAreaTypeName === "تیرپارک" && detail.grade === 4) {
                th.areaname = th.$t('ServiceAreaDetailsDialog.TirPark') + " " + detail.name + " " + "(" + 'درجه چهار' + ")";
              }
              th.managerName = th.$t('ServiceAreaDetailsDialog.ManagerName') + " " + ":" + " " + detail.managerName;
              th.axis = th.$t('ServiceAreaDetailsDialog.Axis') + " " + ":" + " " + detail.axis;
              th.km = th.$t('ServiceAreaDetailsDialog.Kilometers') + " " + ":" + " " + detail.km;
            } else
            if (th.$i18n.locale === 'en') {
              if (detail.midwayServiceAreaTypeName === "مجتمع رفاهی" && detail.grade === 1) {
                th.areaname = detail.name + " " + th.$t('ServiceAreaDetailsDialog.ServiceArea') + " " + "(" + 'grade 1' + ")";
              } else if (detail.midwayServiceAreaTypeName === "مجتمع رفاهی" && detail.grade === 2) {
                th.areaname = detail.name + " " + th.$t('ServiceAreaDetailsDialog.ServiceArea') + " " + "(" + 'grade 2' + ")";
              } else if (detail.midwayServiceAreaTypeName === "مجتمع رفاهی" && detail.grade === 3) {
                th.areaname = detail.name + " " + th.$t('ServiceAreaDetailsDialog.ServiceArea') + " " + "(" + 'grade 3' + ")";
              } else if (detail.midwayServiceAreaTypeName === "مجتمع رفاهی" && detail.grade === 4) {
                th.areaname = detail.name + " " + th.$t('ServiceAreaDetailsDialog.ServiceArea') + " " + "(" + 'grade 4' + ")";
              }
              if (detail.midwayServiceAreaTypeName === "تیرپارک" && detail.grade === 1) {
                th.areaname = detail.name + " " + th.$t('ServiceAreaDetailsDialog.TirPark') + " " + "(" + 'grade 1' + ")";
              } else if (detail.midwayServiceAreaTypeName === "تیرپارک" && detail.grade === 2) {
                th.areaname = detail.name + " " + th.$t('ServiceAreaDetailsDialog.TirPark') + " " + "(" + 'grade 2' + ")";
              } else if (detail.midwayServiceAreaTypeName === "تیرپارک" && detail.grade === 3) {
                th.areaname = detail.name + " " + th.$t('ServiceAreaDetailsDialog.TirPark') + " " + "(" + 'grade 3' + ")";
              } else if (detail.midwayServiceAreaTypeName === "تیرپارک" && detail.grade === 4) {
                th.areaname = detail.name + " " + th.$t('ServiceAreaDetailsDialog.TirPark') + " " + "(" + 'grade 4' + ")";
              }
              th.managerName = th.$t('ServiceAreaDetailsDialog.ManagerName') + " " + ":" + " " + detail.managerName;
              th.axis = th.$t('ServiceAreaDetailsDialog.Axis') + " " + ":" + " " + detail.axis;
              th.km = th.$t('ServiceAreaDetailsDialog.Kilometers') + " " + ":" + " " + detail.km;

              $('#areaname').css('text-align', 'left');
              $('#managerName').css('text-align', 'left');
              $('#axis').css('text-align', 'left');
              $('#km').css('text-align', 'left');
              $('#ratingText').css('text-align', 'left');
              $('#contactManager').css('text-align', 'left');
              $('#contactManager').css('direction', 'ltr');
              $('#rating').css('float', 'left');
              $('#rating').css('marginLeft', '10px');
            }
            for(var i = 0;i<response.data[0].documents.length;i++){
              var image = new Image();
              image.src = 'data:image/png;base64,' + response.data[0].documents[i].base64File;
              th.slideArray.push(image.src);
            }
            th.saveColor = '';
            th.$root.$emit('closeDialog', true);
            th.services.forEach(e=>{
              if(th.$i18n.locale==='en') {
                $('.serviceTitle').css('float','left');
                $('.v-rating').css('float','right');
                if (e.serviceTitle === "نمازخانه") {
                  e.serviceTitle = "Prayer Room"
                }
                if (e.serviceTitle === "واحدهای تجاری") {
                  e.serviceTitle = "Shopping Center"
                }
                if (e.serviceTitle === "رستوران") {
                  e.serviceTitle = "Restaurant"
                }
                if (e.serviceTitle === "جایگاه سوخت") {
                  e.serviceTitle = "Petrol Station"
                }
                if (e.serviceTitle === "خدمات ارتباطی") {
                  e.serviceTitle = "Connection services"
                }
                if (e.serviceTitle === "خدمات اقامتی") {
                  e.serviceTitle = "Residental Units"
                }
                if (e.serviceTitle === "خدمات بانکی") {
                  e.serviceTitle = "Bank"
                }
                if (e.serviceTitle === "سرویس های بهداشتی") {
                  e.serviceTitle = "W.C."
                }
                if (e.serviceTitle === "پارکینگ") {
                  e.serviceTitle = "Parkings"
                }
                if (e.serviceTitle === "خدمات ورزشی") {
                  e.serviceTitle = "Sport Services"
                }
                if (e.serviceTitle === "خدمات درمانی") {
                  e.serviceTitle = "Therapeutic Unit"
                }
                if (e.serviceTitle === "امکانات رفاهی") {
                  e.serviceTitle = "Rest Facilities"
                }
                if (e.serviceTitle === "مجتمع رفاهی") {
                  e.serviceTitle = "Service Area"
                }
                if (e.serviceTitle === "تیرپارک") {
                  e.serviceTitle = "TirPark"
                }
                if (e.serviceTitle === "خدمات ایمنی") {
                  e.serviceTitle = "Safety Services"
                }
                if (e.serviceTitle === "خدمات خودرویی") {
                  e.serviceTitle = "Car Service"
                }
              }
            })
            th.RoutingDialog=false;
            th.AreaSubServices = false;
            th.drawer=false;
            // th.getPersonWithPicture();
            favoriteAreas.forEach(e =>{
              if(parseInt(e)===detail.midwayServiceAreaInfoId){
                th.saveColor = 'green'
              }
            })
            th.ServiceAreaDetailsDialog=!th.ServiceAreaDetailsDialog;
            th.ServiceAreaDetailsDialog=true;
          })
      })
    },
    setManagerLoginText(){
      console.log(this.drawer)
      this.$root.$emit("setManagerLoginText",true)
    },
    checkAreaInSearch(sourceGeoJSON, filterFeature) {
    var joined = sourceGeoJSON.filter(function (feature) {
    return turf.booleanPointInPolygon(feature, filterFeature)
      turf.boo
  });

      return joined;
},
    searchSheetResult(){
      this.$root.$emit("goToSearchResultSheet",true);
      this.SearchResultSheet = !this.SearchResultSheet;
      this.SearchResultSheet = true;
      this.ServiceAreaDetailsDialog = false;
    },
    setRefresh(){
     location.href="/#/";
    },

},

}
</script>
