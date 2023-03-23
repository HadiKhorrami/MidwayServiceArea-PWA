<template>
  <v-row justify="center">
    <v-dialog v-model="AddAreaImagesDialog" max-width="600px" eager persistent @click:outside="close()">
      <v-card id="VCard" style="background-color: white;height: 600px;font-family: IranSans;">
        <v-icon style="height:10%;margin-left: 10px;margin-top: 5px" color="red" @click="close()">mdi-close</v-icon>
        <div style="width: 100%;height: 85%;overflow: scroll">
        <v-file-input v-model="image" accept="image/png, image/jpeg, image/bmp, image/jpg" reverse prepend-icon="mdi-camera" label="انتخاب عکس" style="direction: rtl;width: 90%;margin: 20px auto auto auto" @change="onFileChange"></v-file-input>
<!--          <v-img v-for="i in image" :src="i.src" style="margin: auto auto 10px auto;width: 80%;border-radius: 5%"></v-img>-->
          <v-img :src="image.src" style="margin: auto auto 10px auto;width: 80%;border-radius: 5%"></v-img>
        </div>
        <v-card-actions style="background-color: purple;height: 10%;position: relative;bottom: 0;right: 0;width: 100%;">
          <v-spacer></v-spacer>
          <v-btn color="white" text @click="addMidwayServiceAreaDocuments()" style="font-family: IranSans;">اتمام</v-btn>
        </v-card-actions>
        <v-snackbar  v-model="snackbar" :timeout="3000" :color="snackColor"  rounded="pill" style="text-align: center;margin: auto;min-width: 0 !important;width: 50px;font-family: IranSans">
          <v-icon style="float:right;">{{ snackIcon }}</v-icon>
          {{ snackText }}
        </v-snackbar>
      </v-card>
    </v-dialog>
    <UnsubscribeToAddDialog :UnsubscribeToAddDialog="UnsubscribeToAddDialog"/>
    <UnsubscribeToEditDialog :UnsubscribeToEditDialog="UnsubscribeToEditDialog"/>
  </v-row>

</template>

<script>
import UnsubscribeToAddDialog from "./UnsubscribeToAddDialog.vue"
import UnsubscribeToEditDialog from "./UnsubscribeToEditDialog.vue"
import axios from "axios";
export default {
  name: "AddAreaImagesDialog",
  props:{
    AddAreaImagesDialog:false,
    UnsubscribeToAddDialog:false,
    UnsubscribeToEditDialog:false,
    addedResponse:JSON
  },
  data: () => ({
    documents:{"documents":[]},
    files : [],
    image:"",
    snackbar: false,
    snackText: "",
    snackIcon: "",
    snackColor: "",
  }),
  components:{
    UnsubscribeToAddDialog,
    UnsubscribeToEditDialog
  },
  methods:{
    createImage(file) {
      const reader = new FileReader();
      reader.onload = e => {
        this.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    onFileChange(file) {
      var th = this;
      var base64File = "";
      console.log(this.image)

      this.image["src"]= window.URL.createObjectURL(new Blob([this.image], {type: "image/jpg"}))
      var blob = this.image
      var reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend  = function() {
        base64File = reader.result.replace("data:image/jpeg;base64,", "");
        th.documents.documents.push({
          "base64File": base64File,
          "documentId": 0,
          "documentTypeName": "تصویر",
          "fieldName": "تصویر",
          "fileName": th.image.name,
        })
      }
      this.snackColor = "success";
      this.snackText = this.$t("SnackBar.PhotoAdded");
      this.snackIcon = "mdi-check-circle";
      this.snackbar = true;
    },
     addMidwayServiceAreaDocuments(){
       console.log(this.documents)
      const formData = new FormData();
      formData.append('midwayServiceAreaId', this.addedResponse.midwayServiceAreaInfoId);
      formData.append('docs', JSON.stringify(this.documents));
      formData.append('cmd', "{'/*************.midwayareainfo/add-midway-service-area-documents':{}}");
      axios.post('*************', formData,
      ).then(response => {
        if(response.data) {
          if (response.data[0].documents.length > 0) {
            this.snackColor = "success";
            this.snackText = this.$t("SnackBar.AreaAdded");
            this.snackIcon = "mdi-check-circle"
            this.snackbar = true;
            setTimeout(this.goToHome(),2000)
          } else if (response.data[0].documents.length === 0) {
            this.snackColor = "red accent-2";
            this.snackText = this.$t("SnackBar.OperationError");
            this.snackIcon = "mdi-close-circle"
            this.snackbar = true;
          }
        }
        // setTimeout(this.goToHome(), 3000);
        console.log(response)
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
    goToHome(){
      location.href="/#/"
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

</style>
