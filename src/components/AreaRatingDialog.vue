<template>
  <v-row justify="center">
    <v-dialog v-model="AreaRatingDialog"  max-width="500px" eager @click:outside="setFalse()">
      <v-card style="background-color: white;height: 500px;">
        <v-icon style="margin: 10px" color="red" @click="setFalse()">mdi-close</v-icon>
        <div style="width: 100%;height: 82%;background-color: #fff;display: block;overflow:scroll;">
          <span style="margin: 5px;font-family: IranSans;text-align: center">{{$t('AreaRatingDialog.Title')}}</span>
          <div class="ratingDiv" v-for="(s,index) in services">
            <p class="serviceTitle">{{s.serviceTitle}}</p>
            <v-rating class="v-rating" v-model="rating[index]" @click="print()" background-color="purple" color="yellow accent-4" dense half-increments hover size="18"></v-rating>
          </div>
          <v-textarea class="v-textarea" v-bind:label="$t('AreaRatingDialog.Comment')" v-model="desc" rows="4" :reverse="isReverse" outlined dense></v-textarea>
        </div>
        <v-card-actions
            style="background-color: purple;height: 50px;position: relative;bottom: 0;right: 0;width: 100%;">
          <v-spacer></v-spacer>
          <v-btn color="white" text @click="addMidwayServiceAreaRating()" style="font-family: IranSans;">
            {{$t('AreaRatingDialog.Confirm')}}
          </v-btn>
        </v-card-actions>
        <v-snackbar  v-model="snackbar" :timeout="3000" :color="snackColor"  rounded="pill" style="text-align: center;margin: auto;min-width: 0 !important;width: 20px;font-family: IranSans;" @click:outside="setFalse()">
          <v-icon style="float:right;">{{ snackIcon }}</v-icon>
          {{ snackText }}
        </v-snackbar>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import axios from "axios";

export default {
  name: "AreaRatingDialog",
  props:{
    AreaRatingDialog:false,
    services:Array,
    detail: Array,
  },
  data: () => ({
    rating:[],
    totalRating:0,
    desc:"",
    isReverse:true,
    snackbar:false,
    snackText:"",
    snackIcon:"",
    snackColor:"",
  }),
  components:{
  },
  mounted() {
    var th = this;
    this.$root.$on('goToEditImages', (text) => {
      if(text===true){
        th.rating = [];
      }
    })
    this.setReverse();
  },
  methods:{
    setReverse(){
      if(this.$i18n.locale==='en'){
        this.isReverse=false;
      } else if(this.$i18n.locale==='fa'){
        this.isReverse=true;
      }
    },
    addMidwayServiceAreaRating(){
      var th = this;
      this.rating.forEach(e=>{
        th.totalRating += e
      })
      this.totalRating = this.totalRating/this.rating.length
      const formData = new FormData();
      formData.append('userId', this.getCookie("phone"));
      formData.append('midwarServiceAreaInfoId', this.detail.midwayServiceAreaInfoId);
      formData.append('stars', this.totalRating.toFixed());
      formData.append('desc', this.desc);
      formData.append('locale', "fa_IR");
      formData.append('cmd', "{'/*************.midwayarearating/add-midway-service-area-rating':{}}");
      axios.post('*************', formData,
      ).then(response => {
        if(response.data.length===1){
          this.snackColor = "success";
          this.snackText = this.$t("SnackBar.RegisterVote");
          this.snackIcon = "mdi-check-circle";
          this.snackbar = true;
        }
        console.log(response)
      }).catch(error => {
        this.errorMessage = error.message;
        console.error("There was an error!", error);
      });
    },
    setFalse(){
      this.$emit("setFalse",false);
    },
    getCookie(name) {
      let cookie = {};
      document.cookie.split(';').forEach(function(el) {
        let [k] = el.split('=');
        cookie[k.trim()] = el.substring(k.length + 1);
      })
      return cookie[name];
    },
  }
}
</script>

<style scoped>
.ratingDiv{
  width: 90%;
  height: 50px;
  background-color: #fff;
  margin: 10px auto 10px auto;
  text-align: center;
}
.totalRating{
  width: 90%;
  height: 50px;
  background-color: #fff;
  margin: 10px auto 10px auto;
  text-align: center;
}
.v-rating{
  float: left;
  margin-top: 10px;
}
p{
position: relative;
  float: right;
  margin-top: 10px;
}
.v-textarea{
  font-family: IranSans;
  width: 90%;
  height: 20%;
  position: relative;
  display: grid;
  margin: auto;
}
span{
  margin: 10px;
  font-family: IranSans;
  text-align: center;
  display: flex;
  justify-content: center;
  font-weight: bold;
}
hr{
  width:80%;
  margin: auto;
}
</style>
