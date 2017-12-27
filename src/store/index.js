import Vue from 'vue'
import Vuex from 'vuex'
import heavyDate from './modules/heavyDate'
import userInfo from './modules/userInfo'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        heavyDate:{
        	namespaced: true,
        	modules:[heavyDate]
        },
        userInfo:{
        	namespaced: true,
        	modules:[userInfo]
        }
    }
})
