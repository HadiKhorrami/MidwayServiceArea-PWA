<template>
  <v-row justify="center">
    <v-dialog v-model="ManagerLoginDialog"   max-width="600px" eager @click:outside="setFalse">
      <v-card style="background-color: white;height: 450px">
        <v-icon style="margin: 10px" color="red" @click="setFalse()">mdi-close</v-icon>
        <div id="" style="width: 100%;height: 90%;font-family: IranSans">
          <p style="font-family: IranSans;text-align: center;font-size: 15px;top: 0px;position: relative;width: 80%;margin: auto;">مخصوص کارکنان سازمان راهداری و حمل و نقل جاده ای</p>
          <v-text-field class="textField" v-model="screenName"  label="نام نمایشی"   required :reverse="isReverse" color="red"  outlined style="min-height:0;height: 55px;position: relative;margin: 80px auto auto ;width: 80%;display: flex;" append-icon="mdi-account"/>
          <v-text-field class="textField" v-model="password" label="گذرواژه"   required :reverse="isReverse" color="red"  outlined style="min-height:0;height: 55px;position: relative;margin: 20px auto auto ;width: 80%;display: flex" append-icon="mdi-lock" type="password"></v-text-field>
          <v-btn id="editbtn" rounded dense style="height:45px;margin: 50px auto auto;background-color: #ffffff;color: green;position: relative;width: 80%;border: 1px green solid;display: flex" @click="login()">
            ورود به سیستم
            <v-icon dark right color="green">
              mdi-checkbox-marked-circle
            </v-icon></v-btn>
        </div>

      </v-card>
    </v-dialog>
    <v-snackbar  v-model="snackbar" :timeout="2000" :color="snackColor"  rounded="pill" style="text-align: center;margin: auto;min-width: 0 !important;width: 50px;font-family: IranSans">
      <v-icon style="float:right;">{{ snackIcon }}</v-icon>
      {{ snackText }}
    </v-snackbar>
  </v-row>
</template>
<script>
import axios from "axios";
import image1 from "../assets/round_local_parking_black_24.png";
import image2 from "../assets/round_location_on_black_36.png";

export default {
  name: "ManagerLoginDialog",
  props:{
    ManagerLoginDialog:false
  },
  data: () => ({
    ManagerLoginDialog:false,
    isReverse:true,
    screenName:"",
    password:"",
    snackbar:false,
    snackText:"",
    snackIcon:"",
    snackColor:"",
  }),
  mounted() {
    console.log(this.$i18n.locale)
  },
  methods:{
    login(){
      if(this.screenName === "" || this.password === ""){
        this.snackColor = "red accent-2";
        this.snackText = "نام نمایشی و گذرواژه را وارد کنید";
        this.snackIcon = "mdi-close-circle";
        this.snackbar = true;
      }else if(this.screenName != "" && this.password != ""){
        const formData = new FormData();
        formData.append('companyId', "20155");
        formData.append('screenName', this.screenName);
        formData.append('cmd', "{'/user/get-user-by-screen-name':{}}");
        axios.post('https://restareas.rmto.ir/api/jsonws/invoke', formData,{
          auth: {
            username: this.screenName,
            password: this.password
          }}
        ).then(response => {
          if(!response.data.exception){
            this.snackColor = "success";
            this.snackText = "ورود با موفقیت انجام شد";
            this.snackIcon = "mdi-check-circle";
            this.snackbar = true;
            var today = new Date();
            var expire = new Date();
            expire.setTime(today.getTime() + 3600000*24*14);
            document.cookie = "managerUserId=" + response.data.userId + ";expires="+expire.toGMTString();
            document.cookie = "managerScreenName=" + this.screenName + ";expires="+expire.toGMTString();;
            document.cookie = "managerPassword=" + this.password + ";expires="+expire.toGMTString();;
            this.setFalse();
          }else if(response.data.exception){
            this.snackColor = "red accent-2";
            this.snackText = this.$t("SnackBar.NetworkError");
            this.snackIcon = "mdi-close-circle";
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

    },

    setReverse(){
      if(this.$i18n.locale==='en'){
        this.isReverse=false;
      } else if(this.$i18n.locale==='fa'){
        this.isReverse=true;
      }
    },
    setFalse(){
        this.$emit("setFalse",false);
    },

  }
}
</script>

<style scoped>
.v-text-field--enclosed .v-input__append-inner{
  margin-top: 10px !important;
}

</style>
