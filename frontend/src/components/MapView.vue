<template>
  <div>
   <!-- EMBED MAP ELEMENT HERE -->
   MapView
   {{ routeObject }}
  </div>
</template>

<style>

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

      console.log("Loading map with route:", this.routeObject)
    }
  }
</script>
