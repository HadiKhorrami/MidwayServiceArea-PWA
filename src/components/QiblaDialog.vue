<template>
  <v-row justify="center">
    <v-dialog v-model="QiblaDialog" max-width="600px" eager>
      <v-card id="VCard" style="background-color: white;height: 200px;font-family: IranSans;overflow: scroll">
        <iframe src="http://qib.la/embed/" width="300" height="200"
                style="border:5px solid #BBB">
          Check the prayer direction towards the Ka'ba in Makkah at
          <a href="http://qib.la/">Qibla Direction</a>.
       </iframe>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  name: "QiblaDialog",
  props:{
    QiblaDialog:false
  },
  data: () => ({
    QiblaDialog:false
  }),
}
</script>

<style scoped>

</style>