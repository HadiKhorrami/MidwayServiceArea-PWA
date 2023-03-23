<template>
  <v-row justify="center">
    <v-dialog v-model="EditAreaImagesDialog" max-width="350px" eager persistent @click:outside="close()">
      <v-card style="background-color: white;height: 600px;font-family: IranSans;">
        <v-icon style="margin: 10px" color="red" @click="close()">mdi-close</v-icon>
        <div style="height: 85%;width: 100%;overflow: scroll">
          <v-img v-for="e in editResponse.documents" :src="e.base64File" style="margin: 10px auto 10px auto;width: 80%;border-radius: 5%" @click="deleteImage(e.documentId)"></v-img>
          <div style="width: 100%;height: 90%;overflow: scroll">
            <v-file-input v-model="image" accept="image/png, image/jpeg, image/bmp, image/jpg" reverse prepend-icon="mdi-camera" label="انتخاب عکس" style="direction: rtl;width: 90%;margin: 20px auto auto auto" @change="onNewFileChange"></v-file-input>
            <v-img :src="image.src" style="margin: auto auto 10px auto;width: 80%;border-radius: 5%"></v-img>
          </div>
          <v-progress-circular id="progress" v-if="overlay" :size="70" :width="7" color="gold" indeterminate></v-progress-circular>
        </div>

        <v-card-actions style="background-color: purple;height: 8%;position: relative;bottom: 0;right: 0;width: 100%;">
          <v-spacer></v-spacer>
          <v-btn color="white" text @click="addMidwayServiceAreaDocuments()" style="font-family: IranSans;">اتمام</v-btn>
        </v-card-actions>
        <v-snackbar  v-model="snackbar" :timeout="3000" :color="snackColor"  rounded="pill" style="text-align: center;margin: auto;min-width: 0 !important;width: 50px;font-family: IranSans">
          <v-icon style="float:right;">{{ snackIcon }}</v-icon>
          {{ snackText }}
        </v-snackbar>
      </v-card>
    </v-dialog>
    <UnsubscribeToEditDialog :UnsubscribeToEditDialog="UnsubscribeToEditDialog"/>
  </v-row>
</template>

<script>
import UnsubscribeToEditDialog from "./UnsubscribeToEditDialog.vue"
import axios from "axios";
export default {
  name: "EditAreaImagesDialog",
  props:{
    EditAreaImagesDialog:false,
    UnsubscribeToAddDialog:false,
    UnsubscribeToEditDialog:false,
    addedResponse:JSON,
    editResponse:JSON,
  },
  data: () => ({
    documents:{"documents":[]},
    files : [],
    image:"",
    overlay: false,
    snackbar: false,
    snackText: "",
    snackIcon: "",
    snackColor: "",
  }),
  components:{
    UnsubscribeToEditDialog
  },
  mounted() {
    this.getImages()
  },
  methods:{
    createImage(file) {
      const reader = new FileReader();
      reader.onload = e => {
        this.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    deleteImage(id) {
      const formData = new FormData();
      formData.append('documentId', id);
      formData.append('cmd', "{'/MidwayServiceArea-portlet.midwayareainfo/delete-area-document':{}}");
      axios.post('https://restareas.rmto.ir/api/jsonws/invoke', formData,
      ).then(response => {
        for (var i = 0;i<this.editResponse.documents.length;i++){
          if (response.data[0].id===this.editResponse.documents[i].documentId) {
            this.editResponse.documents.splice(i,1)
            this.snackColor = "red accent-2";
            this.snackText = this.$t("SnackBar.DeletePhoto");
            this.snackIcon = "mdi-close-circle"
            this.snackbar = true;
          }
        }
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
    onNewFileChange() {
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
      this.overlay = true;
      const formData = new FormData();
      formData.append('midwayServiceAreaId', this.editResponse.midwayServiceAreaInfoId);
      formData.append('docs', JSON.stringify(this.documents));
      formData.append('cmd', "{'/MidwayServiceArea-portlet.midwayareainfo/add-midway-service-area-documents':{}}");
      axios.post('https://restareas.rmto.ir/api/jsonws/invoke', formData,
      ).then(response => {
        this.overlay = false;
        if(response.data) {
          if (response.data[0].documents.length > 0) {
            this.snackColor = "success";
            this.snackText = this.$t("SnackBar.PhotosAdded");
            this.snackIcon = "mdi-check-circle"
            this.snackbar = true;
          } else if (response.data[0].documents.length === 0) {
            this.snackColor = "red accent-2";
            this.snackText = this.$t("SnackBar.OperationError");
            this.snackIcon = "mdi-close-circle"
            this.snackbar = true;
          }
        }
        setTimeout(this.goToHome(), 5000);
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
    getImages(){
      this.$root.$on('goToEditImages', (text) => {
        if(text===true && this.getCookie("isEdit")==="true"){
          for(var i in this.editResponse.documents){
            this.editResponse.documents[i].base64File = "data:image/jpeg;base64,"+this.editResponse.documents[i].base64File;
          }
        }
      })
    },
    getCookie(name) {
      let cookie = {};
      document.cookie.split(';').forEach(function(el) {
        let [k] = el.split('=');
        cookie[k.trim()] = el.substring(k.length + 1);
      })
      return cookie[name];
    },
    goToHome(){
      location.href="/#/"
    },
    close(){

        this.UnsubscribeToEditDialog = !this.UnsubscribeToEditDialog;
        this.UnsubscribeToEditDialog = true;
    },
  }

}
</script>

<style scoped>
.v-dialog{
  overflow-y:inherit !important;
}
#progress{
  position: fixed;
}
</style>
