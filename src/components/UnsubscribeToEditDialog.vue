<template>
  <v-row justify="center">
    <v-dialog v-model="UnsubscribeToEditDialog" max-width="290" style="font-family: IranSans;text-align: center;padding-top: 20px;" eager>
      <v-card>
        <v-card-text style="font-family: IranSans;text-align: center;padding-top: 20px">
          میخواهید به ویرایش مجتمع خاتمه دهید؟
        </v-card-text>

        <v-card-actions style="font-family: IranSans;">
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="UnsubscribeToEditDialog = false" style="float: left;position: fixed">خیر</v-btn>
          <v-btn color="green darken-1" text @click="GoToHome()">بله</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  name: "UnsubscribeToEditDialog",
  props:{
    UnsubscribeToEditDialog:false
  },
  methods:{
    GoToHome(){
      location.href = '/#/'
    }
  }
}
</script>

<style scoped>

</style>
