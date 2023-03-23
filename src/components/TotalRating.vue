<template>
  <v-row justify="center">
    <v-dialog v-model="TotalRating"  max-width="500px" eager @click:outside="setFalse()">
      <v-card style="background-color: white;height: 350px;">
        <div style="width: 100%;height: 100%;overflow: scroll">
          <div class="totalRating" @click="show()">
            <p id="yourRating">{{$t('AreaRatingDialog.YourRating')}}</p>
            <v-rating class="v-rating" id="yourRatingStars" v-model="ratingArray[0].rate" background-color="red" color="yellow accent-4" dense half-increments hover size="25"></v-rating>
          </div><br><br>
          <hr><br>
          <div id="Rating">
            <div id="personRating" v-for="r in otherRatingArray">
              <v-icon class="v-icon" size="80">mdi-account</v-icon>
              <p style=" position: relative;top: 70px;right: -70px;">{{r.nameOfVoter}}</p>
              <v-rating class="v-rating" v-model="r.rate" background-color="red" color="yellow accent-4" dense half-increments hover size="25" style=" position: relative;top: -30px;"></v-rating>

              <v-icon class="thumb-up" size="30" color="green" @click="setLike(r.midwayServiceAreaRatingId,r.islike)">mdi-thumb-up</v-icon>
              <p class="thumb-up-text">{{r.like}}</p>
              <v-icon class="thumb-down" size="30" color="red" @click="setDisLike(r.midwayServiceAreaRatingId,r.isdislike)">mdi-thumb-down</v-icon>
              <p class="thumb-down-text">{{r.dislike}}</p>

            </div>
          </div>
        </div>
        <v-snackbar  v-model="snackbar" :timeout="3000" :color="snackColor"  rounded="pill" style="text-align: center;margin: auto;min-width: 0 !important;width: 20px;font-family: IranSans;">
          <v-icon style="float:right;">{{ snackIcon }}</v-icon>
          {{ snackText }}
        </v-snackbar>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import axios from "axios";
import $ from "jquery";
export default {
  name: "TotalRating",
  props:{
    TotalRating:false,
    detail:Array,
    ratingArray:[],
    otherRatingArray:[],
  },
  data: () => ({
    rating:[],
    isReverse:true,
    averageRating:0,
    snackbar: false,
    snackText: "",
    snackIcon: "",
    snackColor: "",
  }),
  mounted() {
    if(this.$i18n.locale==='en') {
      $('#yourRating').css('float', 'left')
      $('#yourRatingStars').css('float', 'right')
    }
  },
  methods:{
    setLike(id,islike){
      console.log(this.otherRatingArray)
      var likeColor = "";
      if(islike === false){
        const formData = new FormData();
        formData.append('midwayServiceAreaRatingId', id);
        formData.append('offset',1);
        formData.append('cmd', "{'/MidwayServiceArea-portlet.midwayarearating/like-rating':{}}");
        axios.post('https://restareas.rmto.ir/api/jsonws/invoke', formData,
        ).then(response => {
          for(var i in this.otherRatingArray){
            if(this.otherRatingArray[i].midwayServiceAreaRatingId===id){
              this.otherRatingArray[i].like ++;
              this.otherRatingArray[i].islike = true
            }
          }
          likeColor = "green"
        }).catch(error => {
          this.errorMessage = error.message;
          this.snackColor = "red accent-2";
          this.snackText = this.$t("SnackBar.NetworkError");
          this.snackIcon = "mdi-close-circle";
          this.snackbar = true;
          console.error("There was an error!", error);
        });
      }else if(islike === true){
      }
    },
    setDisLike(id,isdislike){
      var dislike = false;
      var dislikeColor = "";
      if(isdislike === false){
        const formData = new FormData();
        formData.append('midwayServiceAreaRatingId', id);
        formData.append('offset',1);
        formData.append('cmd', "{'/MidwayServiceArea-portlet.midwayarearating/dislike-rating':{}}");
        axios.post('https://restareas.rmto.ir/api/jsonws/invoke', formData,
        ).then(response => {
          for(var i in this.otherRatingArray){
            if(this.otherRatingArray[i].midwayServiceAreaRatingId===id){
              this.otherRatingArray[i].dislike ++;
              this.otherRatingArray[i].isdislike = true
            }
          }
          dislikeColor = "red"
          dislike = true;
        }).catch(error => {
          this.errorMessage = error.message;
          this.snackColor = "red accent-2";
          this.snackText = this.$t("SnackBar.NetworkError");
          this.snackIcon = "mdi-close-circle";
          this.snackbar = true;
          console.error("There was an error!", error);
        });
      }else if(isdislike === true){
      }
    },
    setFalse(){
      this.$emit("setFalse",false);
    },
  },

}
</script>

<style scoped>
.totalRating{
  width: 90%;
  height: 50px;
  background-color: #fff;
  margin: auto;
  top: 30px;
  text-align: center;
  position: relative;
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
hr{
  width: 80%;
  margin: auto;
  color: black;
}
#Rating{
  height: 200px;
  width: 90%;
  background-color: #fff;
  margin: auto;
  display: block;
}
#personRating{
  height: 40%;
  width: 90%;
  background-color: #fff;
  margin: auto auto 40px auto;
}
.v-icon{
  float: right;
}
.thumb-up{
  font-size: 30px;
  position: relative;
  left: -160px;
  top: 20px;
}
.thumb-up-text{
  font-size: 20px;
  position: relative;
  left: -100px;
  top: 10px;
}
.thumb-down{
  font-size: 30px;
  position: relative;
  left: -125px;
  top: 20px;
}.thumb-down-text{
  font-size: 20px;
  position: relative;
  left: -60px;
  top: 10px;
}
</style>
