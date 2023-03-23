import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import VueRouter from 'vue-router'
import {Routes} from './router/index.js'
import vuetify from './plugins/vuetify'
import vSelect from 'vue-select'
import VueResource from 'vue-resource'
import axios from 'axios';
import VueAxios from 'vue-axios';
import AxiosPlugin from 'vue-axios-cors';
import VueI18n from 'vue-i18n';
import i18n from '@/i18n';
import i18next from 'i18next';
import VueI18Next from '@panter/vue-i18next';
import VueGeolocation from 'vue-browser-geolocation';
import VueGeolocationApi from 'vue-geolocation-api'
import ajax from "vuejs-ajax";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { languages } from './router/index.js'
import { defaultLocale } from './router/index.js'
import VueSessionStorage from "vue-sessionstorage";
import { store } from './store';


Vue.use(VueSessionStorage);
const messages = Object.assign(languages)
Vue.component('font-awesome-icon', FontAwesomeIcon)
// ...
Vue.use(ajax);
Vue.use(VueGeolocationApi/*, { ...options } */)
Vue.use(VueGeolocation);
Vue.use(VueI18n);
Vue.use(AxiosPlugin);
Vue.use(axios);
Vue.use(VueResource);
Vue.component('v-select', vSelect);
Vue.use(VueRouter);
Vue.config.productionTip = false;
window.$ = require('jquery');
window.JQuery = require('jquery');

 // i18n = new VueI18Next(i18next);
const router=new VueRouter({
routes:Routes
});

new Vue({
  store,
  i18n,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')

