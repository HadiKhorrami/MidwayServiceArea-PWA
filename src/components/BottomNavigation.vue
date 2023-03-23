<template>
  <v-app>
  <footer>
    <v-bottom-navigation id="footer" v-model="value" :background-color="color" dark>
        <v-btn style="height: 100%;color: white;width: 100%;max-width: 100%;background-color: white" @click="goTo141()">
          <span style="color: black;font-size:10px">{{$t('BottomNavigation.141')}}</span>
          <v-icon style="color: black">mdi-account</v-icon>
        </v-btn>
      <v-btn style="height: 100%;color: white;width: 100%;max-width: 100%;background-color: white" @click="AddEditDeleteArea()" >
        <span style="color: black;font-size:10px">{{$t('BottomNavigation.Edit')}}</span>
        <v-icon style="color: black">mdi-pencil</v-icon>
      </v-btn>
      <v-btn style="border-radius: 90%;width: 90%;max-width: 0;margin-left: 15px" color="pink" dark absolute top fab rounded @click="Layersheet=!Layersheet;Layersheet=true;Layersheet=!Layersheet;Layersheet=true;SelectAreaForAddEditDeleteDialog=false;MyFavoriteAreasDialog=false">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn style="height: 100%;color: white;width: 100%;max-width: 100%;background-color: white" @click="goToMyFavoriteAreasDialog()">
        <span style="color: black;font-size:10px">{{$t('BottomNavigation.Favorite')}}</span>
        <v-icon style="color: black">mdi-heart</v-icon>
      </v-btn>

        <v-btn @click="ProfileOrLogin()" style="height: 100%;color: white;width: 100%;max-width: 100%;background-color: white">
          <span style="color: black;font-size:10px">{{$t('BottomNavigation.Profile')}}</span>
          <v-icon style="color: black">mdi-account</v-icon>
        </v-btn>

    </v-bottom-navigation>
    <v-snackbar  v-model="snackbar" :timeout="3000" :color="snackColor"  rounded="pill" style="text-align: center;margin: auto;min-width: 0 !important;width: 20px;font-family: IranSans;">
      <v-icon style="float:right;">{{ snackIcon }}</v-icon>
      {{ snackText }}
    </v-snackbar>
  </footer>
    <SearchSheet  :Layersheet="Layersheet" @otherlatlng="otherlatlng" :services="services"/>
    <SelectAreaForAddEditDeleteDialog  :SelectAreaForAddEditDeleteDialog="SelectAreaForAddEditDeleteDialog" :areaNames="areaNames" @setFalse="SelectAreaForAddEditDeleteDialog=false"/>
    <AddAreaImagesDialog  :AddAreaImagesDialog="AddAreaImagesDialog"/>
    <MyFavoriteAreasDialog  :MyFavoriteAreasDialog="MyFavoriteAreasDialog" :areaNames="areaNames" @setFalse="setFalse"/>
  </v-app>
</template>

<script>
import mapboxgl from 'mapbox-gl';
import { mdiChartLine } from '/node_modules/@mdi/js';
import SearchSheet from '../components/SearchSheet.vue'
import AddAreaImagesDialog from '../components/AddAreaImagesDialog.vue'
import SelectAreaForAddEditDeleteDialog from '../components/SelectAreaForAddEditDeleteDialog.vue'
import MyFavoriteAreasDialog from '../components/MyFavoriteAreasDialog.vue'
import $ from "jquery";
export default {
  name: "BottomNavigation",
  props:{
    SelectAreaForAddEditDeleteDialog:false,
    MyFavoriteAreasDialog:false,
    AddAreaImagesDialog:false,
    ServiceAreaDetailsDialog:false,
    areaNames:[],
    services:[],
    favoriteAreas:[],
    otherlatlng:[],
    Layersheet:false,
  },
  data: () => ({
    chartlogo: mdiChartLine,
    color: "white",
    SearchSheet:false,
	Layersheet:false,
    isLogin:"/LoginForm",
    snackbar:false,
    snackText:"",
    snackIcon:"",
    snackColor:"",
  }),
  components: {
    SearchSheet,
    SelectAreaForAddEditDeleteDialog,
    AddAreaImagesDialog,
    MyFavoriteAreasDialog
  },
  mounted() {
  },
  methods: {
    ProfileOrLogin(){
      $('.v-dialog:not(.v-dialog--fullscreen)').css('display','none');
      this.drawer = false;
      if(this.getCookie("phone")==='undefined' || this.getCookie("phone")===undefined){
        this.$router.push({ path: "/LoginForm" });
        this.ServiceAreaDetailsDialog = false;
      }else if(this.getCookie("phone")!='undefined' || this.getCookie("phone")!=undefined){
        this.$router.push({ path: "/Profile" });
      }
    },
    AddEditDeleteArea(){
      if(this.getCookie("managerUserId")===undefined || this.getCookie("managerUserId")==='undefined'){
        this.Layersheet = false;
        this.snackColor = "red accent-2";
        this.snackText = this.$t("SnackBar.PleaseLoginAsManager");
        this.snackIcon = "mdi-close-circle"
        this.snackbar = true;
      }else{
      this.Layersheet = false;
      this.MyFavoriteAreasDialog = false;
        this.SelectAreaForAddEditDeleteDialog=!this.SelectAreaForAddEditDeleteDialog;
        this.SelectAreaForAddEditDeleteDialog = true;
      }
    },
    goToMyFavoriteAreasDialog(){
      if(this.getCookie("phone")==='undefined' || this.getCookie("phone")===undefined){
        this.Layersheet = false;
        this.snackColor = "red accent-2";
        this.snackText = this.$t("SnackBar.PleaseLogin");
        this.snackIcon = "mdi-close-circle"
        this.snackbar = true;
        this.Layersheet = false
        this.SelectAreaForAddEditDeleteDialog = false
      }
      else if(this.getCookie("phone")!='undefined'){
        this.MyFavoriteAreasDialog=!this.MyFavoriteAreasDialog;
        this.MyFavoriteAreasDialog = true;
        this.Layersheet = false
        this.SelectAreaForAddEditDeleteDialog = false
        this.$root.$emit('goToMyFavoriteAreas', true);
      }

    },
    goTo141(){
      window.open('https://141.ir', '_blank');
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
      this.MyFavoriteAreasDialog = false;
    }
  },
}
</script>

<style scoped>
#footer{
  position: fixed;
  bottom: 0;
  padding: 0;
  font-family: IranSans;
  box-shadow: 5px 5px 5px 5px #282828;
  background-color: teal;
  z-index: 500;
}
</style>
