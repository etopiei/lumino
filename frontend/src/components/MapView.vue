<template>
  <div class="mapview">
   <div id='map' fill-height v-bind:style="{ height: mapHeight }"></div>
  </div>
</template>

<style>
.mapview {
  position: relative;
}
#map { position: absolute; top: 0; left: 0; width:100%; }
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

function make_everything_happen(route, map, featureGroup) {
  clearRoutes(featureGroup);
  map.setView([-37.818437, 144.967198], 13)
  .addLayer(L.mapbox.styleLayer('mapbox://styles/mapbox/dark-v9'));
  let selected = true;
  let old_total = null;
  let first = true;
  let total = 0;
  let points = [];
  route.legs.forEach(leg => {
    const extra_points = polyline.decode(leg.legGeometry.points);
    points = points.concat(extra_points);
    drawRoute(points, '#4264fb', featureGroup);
  });
}

  export default {
    name: 'mapview',
    props: [ 'routeObject' ],
    data () {
      return {
        map: null,
        featureGroup: null
      }
    },
    computed: {
      mapHeight() {
        console.log(window.height)
        return '1200px';
      }
    },
    methods: {
      update_data(selected) {
        make_everything_happen(this.routeObject.routes[selected], this.map, this.featureGroup)
      },
    },
    mounted() {
      // This function is called once the component is ready
      // Set up map, draw etc
      this.map = L.mapbox.map('map');

      this.featureGroup = L.featureGroup().addTo(this.map);
      console.log("Loading map with route:", this.routeObject, this.map)
      make_everything_happen(this.routeObject.routes[0], this.map, this.featureGroup);

      // $(window).on("resize", function () { $("#map").height($(window).height()); map.invalidateSize(); }).trigger("resize");
  }
  }
</script>
