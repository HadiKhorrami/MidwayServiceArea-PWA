<template>
  <v-app style="height: 100%; width: 100%; top: 0;  background-color: white;position: fixed;">
    <div id="maindiv">
      <div id="photodiv">
        <v-icon color="white" large  style="margin: 10px" @click="backClick()">mdi-arrow-left</v-icon>
        <v-icon color="white" style="display: flex;font-size: 100px">mdi-account</v-icon>
        <p style="top: -15px;display: flex;justify-content: center;color: #fff">{{fullname}}</p>

      </div>
      <div id="midDiv">
        <div style="width: 30%;height: 90%;background-color: #fff;position: relative;float: right;right: 10px;top:5px;">
          <p>{{$t('Profile.Rating')}}</p><br>
          <p style="bottom: 15px;position: relative">{{ rateCount }}</p>
        </div>
<!--        <div style="width: 30%;height: 90%;background-color: #fff;position: relative;right: -120px;top:5px;">-->
<!--          <p>{{$t('Profile.Favorites')}}</p><br>-->
<!--          <p style="bottom: 15px;position: relative">{{ interestedAreas }}</p>-->
<!--        </div>-->
        <div style="width: 30%;height: 90%;background-color: #fff;position: relative;float: left;left: 10px;top:5px;">
          <p>{{$t('Profile.Areas')}}</p><br>
          <p style="bottom: 15px;position: relative">{{ areaCount }}</p>
        </div>
      </div>
      <div style="display: grid;width: 100%;padding: 5px;">
        <v-btn id="btn" class="v-btn" x-large @click="ChSClick()"><v-icon large right>mdi-menu</v-icon>{{$t('Profile.ChangeSpecification')}}</v-btn>
        <v-btn id="btn" class="v-btn" x-large @click="MyAreasClick()"><v-icon large right>mdi-map</v-icon>{{$t('Profile.MyServiceAreas')}}</v-btn>
<!--        <v-btn id="btn" class="v-btn" x-large @click="MyFavoriteAreasClick()"><v-icon large right>mdi-heart</v-icon>{{$t('Profile.MyInterestedAreas')}}</v-btn>-->
        <v-btn id="btn" class="v-btn" x-large @click="getMidwayServiceAreaComplaints()"><v-icon large right>mdi-emoticon-angry-outline</v-icon>{{$t('Profile.ReceivedComplaints')}}</v-btn>
        <v-btn id="btn" class="v-btn" x-large @click="ExitClick()"><v-icon large right>mdi-arrow-right</v-icon>{{$t('Profile.Exit')}}</v-btn>
      </div>
    </div>
    <v-snackbar  v-model="snackbar" :timeout="3000" :color="snackColor"  rounded="pill" style="text-align: center;margin: auto;min-width: 0 !important;width: 20px;font-family: IranSans;">
      <v-icon style="float:right;">{{ snackIcon }}</v-icon>
      {{ snackText }}
    </v-snackbar>
  <FillProfileDialog v-if="FillProfileDialog===true" :FillProfileDialog="FillProfileDialog" :firstName="firstName" :lastName="lastName" :fromProfile="fromProfile" @setFalse="setFalse"></FillProfileDialog>
  <MyFavoriteAreasDialog v-if="MyFavoriteAreasDialog===true" :MyFavoriteAreasDialog="MyFavoriteAreasDialog" @setFalse="setFalse"></MyFavoriteAreasDialog>
  <TrackComplaintDialog v-if="TrackComplaintDialog===true" :TrackComplaintDialog="TrackComplaintDialog" :complaints="complaints" @setFalse="setFalse"></TrackComplaintDialog>
  <MyAreasDialog v-if="MyAreasDialog===true" :MyAreasDialog="MyAreasDialog" :myAreas="myAreas" @setFalse="setFalse"></MyAreasDialog>
  </v-app>
</template>
<style>
#btn{
  font-family: IranSans;
  direction: rtl;
  width: 90%;
  margin:10px auto auto auto;
  background-color: white;
  color: #fff;
  border: 1px #4B946A;
  box-shadow: 0px 1px 0px 1px black;
  background-color: #4B946A;
}
p{
  text-align: center;
  font-family: IranSans;
}
#maindiv{
  height: 100%;
  width: 100%;
}
#photodiv{
  height: 30%;
  width: 100%;
  background-color: #4B946A;
}
#midDiv {
  height: 10%;
  width: 70%;
  background-color: #ffff;
  position: relative;
  margin: auto;
  top:-40px;
  border-radius: 10px;
  box-shadow: 0px 1px 0px 1px #666666;
}
</style>

<script>
import axios from "axios";
import $ from "jquery";
import FillProfileDialog from '../components/FillProfileDialog.vue'
import MyFavoriteAreasDialog from '../components/MyFavoriteAreasDialog.vue'
import TrackComplaintDialog from '../components/TrackComplaintDialog.vue'
import MyAreasDialog from '../components/MyAreasDialog.vue'
export default {
  name: "Profile",
  props:{
    FillProfileDialog:false,
    MyFavoriteAreasDialog:false,
    TrackComplaintDialog:false,
    MyAreasDialog:false,
    firstName:"",
    lastName:"",
    fromProfile:false,
    areaNames:[],
    complaints:[],
  },
    data: () => ({
      FillProfileDialog:false,
      MyFavoriteAreasDialog:false,
      MyAreasDialog:false,
      firstName:"",
      lastName:"",
      fromProfile:false,
      areaCount:0,
      rateCount:0,
      interestedAreas:"",
      favoriteAreas:[],
      myAreas:[],
      fullname:"",
      snackbar:false,
      snackText:"",
      snackIcon:"",
      snackColor:"",
  }),
  components:{
    FillProfileDialog,
    MyFavoriteAreasDialog,
    TrackComplaintDialog,
    MyAreasDialog
  },
  mounted() {
    console.log(this.getCookie("phone"))
    if(this.$i18n.locale==='en'){
      $('.v-btn').css('direction','ltr');
      $('.v-application--is-ltr .v-btn__content .v-icon--right').css('marginRight','15px');
      // $('.v-btn__content .v-icon.v-icon--left, .v-btn__content .v-icon.v-icon--right').css('fontSize','36px');
    }else if(this.$i18n.locale==='fa'){
      $('.v-btn').css('direction','rtl')
    }
    this.getPersonWithPicture();
    this.setMyAreas();
  },
  methods:{
    ChSClick(){
      this.fromProfile = true;
      this.firstName = this.getCookie("firstName")
      this.lastName = this.getCookie("familyName")
      this.FillProfileDialog = !this.FillProfileDialog;
    },
    MyAreasClick(){
      this.MyAreasDialog = !this.MyAreasDialog;
      this.MyAreasDialog = true;
    },

    getCookie(name) {
      let cookie = {};
      document.cookie.split(';').forEach(function(el) {
        let [k] = el.split('=');
        cookie[k.trim()] = el.substring(k.length + 1);
      })
      return cookie[name];
    },
    getPersonWithPicture(){
      const formData = new FormData();
      formData.append('mobileNumber', this.getCookie("phone"));
      formData.append('cmd', "{'/MidwayServiceArea-portlet.person/get-person-with-picture':{}}");
      axios.post('https://restareas.rmto.ir/api/jsonws/invoke', formData,
      ).then(response => {
        this.rateCount = response.data[0].rateCount;
        if(response.data[0].interestedAreas===""){
          this.interestedAreas = 0;
        }
        this.favoriteAreas = response.data[0].interestedAreas.split(",");
        this.fullname =  response.data[0].firstName + " " + response.data[0].familyName
        console.log(this.favoriteAreas)
      }).catch(error => {
        this.errorMessage = error.message;
        this.snackColor = "red accent-2";
        this.snackText = this.$t("SnackBar.NetworkError");
        this.snackIcon = "mdi-close-circle";
        this.snackbar = true;
        console.error("There was an error!", error);
      });
    },
    getMidwayServiceAreaComplaints(){
      this.$root.$emit("goToTrackComplaint",true);
      this.TrackComplaintDialog = !this.TrackComplaintDialog;
      this.TrackComplaintDialog = true;
    },
    ExitClick(){
      location.href='/#/'
      document.cookie = "phone=" + undefined;
  },
    backClick(){
      location.href='/#/'
    },
    setMyAreas(){
      var th = this;
      console.log(this.getCookie("managerScreenName"))
          th.myAreas = [];
          const formData = new FormData();
          formData.append('locale', "fa_IR");
          formData.append('mobileNumber',th.getCookie("phone"));
          formData.append('cmd', "{'/MidwayServiceArea-portlet.midwayareainfo/get-person-areas':{}}");
          axios.post('https://restareas.rmto.ir/api/jsonws/invoke', formData,{
            auth: {username: this.getCookie("managerScreenName"), password: this.getCookie("managerPassword")}}
          ).then(response => {
            for(var i=0;i<response.data.length;i++){
              this.areaCount = response.data.length;
              th.myAreas.push(response.data[i])
              if(th.$i18n.locale==='fa' && response.data[i].side===1) {
                th.side = "راست"
              }else if(th.$i18n.locale==='en' && response.data[i].side===1) {
                th.side = "right"
              }else if(th.$i18n.locale==='fa' && response.data[i].side===2) {
                th.side = "چپ"
              }else if(th.$i18n.locale==='en' && response.data[i].side===2) {
                th.side = "left"
              }
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
          console.log(th.areaNames)
          console.log(th.favoriteAreas)
    },
    setFalse(){
      this.MyFavoriteAreasDialog = false;
      this.FillProfileDialog = false;
      this.MyAreasDialog = false;
      this.TrackComplaintDialog = false;
    }
  },
  watch: {
    'phone' (val) {
      this.numberRules = []
    }
  },
}
</script>
