import Vue from 'vue'
import VueRouter from 'vue-router'
import App from '../App.vue'
import LoginForm from '../views/LoginForm.vue'
import Profile from '../views/Profile.vue'
import en from '../locales/en.json'
import fa from '../locales/fa.json'

export const defaultLocale = 'fa'

export const languages = {
    en: en,
    fa: fa,
}

Vue.use(VueRouter)

export const Routes = [

    {
        path: "/",
        name: ""
    },
    {
        path: "/LoginForm",
        name: "LoginForm",
        component: LoginForm
    },
    {
        path: "/Profile",
        name: "Profile",
        component: Profile
    },

     {
    path: '/App',
    name: 'App',
    component:App
  },
]

 const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  Routes
})

