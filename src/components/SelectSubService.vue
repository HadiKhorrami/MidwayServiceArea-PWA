<template>
  <v-row justify="center">
    <v-dialog v-model="SelectSubService" max-width="600px" persistent @click:outside="close()">
      <v-card style="background-color: white;height: 400px;font-family: IranSans;">
        <v-icon style="margin: 10px;" color="red" @click="close()">mdi-close</v-icon>
        <div id="selectedType">
          <div v-for="s in selectedTypes" style="width: 100%;height: 50%;">
            <p>{{s.title}}</p>
            <hr>
          <v-checkbox :label="ss.name" style="direction: rtl;color: black" v-for="ss in s.sub" @change="setServicesForJson(ss.midwayServiceAreaTypeId,$event);" :input-value="ss.isChecked" >
          </v-checkbox>
          </div>
        </div>
        <v-card-actions
            style="background-color: purple;height: 10%;position: relative;bottom: 0;right: 0;width: 100%;">
          <v-spacer></v-spacer>
          <v-btn color="white" text @click="insertOrUpdateArea();" style="font-family: IranSans;">{{btnText}}</v-btn>
        </v-card-actions>
        <v-snackbar  v-model="snackbar" :timeout="2000" :color="snackColor"  rounded="pill" style="text-align: center;margin: auto;min-width: 0 !important;width: 50px;font-family: IranSans">
          <v-icon style="float:right;">{{ snackIcon }}</v-icon>
          {{ snackText }}
        </v-snackbar>
      </v-card>
    </v-dialog>
    <AddServiceType :AddServiceType="AddServiceType"/>
    <UnsubscribeToAddDialog :UnsubscribeToAddDialog="UnsubscribeToAddDialog"/>
    <UnsubscribeToEditDialog :UnsubscribeToEditDialog="UnsubscribeToEditDialog"/>
    <AddAreaImagesDialog :AddAreaImagesDialog="AddAreaImagesDialog" :addedResponse="addedResponse"/>
  </v-row>
</template>

<script>
import $ from "jquery";
import AddServiceType from './AddServiceType.vue'
import UnsubscribeToAddDialog from './UnsubscribeToAddDialog.vue'
import AddAreaImagesDialog from './AddAreaImagesDialog.vue'
import axios from "axios";
import UnsubscribeToEditDialog from "./UnsubscribeToEditDialog.vue";

export default {
  name: "SelectSubService",
  props: {
    SelectSubService: false,
    AddServiceType: false,
    AddAreaImagesDialog: false,
    UnsubscribeToAddDialog: false,
    UnsubscribeToEditDialog: false,
    serviceAreaJson:{},
    addedResponse:{},
    editResponse:{},
    selectedTypes: [],
  },
  data: () => ({
    newArray: [],
    checkbox: false,
    isChecked:false,
    snackbar: false,
    snackText: "",
    snackIcon: "",
    snackColor: "",
    btnText:"بعدی"
  }),
  components: {
    AddServiceType,
    UnsubscribeToAddDialog,
    AddAreaImagesDialog,
    UnsubscribeToEditDialog
  },
  updated() {
    var th = this;
    console.log(this.selectedTypes)
    this.$root.$on('goToSubService', (text) => {
      if(text===true && this.getCookie("isEdit")==="true"){
        th.btnText = "اتمام ویرایش"
        th.setchecked();
      }
    })
  },

  methods: {
    setServicesForJson(midwayServiceAreaTypeId, event) {
      console.log(this.serviceAreaJson)
      if(this.getCookie("isEdit")==="false"){
        for (var i = 0; i < this.selectedTypes.length; i++) {
          for (var j = 0; j < this.selectedTypes[i].sub.length; j++) {
            if (event === true && midwayServiceAreaTypeId === this.selectedTypes[i].sub[j].midwayServiceAreaTypeId) {
              this.serviceAreaJson.services += this.selectedTypes[i].sub[j].midwayServiceAreaTypeId + ","
            }else if (event === false){
              this.serviceAreaJson.services = this.serviceAreaJson.services.replace(midwayServiceAreaTypeId + ',','');
            }
          }
        }
      }else if(this.getCookie("isEdit")==="true"){
        for (var i = 0; i < this.selectedTypes.length; i++) {
          for (var j = 0; j < this.selectedTypes[i].sub.length; j++) {
            if (event === true && midwayServiceAreaTypeId === this.selectedTypes[i].sub[j].midwayServiceAreaTypeId) {
              this.selectedTypes[i].sub[j]["isChecked"] = true;
            }else if (event === false && midwayServiceAreaTypeId === this.selectedTypes[i].sub[j].midwayServiceAreaTypeId){
              this.selectedTypes[i].sub[j].isChecked = false;
           }
          }
        }
      }

      console.log(this.selectedTypes)
    },
    insertOrUpdateArea() {
      var th = this;
        if (this.getCookie("isEdit")==="false") {
          const formData = new FormData();
          formData.append('serviceAreaJson', JSON.stringify(this.serviceAreaJson));
          formData.append('cmd', "{'/*************.midwayareainfo/add-midway-service-area':{}}");
          axios.post('*************', formData,
          ).then(response => {
            this.addedResponse = response.data[0];
            console.log(this.addedResponse)
            console.log(response)
          })
              .catch(error => {
                this.errorMessage = error.message;
                console.error("There was an error!", error);
              });
          this.AddAreaImagesDialog=true
        }else if (this.getCookie("isEdit")==="true") {
          var serviceIds = "";
          var serviceIdsArray=[];
          for (var i = 0; i < this.selectedTypes.length; i++) {
          for (var j = 0; j < this.selectedTypes[i].sub.length; j++) {
            if(this.selectedTypes[i].sub[j].isChecked==="true" || this.selectedTypes[i].sub[j].isChecked===true && this.selectedTypes[i].sub[j].midwayServiceAreaTypeId!=this.selectedTypes[i].sub[j].parentMidwayServiceAreaServicesId){
              serviceIds += this.selectedTypes[i].sub[j].midwayServiceAreaTypeId + ",";
              serviceIdsArray = serviceIds.split(",");
              serviceIdsArray.splice(serviceIdsArray.length-1,1)
              serviceIdsArray = serviceIdsArray.map(Number)
              console.log(serviceIdsArray)
                if(!serviceIdsArray.includes(this.selectedTypes[i].sub[j].parentMidwayServiceAreaServicesId)){
                  serviceIds += this.selectedTypes[i].sub[j].parentMidwayServiceAreaServicesId + ",";
                }
            }
          }
        }
        console.log(serviceIds)
        const formData = new FormData();
        formData.append('companyId', '20155');
        formData.append('areaId', this.editResponse.midwayServiceAreaInfoId);
        formData.append('subServices', serviceIds.slice(0,-1));
        formData.append('cmd', "{'/*************.midwayareadetail/set-sub-services':{}}");
        axios.post('*************', formData,
        ).then(response => {
          if(response.data.length>0){
            this.snackColor = "success";
            this.snackText = this.$t("SnackBar.ServicesEdited");
            this.snackIcon = "mdi-check-circle"
            this.snackbar = true;
          }
          setTimeout(this.goToHome(), 3000);
          console.log(response)
        })
            .catch(error => {
              this.errorMessage = error.message;
              console.error("There was an error!", error);
            });
      }
    },
    setchecked() {
      var subServiceIds = [];
      this.editResponse.serviceIds = "";

      for (var e = 0; e < this.editResponse.services.length; e++) {
        if(this.editResponse.services[e].selected===true){
          this.editResponse.serviceIds += this.editResponse.services[e].midwayServiceAreaTypeId + ","
        }
      }
      subServiceIds = this.editResponse.serviceIds.split(",");

      for (var j = 0; j < subServiceIds.length; j++) {
        for (var k = 0; k < this.selectedTypes.length; k++) {
          for (var s = 0; s < this.selectedTypes[k].sub.length; s++) {
            if (this.selectedTypes[k].sub[s].midwayServiceAreaTypeId === parseInt(subServiceIds[j])) {
              this.selectedTypes[k].sub[s]["isChecked"] = true;
        }
      }
    }
  }
      console.log(this.selectedTypes)
    },
    getCookie(name) {
      let cookie = {};
      document.cookie.split(';').forEach(function(el) {
        let [k] = el.split('=');
        cookie[k.trim()] = el.substring(k.length + 1);
      })
      return cookie[name];
    },
    close(){
      if (this.getCookie("isEdit")==="false") {
        this.UnsubscribeToAddDialog = !this.UnsubscribeToAddDialog;
        this.UnsubscribeToAddDialog = true;
      }else if (this.getCookie("isEdit")==="true"){
        this.UnsubscribeToEditDialog = !this.UnsubscribeToEditDialog;
        this.UnsubscribeToEditDialog = true;
      }
    },
    goToHome(){
      location.href="/#/"
    }
  },

}
</script>

<style scoped>
#selectedType{
  width: 100%;
  height: 80%;
  display: grid;
  overflow: scroll;
}
p{
  margin: 10px auto auto auto;
  text-align: center;
  color: #0078A8;
}
hr{
  width: 80%;
  margin: 5px auto auto auto;
  background-color: #0078A8;
  height: 3px;
}
</style>
