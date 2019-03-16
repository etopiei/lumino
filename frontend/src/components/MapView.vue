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

  const polyline = require('@mapbox/polyline');

  function arraysEqual(arr1, arr2) {
      if(arr1.length !== arr2.length)
          return false;
      for(var i = arr1.length; i--;) {
          if(arr1[i] !== arr2[i])
              return false;
      }

      return true;
  }

  // This function draws a route
  function drawRoute(latlongArray, colour, featureGroup){
    console.log(latlongArray)
    var polyline_options = {color: colour};
    var polyline = L.polyline(latlongArray, polyline_options).addTo(featureGroup).on('click', (e) => {
      console.log("Clicked", this);
    }, featureGroup);
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

      console.log("Loading map with route:", this.routeObject.data.routes, this.map)

      this.map = L.mapbox.map('map');
      this.map.setView([-37.818437, 144.967198], 13)
      .addLayer(L.mapbox.styleLayer('mapbox://styles/mapbox/streets-v11'));

      let selected = true;
      let other_routes = [];
      let first = true;
      var featureGroup = L.featureGroup().addTo(this.map);
      this.routeObject.data.routes.forEach(route => {
        let points = [];
        let colour = "#c2c2c2";
        route.legs.forEach(leg => {
          points = points.concat(polyline.decode(leg.legGeometry.points));
          if (selected) {
            colour = 'red';
            selected = false;
          }
          });
          drawRoute(points, colour, featureGroup);
      });

    // clearRoutes(featureGroup);
  }
  }
</script>
