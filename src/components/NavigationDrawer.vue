<template>
  <v-card class="mx-auto overflow-hidden" height="100%" width="60%">
    <v-navigation-drawer v-model="drawer" absolute temporary :right="isRight" style="background-color: white;height: 100%;width: 60%;z-index: 1000;overflow: hidden" dark v-click-outside="setFalse">
      <div class="custom-shape-divider-top-1648540781">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 150" preserveAspectRatio="none">
          <path d="M0,0V7.23C0,65.52,268.63,112.77,600,112.77S1200,65.52,1200,7.23V0Z" class="shape-fill"></path>
        </svg>
      </div>
      <v-img
          :src="require('../assets/app_icon.png')"
          style="height: 70px; width: 70px; margin-left: 5px;display: flex;justify-content: center;margin: auto"
      ></v-img><br>
      <p style="font-family: IranSans;margin:auto;text-align: center;font-size: 12px;z-index: 100;position: relative;color: white;width: 80%">{{$t("NavTitle")}}</p>

      <div style="max-width: 100%;height: 70%;overflow: scroll;position: relative;margin-top: 80px;">
        <v-list style="background-color: white;margin-right: 2%;overflow: scroll" >
        <v-list-item @click="managerLoginOrLogOut()">
          <v-list-item-icon style="position: absolute; right: -30px;">
            <v-icon  style="color: #06978A;height: 40px;width: 40px;margin-top: -15px">mdi-login-variant</v-icon>
          </v-list-item-icon>
          <v-list-item-title class="itemTitle" v-text="LoginAsManagerText"
                             style="position: absolute;right: 35px;font-family: IranSans;font-size: 12px;color:black;"
          >
          </v-list-item-title
          >
        </v-list-item>
        <v-list-item @click="LanguageDialog=!LanguageDialog;drawer=false;">

          <v-list-item-icon style="position: absolute; right: -30px;">
            <v-icon  style="color:#06978A;height: 40px;width: 40px;margin-top: -15px">mdi-web</v-icon>
          </v-list-item-icon>

          <v-list-item-title class="itemTitle" v-text="" v-text="$t('Nav.Language')"
                             style="
                      position: absolute;
                      right: 35px;
                      font-family: IranSans;
                      font-size: 12px;
                    "
          >
          </v-list-item-title
          >
        </v-list-item>
        <v-list-item @click="goToPrayerTimeDialog()">
          <v-list-item-icon style="position: absolute; right: -30px;color: white">
            <v-icon  style="color:#06978A;height: 40px;width: 40px;margin-top: -15px">mdi-mosque</v-icon>
          </v-list-item-icon>
          <v-list-item-title class="itemTitle" v-text="$t('Nav.PrayerTimes')"
                             dark style="position: absolute;right: 35px;font-family: IranSans;font-size: 13px;">
          </v-list-item-title
          >
        </v-list-item>
        <v-list-item id="menutools" @click="EssentialPhonesDialog=!EssentialPhonesDialog;drawer=false;">
          <v-list-item-icon style="position: absolute; right: -30px;">
            <v-icon  style="color:#06978A;height: 40px;width: 40px;margin-top: -15px">mdi-phone</v-icon>
          </v-list-item-icon>

          <v-list-item-title class="itemTitle" v-text="$t('Nav.EssentialmPhoneNumbers')"
                             style="
                      position: absolute;
                      right: 35px;
                      font-family: IranSans;
                      font-size: 12px;                    "          >

          </v-list-item-title
          >
        </v-list-item>
        <v-list-item id="" @click="drawer=false;goToSubmitComplaintDialog()">
          <v-list-item-icon style="position: absolute; right: -30px;">
            <v-icon style="color:#06978A;height: 40px;width: 40px;margin-top: -15px">mdi-emoticon-angry-outline</v-icon>
          </v-list-item-icon>

          <v-list-item-title class="itemTitle" v-text="$t('Nav.SubmitComplaint')"
                             style="
                      position: absolute;
                      right: 35px;
                      font-family: IranSans;
                      font-size: 12px;">
          </v-list-item-title
          >
        </v-list-item>
        <v-list-item id="" @click="drawer=false;goToMidwayServiceAreaComplaints()">
          <v-list-item-icon style="position: absolute; right: -30px;">
            <v-icon style="color:#06978A;height: 40px;width: 40px;margin-top: -15px">mdi-information-variant</v-icon>
          </v-list-item-icon>

          <v-list-item-title class="itemTitle" v-text="$t('Nav.TrackComplaint')"
                             style="
                      position: absolute;
                      right: 35px;
                      font-family: IranSans;
                      font-size: 12px;">
          </v-list-item-title
          >
        </v-list-item>
        <v-list-item id="" @click="drawer=false;shareViaWebShare()">
          <v-list-item-icon style="position: absolute; right: -30px;">
            <v-icon style="color:#06978A;height: 40px;width: 40px;margin-top: -15px">mdi-share-variant</v-icon>
          </v-list-item-icon>

          <v-list-item-title class="itemTitle" v-text="$t('Nav.ShareWithFriends')"
                             style="
                      position: absolute;
                      right: 35px;
                      font-family: IranSans;
                      font-size: 12px;">
          </v-list-item-title
          >
        </v-list-item>
        <v-list-item id="" @click="drawer=false;goToSubmitCommentDialog()">
          <v-list-item-icon style="position: absolute; right: -30px;">
            <v-icon style="color:#06978A;height: 40px;width: 40px;margin-top: -15px">mdi-tooltip-edit-outline</v-icon>
          </v-list-item-icon>

          <v-list-item-title class="itemTitle" v-text="$t('Nav.Rating/ErrorReport')"
                             style="
                      position: absolute;
                      right: 35px;
                      font-family: IranSans;
                      font-size: 12px;">
          </v-list-item-title
          >
        </v-list-item>
        <v-list-item id="" @click="drawer=false;closeToRange=true;snackbar1=true">
          <v-list-item-icon style="position: absolute; right: -30px;">
            <v-icon style="color:#06978A;height: 40px;width: 40px;margin-top: -15px">mdi-help-circle-outline</v-icon>
          </v-list-item-icon>

          <v-list-item-title class="itemTitle" v-text="$t('Nav.Help')"
                             style="
                      position: absolute;
                      right: 35px;
                      font-family: IranSans;
                      font-size: 12px;"
          >
          </v-list-item-title
          >
        </v-list-item>
        <v-list-item id="" @click="drawer=false;AboutAppDialog=!AboutAppDialog">
          <v-list-item-icon style="position: absolute; right: -30px;">
            <v-icon style="color:#06978A;height: 40px;width: 40px;margin-top: -15px">mdi-information</v-icon>
          </v-list-item-icon>

          <v-list-item-title class="itemTitle" v-text="$t('Nav.AboutUs')"
                             style="
                      position: absolute;
                      right: 35px;
                      font-family: IranSans;
                      font-size: 12px;"          >
          </v-list-item-title
          >
        </v-list-item>

      </v-list>
      </div>
      <v-row justify="center">
        <v-dialog v-model="UnsubscribeToLogOutDialog" max-width="290" style="font-family: IranSans;text-align: center;padding-top: 20px;" eager>
          <v-card>
            <v-card-text style="font-family: IranSans;text-align: center;padding-top: 20px">
              میخواهید خارج شوید؟
            </v-card-text>

            <v-card-actions style="font-family: IranSans;">
              <v-spacer></v-spacer>
              <v-btn color="red darken-1" text @click="UnsubscribeToLogOutDialog = false" style="float: left;position: fixed">خیر</v-btn>
              <v-btn color="green darken-1" text @click="managerLogOut()">بله</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </v-navigation-drawer>
    <v-snackbar  v-model="snackbar" :timeout="3000" :color="snackColor"  rounded="pill" style="text-align: center;margin: auto;min-width: 0 !important;width: 20px;font-family: IranSans;">
      <v-icon style="float:right;">{{ snackIcon }}</v-icon>
      {{ snackText }}
    </v-snackbar>
    <LanguageDialog :LanguageDialog="LanguageDialog" @setFalse="LanguageDialog=false"/>
    <ManagerLoginDialog :ManagerLoginDialog="ManagerLoginDialog" @setFalse="ManagerLoginDialog=false"/>
    <PrayerTimeDialog :PrayerTimeDialog="PrayerTimeDialog" @setFalse="PrayerTimeDialog=false"/>
    <EssentialPhonesDialog :EssentialPhonesDialog="EssentialPhonesDialog" @setFalse="EssentialPhonesDialog=false"/>
    <SubmitComplaintDialog :SubmitComplaintDialog="SubmitComplaintDialog" :area-names="areaNames" @setFalse="SubmitComplaintDialog=false"/>
    <TrackComplaintDialog :TrackComplaintDialog="TrackComplaintDialog" :complaints="complaints" :areaNames="areaNames" @setFalse="TrackComplaintDialog=false"/>
    <SubmitCommentDialog :SubmitCommentDialog="SubmitCommentDialog" @setFalse="SubmitCommentDialog=false"/>
    <AboutAppDialog :AboutAppDialog="AboutAppDialog" @setFalse="AboutAppDialog=false"/>

  </v-card>

</template>

<script>
import {mdiChartLine} from "@mdi/js";
import shareIt from 'vue-share-it'
import ManagerLoginDialog from '../components/ManagerLoginDialog.vue'
import LanguageDialog from '../components/LanguageDialog.vue'
import PrayerTimeDialog from '../components/PrayerTimeDialog.vue'
import EssentialPhonesDialog from '../components/EssentialPhonesDialog.vue'
import SubmitComplaintDialog from './SubmitComplaintDialog.vue'
import TrackComplaintDialog from './TrackComplaintDialog.vue'
import SubmitCommentDialog from './SubmitCommentDialog.vue'
import AboutAppDialog from './AboutAppDialog.vue'
import axios from "axios";
import image1 from "../assets/round_local_parking_black_24.png";
import image2 from "../assets/round_location_on_black_36.png";
export default {
  name: "NavigationDrawer",
  props:{
    drawer:false,
    areaNames:[],
    complaints:[],
    complaintHeader:"",
    isRight:false,
  },
  data: () => ({
    ManagerLoginDialog:false,
    LanguageDialog:false,
    PrayerTimeDialog:false,
    EssentialPhonesDialog:false,
    SubmitComplaintDialog:false,
    TrackComplaintDialog:false,
    SubmitCommentDialog:false,
    AboutAppDialog:false,
    SearchSheet:false,
    drawer:false,
    UnsubscribeToLogOutDialog:false,
    snackbar:false,
    LoginAsManagerText:"ورود به عنوان مدیر سیستم",
    snackText:"",
    snackIcon:"",
    snackColor:"",
  }),
  components:{
    ManagerLoginDialog,
    LanguageDialog,
    PrayerTimeDialog,
    EssentialPhonesDialog,
    SubmitComplaintDialog,
    TrackComplaintDialog,
    SubmitCommentDialog,
    AboutAppDialog,
    shareIt
  },
  mounted() {
    var th = this;
    this.$root.$on('setManagerLoginText', (text) => {
      if (text === true) {
        th.ManagerLoginDialog = false;
        if(this.getCookie("managerUserId")===undefined || this.getCookie("managerUserId")==='undefined'){
          this.LoginAsManagerText = "ورود به عنوان مدیر سیستم"
        }else{
          this.LoginAsManagerText = "خروج مدیر از سیستم"
        }
      }
    })

  },
  methods:{
    shareViaWebShare() {
      navigator.share({
        title: 'Title to be shared',
        text: 'Text to be shared',
        url: 'URL to be shared'
      })
    },
    goToMidwayServiceAreaComplaints(){
      if(this.getCookie("phone")!=undefined) {
        this.$root.$emit("goToTrackComplaint",true);
        this.TrackComplaintDialog = !this.TrackComplaintDialog;
        this.TrackComplaintDialog = true;
      }else if(this.getCookie("phone")===undefined || this.getCookie("phone")==='undefined'){
        this.snackColor = "red accent-2";
        this.snackText = this.$t('SnackBar.PleaseLogin');
        this.snackIcon = "mdi-close-circle"
        this.snackbar = true;
      }
    },
    goToSubmitComplaintDialog(){
      if(this.getCookie("phone")!=undefined) {
        this.SubmitComplaintDialog = !this.SubmitComplaintDialog;
        this.SubmitComplaintDialog = true;
      }else if(this.getCookie("phone")===undefined){
        this.snackColor = "red accent-2";
        this.snackText = this.$t("SnackBar.PleaseLogin");
        this.snackIcon = "mdi-close-circle"
        this.snackbar = true;
      }
    },
    goToSubmitCommentDialog(){
      if(this.getCookie("phone")!=undefined) {
        this.SubmitCommentDialog = !this.SubmitCommentDialog;
        this.SubmitCommentDialog = true;
      }else if(this.getCookie("phone")===undefined){
        this.snackColor = "red accent-2";
        this.snackText = this.$t("SnackBar.PleaseLogin");
        this.snackIcon = "mdi-close-circle"
        this.snackbar = true;
      }
    },
    goToPrayerTimeDialog(){
      this.$root.$emit('goToPrayerTimeDialog', true);
      this.PrayerTimeDialog=!this.PrayerTimeDialog;
      this.PrayerTimeDialog = true;
      this.drawer=false;
    },
    managerLoginOrLogOut(){
      if(this.getCookie("managerUserId")===undefined || this.getCookie("managerUserId")==='undefined'){
        this.drawer=false;
        this.ManagerLoginDialog=!this.ManagerLoginDialog;
      }else if(this.getCookie("managerUserId")!=undefined){
        this.UnsubscribeToLogOutDialog = !this.UnsubscribeToLogOutDialog;
        this.UnsubscribeToLogOutDialog = true;
      }
    },
    managerLogOut(){
      document.cookie = "managerUserId=" + undefined;
      this.LoginAsManagerText = "ورود به عنوان مدیر سیستم"
      this.drawer = false;
      this.UnsubscribeToLogOutDialog = false;
    },
    setFalse(){
      if(this.drawer===false){
        this.$emit("setFalse",false);
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
  },


}
</script>
<style scoped>
.itemTitle{
  color: black;
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

</style>
