<template>
  <v-container fluid class="routeinput" fill-height>

      <v-layout row align-center>
        <v-flex>
          
          <v-layout row wrap align-center justify-center>

            <v-flex xs12 text-xs-center>
              <h1>
                Where are you going?
              </h1>
            </v-flex>

            <v-flex xs12>

              <v-layout row justify-center>
                <v-flex xs6>
                  <v-autocomplete solo class="text-field" :items="startPlaces" :loading="startLoading" v-model="start"
                    prepend-inner-icon="place"
                    placeholder="Starting point"
                    :search-input.sync="startPlaceInput"
                    :readonly="loadingLocation"
                    hide-no-data
                    hide-selected
                    return-object
                    required
                    >

                    <template v-slot:append>
                      <v-fade-transition leave-absolute group>
                        <v-progress-circular :key="0"
                          v-if="loadingLocation"
                          size="24"
                          color="info"
                          indeterminate
                        ></v-progress-circular>
                        <v-btn flat icon color="primary" :key="1"
                          v-if="!loadingLocation"
                          @click="loadLocation"
                        >
                          <v-icon>location_searching</v-icon>
                        </v-btn>
                      </v-fade-transition>
                    </template>

                  </v-autocomplete>
                </v-flex>
              </v-layout>
            </v-flex>

            <v-flex xs12>

              <v-layout row justify-center>
                <v-flex xs6>
                  <v-autocomplete solo class="text-field" :items="destinationPlaces" :loading="destinationLoading" v-model="destination"
                    prepend-inner-icon="place"
                    placeholder="Destination"
                    :search-input.sync="destinationPlaceInput"
                    hide-no-data
                    hide-selected
                    return-object
                    required
                    >
                  </v-autocomplete>
                </v-flex>
              </v-layout>

            </v-flex>

            <v-flex xs12 text-xs-center style="min-height:50px;">
              <v-fade-transition>
                <v-btn flat class="link" color="accent" :to="routeDetails"
                v-if="!!start && !!destination"
                >OK. Let's Go</v-btn>
              </v-fade-transition>
            </v-flex>

          </v-layout>

        </v-flex>
      </v-layout>


  </v-container>
</template>

<style scoped lang="scss">

.routeinput {
  background: #e3e3e3;
}

h1, .link {
  font-size: 2em;
  font-weight: 300;
}

.layout {
  margin: 20px 0px;
}

.link {
  font-family:inherit;
  text-transform:none;
}
.link::before {
    color: transparent
}
.link:hover {
  text-decoration:underline;
}
</style>

<script>

const axios = require('axios');
const _ = require('lodash');
const myLocationString = "My location";

export default {
  name: 'routeinput',
  components: {
    
  },
  methods: {
    getPlaces(input) {
      return axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${input}.json?access_token=pk.eyJ1IjoibmF6YWlyZSIsImEiOiJjanRiY3hlMXowa2Y3M3lzMGppYjVhMHd2In0.V66pqegxdri0oOsw-K20nQ`)
    },
    loadLocation() {

      if (navigator.geolocation) {
        this.loadingLocation = true;
        this.startPlaceInput = "Determining your location..."
        navigator.geolocation.getCurrentPosition((position) => {
          this.start = {
            text: myLocationString,
            coords: [ position.coords.latitude, position.coords.longitude ]
          }
          this.startPlaces.push(myLocationString)
          this.startPlaceInput = myLocationString
          this.loadingLocation = false;
        });
      }
    }
  },
  data () {
    return {
      loadingLocation: false,

      start: null,
      startPlaceInput: null,
      startLoading: false,
      startPlaces: [],

      destination: null,
      destinationPlaceInput: null,
      destinationLoading: false,
      destinationPlaces: []
    }
  },
  computed: {
    routeDetails () {
      return !!this.start && !!this.destination ? `/route/${this.start.coords.join(',')}/${this.destination.coords.join(',')}` : null;
    }
  },
  watch: {
    startPlaceInput: function (val) {
      if (this.loadingLocation || !val || val === myLocationString ) return;
      this.debouncedAutoFillStart();
    },
    destinationPlaceInput: function (val) {
      if (!val) return;
      this.debouncedAutoFillDestination();
    }
  },
  created() {
    this.debouncedAutoFillStart = _.debounce(() => {
      this.startLoading = true;
      this.getPlaces(this.startPlaceInput)
      .then(response => {
        // this.startLoading = false;
        this.startPlaces = response.data.features.map( poi => {
          return {
            text: poi["place_name"],
            coords: poi["center"]
          }
        })
        this.startLoading = false;
      })
    }, 500)

    this.debouncedAutoFillDestination = _.debounce(() => {
      this.destinationLoading = true;
      this.getPlaces(this.destinationPlaceInput)
      .then(response => {
        // this.startLoading = false;
        this.destinationPlaces = response.data.features.map( poi => {
          return {
            text: poi["place_name"],
            coords: poi["center"]
          }
        })
        this.destinationLoading = false;
      })
    }, 500)
  }


}
</script>
