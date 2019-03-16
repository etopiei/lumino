<template>
  <v-container fluid class="routeinput" fill-height>

      <v-layout row align-center>
        <v-flex>
          
          <v-layout row wrap align-center justify-center>

            <v-flex xs12 text-xs-center>
              <h1>
                Where are you going?
              </h1>
            </v-flex>

            <v-flex xs12>

              <v-layout row justify-center>
                <v-flex xs6>
                  <v-text-field solo class="text-field" v-model="start"
                    label="Regular"
                    placeholder="Starting point"
                    >
                  </v-text-field>
                </v-flex>
              </v-layout>
            </v-flex>

            <v-flex xs12>

              <v-layout row justify-center>
                <v-flex xs6>
                  <v-text-field solo class="text-field" v-model="destination"
                    label="Regular"
                    placeholder="Destination"
                    >
                  </v-text-field>
                </v-flex>
              </v-layout>

            </v-flex>

          </v-layout>

        </v-flex>
      </v-layout>

      <!-- <v-layout row wrap align-center>
        <v-layout row justify-center>
          <v-flex xs12>
            <h1>
              Where are you going?
            </h1>
          </v-flex>
        </v-layout>
    		<v-layout row justify-center>
    			<v-flex xs6 >
    				<v-text-field solo class="text-field"
              label="Regular"
              placeholder="Starting point"
            ></v-text-field>
    			</v-flex>
    		</v-layout>
    		<v-layout row justify-center>
    			<v-flex xs6>
    				<v-text-field solo class="text-field"
              label="Regular"
              placeholder="Destination"
            ></v-text-field>
    			</v-flex>
    		</v-layout>
      </v-layout> -->


  </v-container>
</template>

<style scoped lang="scss">

.routeinput {
  background: #e3e3e3;
}

h1 {
  font-size: 2em;
  font-weight: 300;
}

.layout {
  margin: 20px 0px;
}

.text-field {
}
</style>

<script>

export default {
  name: 'routeinput',
  components: {
    
  },
  data () {
    return {
      start: null,
      destination: null
    }
  },
  watch: {
    start: function (val) {
      // this.destination = val
    }
  }
}
</script>
