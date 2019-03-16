<template>
  <div>
    <v-list one-line>

      <v-list-tile class="routestop start">
        <v-list-tile-action>
          <v-icon color="">star</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <span>Starting point</span>
        </v-list-tile-content>
      </v-list-tile>

      <v-list-group>
        <template v-slot:activator>
          <v-list-tile>
            <v-list-tile-content>
              <v-list-tile-title>Title</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>

        <v-list-tile class="routestop train">
          <v-list-tile-action>
            <v-icon color="primary">train</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              Parliament Station
              <span class="score low">43</span>
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list-group>

      <v-list-tile class="routestop bus">
        <v-list-tile-action>
          <v-icon color="secondary">directions_bus</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>
            Bus Stop 1029
            <span class="score low">19</span>
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>

      <v-list-tile class="routestop bus">
        <v-list-tile-action>
          <v-icon color="secondary">directions_bus</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>
            Bus Stop 1031
            <span class="score high">53</span>
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>

      <v-list-tile class="routestop start">
        <v-list-tile-action>
          <v-icon color="">star</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <span>Destination</span>
        </v-list-tile-content>
      </v-list-tile>

    </v-list>
  </div>
</template>

<style scoped lang="scss">
.dot {
  height: 25px;
  width: 25px;
  border-radius: 50%;
  // display: inline-block;
}
.routestop {
  .score {
    float: right;
    opacity: 0.7;
    font-size:0.8em;
  }
  .score.high {
    color:green;
  }
  .score.low {
    color:red;    
  }
}

.routestop.start {

  .dot {
     background-color: blue;
  }
}
</style>


<script>
  export default {
    name: 'routedetails',
    props: [ 'routeObject' ],
    data () {
      return {

      }
    },
    mounted() {

    }
  }
</script>
