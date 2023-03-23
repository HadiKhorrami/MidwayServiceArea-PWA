<template>
  <v-app>
  <v-bottom-sheet v-model="SearchResultSheet"  @click:outside="SearchResultSheet=false;ServiceAreaDetailsDialog=false;setFalse()">
    <v-sheet class="text-center" height="400px" :key="$route.fullPath" style="background-color: white;">
      <v-icon style="margin: 10px;float: left" color="red" @click="setFalse()">mdi-close</v-icon>
      <div style="height: 80%;width: 100%;overflow: scroll;padding-bottom: 10px;">
      <div id="popupDiv" v-for="i in searchResultArray">
        <div id="distanceDiv">
          <p id="distance">{{ $t('AreaDetail.DistanceToYou') }} {{ parseInt(i.distance) }} {{ $t('AreaDetail.Kilometers') }}</p>
          </div>
        <div style="width: 100%;height: 55%;background-color: #ef8787;border-radius: 5px;position: absolute;top: 0;display: grid">
          <p id="name">{{i.name}}</p>
          <p id="side">{{i.side}}</p>
          </div>
        <p id="direction" @click="routingClick(i.coordinates)">{{$t('AreaDetail.Directions')}}</p>
        <p id="more" @click="getMidWayServiceArea(i.id)">{{$t('AreaDetail.MoreInfo')}}</p>
      </div>
      </div>
    </v-sheet>
    <v-progress-circular id="progress" v-if="overlay" :size="70" :width="7" color="blue" indeterminate></v-progress-circular>
    <v-snackbar  v-model="snackbar" :timeout="3000" :color="snackColor"  rounded="pill" style="text-align: center;margin: auto;min-width: 0 !important;width: 20px;font-family: IranSans;">
      <v-icon style="float:right;">{{ snackIcon }}</v-icon>
      {{ snackText }}
    </v-snackbar>
    <ServiceAreaDetailsDialog  :ServiceAreaDetailsDialog="ServiceAreaDetailsDialog" :slideArray="slideArray" :detail="detail" :saveColor="saveColor" :services="services" :ratingArray="ratingArray"
                               :areaname="areaname" :managerName="managerName" :axis="axis" :km="km" @setFalse="setChildFalse"/>
    <AreaSubServices  :AreaSubServices="AreaSubServices" :subServiceArray="subServiceArray" :headerColor="headerColor"/>
    <RoutingDialog :RoutingDialog="RoutingDialog"  @setFalse="RoutingDialog=false"/>
  </v-bottom-sheet>
  </v-app>
</template>

<script>
import ServiceAreaDetailsDialog from './ServiceAreaDetailsDialog.vue'
import AreaSubServices from './AreaSubServices.vue'
import RoutingDialog from './RoutingDialog.vue'
import * as turf from "@turf/turf";
import axios from "axios";
import mapboxgl from "mapbox-gl";
import $ from "jquery";

export default {
  name: "SearchResultSheet",
  props: {
    ServiceAreaDetailsDialog: false,
    AreaSubServices: false,
    RoutingDialog: false,
    SearchResultSheet: false,
    searchResultArray: [],
    services : [],
    slideArray:[],
    ratingArray:[],
    areaname:"",
    managerName:"",
    axis:"",
    km:"",
    routingMap:"",
    headerColor:"",
    saveColor:"",
    currlat:"",
    currlng:"",
  },
  data: () => ({
    areaResponse:"",
    favoriteAreas:[],
    latlng:[],
    detail:{},
    services :[],
    subServiceArray:[],
    areaDetail:{
      midwayServiceAreaTypeName:"",
      name:"",
      side:"",
    },
    overlay:false,
    snackbar: false,
    snackText: "",
    snackIcon: "",
    snackColor: "",
  }),
  components:{
    ServiceAreaDetailsDialog,
    RoutingDialog,
    AreaSubServices
  },
   mounted () {
    var th= this;
    // this.$root.$off("goToSearchResultSheet");
    this.$root.$on("goToSearchResultSheet",this.setSearchResultArray)
  },
  methods:{
    setSearchResultArray(){
      var th = this;
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
    },
    getMidWayServiceArea(id){
      var th = this;
      this.overlay=true;
      const formData = new FormData();
      formData.append('id', id);
      formData.append('locale', "fa_IR");
      formData.append('dateInMiliseconds', true);
      formData.append('cmd', "{'/MidwayServiceArea-portlet.midwayareainfo/get-mid-way-service-area-with-documents-and-services-and-rate':{}}");
      axios.post('https://restareas.rmto.ir/api/jsonws/invoke', formData,{timeout: 15000}
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
        console.log(document.getElementById("services"))
        this.setReverse();
        this.moreInfoClick();
        this.getMidwayServiceAreaRatings(response.data[0].midwayServiceAreaInfoId);
        th.ServiceAreaDetailsDialog=!th.ServiceAreaDetailsDialog;
        th.ServiceAreaDetailsDialog=true;
      }).catch(error => {
        this.errorMessage = error.message;
        this.overlay = false;
        this.snackColor = "red accent-2";
        this.snackText = this.$t("SnackBar.NetworkError");
        this.snackIcon = "mdi-close-circle";
        this.snackbar = true;
        console.error("There was an error!", error);
      });
    },
    moreInfoClick(){
      var th = this;
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
          this.snackColor = "red accent-2";
          this.snackText = this.$t("SnackBar.NetworkError");
          this.snackIcon = "mdi-close-circle";
          this.snackbar = true;
          console.error("There was an error!", error);
        });
      }
    },
    routingClick(coordinates){
      this.$root.$emit("goToApp",coordinates);
    },
    getCookie(name) {
      let cookie = {};
      document.cookie.split(';').forEach(function(el) {
        let [k] = el.split('=');
        cookie[k.trim()] = el.substring(k.length + 1);
      })
      return cookie[name];
    },
    setFalse(){
      this.$emit("setFalse",false);
    },
    setChildFalse(value){
      this.ServiceAreaDetailsDialog = value;
      this.RoutingDialog = value;
    }
  }
}
</script>

<style scoped>
#popupDiv{
  background-color: white;
  height: 150px;
  width: 300px;
  position: relative;
  border-radius: 15px;
  margin: auto;
  margin-bottom: 20px;
  top:20px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
}
#distanceDiv {
  height: 40%;
  width: 30%;
  background-color: #ffc2c2;
  position: relative;
  z-index: 500;
  margin: 30px 10px auto 10px;
  border-radius: 10px;
  float: right;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
}
#distance {
  color: white;
  text-align: center;
  position: absolute;
  font-size: small;
  color: #414141;
}
#name{
  color: white;
  float: right;
  margin-top: 10px;
  margin-right: 120px;
  font-size: small;
  text-align: right;
}
#side{
  color: white;
  float: right;
  margin-top: 10px;
  margin-right: 120px;
  margin-bottom: 10px;
  font-size: small;
  text-align: right;
}
#direction{
  position: relative;
  bottom: -110px;
  height: 20px;
  text-align: right;
  font-size: small;
  width: 100px;
  float: right;
  left: 30%;
  background-color: burlywood;
  text-align: center;
  border-radius: 5px;
}
#more{
  position: relative;
  bottom: -92px;
  height: 20px;
  text-align: left;
  font-size: small;
  margin-left: 10px;
  width: 100px;
  background-color: burlywood;
  text-align: center;
  border-radius: 5px;
  float: left;
}
#progress{
  position: fixed;
  margin-left: 80px;
  margin-top: 300px;
}
</style>
