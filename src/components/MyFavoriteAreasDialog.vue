<template>
  <v-row justify="center">
    <v-dialog v-model="MyFavoriteAreasDialog"   max-width="600px" eager @click:outside="setFalse">
      <v-card style="background-color: white;height: 500px;">
        <v-icon style="margin: 10px" color="red" @click="setFalse()">mdi-close</v-icon>
        <div style="width: 100%;height: 90%;overflow: scroll">
        <div v-if="interests.length > 0" v-for="i in interests" id="favoriteDiv">
          <p class="favoriteDialogText">{{i.data.name}}</p>
          <p class="favoriteDialogText">{{i.data.axis}}</p>
          <p class="favoriteDialogText">{{$t('MyAreasDialog.Side')}} {{i.data.side}}</p>
          <v-btn class="btn" @click="id=i.data.midwayServiceAreaInfoId;UnsubscribeToDeleteDialog=true"> {{$t('MyFavoriteAreasDialog.Delete')}}</v-btn>
          <v-btn class="btn" color="success" @click="id=i.data.midwayServiceAreaInfoId;openServiceDetail(i.response)"> {{$t('MyFavoriteAreasDialog.Show')}}</v-btn>
        </div>
          <p v-if="interests.length==0" id="noArea"  style="text-align: center;top: 60px;position: relative">{{$t('MyFavoriteAreasDialog.NoArea')}}</p>
          <v-progress-circular v-if="overlay" :size="70" :width="7"  color="blue" indeterminate style="position:fixed;margin-left: 40%;margin-top: 80%"></v-progress-circular>
        </div>

        <v-row justify="center">
          <v-dialog v-model="UnsubscribeToDeleteDialog" max-width="290" style="font-family: IranSans;text-align: center;padding-top: 20px;" eager>
            <v-card>
              <v-card-text style="font-family: IranSans;text-align: center;padding-top: 20px">
                میخواهید حذف کنید؟
              </v-card-text>

              <v-card-actions style="font-family: IranSans;">
                <v-spacer></v-spacer>
                <v-btn color="red darken-1" text @click="UnsubscribeToDeleteDialog = false" style="float: left;position: fixed">خیر</v-btn>
                <v-btn color="green darken-1" text @click="deleteFromFavorite(id)">بله</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
        <v-snackbar  v-model="snackbar" :timeout="3000" :color="snackColor"  rounded="pill" style="text-align: center;margin: auto;min-width: 0 !important;width: 50px;font-family: IranSans">
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
  name: "MyFavoriteAreasDialog",
  props:{
    MyFavoriteAreasDialog:false,
    areaNames:[]
  },
  data: () => ({
    UnsubscribeToDeleteDialog:false,
    interests:[],
    favoriteAreas:[],
    detail:{},
    overlay:false,
    id:0,
    side:"",
    snackbar: false,
    snackText: "",
    snackIcon: "",
    snackColor: "",
  }),
  mounted() {
    this.setMyFavoriteAreas()
  },
  methods:{
    setMyFavoriteAreas(){
      var th = this;
      this.$root.$off('goToMyFavoriteAreas');
      this.$root.$on('goToMyFavoriteAreas', (text) => {
          th.interests = [];
          console.log(th.interests)
          th.getPersonWithPicture();
      })
    },
    deleteFromFavorite(id){
      var th = this;
      this.UnsubscribeToDeleteDialog = false;
      this.interests = [];
      const formData = new FormData();
      formData.append('areaId', id);
      formData.append('mobileNumber',this.getCookie("phone"));
      formData.append('cmd', "{'/MidwayServiceArea-portlet.person/remove-from-favorite':{}}");
      axios.post('https://restareas.rmto.ir/api/jsonws/invoke', formData,
      ).then(response => {
        this.favoriteAreas = [];
        this.getPersonWithPicture();
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
      var th = this;

      this.overlay = true;
        const formData = new FormData();
        formData.append('mobileNumber', this.getCookie("phone"));
        formData.append('cmd', "{'/MidwayServiceArea-portlet.person/get-person-with-picture':{}}");
        axios.post('https://restareas.rmto.ir/api/jsonws/invoke', formData,{timeout:15000}
        ).then(response => {
          th.overlay = false
          this.favoriteAreas = [];
          this.favoriteAreas = response.data[0].interestedAreas.split(",");
          document.cookie = "userId=" + response.data[0].userId

          for (var f in th.favoriteAreas) {
            th.overlay = true;
            const formData = new FormData();
            formData.append('id', th.favoriteAreas[f]);
            formData.append('locale', "fa_IR");
            formData.append('dateInMiliseconds', true);
            formData.append('cmd', "{'/MidwayServiceArea-portlet.midwayareainfo/get-mid-way-service-area-with-documents-and-services-and-rate':{}}");
            axios.post('https://restareas.rmto.ir/api/jsonws/invoke', formData,
            ).then(response => {
              th.overlay = false
              if (th.$i18n.locale === 'fa' && response.data[0].side === 1) {
                response.data[0].side = "راست"
              } else if (th.$i18n.locale === 'en' && response.data[0].side === 1) {
                response.data[0].side = "right"
              } else if (th.$i18n.locale === 'fa' && response.data[0].side === 2) {
                response.data[0].side = "چپ"
              } else if (th.$i18n.locale === 'en' && response.data[0].side === 2) {
                response.data[0].side = "left"
              }
              this.interests.push({"data": response.data[0],"response":response})
              console.log(this.interests)
              if(this.interests.length===this.favoriteAreas.length){

              }

            }).catch(error => {
              this.errorMessage = error.message;
              console.error("There was an error!", error);
            });

          }

          console.log(response)
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
    openServiceDetail(response){
      this.$root.$emit('goToServiceDetail', this.favoriteAreas);
      this.$root.$emit('favoriteResponse', response);
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

  }
}
</script>

<style scoped>
#favoriteDiv{
  width: 85%;
  height: 170px;
  background-color: #414141;
  margin: auto;
  top: 20px;
  bottom: 20px;
  position: relative;
  box-shadow: 0px 2px 0px 0px cadetblue;
  overflow: scroll;
  margin-bottom: 15px;
  border-radius: 15px;
}
.favoriteDialogText{
  top: 10px;
  margin-bottom: 10px;
  position: relative;
  color: white;
}
.btn{
  font-family: IranSans;
  left: 25%;
  margin: 2px;
  color: white;
  bottom: -20px;
  background-color: crimson !important;
}
</style>
