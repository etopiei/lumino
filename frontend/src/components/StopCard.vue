<template>
	<v-list-group v-if="!stop.first && !stop.last">
		<template v-slot:activator>
			<v-list-tile class="stopheader">
				<v-list-tile-action >
					<v-icon :color="stop.icon_color">{{ stop.icon }}</v-icon>
				</v-list-tile-action>

				<v-list-tile-content>
					<v-list-tile-title class="stoptitle">{{ stop.name }} </v-list-tile-title>
				</v-list-tile-content>

				<v-list-tile-avatar class="score low">
					{{ stop.safety.index }}
				</v-list-tile-avatar>
			</v-list-tile>
		</template>

		<v-list dense>
			<v-list-tile class="stopdetail">
				<v-list-tile-action>
				</v-list-tile-action>

				<v-icon class="icon" v-if="stop.safety.details.lighting">check</v-icon>
				<v-icon class="icon" v-else>close</v-icon>
				<v-list-tile-content class="text">
					Lighting
				</v-list-tile-content>
			</v-list-tile>
			<v-list-tile class="stopdetail">
				<v-list-tile-action>
				</v-list-tile-action>

				<v-icon class="icon" v-if="stop.safety.details.psos">check</v-icon>
				<v-icon class="icon" v-else>close</v-icon>
				<v-list-tile-content class="text">
					Protective Services
				</v-list-tile-content>
			</v-list-tile>
			<v-list-tile class="stopdetail">
				<v-list-tile-action>
				</v-list-tile-action>

				<v-icon class="icon" v-if="stop.safety.details.cctv">check</v-icon>
				<v-icon class="icon" v-else>close</v-icon>
				<v-list-tile-content class="text">
					CCTV
				</v-list-tile-content>
			</v-list-tile>
			<v-list-tile class="stopdetail" v-if="stop.safety.high_crime">
				<v-list-tile-action>
				</v-list-tile-action>

				<v-icon class="icon">close</v-icon>
				<v-list-tile-content class="text">
					High crime area
				</v-list-tile-content>
			</v-list-tile>
		</v-list>


  </v-list-group>
  <v-list-tile class="stopheader" v-else>
	<v-list-tile-action >
		<v-icon :color="stop.icon_color">{{ stop.icon }}</v-icon>
	</v-list-tile-action>

	<v-list-tile-content>
		<v-list-tile-title class="stoptitle">{{ stop.name }}</v-list-tile-title>
	</v-list-tile-content>

	<v-list-tile-avatar class="">
	</v-list-tile-avatar>
  </v-list-tile>
</template>

<style scoped lang="scss">

.stopheader .stoptitle {
	font-size: 1em;
}
.stopdetail {
	.icon {
		padding: 0px 5px;
	}
}
.score {
	font-size: 1em;
}
.score.low {
	color: red;
}
.score.high {
	color:green;
}


</style>


<script>
  export default {
    name: 'stopcard',
    props: [ 'stop' ],
    data () {
      return {
      	expanded: false,
      }
    },
    methods: {
   
    },
    computed: {
   
    },
    mounted() {

    }
  }
</script>