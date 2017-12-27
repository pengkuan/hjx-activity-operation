import api from '@/api/index'
import * as types from '../mutation-types.js'

 
// initial state
const state = {
    userId: '666',
    userName: 'pengkuan',
    power: { //按钮权限管理
        active_reward_add: true,
        active_reward_look: true,
        active_reward_setpower: true,
        active_reward_setpriority: true
    }
}

// getters
const getters = {
    userId: state => state.userId,
    userName: state => state.userName,
    power: state => state.power
}

// actions
const actions = {

}

// mutations 
const mutations = {
    [types.SET_POWER_LIST](state,  list ) {
        if (list.length == 0)return
        else{
            list.forEach(item =>{
                if(item in state.power) state.power[item] = false
            })
        }
    } 
}

export default {
    state,
    getters,
    actions,
    mutations
}
