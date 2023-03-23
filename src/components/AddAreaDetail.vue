<template>
  <v-row justify="center">
    <v-dialog v-model="AddAreaDetail" max-width="600px" @click:outside="close()">

      <v-card style="background-color: white;height: 700px;font-family: IranSans;">
        <v-icon style="height:5%;margin-left: 10px" color="red" @click="close()">mdi-close</v-icon>
        <div style="width: 100%;height: 90%;overflow: scroll">
        <v-combobox append-icon="" solo v-model="midwayServiceAreaTypeId" :items="areaTypes" return-object item-value="value" item-text="name" @click="setInputs=null" reverse style="width: 80%;position: relative;display: flex;justify-content: center;margin: auto;top:20px" label="نوع محل(الزامی)" editable outlined background-color="white"></v-combobox>

        <v-text-field v-model="trackingCode" class="textField" @click="setInputs=null" label="کد رهگیری(الزامی)" :rules="rules.value" type="number" style="width: 80%;position: relative;display: flex;justify-content: center;margin: auto;top:20px;direction: rtl" outlined reverse></v-text-field>
        <v-text-field v-model="name" class="textField" @click="setInputs=null" label="نام محل(الزامی)" :rules="rules.value" style="width: 80%;position: relative;display: flex;justify-content: center;margin: auto;top:20px;direction: rtl" outlined reverse></v-text-field>
        <v-text-field v-model="managerName" class="textField" @click="setInputs=null"  label="نام مدیر" style="width: 80%;position: relative;display: flex;justify-content: center;margin: auto;top:20px;direction: rtl" outlined reverse></v-text-field>
        <v-text-field v-model="mobileNumber" class="textField" @click="setInputs=null"  label="موبایل مدیر(الزامی)" :rules="rules.value" type="number" style="width: 80%;position: relative;display: flex;justify-content: center;margin: auto;top:20px;direction: rtl" outlined reverse></v-text-field>
        <v-text-field v-model="investorName" class="textField" @click="setInputs=null"  label="نام سرمایه گذار" style="width: 80%;position: relative;display: flex;justify-content: center;margin: auto;top:20px;direction: rtl" outlined reverse></v-text-field>
        <v-text-field v-model="investorMobileNumber" class="textField" @click="setInputs=null"  label="موبایل سرمایه گذار(الزامی)" type="number" style="width: 80%;position: relative;display: flex;justify-content: center;margin: auto;top:20px;direction: rtl" outlined reverse></v-text-field>
        <v-text-field v-model="phoneNumber" class="textField" @click="setInputs=null"  label="تلفن ثابت" type="number" style="width: 80%;position: relative;display: flex;justify-content: center;margin: auto;top:20px;direction: rtl" outlined reverse></v-text-field>
        <v-text-field v-model="emailAddress" class="textField" @click="setInputs=null"  label="پست الکترونیک" style="width: 80%;position: relative;display: flex;justify-content: center;margin: auto;top:20px;direction: rtl" outlined reverse></v-text-field>
        <v-text-field v-model="faxNumber" class="textField" @click="setInputs=null"  label="فکس" type="number" style="width: 80%;position: relative;display: flex;justify-content: center;margin: auto;top:20px;direction: rtl" outlined reverse></v-text-field>
        <v-text-field v-model="axis" class="textField" @click="setInputs=null"  label="محور" type="number" style="width: 80%;position: relative;display: flex;justify-content: center;margin: auto;top:20px;direction: rtl" outlined reverse></v-text-field>
        <v-text-field v-model="km" class="textField" @click="setInputs=null"  label="کیلومتر" type="number" style="width: 80%;position: relative;display: flex;justify-content: center;margin: auto;top:20px;direction: rtl" outlined reverse></v-text-field>
        <v-text-field v-model="area" class="textField" @click="setInputs=null"  label="مساحت" type="number" style="width: 80%;position: relative;display: flex;justify-content: center;margin: auto;top:20px;direction: rtl" outlined reverse></v-text-field>

        <v-combobox append-icon="" solo v-model="grade" class="combobox" :items="grades" return-object item-value="value" item-text="name" @click="setInputs=null" label="درجه مجتمع" reverse  outlined  style="width: 80%;position: relative;display: flex;justify-content: center;margin: auto;top:20px;font-family: IranSans"></v-combobox>
        <v-combobox append-icon="" solo v-model="areaStatus" class="combobox" :items="status" return-object item-value="value" item-text="name" @click="setInputs=null" label="وضعیت پروژه" reverse  outlined @change="change" style="width: 80%;position: relative;display: flex;justify-content: center;margin: auto;top:20px;font-family: IranSans"></v-combobox>
        <v-combobox append-icon="" solo v-model="side" class="combobox" :items="sides" item-value="id" item-text="name" @click="setInputs=null" label="سمت" reverse  outlined style="width: 80%;position: relative;display: flex;justify-content: center;margin: auto;top:20px;font-family: IranSans"></v-combobox>

        <v-textarea class="textarea" v-model="address" outlined reverse dense name="input-7-4" label="آدرس" @click="setInputs=null" style="width: 80%;position: relative;display: flex;justify-content: center;margin:auto auto 30px auto;top:20px;direction: rtl"></v-textarea>
        </div>
        <v-btn style="width: 100%;position: relative;display: flex;margin: auto;direction: rtl;background-color: #06978A;color: white" @click="btnClick()" >{{btnText}}</v-btn>
        <v-snackbar  v-model="snackbar" :timeout="3000" :color="snackColor"  rounded="pill" style="text-align: center;margin: auto;min-width: 0 !important;width: 50px;font-family: IranSans">
          <v-icon style="float:right;">{{ snackIcon }}</v-icon>
          {{ snackText }}
        </v-snackbar>

      </v-card>
    </v-dialog>
    <AddServiceType :AddServiceType="AddServiceType" :serviceAreaJson="serviceAreaJson"/>
    <UnsubscribeToAddDialog :UnsubscribeToAddDialog="UnsubscribeToAddDialog"/>
    <UnsubscribeToEditDialog :UnsubscribeToEditDialog="UnsubscribeToEditDialog"/>
  </v-row>
</template>

<script>
import AddServiceType from './AddServiceType.vue'
import UnsubscribeToAddDialog from './UnsubscribeToAddDialog.vue'
import UnsubscribeToEditDialog from './UnsubscribeToEditDialog.vue'
import axios from "axios";
import $ from "jquery";
export default {
  name: "AddAreaDetail",
  props: {
    AddAreaDetail: false,
    AddServiceType: false,
    UnsubscribeToEditDialog: false,
    UnsubscribeToAddDialog: false,
    serviceAreaJson:{},
    editResponse:{},
    selectedTypes:[],
    serviceTypes:[],
    allTypes:[],
  },
  data: () => ({
    AddAreaDetail: false,
    goToAddServiceType:false,
    isReverse: true,
    snackbar: false,
    snackText: "",
    snackIcon: "",
    snackColor: "",
    selectedArea: "",
    btnText:"بعدی",
    areaTypes: [{name:"مجتمع رفاهی",value:28},{name:"تیرپارک",value:26}],
    grades: [{name:"درجه یک", value:1},{name:"درجه دو", value:2},{name:"درجه سه", value:3},{name:"درجه چهار", value:4}],
    status: [{name:"استعلام", value:1},{name:"ساخت", value:2},{name:"فاز 1", value:3},{name:"بهره برداری", value:4}],
    sides: [{name:"راست", value:1},{name:"چپ", value:2},{name:"مابین محور", value:3}],
    ////////////////////////////////////////////////////
    midwayServiceAreaTypeId: "",
    midwayServiceAreaTypeValue:"",
    trackingCode: "",
    name: "",
    managerName: "",
    mobileNumber: "",
    investorName: "",
    investorMobileNumber: "",
    phoneNumber: "",
    emailAddress: "",
    faxNumber: "",
    axis: "",
    km: "",
    area: "",
    grade: "",
    areaStatus: "",
    side: "",
    address: "",
    ////////////////////////////////////////////////////
    gradeValue: "",
    areaStatusValue: "",
    sideValue: "",
    ////////////////////////////////////////////////////


    rules: {
      value: [val => (val || '').length > 0 || 'این فیلد الزامی است'],
    },
  }),
  components: {
    AddServiceType,
    UnsubscribeToEditDialog,
    UnsubscribeToAddDialog
  },
  mounted() {
    this.getMidWayServiceAreaTypes();

  },
  methods: {
    getMidWayServiceAreaTypes() {
      var th = this;
      const formData = new FormData();
      formData.append('locale', "fa_IR");
      formData.append('dateInMiliseconds', "true");
      formData.append('cmd', "{'/*************.midwayareatype/get-mid-way-service-area-types-with-documents':{}}");
      axios.post('*************', formData,
      ).then(response => {
        this.allTypes = response.data;
        for (let i = 0; i < response.data.length; i++) {
          if (response.data[i].parentMidwayServiceAreaServicesId === response.data[i].midwayServiceAreaTypeId) {
            this.serviceTypes.push(response.data[i])
          }
        }

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
    addServiceTypesToDiv() {
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
    AddServiceAreaJson(){
      if(this.midwayServiceAreaTypeId.value==="" || this.trackingCode==="" || this.name==="" || this.mobileNumber==="" || this.investorMobileNumber==="" ){
        this.snackColor = "red accent-2";
        this.snackText = this.$t("SnackBar.RequireFields");
        this.snackIcon = "mdi-close-circle"
        this.snackbar = true;
      }else {
        this.serviceAreaJson.services = "";
        this.serviceAreaJson.userId = this.getCookie("managerUserId");
        this.serviceAreaJson.guestUserId = "";
        this.serviceAreaJson.midwayServiceAreaTypeId = this.midwayServiceAreaTypeId.value;
        this.serviceAreaJson.trackingCode = this.trackingCode;
        this.serviceAreaJson.name = this.name;
        this.serviceAreaJson.managerName = this.managerName;
        this.serviceAreaJson.mobileNumber = this.mobileNumber;
        this.serviceAreaJson.investorName = this.investorName;
        this.serviceAreaJson.investorMobileNumber = this.investorMobileNumber;
        this.serviceAreaJson.phoneNumber = this.phoneNumber;
        this.serviceAreaJson.emailAddress = this.emailAddress;
        this.serviceAreaJson.faxNumber = this.faxNumber;
        this.serviceAreaJson.axis = this.axis;
        this.serviceAreaJson.km = this.km;
        this.serviceAreaJson.area = this.area;
        this.serviceAreaJson.grade = this.grade.value;
        this.serviceAreaJson.areaStatus = this.areaStatus.value;
        this.serviceAreaJson.side = this.side.value;
        this.serviceAreaJson.address = this.address;
        this.serviceAreaJson.distanceToNextServiceArea = "";
        this.serviceAreaJson.description = "";
        this.serviceAreaJson.placeKeywords = "";
        this.serviceAreaJson.locale = "fa_IR";
        this.serviceAreaJson.scale = "";
        this.serviceAreaJson.tagsimatCode = "IRN";
        this.goToAddServiceType =true;
        this.AddAreaDetail = false;
        this.AddServiceType = !this.AddServiceType;

        this.AddServiceType=!this.AddServiceType;
        this.AddServiceType = true;
        this.AddAreaDetail = false;
        this.$root.$emit("goToAddService",true)


        // this.serviceTypeClick();

      }
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
    setInputs(){
      if(this.getCookie("isEdit") === "true") {
        this.btnText = "ذخیره";
        this.midwayServiceAreaTypeId = this.editResponse.midwayServiceAreaTypeName
        for(var i = 0;i<this.areaTypes.length;i++){
          if(this.midwayServiceAreaTypeId===this.areaTypes[i].name){
            this.midwayServiceAreaTypeValue = this.areaTypes[i].value;
          }
        }
        ////////////////////////////////
        this.trackingCode = this.editResponse.trackingCode;
        this.name = this.editResponse.name;
        this.managerName = this.editResponse.managerName;
        this.mobileNumber = this.editResponse.mobileNumber;
        this.investorName = this.editResponse.investorName;
        this.investorMobileNumber = this.editResponse.investorMobileNumber;
        this.phoneNumber = this.editResponse.phoneNumber;
        this.emailAddress = this.editResponse.emailAddress;
        this.faxNumber = this.editResponse.faxNumber;
        this.axis = this.editResponse.axis;
        this.km = this.editResponse.km;
        this.area = this.editResponse.area;
        this.address = this.editResponse.address;
        ////////////////////////////////
        for(var i = 0;i<this.grades.length;i++){
          if(this.editResponse.grade===this.grades[i].value){
            this.grade = this.grades[i].name;
            this.gradeValue = this.grades[i].value;
          }
        }
        for(var i = 0;i<this.status.length;i++){
          if(this.editResponse.areaStatus===this.status[i].value){
            this.areaStatus = this.status[i].name;
            this.areaStatusValue = this.status[i].value;
          }
        }
        for(var i = 0;i<this.sides.length;i++){
          if(this.editResponse.side===this.sides[i].value){
            this.side = this.sides[i].name;
            this.sideValue = this.sides[i].value;
          }
        }
        ////////////////////////////////
      }else{
        this.btnText = "بعدی";
            this.midwayServiceAreaTypeId= "";
            this.midwayServiceAreaTypeValue="";
            this.trackingCode= "";
            this.name= "";
            this.managerName= "";
            this.mobileNumber= "";
            this.investorName= "";
            this.investorMobileNumber= "";
            this.phoneNumber= "";
            this.emailAddress= "";
            this.faxNumber= "";
            this.axis= "";
            this.km= "";
            this.area= "";
            this.grade= "";
            this.areaStatus= "";
            this.side= "";
            this.address= "";
      }
    },
    updateMidwayServiceArea(){
      this.serviceAreaJson.userId = this.editResponse.userId;
        this.serviceAreaJson.guestUserId = "";

        if(this.editResponse.midwayServiceAreaTypeName===this.midwayServiceAreaTypeId){
          this.serviceAreaJson.midwayServiceAreaTypeId = this.midwayServiceAreaTypeValue;
        }else{
          this.serviceAreaJson.midwayServiceAreaTypeId = this.midwayServiceAreaTypeId.value;
        }
        this.serviceAreaJson.midwayServiceAreaId = this.editResponse.midwayServiceAreaInfoId;
        this.serviceAreaJson.trackingCode = this.trackingCode;
        this.serviceAreaJson.name = this.name;
        this.serviceAreaJson.managerName = this.managerName;
        this.serviceAreaJson.mobileNumber = this.mobileNumber;
        this.serviceAreaJson.investorName = this.investorName;
        this.serviceAreaJson.investorMobileNumber = this.investorMobileNumber;
        this.serviceAreaJson.phoneNumber = this.phoneNumber;
        this.serviceAreaJson.emailAddress = this.emailAddress;
        this.serviceAreaJson.faxNumber = this.faxNumber;
        this.serviceAreaJson.axis = this.axis;
        this.serviceAreaJson.km = this.km;
        this.serviceAreaJson.area = this.area;
        this.serviceAreaJson.address = this.address;
        this.serviceAreaJson.distanceToNextServiceArea = "";
        this.serviceAreaJson.description = "";
        this.serviceAreaJson.placeKeywords = "";
        this.serviceAreaJson.locale = "fa_IR";
        this.serviceAreaJson.scale = "";
        this.serviceAreaJson.tagsimatCode = "IRN";
        this.serviceAreaJson.services = this.editResponse.serviceIds
        this.serviceAreaJson.wkt = this.editResponse.geomWKT
      if(this.editResponse.grade === this.gradeValue && this.grade.value===undefined){
        this.serviceAreaJson.grade = this.gradeValue;
      }else {
        this.serviceAreaJson.grade = this.grade.value;
      }
      if(this.editResponse.areaStatus===this.areaStatusValue && this.areaStatus.value===undefined) {
        this.serviceAreaJson.areaStatus = this.areaStatusValue;
      }else {
        this.serviceAreaJson.areaStatus = this.areaStatus.value;
      }
      if(this.editResponse.side===this.sideValue && this.side.value===undefined){
        this.serviceAreaJson.side = this.sideValue;
      }else{
        this.serviceAreaJson.side = this.side.value;
      }
      // }
      const formData = new FormData();
      formData.append('serviceAreaJson', JSON.stringify(this.serviceAreaJson));
      formData.append('cmd', "{'/*************.midwayareainfo/update-midway-service-area':{}}");
      axios.post('*************', formData,
      ).then(response => {
        this.snackColor = "success";
        this.snackText = this.$t("SnackBar.DetailsEdited");
        this.snackIcon = "mdi-check-circle";
        this.snackbar = true;
        location.href = '/#/'
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
    btnClick(){
      if(this.getCookie("isEdit") === "true"){
        this.updateMidwayServiceArea();
      }else if(this.getCookie("isEdit") === "false"){
        this.AddServiceAreaJson();
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
  updated() {
    if (this.getCookie("isEdit")==="true") {
      this.setInputs();
    }
  }
}
</script>

<style scoped>

</style>
