<template>
  <v-row justify="center">
    <v-dialog v-model="SubmitCommentDialog"   max-width="600px" eager @click:outside="setFalse">
      <v-card id="VCard" style="background-color: white;height: 550px;font-family: IranSans">
        <v-icon style="margin: 10px;" color="red" @click="setFalse()">mdi-close</v-icon>
        <div style="width: 100%;height: 90%;overflow: scroll">
         <div style="width: 95%;height: 80px;display: flex;direction: rtl;position: relative;margin-left: 10px;margin-right: 10px">
          <div style="height: 80px;width: 60px;background-color: white;margin-left: 5px" @click="rate=5;color5='green';color4='';color3='';color2='';color1='';"  :disabled="isDisable5">
            <v-icon style="color: black;margin: 5px" size="50" :color="color5">mdi-emoticon-excited-outline</v-icon>
            <p style="color: black;font-size: 13px">{{$t('SubmitCommentDialog.VerySatisfied')}}</p>
          </div>
          <div style="height: 80px;width: 60px;background-color: white;margin-left: 5px" @click="rate=4;color4='green';color5='';color3='';color2='';color1='';" :disabled="isDisable4">
            <v-icon style="color: black;margin: 5px" size="50" :color="color4">mdi-emoticon-happy-outline</v-icon>
            <p style="color: black;font-size: 13px">{{$t('SubmitCommentDialog.Satisfied')}}</p>
          </div>
          <div style="height: 80px;width: 60px;background-color: white;margin-left: 5px" @click="rate=3;color3='green';color5='';color4='';color2='';color1='';" :disabled="isDisable3">
            <v-icon style="color: black;margin: 5px" size="50" :color="color3">mdi-emoticon-neutral-outline</v-icon>
            <p style="color: black;font-size: 13px">{{$t('SubmitCommentDialog.NotBad')}}</p>

          </div>
          <div style="height: 80px;width: 60px;background-color: white;margin-left: 5px" @click="rate=2;color2='green';color5='';color4='';color3='';color1='';" :disabled="isDisable2">
            <v-icon style="color: black;margin: 5px" size="50" :color="color2">mdi-emoticon-angry-outline</v-icon>
            <p style="color: black;font-size: 13px">{{$t('SubmitCommentDialog.DisSatisfied')}}</p>

          </div>
          <div style="height: 80px;width: 60px;background-color: white;" @click="rate=1;color1='green';color5='';color4='';color3='';color2='';" :disabled="isDisable1">
            <v-icon style="color: black;margin: 5px" size="50" :color="color1">mdi-emoticon-dead-outline</v-icon>
            <p style="color: black;font-size: 13px">{{$t('SubmitCommentDialog.VeryDisSatisfied')}}</p>

          </div>

        </div>
        <v-text-field v-model="phone" class="textField" append-icon="mdi-cellphone" v-bind:label="$t('SubmitCommentDialog.CallNumber')" style="width: 80%;position: relative;display: flex;justify-content: center;margin: auto;top:100px;direction: rtl" outlined :reverse="isReverse"></v-text-field>
        <v-textarea v-model="desc" class="textarea" outlined :reverse="isReverse" name="input-7-4" v-bind:label="$t('SubmitCommentDialog.Opinion')" style="width: 80%;position: relative;display: flex;justify-content: center;margin: auto;top:100px;direction: rtl"></v-textarea>
        <v-btn style="font-size: 12px;position: relative;display: flex;justify-content: center;margin: auto;top: 100px;background-color: #06978A;color: white" @click="submitComment()">
          {{$t('SubmitCommentDialog.Send')}}<v-icon right>
          mdi-send
        </v-icon></v-btn>
        <v-snackbar  v-model="snackbar" :timeout="3000" :color="snackColor"  rounded="pill" style="text-align: center;margin: auto;min-width: 0 !important;width: 20px;font-family: IranSans;">
          <v-icon style="float:right;">{{ snackIcon }}</v-icon>
          {{ snackText }}
        </v-snackbar>
        </div>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import axios from "axios";

export default {
  name: "SubmitCommentDialog",
  props:{
    SubmitCommentDialog:false
  },
  data: () => ({
    SubmitCommentDialog:false,
    isReverse:true,
    phone:"",
    desc:"",
    rate:0,
    isDisable1:false,
    isDisable2:false,
    isDisable3:false,
    isDisable4:false,
    isDisable5:false,
    color1:"",
    color2:"",
    color3:"",
    color4:"",
    color5:"",
    snackbar:false,
    snackText:"",
    snackIcon:"",
    snackColor:"",
      }),
  mounted() {
    console.log(this.$i18n.locale)
    this.setReverse()
  },
  methods:{
    submitComment(){
      const formData = new FormData();
      formData.append('userId', this.phone);
      formData.append('midwarServiceAreaInfoId', -1);
      formData.append('stars', this.rate);
      formData.append('desc', this.desc);
      formData.append('locale', "fa_IR");
      formData.append('cmd', "{'/MidwayServiceArea-portlet.midwayarearating/add-midway-service-area-rating':{}}");
      axios.post('https://restareas.rmto.ir/api/jsonws/invoke', formData,
      ).then(response => {
        if(response.data.length===1){
          this.phone = "";
          this.desc = "";
          this.color1="",
          this.color2="",
          this.color3="",
          this.color4="",
          this.color5="",
          this.snackColor = "success";
          this.snackText = this.$t("SnackBar.RegisterVote");
          this.snackIcon = "mdi-check-circle";
          this.snackbar = true;
        }
        console.log(response)
      }).catch(error => {
        this.errorMessage = error.message;
        this.snackColor = "red accent-2";
        this.snackText = this.$t("SnackBar.NetworkError");
        this.snackIcon = "mdi-close-circle";
        this.snackbar = true;
        console.error("There was an error!", error);
      });
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
    }
  }
}
</script>

<style scoped>
p{
  text-align: center;
}
.v-application--is-ltr .v-text-field--reverse .v-label{
  font-size: 15px;
}
</style>
