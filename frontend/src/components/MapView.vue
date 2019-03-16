<template>
  <div class="mapview">
   {{ routeObject }}
   <div id='map'></div>
  </div>
</template>

<style>
.mapview {
  position: relative;
}
#map { position: absolute; top: 0; left: 0; width:100%; height: 600px; }
</style>


<script>
  export default {
    name: 'mapview',
    props: [ 'routeObject' ],
    data () {
      return {

      }
    },
    mounted() {

      // This function is called once the component is ready
      // Set up map, draw etc

      // route details stored in this.routeObject

      console.log("Loading map with route:", this.routeObject, this.map)

      // this.map = L.mapbox.map('map');
      // this.map.setView([40, -74.50], 9)
      // .addLayer(L.mapbox.styleLayer('mapbox://styles/mapbox/streets-v11'));
    }
  }
</script>
