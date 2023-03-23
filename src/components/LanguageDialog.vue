<template>
  <v-row justify="center">
    <v-dialog v-model="LanguageDialog"   max-width="600px" eager @click:outside="setFalse">
      <v-card style="background-color: white;height: 110px">
        <v-icon style="margin: 10px" color="red" @click="setFalse()">mdi-close</v-icon>
        <v-container id="container" fluid>
          <v-radio-group
              row
              style="font-family: IranSans;direction: rtl"
          >
            <v-radio
                v-bind:label="$t('LanguageDialog.Persian')"
                @click="setAlignFaّّ()"
                style="direction: rtl;margin-left: 20px"
            ></v-radio>

            <v-radio
                v-bind:label="$t('LanguageDialog.English')"
                @click="setAlignEnّّ()"
                style="direction: rtl;position: relative;right: 100px"
            ></v-radio>
          </v-radio-group>
        </v-container>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import $ from 'jquery'
import i18next from 'i18next';
export default {
  name: "Language",
  props:{
    LanguageDialog:false,
  },
  data: () => ({
    LanguageDialog:false,
    column: null,
    row: null,
    language:"",
  }),
  mounted() {
    if(this.$session.get("lang")==='en'){
      this.$i18n.locale='en';
    }else if(this.$session.get("lang")==='fa'){
      this.$i18n.locale='fa';
    }
  },
  methods:{
    changeLanguages(lang) {
      i18next.changeLanguage(lang);
    },

    setAlignFaّّ(){
      this.$session.set('lang','fa');
      this.$router.go();
      $('.v-sheet.v-card:not(.v-sheet--outlined)').css('float','right');
      $('.SearchRadius').css('right','30px');
      $('.SearchRadius').css('left','auto');
      $('.SearchRadius').css('position','absolute');
      $('.SearchRadius').css('direction','rtl');
      $('.VueSlideBar').css('left','0px');
      $('#list-item').css('left','auto');
    },
    setAlignEnّّ(){
      this.$session.set('lang','en');
      this.$router.go();
      $('.v-sheet.v-card:not(.v-sheet--outlined)').css('float','left');
      $('.v-application--is-ltr .v-text-field--reverse .v-label').css('left','0 !important')
      $('.v-text-field--reverse > .v-input__control > .v-input__slot, .v-text-field--reverse .v-text-field__slot').css('flex-direction','initial')
      $('.theme--light.v-label').css('left','0 !important');
      $('.theme--light.v-label').css('text-align','left');
      $('.SearchRadius').css('left','30px');
      $('.SearchRadius').css('right','auto');
      $('.SearchRadius').css('position','absolute');
      $('.SearchRadius').css('direction','ltr');
      $('.VueSlideBar').css('right','0px');
      $('#list-item').css('left','35px');
    },
    setFalse(){
      this.$emit("setFalse",false);
    }
  },


}
</script>

<style scoped>
#container{
height: fit-content;
  position: relative;
  top: -20px;
}
</style>
