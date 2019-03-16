import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import RouteInput from './views/RouteInput.vue'
import RouteView from './views/RouteView.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'routeinput',
      component: RouteInput
    },
    {
      path: '/route/:start/:destination',
      name: 'routeview',
      component: RouteView
    }
  ]
})
