import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'
import colors from 'vuetify/es5/util/colors'

Vue.use(Vuetify, {
  iconfont: 'md',
  theme: {
    primary: colors.red.darken1, // #E53935
    secondary: colors.blue.darken1, // #FFCDD2
    accent: '#4264fb'
  }
})
