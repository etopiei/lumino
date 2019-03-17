<template>
  <v-app >
    <v-toolbar app flat v-bind:class=" { purple: shouldBePurple }">
      <router-link to="/">
        <v-toolbar-title class="catamaran brand text-lowercase">
          lumino.
        </v-toolbar-title>
      </router-link>

      <v-spacer></v-spacer>

      <span>
        UNIHACK 2019
      </span>
    </v-toolbar>

    <v-content>
      <router-view/>
    </v-content>

  </v-app>
</template>

<style lang="scss">

.v-toolbar {
  span {
    font-weight:300;
  }

  .brand {
    font-size:2.5em;
    font-weight:100;
  }
}

.purple {
  background-image: linear-gradient(135deg,#7753eb,#4264fb);
  div, span {
    color:white;
  }
}

a {
  text-decoration: none;
  color:none;
}


</style>

<script>

export default {
  name: 'App',
  components: {
    
  },
  computed: {
    shouldBePurple() {
      return this.$route.path !== '/';
    }
  },
  data () {
    return {
      //
    }
  }
}
</script>
