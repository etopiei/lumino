<template>
  <v-container fluid class="routeview" fill-height>
    <!-- {{ $route.params }} -->
    <v-layout row wrap v-if="routeObject" justify-center style="overflow:hidden;">
      <v-flex xs12 sm6 justify-center>
        <v-radio-group v-model="selectedRoute" row class="routeSelector">
          <v-radio :label=" 'Route ' + (index+1) " :value="index" 
            v-for="(_, index) in routeObject.routes"></v-radio>
        </v-radio-group>
        <RouteDetails v-if="!!routeObject" v-bind:routeObject="routeObject" ref="routeDetails"/>
      </v-flex>
      <v-flex xs12 sm6 v-bind:style="{ order: $vuetify.breakpoint.smAndUp ? 1 : -1 }">
        <MapView v-bind:routeObject="routeObject" ref="mapView" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<style scoped lang="scss">

.routeview {
  // background: #f5f5f5;
  padding: 0px;
  background:white;
}

.routeSelector {
  padding-left: 20px;
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
      routeObject: null,
      selectedRoute: 0
    }
  },
  computed: {
    start () {
      return this.$route.params.start.split(",")
    },
    destination() {
      return this.$route.params.destination.split(",")
    }
  },
  watch: {
    selectedRoute(val) {
      this.$refs.routeDetails.updateSelection(val);
      this.$refs.mapView.update_data(val);
    }
  },
  created() {
    const requestBody = {
      start: {
        lat: this.start[0],
        lon: this.start[1]
      },
      destination: {
        lat: this.destination[0],
        lon: this.destination[1]
      }
    }

   
    axios.post('http://10.77.3.7:3000/route', requestBody)
    .then( response => {
        this.routeObject = response.data;
        console.log("Retrieved routeObject")
    })
    .catch( error => {
      console.error(error)
    })
  }


}
</script>
