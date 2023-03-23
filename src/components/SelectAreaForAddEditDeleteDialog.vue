<template>
  <v-row justify="center">
    <v-dialog v-model="SelectAreaForAddEditDeleteDialog"  max-width="500px"  @click:outside="setFalse">
      <v-card  style="background-color: white;height: 550px;font-family: IranSans;overflow:scroll;">
        <v-icon style="margin: 10px;" color="red" @click="setFalse()">mdi-close</v-icon>
        <p style="direction: rtl;text-align: center;margin: 10px">مسئولیت اطلاعات مندرج در این اپ بر عهده مدیران مجتمع های خدماتی رفاهی است و سازمان مسئولیتی در خصوص اطلاعات مندرج ندارد. البته اظهار اطلاعات نادرست به کاربران در صورت ثبت شکایت توسط سازمان پیگیری خواهد شد.</p>

        <div style="width: 100%;height: 100%;position: relative;top:-0px;overflow: scroll">
          <v-checkbox label="موافقم" style="    direction: rtl;color: black;margin-right: 10px;width: fit-content;height: 40px;float: right;" @change="setAgree"></v-checkbox>
          <v-combobox append-icon="" solo  v-model="selectedArea" return-object :items="areaNames" item-value="id" item-text="name"  @click="setURLResponse()" @change="onChange" :reverse="isReverse" style="width: 80%;position: relative;display: flex;justify-content: center;margin: auto;top:10px"
                      v-bind:label="$t('SubmitComplaintDialog.AreaName')" editable outlined background-color="white"></v-combobox>
          <v-btn style="float: right;margin-top: 10px;margin-right:40px;font-size:12px;background-color: #06978A;color: white" @click="LoadMarkers();">انتخاب از روی نقشه</v-btn>
          <div id="buttonsDiv">
            <v-speed-dial id="fab" v-model="fab"  :transition="transition" direction="bottom">
            <template v-slot:activator >
              <v-btn  color="blue darken-2" dark>
                <v-icon v-if="fab" >mdi-close</v-icon>
                <v-icon>mdi-pencil</v-icon>ویرایش
              </v-btn>
            </template>
            <v-btn class="fabBtn"  light size="10" color="#ffffff" style="color:blue;border: 2px solid" @click="detailEditClick()" >
              <v-icon>mdi-file-edit-outline</v-icon>
              مشخصات
            </v-btn>
            <v-btn class="fabBtn" light size="10" color="#ffffff" style="color:blue;border: 2px solid" @click="imageEditClick()">
              <v-icon>mdi-image-outline</v-icon>
              تصاویر
            </v-btn>
            <v-btn class="fabBtn" light size="10" color="#ffffff" style="color:blue;border: 2px solid" @click="serviceEditClick()">
              <v-icon>mdi-format-list-bulleted</v-icon>
              خدمات
            </v-btn>
            <v-btn class="fabBtn" light size="10" color="#ffffff" style="color:blue;border: 2px solid" @click=" wktEditClick();AddAreaDetail=false">
              <v-icon>mdi-map-marker</v-icon>
              مکان
            </v-btn>
          </v-speed-dial>
            <v-btn class="v-btn" depressed color="success" @click="createAreaClick();setMapForAddArea();AddAreaDetail=false"><v-icon>mdi-plus</v-icon>ایجاد</v-btn>
            <v-btn class="v-btn" depressed color="error" @click="deleteMidwayServiceArea()"><v-icon>mdi-delete</v-icon>حذف</v-btn>
          </div>
        </div>

        <v-snackbar  v-model="snackbar" :timeout="2000" :color="snackColor"  rounded="pill" style="text-align: center;margin: auto;min-width: 0 !important;width: 50px;font-family: IranSans">
          <v-icon style="float:right;">{{ snackIcon }}</v-icon>
          {{ snackText }}
        </v-snackbar>
        <v-overlay :value="overlay">
          <v-progress-circular :size="70" :width="7" color="white" indeterminate></v-progress-circular>
        </v-overlay>
        <v-row justify="center">
          <v-dialog v-model="otherFromMapDialog" max-width="500px" eager>
            <v-card style="background-color: white;height: 500px">
              <div id="otherFromMapDiv" style="width: 100%;height: 90%;">
              </div>
              <v-card-actions
                  style="background-color: purple;height: 50px;position: relative;bottom: 0;right: 0;width: 100%;">
                <v-spacer></v-spacer>
                <p style="color: white;margin: 70px">انتخاب مکان مورد نظر</p>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
        <v-row justify="center">
          <v-dialog v-model="UnsubscribeToDeleteDialog" max-width="290" style="font-family: IranSans;text-align: center;padding-top: 20px;" eager>
            <v-card>
              <v-card-text style="font-family: IranSans;text-align: center;padding-top: 20px">
                میخواهید حذف کنید؟
              </v-card-text>

              <v-card-actions style="font-family: IranSans;">
                <v-spacer></v-spacer>
                <v-btn color="red darken-1" text @click="UnsubscribeToDeleteDialog = false" style="float: left;position: fixed">خیر</v-btn>
                <v-btn color="green darken-1" text @click="deleteArea()">بله</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
      </v-card>
    </v-dialog>
    <AddServiceType :AddServiceType="AddServiceType"  :serviceAreaJson="serviceAreaJson" :editResponse="editResponse" :allTypes="allTypes" :serviceTypes="serviceTypes"/>
    <AddAreaDetail :AddAreaDetail="AddAreaDetail" :serviceAreaJson="serviceAreaJson" :editResponse="editResponse"/>
    <EditAreaImagesDialog :EditAreaImagesDialog="EditAreaImagesDialog" :editResponse="editResponse"/>
    <UnsubscribeToAddDialog :UnsubscribeToAddDialog="UnsubscribeToAddDialog"/>
    <UnsubscribeToEditDialog :UnsubscribeToEditDialog="UnsubscribeToEditDialog"/>
  </v-row>
</template>

<script>
import inStreetStyle from '../fa_map/mapbox-street.json'
import mapboxgl from 'mapbox-gl';
import MapboxLanguage from '@mapbox/mapbox-gl-language';
import axios from "axios";
import AddAreaDetail from './AddAreaDetail.vue'
import AddServiceType from './AddServiceType.vue'
import EditAreaImagesDialog from './EditAreaImagesDialog.vue'
import UnsubscribeToAddDialog from './UnsubscribeToAddDialog.vue'
import UnsubscribeToEditDialog from './UnsubscribeToEditDialog.vue'
import $ from "jquery";
import image1 from "../assets/round_local_parking_black_24.png";
import image2 from "../assets/round_location_on_black_36.png";
export default {
  name: "SelectAreaForAddEditDeleteDialog",
  props:{
    SelectAreaForAddEditDeleteDialog:false,
    AddAreaDetail:false,
    AddServiceType:false,
    EditAreaImagesDialog:false,
    UnsubscribeToAddDialog:false,
    UnsubscribeToEditDialog:false,
    otherFromMapDialog:false,
    drawer:Boolean,
    detail:Array,
    allTypes:[],
    editResponse:{},
  },
  data: () => ({
    areaNames:[],
    serviceTypes:[],
    serviceAreaJson:{},
    UnsubscribeToDeleteDialog:false,
    fab: false,
    overlay:false,
    isReverse:true,
    agree:false,
    btnEditDisable:true,
    hasAccess:false,
    selectedArea:"",
    midwayserviceareainfoid:"",
    midwayserviceareatypeid:"",
    snackbar:false,
    snackText:"",
    snackIcon:"",
    snackColor:"",
    transition: 'slide-y-reverse-transition',
    lat:"",
    lng:"",
  }),
  components:{
    AddAreaDetail,
    AddServiceType,
    EditAreaImagesDialog,
    UnsubscribeToAddDialog,
    UnsubscribeToEditDialog,
  },
  mounted() {
    var th = this;
    this.$root.$on('closeDialog', (text) => {
      if(text===true){
        th.SelectAreaForAddEditDeleteDialog=false;
      }
    })
    this.$root.$on('goToEditArea', (text) => {
      if(text===true){
        th.setURLResponseForEdit(th.detail.midwayServiceAreaInfoId);
        th.selectedArea = th.detail.name
      }
    })

    this.$root.$off('goToEditFromMyArea');
    this.$root.$on('goToEditFromMyArea', (detail) => {
        th.setURLResponseForEdit(detail.midwayServiceAreaInfoId);
        th.selectedArea = detail.name
    })
  },
  methods:{
    LoadMarkers(){
      var th = this;
      this.otherFromMapDialog=!this.otherFromMapDialog;
      this.AddAreaDetail=false;
      this.AddServiceType=false;
      this.drawer=false
      document.getElementById("otherFromMapDiv").innerHTML = "";
      mapboxgl.accessToken = 'pk.eyJ1IjoiaGFkaXJlYWw5IiwiYSI6ImNsMmZ0cXNjMjBiY3UzY2xqdzE1OHIxbXEifQ.wi3bA4H8DAxUbGGi0HwQJg';
      var map = new mapboxgl.Map({
        container: 'otherFromMapDiv',
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
        this.snackColor = "red accent-2";
        this.snackText = this.$t("SnackBar.NetworkError");
        this.snackIcon = "mdi-close-circle";
        this.snackbar = true;
        console.error("There was an error!", error);
      });

      map.on('click','clusters',(e) => {
        var features =map.queryRenderedFeatures(e.point, {
          layers: ['clusters']
        });
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
        th.otherFromMapDialog=false;
        th.selectedArea = e.features[0].properties.areaname
        th.onChange(e.features[0].properties.midwayserviceareainfoid)
      })
    },
    setURLResponse(){
      this.AddAreaDetail = false;
      axios.post(this.getCookie("response")+";type=geojson&TILED=false", null,
      ).then(response => {
        for(var i = 0;i<response.data.features.length;i++){
          this.areaNames.push({
            "name":response.data.features[i].properties.areaname,
            "id":response.data.features[i].properties.midwayserviceareainfoid,
            "typeid":response.data.features[i].properties.midwayserviceareatypeid,
          })
        }
      }).catch(error => {
        this.errorMessage = error.message;
        this.snackColor = "red accent-2";
        this.snackText = this.$t("SnackBar.NetworkError");
        this.snackIcon = "mdi-close-circle";
        this.snackbar = true;
        console.error("There was an error!", error);
      });
    },
    setURLResponseForEdit(areaId){
      this.AddAreaDetail = false;
      this.areaNames = [];
      axios.post(this.getCookie("response")+";type=geojson&TILED=false", null,
      ).then(response => {
        for(var i = 0;i<response.data.features.length;i++){
          this.areaNames.push({
            "name":response.data.features[i].properties.areaname,
            "id":response.data.features[i].properties.midwayserviceareainfoid,
            "typeid":response.data.features[i].properties.midwayserviceareatypeid,
          })
        }
        this.onChange(areaId);
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
      console.log(value)
      var th = this;
      this.overlay = true;
      this.EditAreaImagesDialog = false;
      this.editResponse = {}
      this.areaNames.forEach(e =>{
        if(value.id && value.id===e.id) {
          th.midwayserviceareainfoid = e.id;
          th.midwayserviceareatypeid = e.typeid;
        }else if(value===e.id){
          th.midwayserviceareainfoid = e.id;
          th.midwayserviceareatypeid = e.typeid;
        }
      })
      const formData = new FormData();
      formData.append('id', this.midwayserviceareainfoid);
      formData.append('locale', "fa_IR");
      formData.append('dateInMiliseconds', true);
      formData.append('cmd', "{'/*************.midwayareainfo/get-mid-way-service-area-with-documents-and-services-and-rate':{}}");
      axios.post('*************', formData,
      ).then(response => {
        console.log(response)
        this.overlay = false;
        this.editResponse = response.data[0]
        this.serviceAreaJson.userId = this.getCookie("managerUserId");
        this.serviceAreaJson.guestUserId = "";
        this.serviceAreaJson.midwayServiceAreaTypeId =  this.editResponse.midwayServiceAreaTypeId;
        this.serviceAreaJson.midwayServiceAreaId = this.editResponse.midwayServiceAreaInfoId;
        this.serviceAreaJson.trackingCode = this.editResponse.trackingCode;
        this.serviceAreaJson.name = this.editResponse.name;
        this.serviceAreaJson.managerName = this.editResponse.managerName;
        this.serviceAreaJson.mobileNumber = this.editResponse.mobileNumber;
        this.serviceAreaJson.investorName = this.editResponse.investorName;
        this.serviceAreaJson.investorMobileNumber = this.editResponse.investorMobileNumber;
        this.serviceAreaJson.phoneNumber = this.editResponse.phoneNumber;
        this.serviceAreaJson.emailAddress = this.editResponse.emailAddress;
        this.serviceAreaJson.faxNumber = this.editResponse.faxNumber;
        this.serviceAreaJson.axis = this.editResponse.axis;
        this.serviceAreaJson.km = this.editResponse.km;
        this.serviceAreaJson.area = this.editResponse.area;
        this.serviceAreaJson.address = this.editResponse.address;
        this.serviceAreaJson.distanceToNextServiceArea = "";
        this.serviceAreaJson.description = "";
        this.serviceAreaJson.placeKeywords = "";
        this.serviceAreaJson.locale = "fa_IR";
        this.serviceAreaJson.scale = "";
        this.serviceAreaJson.tagsimatCode = "IRN";
        this.serviceAreaJson.services = this.editResponse.serviceIds
        this.serviceAreaJson.wkt = this.editResponse.geomWKT
        this.serviceAreaJson.grade = this.editResponse.grade;
        this.serviceAreaJson.areaStatus = this.editResponse.areaStatus;
        this.serviceAreaJson.side = this.editResponse.side;
        this.getMidWayServiceAreaTypes();

        this.hasAccessToEditDelete(this.editResponse.midwayServiceAreaInfoId);
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
    deleteMidwayServiceArea(){
      if(this.editResponse==='undefined' || this.editResponse===undefined){
        this.snackColor = "red accent-2";
        this.snackText = this.$t("SnackBar.SelectArea");
        this.snackIcon = "mdi-close-circle"
        this.snackbar = true;
      }else {
        if(this.hasAccess===true) {
          this.UnsubscribeToDeleteDialog = true;
        }else {
          this.snackColor = "red accent-2";
          this.snackText = this.$t("SnackBar.EditAccess");
          this.snackIcon = "mdi-close-circle"
          this.snackbar = true;
        }
      }
    },
    deleteArea(){
      this.UnsubscribeToDeleteDialog = false;
      const formData = new FormData();
      formData.append('midwayServiceAreaId', this.midwayserviceareainfoid);
      formData.append('cmd', "{'/*************.midwayareainfo/delete-midway-service-area':{}}");
      axios.post('*************', formData,
      ).then(response => {
        this.snackColor = "red accent-2";
        this.snackText = this.$t("SnackBar.AreaDeleted");
        this.snackIcon = "mdi-close-circle"
        this.snackbar = true;
        setTimeout(this.goToHome(),2000)
      }).catch(error => {
        this.errorMessage = error.message;
        this.snackColor = "red accent-2";
        this.snackText = this.$t("SnackBar.NetworkError");
        this.snackIcon = "mdi-close-circle";
        this.snackbar = true;
        console.error("There was an error!", error);
      });
    },
    setMapForAddArea(){
      var th = this;
      mapboxgl.accessToken = 'pk.eyJ1IjoiaGFkaXJlYWw5IiwiYSI6ImNsMmZ0cXNjMjBiY3UzY2xqdzE1OHIxbXEifQ.wi3bA4H8DAxUbGGi0HwQJg';
      var map = new mapboxgl.Map({
        container: 'otherFromMapDiv',
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
      if(this.getCookie("isEdit")==='false'){
        const marker = new mapboxgl.Marker({draggable: true}).setLngLat([53.6880, 32.4279]).addTo(map);
        function onDragEnd() {
          const lngLat = marker.getLngLat();
          th.lng = lngLat.lng;
          th.lat = lngLat.lat;
        }
        marker.on('dragend', onDragEnd);
        marker.getElement().addEventListener('click', () => {
          var wkt = "MULTIPOINT (("+th.lng+' '+th.lat+"))"
          th.serviceAreaJson.wkt = wkt;
          th.AddAreaDetail = !th.AddAreaDetail;
          th.AddAreaDetail = true;
          th.otherFromMapDialog = false;
        });
        this.AddServiceType = false;
        this.otherFromMapDialog = true;
      }else if(this.getCookie("isEdit")==='true'){
        var latlng = this.editResponse.geomWKT.substring(13,this.editResponse.geomWKT.length-2);
        latlng = latlng.split(" ");
        this.lat=parseFloat(latlng[1]);
        this.lng=parseFloat(latlng[0]);
        const marker = new mapboxgl.Marker({draggable: true}).setLngLat([this.lng, this.lat]).addTo(map);
        function onDragEnd() {
          const lngLat = marker.getLngLat();
          th.lng = lngLat.lng;
          th.lat = lngLat.lat;
        }
        marker.on('dragend', onDragEnd);
        marker.getElement().addEventListener('click', () => {
          var wkt = "MULTIPOINT (("+th.lng+' '+th.lat+"))"
          th.serviceAreaJson.wkt = wkt;
          console.log(th.serviceAreaJson)
          const formData = new FormData();
          formData.append('serviceAreaJson', JSON.stringify(th.serviceAreaJson));
          formData.append('cmd', "{'/*************.midwayareainfo/update-midway-service-area':{}}");
          axios.post('*************', formData,
          ).then(response => {
            this.snackColor = "success";
            this.snackText = this.$t("SnackBar.DetailsEdited");
            this.snackIcon = "mdi-check-circle";
            this.snackbar = true;
            setTimeout(this.goToHome(), 3000);
          })
              .catch(error => {
                this.errorMessage = error.message;
                this.snackColor = "red accent-2";
                this.snackText = this.$t("SnackBar.NetworkError");
                this.snackIcon = "mdi-close-circle";
                this.snackbar = true;
                console.error("There was an error!", error);
              });
          this.otherFromMapDialog = false;
        });
        this.AddServiceType = false;
        this.otherFromMapDialog = true;
      }
    },
    detailEditClick(){
      if(this.agree) {
        document.cookie = "isEdit=" + true
        if (this.editResponse === undefined) {
          this.snackColor = "red accent-2";
          this.snackText = this.$t("SnackBar.SelectArea");
          this.snackIcon = "mdi-close-circle"
          this.snackbar = true;
        } else {
          if (this.hasAccess === true) {
            this.AddAreaDetail = !this.AddAreaDetail;
            this.AddAreaDetail = true
          } else {
            this.snackColor = "red accent-2";
            this.snackText = this.$t("SnackBar.EditAccess");
            this.snackIcon = "mdi-close-circle"
            this.snackbar = true;
          }
        }
      }else{
        this.snackColor = "red accent-2";
        this.snackText = "گزینه ی (موافقم) را انتخاب کنید";
        this.snackIcon = "mdi-close-circle"
        this.snackbar = true;
      }

    },
    serviceEditClick(){
      if(this.agree) {
        document.cookie = "isEdit=" + true
        if (this.editResponse === undefined) {
          this.snackColor = "red accent-2";
          this.snackText = this.$t("SnackBar.SelectArea");
          this.snackIcon = "mdi-close-circle"
          this.snackbar = true;
        } else {
          if (this.hasAccess === true) {
            this.$root.$emit("goToEditService", true);
            this.AddServiceType = !this.AddServiceType;
            this.AddServiceType = true;
            this.AddAreaDetail = false;
          } else {
            this.snackColor = "red accent-2";
            this.snackText = this.$t("SnackBar.EditAccess");
            this.snackIcon = "mdi-close-circle"
            this.snackbar = true;
          }

        }
      }else {
        this.snackColor = "red accent-2";
        this.snackText = "گزینه ی (موافقم) را انتخاب کنید";
        this.snackIcon = "mdi-close-circle"
        this.snackbar = true;
      }
    },
    imageEditClick(){
      if(this.agree) {
      document.cookie = "isEdit=" + true
      if(this.editResponse===undefined){
        this.snackColor = "red accent-2";
        this.snackText = this.$t("SnackBar.SelectArea");
        this.snackIcon = "mdi-close-circle"
        this.snackbar = true;
      }else {
        if(this.hasAccess===true){
        this.$root.$emit('goToEditImages', true);
        this.EditAreaImagesDialog = !this.EditAreaImagesDialog;
        this.EditAreaImagesDialog = true;
        this.AddAreaDetail = false;
        this.AddServiceType = false;
          }else{
          this.snackColor = "red accent-2";
          this.snackText = this.$t("SnackBar.EditAccess");
          this.snackIcon = "mdi-close-circle"
          this.snackbar = true;
        }
      }
    }else {
      this.snackColor = "red accent-2";
      this.snackText = "گزینه ی (موافقم) را انتخاب کنید";
      this.snackIcon = "mdi-close-circle"
      this.snackbar = true;
    }
    },
    wktEditClick(){
      if(this.agree) {
      document.cookie = "isEdit=" + true
      if(this.editResponse===undefined){
        this.snackColor = "red accent-2";
        this.snackText = this.$t("SnackBar.SelectArea");
        this.snackIcon = "mdi-close-circle"
        this.snackbar = true;
      }else {
        if (this.hasAccess === true) {
          this.setMapForAddArea();
        }else{
          this.snackColor = "red accent-2";
          this.snackText = this.$t("SnackBar.EditAccess");
          this.snackIcon = "mdi-close-circle"
          this.snackbar = true;
        }
      }
    }else {
      this.snackColor = "red accent-2";
      this.snackText = "گزینه ی (موافقم) را انتخاب کنید";
      this.snackIcon = "mdi-close-circle"
      this.snackbar = true;
    }
    },
    createAreaClick(){
      document.cookie = "isEdit=" + false
    },
    getMidWayServiceAreaTypes() {
      var th = this;
      const formData = new FormData();
      formData.append('locale', "fa_IR");
      formData.append('dateInMiliseconds', "true");
      formData.append('cmd', "{'/*************.midwayareatype/get-mid-way-service-area-types-with-documents':{}}");
      axios.post('*************', formData,
      ).then(response => {
        this.allTypes = response.data;
        console.log(response)
        for (let i = 0; i < response.data.length; i++) {
          if (response.data[i].parentMidwayServiceAreaServicesId === response.data[i].midwayServiceAreaTypeId) {
            this.serviceTypes.push(response.data[i])
          }
        }
        console.log(this.allTypes)
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
    goToHome(){
      location.href="/#/"
    },
    close(){
      if (this.getCookie("isEdit")==="false") {
        this.UnsubscribeToAddDialog = !this.UnsubscribeToAddDialog;
        this.UnsubscribeToAddDialog = true;
      }else if (this.getCookie("isEdit")==="true"){
        this.UnsubscribeToEditDialog = !this.UnsubscribeToEditDialog;
        this.UnsubscribeToEditDialog = true;
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
    setAgree(value){
      if(value===true){
        this.agree = true;
      } else if(value===false){
        this.agree = false;
      }

    },
    map(){
      this.$root.$emit("load",true)
    },
    hasAccessToEditDelete(id){
      const formData = new FormData();
      formData.append('areaId', id);
      formData.append('mobileNumber', this.getCookie("phone"));
      formData.append('cmd', "{'/*************.person/has-access-to-edit-delete-area-with-mobile':{}}");
      axios.post('*************', formData, {
        auth:{username: this.getCookie("managerScreenName"), password: this.getCookie("managerPassword")}}
      ).then(response => {
        if(response.data[0].hasAccess==="false"){
          this.hasAccess = false;
        }else if(response.data[0].hasAccess==="true"){
          this.hasAccess = true;
        }
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
    setFalse(){
      this.$emit("setFalse",false);
    }
  },


}
</script>

<style scoped>
#buttonsDiv{
  display: flex;
  justify-content: center;
  direction: rtl;
  margin-top: 80px;
}
.v-btn{
  margin: 5px;
}
.fabBtn{
  width: 120px;
}
</style>
