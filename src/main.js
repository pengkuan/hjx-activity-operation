import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/fonts/iconfont.css'
import store from './store/index'
import Util from '@/util/index'
import Config from '@/config/index.js'

Vue.config.productionTip = false
Vue.prototype._Util = Util
Vue.prototype._Config = Config
Vue.use(ElementUI)

new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
})
