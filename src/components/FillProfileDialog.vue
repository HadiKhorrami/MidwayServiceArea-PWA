<template>
  <v-row justify="center">
    <v-dialog v-model="FillProfileDialog"   max-width="600px" @click:outside="setFalse">
      <v-card style="background-color: white;height: 400px">
        <v-icon style="margin: 10px" color="red" @click="setFalse()">mdi-close</v-icon>
        <v-form id="form" ref="entryForm" @submit.prevent="submitHandler">
        <div id="" style="width: 100%;height: 100%;font-family: IranSans">
          <p style="font-family: IranSans;text-align: center;font-size: 15px;top: 0px;position: relative;width: 80%;margin: auto;">{{ $t('FillProfileDialog.HeaderText') }}</p>
          <v-text-field v-model="firstName" class="textField" :rules="Rules"  v-bind:label="$t('FillProfileDialog.FirstName')"  required :reverse="isReverse" color="red"  outlined style="min-height:0;height: 55px;position: relative;margin: 50px auto auto ;width: 80%;display: flex;" append-icon="mdi-account"/>
          <v-text-field v-model="lastName" class="textField" :rules="Rules"  v-bind:label="$t('FillProfileDialog.LastName')"  required :reverse="isReverse" color="red"  outlined style="min-height:0;height: 55px;position: relative;margin: 20px auto auto ;width: 80%;display: flex" append-icon="mdi-lock"></v-text-field>
          <v-btn type="submit" id="editbtn" rounded dense style="height:45px;margin: 50px auto auto;background-color: #ffffff;color: green;position: relative;width: 80%;border: 1px green solid;display: flex">
            {{$t('FillProfileDialog.Save')}}<v-icon dark right color="green">mdi-checkbox-marked-circle</v-icon></v-btn>
        </div>
        </v-form>
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

export default {
  name: "FillProfileDialog",
  props:{
    FillProfileDialog:false,
    firstName:"",
    lastName:"",
    fromProfile:false,
  },
  data: () => ({
    FillProfileDialog:false,
    isReverse:true,
    firstName:"",
    lastName:"",
    Rules:[],
    fromProfile:false,
    snackbar: false,
    snackText: "",
    snackIcon: "",
    snackColor: "",
  }),
  mounted() {
    this.setReverse();
    this.firstName = this.getCookie("firstName");
    this.lastName = this.getCookie("familyName");
  },
  methods:{
    submitHandler (){
      this.Rules = [
        v => !!v || 'مقادیر وارد نشده است',
        ]
      let self = this
      setTimeout(function () {
        if (self.$refs.entryForm.validate()){
          self.saveProfile();
        }
      })
    },
    saveProfile(){
      const formData = new FormData();
      formData.append('userId', "20435");
      formData.append('mobileNumber',this.getCookie("phone"));
      formData.append('firstName',this.firstName);
      formData.append('lastName',this.lastName);
      formData.append('cmd', "{'/*************.person/save-profile':{}}");
      axios.post('*************', formData,
      ).then(response => {
        if(response.data[0]){
          if(this.fromProfile = false) {
            this.FillProfileDialog = false;
            document.cookie = "firstName=" + response.data[0].firstName;
            document.cookie = "familyName=" + response.data[0].familyName;
            location.href = '/#/'
          }else if(this.fromProfile = true) {
            this.FillProfileDialog = false;
            document.cookie = "firstName=" + response.data[0].firstName;
            document.cookie = "familyName=" + response.data[0].familyName;
          }
        }

      }).catch(error => {
        this.errorMessage = error.message;
        this.snackColor = "red accent-2";
        this.snackText = this.$t("SnackBar.NetworkError");
        this.snackIcon = "mdi-close-circle";
        this.snackbar = true;
        console.error("There was an error!", error);
      });
    },
    getCookie(name) {
      let cookie = {};
      document.cookie.split(';').forEach(function(el) {
        let [k] = el.split('=');
        cookie[k.trim()] = el.substring(k.length + 1);
      })
      return cookie[name];
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

</style>
