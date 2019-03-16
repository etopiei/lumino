<template>
  <v-container fluid class="routeview" fill-height>
    <!-- {{ $route.params }} -->
    <v-layout row wrap>
      <v-flex xs12 sm6 >
        <RouteDetails v-bind:routeObject="routeObject"/>
      </v-flex>
      <v-flex xs12 sm6 v-bind:style="{ order: $vuetify.breakpoint.smAndUp ? 1 : -1 }">
        <MapView v-bind:routeObject="routeObject"/>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<style scoped lang="scss">

.routeview {
  // background: #f5f5f5;
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
    start () {
      return this.$route.params.start.split(",")
    },
    destination() {
      return this.$route.params.destination.split(",")
    }
  },
  watch: {
    
  },
  mounted() {
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
      this.routeObject = response;
    })
  }


}
</script>
