<template>
  <v-container fluid class="routeview" fill-height>
    <!-- {{ $route.params }} -->
    <v-layout row wrap>
      <v-flex sm6 xs12 v-bind:style="{ order: $vuetify.breakpoint.smAndUp ? 1 : 0 }">
        <MapView v-bind:routeObject="routeObject"/>
      </v-flex>
      <v-flex xs12 sm6 left>
        <RouteDetails v-bind:routeObject="routeObject"/>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<style scoped lang="scss">

.routeview {
  background: #e3e3e3;
}

</style>

<script>
import RouteDetails from '@/components/RouteDetails.vue'
import MapView from '@/components/MapView.vue'

const axios = require('axios');
const _ = require('lodash');

export default {
  name: 'routeview',
  components: {
    RouteDetails,
    MapView
  },
  methods: {
   
  },
  data () {
    return {
      routeObject: 'test'
    }
  },
  computed: {

  },
  watch: {
    
  },
  created() {
    
  }


}
</script>
