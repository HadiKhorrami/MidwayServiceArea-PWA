<template>
  <v-row justify="center">
    <v-dialog v-model="AreaSubServices" max-width="600px" eager @click:outside="setFalse()">
      <v-card id="VCard" style="background-color: white;height: 400px;font-family: IranSans;">
        <v-icon style="margin: 10px" color="red" @click="setFalse()">mdi-close</v-icon>
        <div style="height: 90%;width: 100%;overflow: scroll">
        <v-expansion-panels accordion dir="rtl" style="margin: auto;width: 90%;top:0px;">
          <v-expansion-panel
              v-for="(item,i) in subServiceArray"
              :key="i"
              style="margin-bottom: 10px;border-radius: 10px"
          >
            <v-expansion-panel-header style="color: white;" :color="item.color" @click="setContent(item.hasMenu)" >
              <p style="position: absolute;right: 75%">{{item.has}}</p>
              <p style="width:200px;position: absolute;left: 40%">{{item.name}}</p>
            </v-expansion-panel-header>
            <v-expansion-panel-content style="background-color: #414141;color: white;padding: 10px;">{{content}}
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        </div>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>

import axios from "axios";

export default {
  name: "AreaSubServices",
  props:{
    AreaSubServices:false,
    subServiceArray:Array,
  },
  data: () => ({
    headerColor:"red",
    content:""
  }),
  methods:{
    setContent(hasMenu){

      if(hasMenu===true){

      }else{
        this.content = "منویی در درسترس نیست"
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
