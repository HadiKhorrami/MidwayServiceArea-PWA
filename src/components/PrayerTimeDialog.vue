<template>
  <v-row justify="center">
    <v-dialog v-model="PrayerTimeDialog"   max-width="600px" @click:outside="setFalse">
      <v-card id="VCard" style="background-color: white;height: 500px;">
        <div style="width: 50%;height: 100%;margin: auto;font-family: IranSans;font-size: 10px" class="prayer-times">
          <v-icon style="margin: 10px;right: 80px" color="red" @click="setFalse()">mdi-close</v-icon>
          <br><br>
          <p style="font-size: 20px !important;">{{$t("PrayerTimeDialog.PrayerTime")}}</p><br><br>
          <p>{{$t("PrayerTimeDialog.Fajr")}} : {{ fajr }}</p><br>
          <p>{{$t("PrayerTimeDialog.Sunrise")}} : {{ sunrise }}</p><br>
          <p>{{$t("PrayerTimeDialog.Dhuhr")}} : {{ dhuhr }}</p><br>
          <p>{{$t("PrayerTimeDialog.Asr")}} : {{ asr }}</p><br>
          <p>{{$t("PrayerTimeDialog.Sunset")}} : {{ sunset }}</p><br>
          <p>{{$t("PrayerTimeDialog.Maghrib")}} : {{ maghrib }}</p><br>
          <p>{{$t("PrayerTimeDialog.Isha")}} : {{ isha }}</p><br>
          <p>{{$t("PrayerTimeDialog.Midnight")}} : {{ midnight }}</p><br>
        </div>
        <v-snackbar  v-model="snackbar" :timeout="3000" :color="snackColor"  rounded="pill" style="text-align: center;margin: auto;min-width: 0 !important;width: 20px;font-family: IranSans;">
          <v-icon style="float:right;">{{ snackIcon }}</v-icon>
          {{ snackText }}
        </v-snackbar>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import { getByDay, getByMonth } from 'prayertiming';

export default {
  name: "PrayerTimeDialog",
  props:{
    PrayerTimeDialog:false
  },
  data: () => ({
    lat:"",
    lng:"",
    fajr:"",
    sunrise:"",
    dhuhr:"",
    asr:"",
    sunset:"",
    maghrib:"",
    isha:"",
    midnight:"",
    snackbar:true,
    snackText:"",
    snackIcon:"",
    snackColor:"",
  }),
  mounted() {
    this.setTimes();
  },
  methods:{
    getCurrentLocation(){
      var th = this;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
              th.lat = position.coords.latitude;
              th.lng = position.coords.longitude;
              th.fajr=getByDay({long: th.lng,lat: th.lat,method: 'Tehran',timeFormat: '24h',})["fajr"]
              th.sunrise=getByDay({long: th.lng,lat: th.lat,method: 'Tehran',timeFormat: '24h',})["sunrise"]
              th.dhuhr=getByDay({long: th.lng,lat: th.lat,method: 'Tehran',timeFormat: '24h',})["dhuhr"]
              th.asr=getByDay({long: th.lng,lat: th.lat,method: 'Tehran',timeFormat: '24h',})["asr"]
              th.sunset=getByDay({long: th.lng,lat: th.lat,method: 'Tehran',timeFormat: '24h',})["sunset"]
              th.maghrib=getByDay({long: th.lng,lat: th.lat,method: 'Tehran',timeFormat: '24h',})["maghrib"]
              th.isha=getByDay({long: th.lng,lat: th.lat,method: 'Tehran',timeFormat: '24h',})["isha"]
              th.midnight=getByDay({long: th.lng,lat: th.lat,method: 'Tehran',timeFormat: '24h',})["midnight"]
            },
            function (error) {
              th.snackColor = "red accent-2";
              th.snackText = th.$t("SnackBar.TurnOnLocation");
              th.snackIcon = "mdi-close-circle";
              th.snackbar = true;
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
            }
        );
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    },
    setTimes(){
      var th = this;
      this.$root.$off('goToPrayerTimeDialog');
      this.$root.$on('goToPrayerTimeDialog', (text) => {
          th.getCurrentLocation();
      })
    },
    setFalse(){
      this.$emit("setFalse",false);
    }
  }
}
</script>

<style scoped>
p{
  font-size: 15px;
  text-align: center;
}
#VCard{
  background-image: url("../assets/prayer.jpg");
  background-size: 100% 100%;
}
</style>
