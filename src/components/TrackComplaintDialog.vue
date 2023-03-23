<template>
  <v-row justify="center">
    <v-dialog v-model="TrackComplaintDialog" ax-width="600px" @click:outside="setFalse">
      <v-card style="background-color: white;height: 500px">
        <v-icon style="margin: 10px" color="red" @click="setFalse()">mdi-close</v-icon>
        <div id="" style="width: 100%;height: 90%;font-family: IranSans">
          <v-expansion-panels v-if="complaints && complaints.length > 0" accordion dir="rtl" style="margin: auto;width: 90%;top:20px;">
            <v-expansion-panel
                v-for="(item,i) in complaints"
                :key="i"
                style="margin-bottom: 10px;border-radius: 10px"
            >
              <v-expansion-panel-header style="color: white;text-align: revert;line-height: normal !important;" color="green">{{item.headerText}}</v-expansion-panel-header>
              <v-expansion-panel-content style="background-color: #414141;color: white;padding: 10px;">
                <p>{{$t("TrackComplaint.State")}} {{item.checkState}}</p>
                <p id="result">{{$t("TrackComplaint.Result")}} {{item.checkResult}}</p>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <p v-if="complaints && complaints.length === 0" style="text-align: center;top: 60px;position: relative">{{$t("TrackComplaint.NoComplaints")}}</p>
        </div>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import $ from "jquery";
import axios from "axios";

export default {
  name: "TrackComplaintDialog",
  props:{
    TrackComplaintDialog:false,
    areaNames: Array,
    complaintHeader:String
  },
  data: () => ({
    TrackComplaintDialog:false,
    complaints: [],
  }),
  mounted() {
    var th = this;
    this.$root.$on("goToTrackComplaint",function (text){
      if(text===true){
        th.getMidwayServiceAreaComplaints();
      }
    })
  },
  methods:{
    getMidwayServiceAreaComplaints(){
        const formData = new FormData();
        formData.append('companyId ', "20155 ");
        formData.append('mobileNumber ', this.getCookie("phone"));
        formData.append('locale', "fa_IR");
        formData.append('cmd', "{'/*************.midwayareacomplaint/get-midway-service-area-complaints-by-mobile-number':{}}");
        axios.post('*************', formData,{
          auth: {username: this.getCookie("managerScreenName"), password: this.getCookie("managerPassword")}}
        ).then(response => {
          for (var i in response.data) {
            for (var j in this.areaNames) {
              if (this.areaNames[j].id === response.data[i].midwayServiceAreaInfoId) {
                if (this.$i18n.locale === "en") {
                  response.data[i]["headerText"] = this.areaNames[j].name + " " + this.$t('TrackComplaint.ComplaintFrom') + this.$t('TrackComplaint.Area') + this.$t('TrackComplaint.WithTrackingCode') + response.data[i].midwayServiceAreaComplaintId
                } else if (this.$i18n.locale === "fa") {
                  response.data[i]["headerText"] = this.$t('TrackComplaint.ComplaintFrom') + this.$t('TrackComplaint.Area') + this.areaNames[j].name + " " + this.$t('TrackComplaint.WithTrackingCode') + response.data[i].midwayServiceAreaComplaintId
                }
              }
            }
            if(response.data[i].checkType===0){
              if (this.$i18n.locale === "en") {
                response.data[i]["checkState"] = "Not Checked"
              } else if (this.$i18n.locale === "fa") {
                response.data[i]["checkState"] = "بررسی نشده"
              }
            }else
            if(response.data[i].checkType!=0){
              if (this.$i18n.locale === "en") {
                response.data[i]["checkState"] = "Checked"
              } else if (this.$i18n.locale === "fa") {
                response.data[i]["checkState"] = "بررسی شده"
              }
            }
          }
          this.complaints = response.data;
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
    setFalse(){
      this.$emit("setFalse",false);
    },
  }
}
</script>

<style scoped>

</style>
