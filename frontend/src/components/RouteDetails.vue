<template>
  <div>

    <v-list fill-height>
      <StopCard v-bind:stop="stop" v-for="stop in stops"> </StopCard>
    </v-list>
  </v-card>

  </div>
</template>

<style scoped lang="scss">
.stopcard {
  position: absolute;
  z-index: 10000;
  max-width: 400px;
}
.dot {
  height: 25px;
  width: 25px;
  border-radius: 50%;
  // display: inline-block;
}


.routestop {

  .stoptitle {

  }

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

.stopdetail {
  font-size: 0.8em;
}

.routestop.start {

  .dot {
     background-color: blue;
  }
}

</style>


<script>
import StopCard from '@/components/StopCard.vue' 

  export default {
    name: 'routedetails',
    props: [ 'routeObject' ],
    components: {
      StopCard
    },
    data () {
      return {
        legs: null,
        stops: [],

        focusedStop: null,
        stopcardTop: 0,
        stopcardLeft: 0
      }
    },
    methods: {
      // isTrainOrBus
      // isTrain() {

      // }
      openModal(event, stop) {
        console.log("Opening modal for stop", stop)

        this.focusedStop = stop;
        console.log(event.pageY, event.pageX, this.stopcardTop, this.stopcardLeft
          )
        this.stopcardTop = event.pageY - 70;
        this.stopcardLeft = event.pageX - 20;

        console.log(event.target.pageY)


      },
      closeModal() {
        // this.focusedStop = null;
        // console.log("mouseout")
      }
    },
    computed: {
      endLeg() {
        return this.legs[this.legs.length - 1]
      },
      middleLegs() {
        return this.legs.slice(0, this.legs.length - 1)
      },
      startLeg() {
        return this.legs[0];
      }
    },
    mounted() {
      // Build all the stops to display on UI

      const route = this.routeObject.routes[0];
      this.legs = route.legs;
      const lastIndex = this.legs.length - 1;
      let stops = [];
      this.legs.forEach( (leg, index) => {
        let start = leg.from;
        let end = leg.to;
        let safety = leg.safety;
        let mode = leg.mode;

        if (index === 0) {
          // First stop
          stops.push({
            name: start.name,
            icon: 'star',
            icon_color: '',
            first: true,
            type: start.vertexType
          })
        }

        if (index !== lastIndex) {
          // Populate metafields
          let details = {}
          if (safety && safety.meta) {
            details = {
              lighting: safety.meta ? safety.meta.lighting : null,
              cctv: safety.meta ? safety.meta.cctv : null,
              psos: safety.meta ? safety.meta.psos : null
            }
          }


          // Middle stop
          stops.push({
            name: end.name,
            icon: 'directions_bus',
            icon_color: 'primary',
            type: end.vertexType,
            safety: {
              index: safety ? Math.round(safety.s_index.safety_index * 100) : null,
              high_crime: false,
              details: details
            }
          })
        } else {
          // Last stop
          stops.push({
            name: end.name,
            icon: 'flag',
            icon_color: '',
            last: true,
            type: end.vertexType
          })
        }
      })

      // Calculate rails
      this.legs.forEach( (leg, index) => {
        if (leg.mode === 'RAIL' && index + 1 < stops.length) {
          // console.log('RAIL', stops[index], stops[index + 1])
          let a = stops[index], b = stops[index + 1];
          a.icon = 'train';
          a.icon_color = 'secondary';
          b.icon = 'train';
          b.icon_color = 'secondary';
        }
      })
      this.stops = stops;

      console.log('legs', this.legs)
      // console.log('stops', this.stops)
    }
  }
</script>
