<template>
  <v-row justify="center">
    <v-dialog v-model="EssentialPhonesDialog"   max-width="600px" eager @click:outside="setFalse">
      <v-card id="VCard" style="background-color: white;height: 700px;">
        <v-icon style="margin: 10px" color="red" @click="setFalse()">mdi-close</v-icon>
        <div style="width: 100%;height: 90%;overflow:scroll;">
        <v-data-table
             :headers="headers" :items="desserts" hide-default-footer class="table" :mobile-breakpoint="0" disable-pagination
            style="text-align: center;font-family: IranSans;direction: rtl;overflow: scroll"
        ></v-data-table>
        </div>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import i18n from 'i18n'
export default {
  name: "EssentialPhonesDialog",
  props:{
    EssentialPhonesDialog:false
  },
  data: () => ({
    headers: [
        {text: 'نام', value: 'name',align:'center'},
        {text: 'شماره', value: 'number'},
      ],
    EnHeaders:[
        {text: 'Number', value: 'number',width: "30%"},
        {text: 'Name', value: 'name',align:'center'},
      ]

  }),
  mounted() {
    if(this.$i18n.locale==='en'){
      this.headers.splice(0,this.headers.length);
      for(var i=0;i<this.EnHeaders.length;i++){
        this.headers[i]=this.EnHeaders[i];
      }
    }
    // else if(this.$i18n.locale==='fa'){
    //   this.headers.splice(0,this.headers.length);
    //   this.headers.push(this.headers);
    // }
    console.log(this.headers)
  },
  methods:{
    setFalse(){
      this.$emit("setFalse",false);
    }
  },
  computed:{
    desserts() {
      return [
        {name: this.$t("EssentialPhonesDialog.RoadInfos"), number: "141"},
        {name: this.$t('EssentialPhonesDialog.InformationMinistry'),number: "113"},
        {name: this.$t('EssentialPhonesDialog.Emergency'),number: "115"},
        {name: this.$t('EssentialPhonesDialog.WeatherInfos'),number: "134"},
        {name: this.$t('EssentialPhonesDialog.Police'),number: "110"},
        {name: this.$t('EssentialPhonesDialog.IranKhodroCarService'),number: "096440"},
        {name: this.$t('EssentialPhonesDialog.IranKhodroCarService'),number: "159"},
        {name: this.$t('EssentialPhonesDialog.MidwayServices'),number: "09629"},
        {name: this.$t('EssentialPhonesDialog.Fireman'),number: "125"},
        {name: this.$t('EssentialPhonesDialog.RailRoad'),number: "5149"},
        {name: this.$t('EssentialPhonesDialog.FirstAid'),number: "112"},
        {name: this.$t('EssentialPhonesDialog.FlightInfos'),number: "199"},
        {name: this.$t('EssentialPhonesDialog.ImamKhomeyniAirportFlightInfos'),number: "096330"},
      ]
    },

  }
}
</script>

<style scoped>

</style>
