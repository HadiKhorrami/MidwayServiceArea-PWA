<template>
  <v-app style="height: 100%; width: 100%; top: 0;  background-color: white;position: absolute;
">
  <v-form id="form" ref="entryForm" @submit.prevent="submitHandler" style="margin-top:70%;padding: 20px;font-family: IranSans">
    <v-container>
      <v-row>
        <v-text-field class="phonetext" v-model="phone" :rules="numberRules" v-bind:label="$t('LoginForm.EnterPhone')" type="number" required rounded filled :reverse="isReverse" clearable dense style="width: 100%;max-width: 100%;direction: rtl"></v-text-field>
      </v-row>
      <v-row>
        <v-btn large rounded type="submit" color="#596E79" id="subminbtn">{{$t('LoginForm.BtnSendCode')}}</v-btn>
      </v-row>
    </v-container>
    <v-alert type="error" v-model="error" style="direction: rtl;font-family: IranSans;position: fixed;top:0;width: 100%;left: 0;text-align: right">
      {{ errormsg }}
    </v-alert>
    <v-alert v-model="success" type="success" style="direction: rtl;font-family: IranSans;position: fixed;top:0;width: 100%;left: 0;text-align: right">
      ورود با موفقیت انجام شد
    </v-alert>
    <v-bottom-sheet v-model="sheet" persistent eager >
      <v-sheet
          class="text-center"
          height="250px"
          style="font-family: IranSans; text-align: center;align-content: center;background-color:#414141;color: white;padding: 10px; "
      >
        <form>
          <div class="py-3">
            <h5>{{$t('LoginForm.EnterCode')}}</h5>
            <br>
            <label id="sendagain">{{countDown}}</label>
            <div class="form-group">
              <input type="" class="form-control form-control-lg" id="confirmtext"/>
            </div>
            <v-btn  class="btn btn-dark btn-lg btn-block" :loading="loading" :disabled="loading" dark id="confirmbtn" @click="loader = 'loading';ConfirmCode();" >{{$t('LoginForm.BtnLogIn')}}
            </v-btn>
            <v-btn class="btn btn-dark btn-lg btn-block" id="sendagainbtn" :disabled="sendAgainDisable" @click="countDownTimer();ResendCode()">{{$t('LoginForm.BtnSendAgain')}}</v-btn>
            <v-btn class="btn btn-dark btn-lg btn-block" id="changephonebtn"  @click="changePhone()">{{$t('LoginForm.BtnChangePhone')}}</v-btn>
          </div>

        </form>

      </v-sheet>
    </v-bottom-sheet>
  </v-form>
    <v-snackbar  v-model="snackbar" :timeout="3000" :color="snackColor"  rounded="pill" style="text-align: center;margin: auto;min-width: 0 !important;width: 20px;font-family: IranSans;">
      <v-icon style="float:right;">{{ snackIcon }}</v-icon>
      {{ snackText }}
    </v-snackbar>
    <v-progress-circular v-if="overlay" :size="50" :width="7"  color="pink" indeterminate style="position:relative;margin-left: 40%"></v-progress-circular>
    <FillProfileDialog :FillProfileDialog="FillProfileDialog"/>
  </v-app>
</template>
<style>
    #subminbtn{
      margin-top: 10px;
      background-color: #596E79;
      color: white;
      width: 100%;
      border: hidden;
    }
    #confirmtext{
      height: 40px;
      width: 70%;
      min-height: 0;
      text-align: center;
      margin-top: 30px;
      background-color: white;
      border-radius: 2px;
    }
    #confirmbtn{
      background-color: #54d35b;
      margin-top: 30px;
      color: white;
    }
    #sendagainbtn{
      background-color: #d55360;
      margin-top: 30px;
      color: white;
      margin-left: 5px;
    }
    #changephonebtn{
      background-color: #ea8525;
      margin-top: 30px;
      color: white;
      margin-left: 5px;
    }
    .v-messages__message{
      float: right;
    }
    .custom-shape-divider-top-1639491006 {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      overflow: hidden;
      line-height: 0;
      transform: rotate(180deg);
    }

    .custom-shape-divider-top-1639491006 svg {
      position: relative;
      display: block;
      width: calc(226% + 1.3px);
      height: 374px;
    }

    .custom-shape-divider-top-1639491006 .shape-fill {
      fill: #C7B198;
    }

    /** For mobile devices **/
    @media (max-width: 767px) {
      .custom-shape-divider-top-1639491006 svg {
        width: calc(184% + 1.3px);
        height: 98px;
      }
    }

    .custom-shape-divider-bottom-1639491063 {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      overflow: hidden;
      line-height: 0;
    }

    .custom-shape-divider-bottom-1639491063 svg {
      position: relative;
      display: block;
      width: calc(226% + 1.3px);
      height: 374px;
    }

    .custom-shape-divider-bottom-1639491063 .shape-fill {
      fill: #C7B198;
    }

    /** For mobile devices **/
    @media (max-width: 767px) {
      .custom-shape-divider-bottom-1639491063 svg {
        width: calc(184% + 1.3px);
        height: 98px;
      }
    }

    /** For mobile devices **/
    @media (max-width: 767px) {
      .custom-shape-divider-top-1638773172 svg {
        width: calc(208% + 1.3px);
        height: 189px;
      }
    }

    #subminbtn{
      margin-top: 10px;
      background-color: #596E79;
      color: white;
      width: 100%;
      border: hidden;
    }
    #phonetext{
      margin-top: 30px;
      min-height: 0;
      text-align: center;
    }
    .vue-tempalte{
      width:100%;
      height:100%;
      position: absolute;
      text-align: center;
      background-color: white;
      font-family: IranSans;
      padding: 20px;
      color: black;
    }



    .v-input--selection-controls .v-input__slot > .v-label, .v-input--selection-controls .v-radio > .v-label {
      font-size: 12px;
    }
    .custom-loader {
      animation: loader 1s infinite;
      display: flex;
    }
    @-moz-keyframes loader {
      from {
        transform: rotate(0);
      }
      to {
        transform: rotate(360deg);
      }
    }
    @-webkit-keyframes loader {
      from {
        transform: rotate(0);
      }
      to {
        transform: rotate(360deg);
      }
    }
    @-o-keyframes loader {
      from {
        transform: rotate(0);
      }
      to {
        transform: rotate(360deg);
      }
    }
    @keyframes loader {
      from {
        transform: rotate(0);
      }
      to {
        transform: rotate(360deg);
      }
    }
    .phonetext.v-text-field.v-input--dense:not(.v-text-field--outlined) input{
      text-align: center !important;
    }
    .v-progress-circular{
      top: 0 !important;
      left: 0 !important;
    }
  </style>

<script>
import axios from "axios";
import $ from "jquery";
import FillProfileDialog from '../components/FillProfileDialog.vue'

export default {
  name: "LoginForm",
  props:{
    FillProfileDialog:false,
  },
  data: () => ({
    numberRules: [],
    phone: "",
    valid:false,
    sheet:false,
    loading: false,
    countDown :60,
    interval :"",
    success:false,
    error:false,
    isReverse:false,
    FillProfileDialog:false,
    sendAgainDisable:true,
    overlay:false,
    snackbar:false,
    snackText:"",
    snackIcon:"",
    snackColor:"",
  }),
  components:{
    FillProfileDialog
  },
  mounted() {
    console.log(this.getCookie("phone"))

    if(this.$i18n.locale==='en'){
      $('.phonetext').css('direction','ltr');
      $('.v-messages__message').css('float','left');
      this.isReverse=false;
    }else if(this.$i18n.locale==='fa'){
      $('.v-messages__message').css('float','right');
      this.isReverse=true;
    }
    this.setReverse();
  },
  methods:{
    submitHandler () {
      this.numberRules = [
        v => !!v || this.$t("LoginForm.EmptyError"),
        v => /^\d+$/.test(v) || 'Must be a number',
      ]
      let self = this
      setTimeout(function () {
        if (self.$refs.entryForm.validate()){
          self.sendConfirmationMessage();
        }
      })
    },
    countDownTimer() {
      var th = this;
      var countDown = 59;
      document.getElementById("sendagain").style.fontSize = "15px";
      document.getElementById("sendagainbtn").disabled = true;

      this.interval = setInterval(function (){
        console.log(countDown)
        document.getElementById("sendagain").textContent=countDown;
        countDown--;

        if(countDown === 0){
          clearInterval(th.interval);
          th.sendAgainDisable = false
          document.getElementById("sendagain").textContent = th.$t("LoginForm.TimeOutDesc");
          document.getElementById("sendagain").style.fontSize = "12px";
          document.getElementById("sendagain").textContent=60;

          th.ClearCode();
        }
      },1000)
    },
    sendConfirmationMessage(){
      this.overlay = true;
      const formData = new FormData();
      formData.append('userId', "20435");
      formData.append('mobileNumber',this.phone);
      formData.append('cmd', "{'/MidwayServiceArea-portlet.person/send-confirmation-message':{}}");
      axios.post('https://restareas.rmto.ir/api/jsonws/invoke', formData,
      ).then(response => {
        this.overlay = false;
        this.sheet=true;
        this.countDownTimer();
        console.log(response)
      }).catch(error => {
        this.overlay = false;
        this.snackColor = "red accent-2";
        this.snackText = this.$t("SnackBar.NetworkError");
        this.snackIcon = "mdi-close-circle";
        this.snackbar = true;
        console.error("There was an error!", error);
      });
      $("#confirmtext").val("");
    },
    ConfirmCode(){
      if($("#confirmtext").val()!="") {
      const l = this.loader
      this[l] = !this[l];
      if(this.phone.charAt(0)==='0'){
        this.phone = this.phone.substring(1)
      }
        const formData = new FormData();
        formData.append('code', $("#confirmtext").val());
        formData.append('mobileNumber', this.phone);
        formData.append('cmd', "{'/MidwayServiceArea-portlet.person/confirm-login':{}}");
        for (var pair of formData.entries()) {
          console.log(pair[0] + ', ' + pair[1]);
        }
        axios.post('https://restareas.rmto.ir/api/jsonws/invoke', formData,
        ).then(response => {
          console.log(response)
          this.ServiceAreaDetailsDialog = false;
          this[l] = false;
          this.loader = null
          if (response.data[0].login === "ok" && response.data[0].profile === "incomplete") {
            this.error = false;
            this.success = true;
            this.sheet = false;
            this.FillProfileDialog = true;
            var today = new Date();
            var expire = new Date();
            expire.setTime(today.getTime() + 3600000 * 24 * 14);
            document.cookie = "phone=" + this.phone + ";expires=" + expire.toGMTString();
          } else if (response.data[0].login === "ok" && response.data[0].profile === "complete") {
            var today = new Date();
            var expire = new Date();
            expire.setTime(today.getTime() + 3600000 * 24 * 14);
            document.cookie = "phone=" + this.phone + ";expires=" + expire.toGMTString();
            document.cookie = "firstName=" + response.data[0].firstName;
            document.cookie = "familyName=" + response.data[0].familyName;
            location.href = "/#/"
          } else if (response.data[0].login === "fail" && response.data[0].msg === "not-connect-to-server-please-try-again") {
            this.errormsg = "ارتباط با سرور برقرار نشد. دوباره سعی کنید";
            this.error = true;
          } else if (!response.data[0].login) {
            this.errormsg = "کد وارد شده نادرست است";
            this.error = true;
            $("#confirmtext").val("");
          }
        }).catch(error => {
          this.errorMessage = error.message;
          this.snackColor = "red accent-2";
          this.snackText = this.$t("SnackBar.NetworkError");
          this.snackIcon = "mdi-close-circle";
          this.snackbar = true;
          console.error("There was an error!", error);
        });
      }
      else if($("#confirmtext").val()===""){
        this.snackColor = "red accent-2";
        this.snackText = this.$t("SnackBar.EnterConfirmCode");
        this.snackIcon = "mdi-close-circle";
        this.snackbar = true;
      }
    },
    ClearCode(){
      const formData = new FormData();
      formData.append('mobileNumber', this.phone);
      formData.append('cmd', "{'/MidwayServiceArea-portlet.person/clear-code':{}}");
      axios.post('https://restareas.rmto.ir/api/jsonws/invoke', formData,
      ).then(response => {
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
    ResendCode(){
      this.sendAgainDisable = true
      this.error = false;
      const formData = new FormData();
      formData.append('userId', "20435");
      formData.append('mobileNumber', this.phone);
      formData.append('cmd', "{'/MidwayServiceArea-portlet.person/send-confirmation-message':{}}");
      axios.post('https://restareas.rmto.ir/api/jsonws/invoke', formData,
      ).then(response => {
        console.log(response)
      }).catch(error => {
        this.errorMessage = error.message;
        this.snackColor = "red accent-2";
        this.snackText = this.$t("SnackBar.NetworkError");
        this.snackIcon = "mdi-close-circle";
        this.snackbar = true;
        this.$router.push({ path: "/LoginForm" });
        console.error("There was an error!", error);
      });
      $("#confirmtext").val("");
    },
    setReverse(){
      if(this.$i18n.locale==='en'){
        this.isReverse=false;
      } else if(this.$i18n.locale==='fa'){
        this.isReverse=true;
      }
    },
    changePhone(){
      this.sheet = false;
      this.phone = "";
      clearInterval(this.interval);
      document.getElementById("sendagain").textContent=60;


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
  watch: {
    'phone' (val) {
      this.numberRules = []
    }
  },
}
</script>
