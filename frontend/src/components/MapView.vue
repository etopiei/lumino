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

  // This function draws a route
  function drawRoute(latlongArray, colour, featureGroup){
    var polyline_options = {color: colour, weight: 5};
    var polyline = L.polyline(latlongArray, polyline_options).addTo(featureGroup).on('click', (e) => {
      console.log("Clicked", this);
    }, featureGroup);
  }

// This function clears the routes
function clearRoutes(featureGroup){
  featureGroup.clearLayers()
}

function make_everything_happen(route, map) {
  map.setView([-37.818437, 144.967198], 13)
  .addLayer(L.mapbox.styleLayer('mapbox://styles/mapbox/streets-v11'));
  let selected = true;
  let old_total = null;
  let first = true;
  var featureGroup = L.featureGroup().addTo(map);
  let total = 0;
  let points = [];
  route.legs.forEach(leg => {
    const extra_points = polyline.decode(leg.legGeometry.points);
    points = points.concat(extra_points);
    drawRoute(points, 'red', featureGroup);
  });
}

  export default {
    name: 'mapview',
    props: [ 'routeObject' ],
    data () {
      return {
        map: null
      }
    },
    methods: {
      update_data(selected) {
        make_everything_happen(this.routeObject.routes[selected], this.map)
      },
    },
    mounted() {
      // This function is called once the component is ready
      // Set up map, draw etc
      this.map = L.mapbox.map('map');
      console.log("Loading map with route:", this.routeObject, this.map)
      make_everything_happen(this.routeObject.routes[0], this.map);
  }
  }
</script>
