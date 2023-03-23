<template>
  <v-row justify="center">
    <v-dialog v-model="AddServiceType" max-width="600px" persistent @click:outside="close()">
      <v-card style="background-color: white;height: 400px;font-family: IranSans;">
        <v-icon style="height:5%;margin-left: 10px;margin-top: 5px" color="red" @click="close()">mdi-close</v-icon>
        <div id="typeDiv">

        </div>
        <v-card-actions
            style="background-color: purple;height: 10%;position: relative;bottom: 0;right: 0;width: 100%;">
          <v-spacer></v-spacer>
          <v-btn color="white" text @click="btnClick();SelectSubService=!SelectSubService;SelectSubService=true;" style="font-family: IranSans;">
            انتخاب
          </v-btn>
        </v-card-actions>
        <v-snackbar  v-model="snackbar" :timeout="3000" :color="snackColor"  rounded="pill" style="text-align: center;margin: auto;min-width: 0 !important;width: 50px;font-family: IranSans">
          <v-icon style="float:right;">{{ snackIcon }}</v-icon>
          {{ snackText }}
        </v-snackbar>
      </v-card>
    </v-dialog>
    <SelectSubService :SelectSubService="SelectSubService" :AddServiceType="AddServiceType" :selectedTypes="selectedTypes" :serviceAreaJson="serviceAreaJson" :editResponse="editResponse" :allTypes="allTypes"/>
    <UnsubscribeToAddDialog :UnsubscribeToAddDialog="UnsubscribeToAddDialog"/>
    <UnsubscribeToEditDialog :UnsubscribeToEditDialog="UnsubscribeToEditDialog"/>
  </v-row>
</template>

<script>
import axios from "axios";
import $ from "jquery";
import SelectSubService from './SelectSubService.vue'
import UnsubscribeToAddDialog from './UnsubscribeToAddDialog.vue'
import UnsubscribeToEditDialog from './UnsubscribeToEditDialog.vue'

export default {
  name: "AddServiceType",
  props:{
    AddServiceType:false,
    SelectSubService:false,
    UnsubscribeToAddDialog:false,
    UnsubscribeToEditDialog:false,
    serviceAreaJson:{},
    editResponse:{},
    allTypes:[],
  },
  data: () => ({
    serviceTypes:[],
    selectedTypes:[],
    snackbar: false,
    snackText: "",
    snackIcon: "",
    snackColor: "",
  }),
  components:{
    SelectSubService,
    UnsubscribeToAddDialog,
    UnsubscribeToEditDialog
  },
  updated() {
    var th = this;
      this.$root.$off("goToEditService");
      this.$root.$on("goToEditService",function (item){
        if(item===true){
          th.getMidWayServiceAreaTypes("edit");
        }
      })
  },
  mounted() {
    var th = this;
    this.$root.$off("goToAddService");
    this.$root.$on("goToAddService",function (item){
      if(item===true){
        th.getMidWayServiceAreaTypes("add");
      }
    })
  },
  methods:{
    btnClick(){
      console.log(this.selectedTypes)
      this.$root.$emit('goToSubService', true);
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
    serviceTypeClick(){
      var th = this;
      $("#typeDiv").empty();
      const formData = new FormData();
      formData.append('locale', "fa_IR");
      formData.append('companyId', "20155");
      formData.append('areaId', th.editResponse.midwayServiceAreaInfoId);
      formData.append('cmd', "{'/MidwayServiceArea-portlet.midwayareatype/get-sub-services':{}}");
      axios.post('https://restareas.rmto.ir/api/jsonws/invoke', formData,
      ).then(response => {
        th.editResponse.services = response.data;
        console.log(response)
      })
          .catch(error => {
            th.errorMessage = error.message;
            this.snackColor = "red accent-2";
            this.snackText = this.$t("SnackBar.NetworkError");
            this.snackIcon = "mdi-close-circle";
            this.snackbar = true;
            console.error("There was an error!", error);
          });
      th.addServiceTypesToDiv();
      $(".type").on('click', function (e) {
        if(e.currentTarget.style.backgroundColor==="rgb(255, 255, 255)" || e.currentTarget.style.backgroundColor==="white"){
          e.currentTarget.style.backgroundColor="rgb(127, 190, 181)";
          th.selectedTypes.push({parentID: e.currentTarget.id,title:e.currentTarget.title,sub:[]})
          // th.serviceAreaJson.services += e.currentTarget.id + ","
          for(var i = 0;i<th.allTypes.length;i++) {
            if (parseInt(e.currentTarget.id) === th.allTypes[i].parentMidwayServiceAreaServicesId && th.allTypes[i].parentMidwayServiceAreaServicesId!=th.allTypes[i].midwayServiceAreaTypeId) {
              th.selectedTypes[th.selectedTypes.length - 1].sub.push(th.allTypes[i])
            }
          }
          console.log(th.selectedTypes)
        }else{
          e.currentTarget.style.backgroundColor="rgb(255, 255, 255)"
          for(var j=0;j<th.selectedTypes.length;j++){
            // th.selectedTypes.forEach((item, index)=>{
            console.log(th.selectedTypes[j])
            console.log(e.currentTarget.id)
            if(th.selectedTypes[j].parentID === e.currentTarget.id){
              console.log(j)
              th.selectedTypes.splice(j,1);
            }
          }
          console.log(th.selectedTypes)
        }
      });
    },
    addServiceTypesToDiv() {
      var th = this
      console.log(th.editResponse.services)
      console.log(th.serviceTypes)
      for (var i = 0; i < th.serviceTypes.length; i++) {
        var div = document.createElement("div");
        let label = document.createElement("label");
        let img = document.createElement("img");
        div.style.width = "70px"
        div.style.height = "80px"
        div.style.display = "inline-block"
        div.id = th.serviceTypes[i].midwayServiceAreaTypeId;
        div.title = th.serviceTypes[i].name;
        div.style.backgroundColor= "rgb(255, 255, 255)";
        for (var j = 0; j < th.editResponse.services.length; j++) {
          if (th.editResponse.services[j].midwayServiceAreaServicesId === parseInt(div.id)) {
            div.style.backgroundColor = "rgb(127, 190, 181)"
            th.selectedTypes.push({parentID: div.id, title: div.title, sub: []})
          }
        }
        div.style.marginTop = "10px"
        div.style.marginRight = "20px"
        div.style.position = "relative"
        div.className = "type";
        div.style.borderRadius = "3px";
        label.textContent = th.serviceTypes[i].name;
        label.style.fontFamily = "IranSans";
        label.style.fontSize = "10px";
        label.style.display = "flex";
        label.style.justifyContent = "center";
        label.style.marginTop = "60px";
        label.style.bottom = "0";
        label.style.color = "black";
        label.style.textAlign = "center";
        img.src = "data:application;base64," + th.serviceTypes[i].documents[0].base64File;
        img.style.width = "100px"
        img.style.width = "50px"
        img.style.display = "flex"
        img.style.marginLeft = "10px"
        img.style.position = "absolute"
        img.style.top = "0"
        div.appendChild(label);
        div.appendChild(img);
        console.log(document.getElementById("typeDiv"))
        document.getElementById("typeDiv").appendChild(div);
      }
      for (var a = 0; a < th.allTypes.length; a++) {
        for (var s = 0; s < th.selectedTypes.length; s++) {
          if (parseInt(th.selectedTypes[s].parentID) === th.allTypes[a].parentMidwayServiceAreaServicesId && th.allTypes[a].parentMidwayServiceAreaServicesId!=th.allTypes[a].midwayServiceAreaTypeId) {
            th.selectedTypes[s].sub.push(th.allTypes[a])
          }
        }
      }

      console.log(th.selectedTypes)
    },
    serviceTypeForAddClick(){
      var th = this;
      $("#typeDiv").empty();
      this.addServiceTypesForAddToDiv();
      th.selectedTypes=[];
      $(".type").on('click', function (e) {
        if(e.currentTarget.style.backgroundColor==="rgb(255, 255, 255)" || e.currentTarget.style.backgroundColor==="white"){
          e.currentTarget.style.backgroundColor="rgb(127, 190, 181)";
          th.selectedTypes.push({parentID: e.currentTarget.id,title:e.currentTarget.title,sub:[]})
          th.serviceAreaJson.services += e.currentTarget.id + ","
          for(var i = 0;i<th.allTypes.length;i++) {
            if (parseInt(e.currentTarget.id) === th.allTypes[i].parentMidwayServiceAreaServicesId && th.allTypes[i].parentMidwayServiceAreaServicesId!=th.allTypes[i].midwayServiceAreaTypeId) {
              th.selectedTypes[th.selectedTypes.length - 1].sub.push(th.allTypes[i])
            }
          }
        }else{
          e.currentTarget.style.backgroundColor="rgb(255, 255, 255)"
          for(var j=0;j<th.selectedTypes.length;j++){
            // th.selectedTypes.forEach((item, index)=>{
            if(th.selectedTypes[j].parentID === e.currentTarget.id){
              th.selectedTypes.splice(j,1);
            }
          }
        }
        console.log(th.selectedTypes)
      });

    },
    addServiceTypesForAddToDiv() {
      for (var i = 0; i < this.serviceTypes.length; i++) {
        var div = document.createElement("div");
        let label = document.createElement("label");
        let img = document.createElement("img");
        div.style.width = "70px"
        div.style.height = "80px"
        div.style.display = "inline-block"
        div.style.backgroundColor = "rgb(255, 255, 255)"
        div.style.marginTop = "10px"
        div.style.marginRight = "20px"
        div.style.position = "relative"
        div.title = this.serviceTypes[i].name;
        div.id = this.serviceTypes[i].midwayServiceAreaTypeId;
        div.className = "type";
        div.style.borderRadius = "3px";
        label.textContent = this.serviceTypes[i].name;
        label.style.fontFamily = "IranSans";
        label.style.fontSize = "10px";
        label.style.display = "flex";
        label.style.justifyContent = "center";
        label.style.marginTop = "60px";
        label.style.bottom = "0";
        label.style.color = "black";
        label.style.textAlign = "center";
        img.src = "data:application;base64," + this.serviceTypes[i].documents[0].base64File;
        img.style.width = "100px"
        img.style.width = "50px"
        img.style.display = "flex"
        img.style.marginLeft = "10px"
        img.style.position = "absolute"
        img.style.top = "0"
        div.appendChild(label);
        div.appendChild(img);
        document.getElementById("typeDiv").appendChild(div);
      }
    },
    getMidWayServiceAreaTypes(state) {
      var th = this;
      const formData = new FormData();
      formData.append('locale', "fa_IR");
      formData.append('dateInMiliseconds', "true");
      formData.append('cmd', "{'/MidwayServiceArea-portlet.midwayareatype/get-mid-way-service-area-types-with-documents':{}}");
      axios.post('https://restareas.rmto.ir/api/jsonws/invoke', formData,
      ).then(response => {
        this.allTypes = response.data;
        console.log(response)
        for (let i = 0; i < response.data.length; i++) {
          if (response.data[i].parentMidwayServiceAreaServicesId === response.data[i].midwayServiceAreaTypeId) {
            this.serviceTypes.push(response.data[i])
          }
        }
        if(th.allTypes.length>0 && state==='edit'){
          th.serviceTypeClick();
        }else if(th.allTypes.length>0 && state==='add'){
          th.serviceTypeForAddClick();
        }
        console.log(this.allTypes)
      })
          .catch(error => {
            this.errorMessage = error.message;
            this.snackColor = "red accent-2";
            this.snackText = this.$t("SnackBar.NetworkError");
            this.snackIcon = "mdi-close-circle";
            this.snackbar = true;
            console.error("There was an error!", error);
          });
    },
  },
  }
</script>

<style scoped>
#typeDiv{
  width: 100%;
  height: 85%;
  text-align: center;
  display: block;
  overflow: scroll;
}
</style>
