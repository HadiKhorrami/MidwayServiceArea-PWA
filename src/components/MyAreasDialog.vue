<template>
  <v-row justify="center">
    <v-dialog v-model="MyAreasDialog"   max-width="600px" @click:outside="setFalse">
      <v-card style="background-color: white;height: 500px;">
        <v-icon style="margin: 10px" color="red" @click="setFalse()">mdi-close</v-icon>
        <div style="height: 90%;width: 100%;overflow:scroll;">
        <div v-for="i in myAreas" id="myAreasDiv">
          <p class="myAreasDialogText">{{i.name}}</p>
          <p class="myAreasDialogText">{{i.axis}}</p>
          <p class="myAreasDialogText">{{$t('MyAreasDialog.Side')}} {{side}}</p>

          <v-btn class="btn" @click="goToEdit(i)"> {{$t('MyAreasDialog.Edit')}}</v-btn>
        </div>
          </div>
        <p v-if="myAreas.length==0" id="noArea" style="text-align: center;top: 60px;position: relative">{{$t('MyFavoriteAreasDialog.NoArea')}}</p>
        <v-snackbar  v-model="snackbar" :timeout="3000" :color="snackColor"  rounded="pill" style="text-align: center;margin: auto;min-width: 0 !important;width: 50px;font-family: IranSans">
          <v-icon style="float:right;">{{ snackIcon }}</v-icon>
          {{ snackText }}
        </v-snackbar>
      </v-card>
    </v-dialog>
    <SelectAreaForAddEditDeleteDialog :SelectAreaForAddEditDeleteDialog="SelectAreaForAddEditDeleteDialog"/>
  </v-row>
</template>

<script>
import SelectAreaForAddEditDeleteDialog from './SelectAreaForAddEditDeleteDialog.vue'
import axios from "axios";

export default {
  name: "MyAreasDialog",
  props:{
    MyAreasDialog:false,
    SelectAreaForAddEditDeleteDialog:false,
    myAreas:[]
  },
  data: () => ({
    MyAreasDialog:false,
    id:"",
    side:"",
    snackbar: false,
    snackText: "",
    snackIcon: "",
    snackColor: "",
  }),
components:{
  SelectAreaForAddEditDeleteDialog
},
  methods:{
    goToEdit(detail){
      this.$root.$emit('goToEditFromMyArea', detail);
      this.SelectAreaForAddEditDeleteDialog = !this.SelectAreaForAddEditDeleteDialog;
      this.SelectAreaForAddEditDeleteDialog = true;
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
#myAreasDiv{
  width: 85%;
  height: 170px;
  background-color: #414141;
  margin: auto;
  top: 20px;
  position: relative;
  box-shadow: 0px 2px 0px 0px cadetblue;
  margin-bottom: 15px;
  border-radius: 15px;
}
.myAreasDialogText{
  top: 10px;
  margin-bottom: 10px;
  position: relative;
  color: white;
}
.btn{
  font-family: IranSans;
  left: 35%;
  color: white;
  bottom: -20px;
  background-color: crimson !important;
}
</style>
