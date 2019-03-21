<template>
  <v-app>
    <!-- <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Vuetify</span>
        <span class="font-weight-light">MATERIAL DESIGN</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        flat
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
      >
        <span class="mr-2">Latest Release</span>
      </v-btn>
    </v-toolbar> -->

    <v-content>
      <router-view />
    </v-content>
    <v-footer class="footer" text-xs-center>
        <v-layout justify-center>
          <v-flex xs12>Please get in touch at<span class="link">dylan.kay@me.com</span></v-flex>
        </v-layout>
    </v-footer>
  </v-app>
</template>

<style>
.footer {
  padding: 0px 20%;
  text-align:center;
}
.link {
  text-decoration: underline;
  margin: 0px 5px;
}
</style>

<script>

export default {
  name: 'App',
  components: {
    
  },
  data () {
    return {
      //
    }
  }
}
</script>
