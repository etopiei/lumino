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

  const greenColour = '#47AB6C'
  const orangeColour = '#F2B134'
  const redColour = '#ED553B'

  function drawRoute(route, featureGroup){
    var legs = route.legs
    var coordinates = new Array(legs.length * 2)
    for(var i = 0; i < legs.length; i++){
      var latStart = legs[i].from.lat
      var lonStart = legs[i].from.lon
      coordinates[i*2] = [latStart, lonStart]
      var latEnd = legs[i].to.lat
      var lonEnd = legs[i].to.lon
      coordinates[i*2 + 1] = [latStart, lonStart]
    }

    drawPolyline(coordinates, greenColour, featureGroup)

    console.log(coordinates)
  }

  // This function draws a route
  function drawPolyline(latlongArray, colour, featureGroup){
    var polyline_options = {
    color: colour
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

      console.log("Loading map with route:", this.routeObject.routes, this.map)

      this.map = L.mapbox.map('map');
      this.map.setView([-37.818437, 144.967198], 13)
      .addLayer(L.mapbox.styleLayer('mapbox://styles/mapbox/streets-v11'));
      
      var featureGroup = L.featureGroup().addTo(this.map);

      if(this.routeObject.routes){
        for(var i = 0; i < this.routeObject.routes.length; i++){
        drawRoute(this.routeObject.routes[i], featureGroup)
      }
      }
      
  }
  }
</script>
