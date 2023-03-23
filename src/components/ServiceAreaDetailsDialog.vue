<template>
  <v-row justify="center">
    <v-dialog  id="serviceAreaDetailsDialog" v-model="ServiceAreaDetailsDialog"  max-width="600px" @click:outside="setFalse()" >
      <v-card style="background-color: white;height: 700px;font-family: IranSans;overflow: scroll">
        <div style="width: 100%;height: 92%;overflow: scroll">
          <v-carousel hide-delimiters style="width: 100%;height: 250px;">
            <v-carousel-item v-for="(item,i) in slideArray" :key="i" eager >
              <v-img :src="item" height="300px" width="100%" eager/>
            </v-carousel-item>
          </v-carousel>
        <div style="width: 100%;height: 38%;top: 250px;font-size:small;">
          <p id="areaname"  style="font-family: IranSans;text-align: right;margin:10px;position: relative;font-weight: bold;font-size: 15px">{{areaname}}</p>
          <v-rating id="rating" v-model="detail.averageRating" background-color="orange lighten-3" color="orange" small dense style="float: right;margin-right: 10px;"></v-rating>
          <p id="ratingText" style="font-family: IranSans;text-align: right;margin-top:10px;margin-right:10px;position: relative;font-size: 12px">(بدون نظر)</p>

          <div style="width: 100%;height: 15%;display: inline-flex;justify-content: space-between;padding: 10px">
<!--            <div style="height: 80px;width: 60px;background-color: white;border-radius:10px">-->
<!--              <v-icon style="color: #0078A8;margin: 8px" size="40">mdi-share-variant</v-icon>-->
<!--              <p style="color: black;font-size: 13px">{{ $t('ServiceAreaDetailsDialog.Share') }}</p>-->
<!--            </div>-->
            <div style="height: 80px;width: 60px;background-color: white;border-radius:10px" @click="EditArea()">
              <v-icon style="color: olivedrab;margin: 8px" size="40">mdi-pencil</v-icon>
              <p style="color: black;font-size: 13px">{{ $t('ServiceAreaDetailsDialog.Edit') }}</p>
            </div>
            <div style="height: 80px;width: 60px;background-color: white;border-radius:10px" @click="addRating()">
              <v-icon style="color: darkorange;margin: 8px" size="40">mdi-star-outline</v-icon>
              <p style="color: black;font-size: 13px">{{ $t('ServiceAreaDetailsDialog.Rating') }}</p>
            </div>
            <div style="height: 80px;width: 60px;background-color: white;border-radius:10px" @click="addToFavorite()">
              <v-icon id="saveIcon" style="margin: 8px" :color="saveColor" size="40">mdi-heart</v-icon>
              <p style="color: black;font-size: 13px">{{ $t('ServiceAreaDetailsDialog.Save') }}</p>
            </div>
          </div>

          <p id="managerName" style="font-family: IranSans;text-align: right;margin:10px;position: relative;top: 50px;">{{managerName}}</p>
          <p id="axis" style="font-family: IranSans;text-align: right;margin:10px;position: relative;top: 50px">{{axis}}</p>
          <p id="km" style="font-family: IranSans;text-align: right;margin:10px;position: relative;top: 50px">{{km}}</p><br><br>
          <hr size="8" width="90%" color="grey" style="position: relative;margin: 20px">
        </div>
        <div style="width: 100%;height: 15%;top: 550px;margin-top: 65px">
          <p id="contactManager" style="font-family: IranSans;text-align: right;margin:10px;position: relative;top: -10px;direction: rtl;font-weight: bold;font-size: 15px">{{ $t("ServiceAreaDetailsDialog.ContactManager") }} :</p>
          <div style="display: inline-flex;justify-content: space-between;width: 100%;padding-left:30px;padding-right: 30px  ">
          <v-icon style="color:#0078A8" large>mdi-phone</v-icon>
          <v-icon style="color:#C7B198" large @click="callManager();">mdi-cellphone</v-icon>
            <a :href="gmail" style="text-decoration: none" target="_blank">
            <v-icon style="color:sandybrown" large>mdi-email</v-icon>
            </a>
          </div><br><br>
          <hr size="8" width="90%" color="grey" style="position: relative;margin: auto">
        </div>
        <div id="services" style="width: 100%;height: 50%;background-color:white;margin-top: 50px;text-align: center;overflow: scroll">
          <div v-for="i in services" style="width:70px;height: 80px;display:inline-block;margin-top: 10px;margin-right: 20px;position: relative" @click="serviceTypeClick(i.midwayServiceAreaServicesId)">
            <v-img :src="'data:application;base64,'+i.documents[0].base64File" style="width: 50px;display: flex;margin-left: 10px;position: absolute;top:0"></v-img>
            <p style="font-size: 10px;display: flex;justify-content: center;margin-top: 60px;bottom: 0;color: black;text-align: center">{{i.serviceTitle}}</p>
          </div>
        </div>
        <v-progress-circular id="progress" v-if="overlay" :size="70" :width="7" color="pink" indeterminate></v-progress-circular>
        </div>
        <v-card-actions style="background-color: #ff4646;height: 8%;position: relative;bottom: 0;right: 0;width: 100%;">
          <v-spacer></v-spacer>
          <v-btn color="white" text @click="setFalse()" style="font-family: IranSans;right: 40%">{{$t('AreaDetail.Close')}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" :timeout="3000" :color="snackColor" rounded="pill" style="text-align: center;margin: auto;min-width: 0 !important;width: 50px;font-family: IranSans;">
      <v-icon style="float:right;">{{ snackIcon }}</v-icon>
      {{ snackText }}
    </v-snackbar>
    <AreaRatingDialog :AreaRatingDialog="AreaRatingDialog" :services="services" :detail="detail" @setFalse="setChildFalse"/>
    <TotalRating :TotalRating="TotalRating" :detail="detail" :ratingArray="ratingArray" :otherRatingArray="otherRatingArray" @setFalse="setChildFalse"/>
    <AreaSubServices :AreaSubServices="AreaSubServices" :detail="detail" :subServiceArray="subServiceArray" @setFalse="setChildFalse"/>
    <SelectAreaForAddEditDeleteDialog :SelectAreaForAddEditDeleteDialog="SelectAreaForAddEditDeleteDialog" :detail="detail"/>
  </v-row>
</template>

<script>
import AreaRatingDialog from './AreaRatingDialog.vue'
import SelectAreaForAddEditDeleteDialog from './SelectAreaForAddEditDeleteDialog.vue'
import TotalRating from './TotalRating.vue'
import AreaSubServices from './AreaSubServices.vue'
import $ from 'jquery'
import axios from "axios";
export default {
  name: "ServiceAreaDetailsDialog",
  props:{
    ServiceAreaDetailsDialog:false,
    SelectAreaForAddEditDeleteDialog:false,
    AreaRatingDialog:false,
    AreaSubServices:false,
    TotalRating:false,
    slideArray:[],
    ratingArray:[],
    otherRatingArray:[],
    subServiceArray:[],
    areaname:"",
    managerName:"",
    axis:"",
    km:"",
    detail:{},
    saveColor:String,
    services:[],
    snackbar:false,
  },
  data: () => ({
    areaname:"",
    managerName:"",
    axis:"",
    km:"",
    overlay:true,
    snackText:"",
    snackIcon:"",
    snackColor:"",
    favoriteAreas:[],
    rating:0,
    gmail:"https://mail.google.com/mail/?view=cm&fs=1&to=" + this.detail.emailAddress + "&cc=someone@ola.example&bcc=someone.else@example.com&su=SUBJECT&body=BODY"
  }),
  components:{
    AreaRatingDialog,
    TotalRating,
    AreaSubServices,
    SelectAreaForAddEditDeleteDialog,
  },
  methods: {
    addToFavorite() {
      if (this.getCookie("phone") === undefined || this.getCookie("phone") === 'undefined') {
        this.snackColor = "red accent-2";
        this.snackText = this.$t("SnackBar.PleaseLogin");
        this.snackIcon = "mdi-close-circle"
        this.snackbar = true;
      } else {
        if (this.saveColor === '') {
          const formData = new FormData();
          console.log(this.getCookie("phone") + "///" + this.detail.midwayServiceAreaInfoId)
          formData.append('mobileNumber', this.getCookie("phone"));
          formData.append('areaId', this.detail.midwayServiceAreaInfoId);
          formData.append('cmd', "{'/MidwayServiceArea-portlet.person/add-to-favorite':{}}");
          axios.post('https://restareas.rmto.ir/api/jsonws/invoke', formData,
          ).then(response => {
            if (response.data) {
              this.saveColor = 'green';
              this.snackColor = "success";
              this.snackText = this.$t("SnackBar.FavoriteAdded");
              this.snackIcon = "mdi-check-circle"
              this.snackbar = true;
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
        } else if (this.saveColor === 'green') {
          const formData = new FormData();
          formData.append('mobileNumber', this.getCookie("phone"));
          formData.append('areaId', this.detail.midwayServiceAreaInfoId);
          formData.append('cmd', "{'/MidwayServiceArea-portlet.person/remove-from-favorite':{}}");
          axios.post('https://restareas.rmto.ir/api/jsonws/invoke', formData,
          ).then(response => {
            if (response.data) {
              this.saveColor = '';
              this.snackColor = "red accent-2";
              this.snackText = this.$t("SnackBar.FavoriteDeleted");
              this.snackIcon = "mdi-close-circle"
              this.snackbar = true;
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
        }
      }
    },
    addRating() {
      if (this.getCookie("phone") != undefined) {
        if (this.detail.averageRating === "0") {
          this.$root.$emit('goToAreaRatingDialog', true);
          this.AreaRatingDialog = !this.AreaRatingDialog;
          this.AreaRatingDialog = true;
        } else {
          this.otherRatingArray = [];
          const formData = new FormData();
          formData.append('locale', "fa_IR");
          formData.append('midwarServiceAreaInfoId', this.detail.midwayServiceAreaInfoId);
          formData.append('companyId', "20155");
          formData.append('cmd', "{'/MidwayServiceArea-portlet.midwayarearating/get-area-all-rating':{}}");
          axios.post('https://restareas.rmto.ir/api/jsonws/invoke', formData,
          ).then(response => {
            for (var i = 0; i < response.data.length; i++) {
              response.data[i]["islike"] = false;
              response.data[i]["isdislike"] = false;
              this.otherRatingArray.push(response.data[i]);
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
          this.TotalRating = !this.TotalRating;
          this.TotalRating = true;
        }
      }else if (this.getCookie("phone") === undefined || this.getCookie("phone") === 'undefined') {
        this.snackColor = "red accent-2";
        this.snackText = this.$t("SnackBar.PleaseLogin");
        this.snackIcon = "mdi-close-circle";
        this.snackbar = true;
      }
    },
    callManager() {
      window.open('tel:' + this.detail.investorMobileNumber);
    },
    EditArea() {
      console.log(this.getCookie("phone"))
      console.log(this.getCookie("managerUserId"))
      if (this.getCookie("managerUserId") === undefined || this.getCookie("managerUserId") === 'undefined' && this.getCookie("phone") != undefined) {
        const formData = new FormData();
        formData.append('areaId', this.detail.midwayServiceAreaInfoId);
        formData.append('mobileNumber', this.getCookie("phone"));
        formData.append('cmd', "{'/MidwayServiceArea-portlet.person/has-access-to-edit-delete-area-with-mobile':{}}");
        axios.post('https://restareas.rmto.ir/api/jsonws/invoke', formData,
        ).then(response => {
          if(response.data[0].hasAccess==="false"){
            this.snackColor = "red accent-2";
            this.snackText = this.$t("SnackBar.EditAccess");
            this.snackIcon = "mdi-close-circle";
            this.snackbar = true;
          }else if(response.data[0].hasAccess==="true"){
            this.$root.$emit('goToEditArea', true);
            this.SelectAreaForAddEditDeleteDialog = !this.SelectAreaForAddEditDeleteDialog;
            this.SelectAreaForAddEditDeleteDialog = true;
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
      } else if (this.getCookie("managerUserId") != 'undefined') {
        this.$root.$emit('goToEditArea', true);
        this.SelectAreaForAddEditDeleteDialog = !this.SelectAreaForAddEditDeleteDialog;
        this.SelectAreaForAddEditDeleteDialog = true;
      }else if (this.getCookie("managerUserId") === 'undefined' && this.getCookie("phone") === undefined){
        this.snackColor = "red accent-2";
        this.snackText = this.$t("SnackBar.PleaseLogin");
        this.snackIcon = "mdi-close-circle";
        this.snackbar = true;
      }
    },
    serviceTypeClick(id){
      this.getSubServices(id);
    },
    getSubServices(id){
      this.subServiceArray = [];
      this.overlay = true;
      const formData = new FormData();
      formData.append('companyId', "20155");
      formData.append('areaId', this.detail.midwayServiceAreaInfoId);
      formData.append('locale', "fa_IR");
      formData.append('cmd', "{'/MidwayServiceArea-portlet.midwayareatype/get-sub-services':{}}");
      axios.post('https://restareas.rmto.ir/api/jsonws/invoke', formData,{timeout: 5000}
      ).then(response => {
        this.overlay = false;
        for(var i = 0;i<response.data.length;i++){
          if (response.data[i].selected && response.data[i].selected === true) {
            response.data[i]["color"] = "green"
            response.data[i]["has"] = "دارد"
          } else {
            response.data[i]["color"] = "red"
            response.data[i]["has"] = "ندارد"
          }
          if('selected' in response.data[i] && response.data[i].parentMidwayServiceAreaServicesId===parseInt(id)){
            this.subServiceArray.push(response.data[i])
          }
        }
        this.AreaSubServices = !this.AreaSubServices;
        this.AreaSubServices = true;
      }).catch(error => {
        this.errorMessage = error.message;
        this.snackColor = "red accent-2";
        this.snackText = this.$t("SnackBar.NetworkError");
        this.snackIcon = "mdi-close-circle";
        this.snackbar = true;
        console.error("There was an error!", error);
      });
    },
    setFalse(value){
      this.$emit("setFalse",false);
    },
    setChildFalse(value){
      this.AreaSubServices = value;
      this.TotalRating = value;
      this.AreaRatingDialog = value;
    },
    getCookie(name) {
      let cookie = {};
      document.cookie.split(';').forEach(function (el) {
        let [k] = el.split('=');
        cookie[k.trim()] = el.substring(k.length + 1);
      })
      return cookie[name];
    },
  },
}
</script>

<style scoped>
p{
  text-align: center;
}
.v-application--is-ltr .v-text-field--reverse .v-label{
  font-size: 15px;
}
#progress{
  position: absolute;
  margin-left: 100px;
  margin-top: 200px;
}
</style>
