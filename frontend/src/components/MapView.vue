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
#map { position: absolute; top: 0; left: 0; width:100%; height: 800px; }
</style>


<script>

  // This function draws a route
  function drawRoute(latlongArray, colour, featureGroup){
    var polyline_options = {
    color: '#000'
  }
    var polyline = L.polyline(latlongArray, polyline_options).addTo(featureGroup);
  }

// This function clears the routes
function clearRoutes(featureGroup){
    featureGroup.clearLayers()
  }

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

      this.map = L.mapbox.map('map');
      this.map.setView([-37.818437, 144.967198], 13)
      .addLayer(L.mapbox.styleLayer('mapbox://styles/mapbox/streets-v11'));
      
      var featureGroup = L.featureGroup().addTo(this.map);

      var line_points = [
    [-37.817442, 144.968762],
    [-37.825849, 144.997962],
    [-37.846998, 144.990061]
];
    drawRoute(line_points, '#000', featureGroup);
    clearRoutes(featureGroup);
  }
  }
</script>
