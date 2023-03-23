<template>
  <v-row justify="center">
    <v-dialog v-model="SubmitComplaintDialog" max-width="600px" @click:outside="setFalse">
      <v-card style="background-color: white;height: 700px;font-family: IranSans;">
        <v-icon style="margin: 10px;" color="red" @click="setFalse()">mdi-close</v-icon>
        <div style="width: 100%;height: 90%;overflow: scroll">

          <v-combobox append-icon="" solo class="textField" v-model="selectedArea" :items="areaNames" item-value="id" item-text="name"  @click="setURLResponse()" @change="onChange" :reverse="isReverse" style="width: 80%;position: relative;display: flex;justify-content: center;margin: auto;" id="overflow"
                        v-bind:label="$t('SubmitComplaintDialog.AreaName')" editable outlined background-color="white"></v-combobox>

        <v-btn style="float: right;margin-right:40px;font-size:12px;background-color: #06978A;color: white" @click="LoadMarkers();otherFromMapDialog=true;">{{$t('SubmitComplaintDialog.SelectFromMap')}}</v-btn>
        <v-text-field v-model="mobile" class="textField" append-icon="mdi-cellphone" v-bind:label="$t('SubmitComplaintDialog.ManagerMobile')" style="width: 80%;position: relative;display: flex;justify-content: center;margin: auto;top:30px;direction: rtl" outlined :reverse="isReverse"  ></v-text-field>
        <v-text-field v-model="email" class="textField" append-icon="mdi-email" v-bind:label="$t('SubmitComplaintDialog.Email')" style="width: 80%;position: relative;display: flex;justify-content: center;margin: auto;top:30px;direction: rtl" outlined :reverse="isReverse"></v-text-field>
        <v-combobox  solo class="combobox" v-model="combo" :items="items" label="" :reverse="isReverse" multiple outlined
            style="width: 80%;position: relative;display: flex;justify-content: center;margin: auto;top:30px;direction: rtl;font-family: IranSans"
        ></v-combobox>
        <v-textarea class="textarea" v-model="desc" outlined :reverse="isReverse" name="input-7-4" v-bind:label="$t('SubmitComplaintDialog.Description')" style="width: 80%;position: relative;display: flex;justify-content: center;margin: auto;top:30px;direction: rtl"></v-textarea>
        <v-file-input v-model="files" @change="show()" placeholder="Upload your documents" v-bind:label="$t('SubmitComplaintDialog.AddImage')" multiple :reverse="isReverse" prepend-icon="mdi-paperclip"
            style="width: 85%;position: relative;display: flex;justify-content: center;margin: auto auto auto 30px;top:10px;direction: rtl;font-family: IranSans">
          <template v-slot:selection="{ text }">
            <v-chip
                small
                label
                color="primary"
            >
              {{ text }}
            </v-chip>
          </template>
        </v-file-input>
        <v-btn style="width: 80%;position: relative;display: flex;margin: auto;bottom:-20px;direction: rtl;background-color: #06978A;color: white" @click="addMidwayServiceAreaComplaint()">{{$t('SubmitComplaintDialog.Submit')}}</v-btn>
        <v-row justify="center">
          <v-dialog v-model="otherFromMapDialog"  max-width="500px" eager>
            <v-card style="background-color: white;height: 500px">
              <div id="otherMapDiv" style="width: 100%;height: 100%;">

              </div>
            </v-card>
          </v-dialog>
        </v-row>
        </div>
      </v-card>
    </v-dialog>
    <v-snackbar  v-model="snackbar" :timeout="10000" :color="snackColor"  rounded="pill" style="text-align: center;margin: auto;min-width: 0 !important;width: 50px;font-family: IranSans">
      <v-icon style="float:right;">{{ snackIcon }}</v-icon>
      {{ snackText }}
      <template v-slot:action="{ attrs }">
        <v-btn color="red accent-2" text v-bind="attrs" @click="snackbar = false">{{ $t('SubmitComplaintDialog.Close') }}</v-btn>
      </template>
    </v-snackbar>

  </v-row>
</template>

<script>
import inStreetStyle from '../fa_map/mapbox-street.json'
import axios from "axios";
import $ from "jquery";
import mapboxgl from "mapbox-gl";
import image1 from "../assets/round_local_parking_black_24.png";
import image2 from "../assets/round_location_on_black_36.png";
import MapboxLanguage from '@mapbox/mapbox-gl-language';

export default {
  name: "SubmitComplaintDialog",
  props:{
    SubmitComplaintDialog:false,
  },
  data: () => ({
    items: ['نمازخانه', 'رستوران', 'سرویس بهداشتی', 'امکانات رفاهی', 'سایر موارد'],
    isReverse:true,
    otherFromMapDialog:false,
    areaNames:[],
    map:"",
    midwayserviceareainfoid:0,
    midwayserviceareatypeid:0,
    mobile:"",
    email:"",
    desc:"",
    combo:"",
    newCombo:"",
    files:"",
    snackbar:false,
    snackText:"",
    snackIcon:"",
    snackColor:"",
    selectedArea:""
  }),
  mounted() {
    this.setReverse()
  },
  methods:{
    setReverse(){
      if(this.$i18n.locale==='en'){
        this.isReverse=false;
      } else if(this.$i18n.locale==='fa'){
        this.isReverse=true;
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
    setURLResponse(){
      axios.post(this.getCookie("response")+";type=geojson&TILED=false", null,
      ).then(response => {
        console.log(response)
        for(var i = 0;i<response.data.features.length;i++){
          this.areaNames.push({
            "name":response.data.features[i].properties.areaname,
            "id":response.data.features[i].properties.midwayserviceareainfoid,
            "typeid":response.data.features[i].properties.midwayserviceareatypeid,
          })
        }
        console.log(this.areaNames)
      }).catch(error => {
        this.errorMessage = error.message;
        this.snackColor = "red accent-2";
        this.snackText = this.$t("SnackBar.NetworkError");
        this.snackIcon = "mdi-close-circle";
        this.snackbar = true;
        console.error("There was an error!", error);
      });
    },
    onChange(value){
      var th = this;
      this.areaNames.forEach(e =>{
        if(value.id && value.id===e.id) {
          th.midwayserviceareainfoid = e.id;
          th.midwayserviceareatypeid = e.typeid;
        }else if(value===e.id){
          th.midwayserviceareainfoid = e.id;
          th.midwayserviceareatypeid = e.typeid;
        }
      })
      console.log(this.midwayserviceareainfoid)
      console.log(this.midwayserviceareatypeid)
    },
    addMidwayServiceAreaComplaint(){
      for(var c=0;c<this.combo.length;c++){
        this.newCombo += " " + this.combo[c]
      }
      const formData = new FormData();
      formData.append('userId', 394258);
      formData.append('guestUserId', this.mobile);
      formData.append('midwarServiceAreaInfoId', this.midwayserviceareainfoid);
      formData.append('midwarServiceAreaTypeId', this.midwayserviceareatypeid);
      formData.append('title', this.newCombo);
      formData.append('desc', this.desc);
      formData.append('email', this.email);
      formData.append('mobile', this.mobile);
      formData.append('message', "");
      formData.append('locale', 'fa_IR');
      formData.append('cmd', "{'/*************.midwayareacomplaint/add-midway-service-area-complaint':{}}");
      for (var pair of formData.entries()) {
        console.log(pair[0]+ ', ' + pair[1]);
      }
      axios.post('*************', formData,
      ).then(response => {
        this.snackText = this.$t('SubmitComplaintDialog.Success') + " " + response.data[0].midwayServiceAreaComplaintId;
        this.snackIcon = "mdi-check-circle"
        this.snackbar = true;
        this.selectedArea="";
        this.mobile="";
        this.email="";
        this.desc="";
        this.combo="";
        this.SubmitComplaintDialog = false;
        console.log(response)
      }).catch(error => {
        this.errorMessage = error.message;
        this.snackColor = "red accent-2";
        this.snackText = this.$t("SnackBar.NetworkError");
        this.snackIcon = "mdi-close-circle";
        this.snackbar = true;
        console.error("There was an error!", error);
      });
    },
    LoadMarkers(){
       var th = this;
       document.getElementById("otherMapDiv").innerHTML = "";
       mapboxgl.accessToken = 'pk.eyJ1IjoiaGFkaXJlYWw5IiwiYSI6ImNsMmZ0cXNjMjBiY3UzY2xqdzE1OHIxbXEifQ.wi3bA4H8DAxUbGGi0HwQJg';
         var map = new mapboxgl.Map({
           container: "otherMapDiv",
           style: inStreetStyle,
           center: [53, 32], // starting position
           zoom: 4, // starting zoom,
         });

         map.on('load', function () {
           map.resize();
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

      const formData = new FormData();
      formData.append('cmd', "{'/*************.midwayareainfo/get-wms-map-url':{}}");
      axios.post('*************', formData,
      ).then(response => {
        this.overlay = false;
        this.response = response;
        console.log(response)
        document.cookie = "response="+ response.data;
        this.setURLResponse();
        map.on('styledata', function(e) {
          if(!map.getSource('midwayArea') && response.data != ''){
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
          if(e.sourceId === 'midwayArea' &&  response.data != ''){
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
          }
        });

      }).catch(error => {
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
        th.ServiceAreaDetailsDialog = false;
        th.otherFromMapDialog=false;
        th.selectedArea = e.features[0].properties.areaname
        th.onChange(e.features[0].properties.midwayserviceareainfoid)
        })
    },
    setFalse(){
      this.$emit("setFalse",false);
    }
  }
}
</script>

<style scoped>
.mapboxgl-canvas{
  height: 100%;
}
.mapboxgl-ctrl-group {
  border-radius: 50%;
  height: 50px;
  width: 50px;
  margin-right: 330px !important;
  margin-top: 500px !important;
  position: relative;
}
.mapboxgl-ctrl-group button{
  height: 50px;
  width: 50px;
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.15), 0px 2px 2px 0px rgba(0, 0, 0, 0.01), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
}
.mapboxgl-ctrl-group:not(:empty){
  box-shadow: unset !important;
}
</style>
