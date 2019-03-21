<template>
  <v-container fluid class="home" text-xs-center grid-list-xl>   

    <v-layout row justify-center>
      <v-flex xs6>
        <h1 class="brand display-3">lumino.</h1>
        <span class="subheading">Coming to Melbourne very soon!</span>
        <v-form>
          <v-text-field
            box
            label="Add yourself to our mailing list"
            required
            append-icon="send"
            @click:append=""
          ></v-text-field>
        </v-form>
      </v-flex>
    </v-layout>

    <v-layout row wrap justify-center>

      <v-flex xs8>

        <v-sheet
          class="d-flex sheet"
          color="grey lighten-3"
          elevation="0">
          <v-layout wrap>
            <v-flex xs12>
              <h6 class="title">Do you feel unsafe on public transport?</h6>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Harum maiores modi quidem veniam, expedita quis laboriosam, ullam facere adipisci, iusto, voluptate sapiente corrupti asperiores rem nemo numquam fuga ab at.</p>
            </v-flex>
          </v-layout>
        </v-sheet>

      </v-flex>

      <v-flex xs8>

        <v-sheet
          class="d-flex sheet"
          color="grey lighten-3"
          elevation="0">
          <v-layout wrap>
            <v-flex xs12>
              <h6 class="title">How does it work?</h6>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Harum maiores modi quidem veniam, expedita quis laboriosam, ullam facere adipisci, iusto, voluptate sapiente corrupti asperiores rem nemo numquam fuga ab at.</p>
            </v-flex>
          </v-layout>
        </v-sheet>

      </v-flex>

      <v-flex xs8>

        <v-sheet
          class="d-flex sheet"
          color="blue lighten-3"
          elevation="6">
          <v-layout wrap>
            <v-flex xs6>
              <h6 class="title">Open Source</h6>
              <p>Check us out on GitHub!</p>
              <a href="https://github.com/etopiei/lumino">
                <v-img
                  :src="require('../assets/github.png')"
                  contain
                  class="d-inline-flex"
                  height="80px"
                  width="80px"
                  ></v-img>
              </a>
            </v-flex>
            <v-flex xs6>
              <h6 class="title">UNIHACK</h6>
              <p>We built the first version of lumino in 24 hours at Unihack Melbourne. Feel free to try out the UNIHACK version below. <small>Warning! Plenty of bugs!</small></p>
              <v-btn color="white" block>Try Demo</v-btn>
              <a class="devpost" href="https://devpost.com/software/lumino">
                View Lumino on Devpost
              </a>
            </v-flex>
          </v-layout>
        </v-sheet>

      </v-flex>

    </v-layout>

  </v-container>
</template>

<style lang="scss" scoped>
a {
  // text-decoration: none;
}
.brand {
  font-weight:100;
}
.sheet {
  padding: 20px;
  h6 {
    padding-bottom:4px;
  }
}
small {
  color:blue;
}
.devpost {
  color:white;
}
</style>

<script>

  export default {
    name: 'home',
    components: {
      
    }
  }
</script>
