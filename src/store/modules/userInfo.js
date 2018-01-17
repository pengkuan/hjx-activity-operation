import api from '@/api/index'
import * as types from '../mutation-types.js'
import config from '@/config'

 
// initial state
const state = {
    userId: config.IS_DEV ? '694' : '',
    userName: 'pengkuan', 
    loginToken: config.IS_DEV ? '837b272de2ef7026239146a352b75c88' : '',
    power: { 
        //店奖权限管理
        active_reward_look: true, //查看活动
        active_reward_add: true, //新增活动
        active_reward_edit: true, //编辑活动
        active_reward_setstatus: true, //设置活动状态
        active_reward_setpriority: true, //设置优先级
        active_reward_setdeadline: true, //设置红包领取有效期

        //广告权限管理 -> 上线后改为true
        active_ad_look: config.IS_DEV ? false : true, //查看广告
        active_ad_add: config.IS_DEV ? false : true, //添加广告
        active_ad_edit: config.IS_DEV ? false : true, //编辑广告
        active_ad_del: config.IS_DEV ? false : true, //删除广告 

        //广告位权限管理 -> 上线后改为true
        active_adpos_look: config.IS_DEV ? false : true, //查看广告位
        active_adpos_add: config.IS_DEV ? false : true, //添加广告位
        active_adpos_edit: config.IS_DEV ? false : true, //编辑广告位
        active_adpos_del: config.IS_DEV ? false : true, //删除广告位
    }, 
}

// getters
const getters = {
    userId: state => state.userId,
    userName: state => state.userName,
    loginToken: state => state.loginToken,
    power: state => state.power, 
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
    },
    [types.SET_USERNAME](state,  val ) {
        if(val) state.userName = val
    },
    [types.SET_USERID](state,  val ) {
        if(val) state.userId = val
    },
    [types.SET_LOGIN_TOKEN](state,  val ) {
        if(val) state.loginToken = val
    },
}

export default {
    state,
    getters,
    actions,
    mutations
}
