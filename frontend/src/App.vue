<template>
  <v-app >
    <v-toolbar app flat>
      <v-toolbar-title class="catamaran brand text-lowercase" >
        lumino.
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <span>
        UNIHACK 2019
      </span>
    </v-toolbar>

    <v-content>
      <RouteInput/>
    </v-content>

  </v-app>
</template>

<style lang="scss">

.v-toolbar {
  span {
    font-weight:300;
  }

  .brand {
    font-size:2.5em;
    font-weight:100;
  }
}


</style>

<script>
import RouteInput from './views/RouteInput.vue'

export default {
  name: 'App',
  components: {
    RouteInput
  },
  data () {
    return {
      //
    }
  }
}
</script>
