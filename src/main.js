import Vue from 'vue'
import App from './App.vue'
import router from './router.js'
import store from './store'
import ElementUI from 'element-ui'
import httpPlugin from '@/utils/http'
import qs from 'qs'
import VueCookie from 'vue-cookie'
import moment from 'moment'
import './assets/style/reset.css'
import './assets/icon/iconfont.css'
import './assets/style/common.less'
import 'element-ui/lib/theme-chalk/index.css'

Vue.prototype.$qs = qs
Vue.prototype.$moment = moment

Vue.config.productionTip = false

// Vue.component('vue-simplemde', VueSimplemde)

Vue.use(ElementUI)
Vue.use(httpPlugin)
Vue.use(VueCookie)

router.beforeEach((to, from, next) => {
  let token = store.state.token
  if (!token && to.path !== '/login') {
    next({
      path: '/login'
    })
    return;
  }
  next()
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')