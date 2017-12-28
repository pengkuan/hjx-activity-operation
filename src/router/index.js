import Vue from 'vue'
import Router from 'vue-router'
import Reward from './reward'
import addList from './addList'
import adPosition from './adPosition' 
const home = resolve => require(['@/views/home'], resolve)
const index = resolve => require(['@/views/index'], resolve)  

const commonDetail = resolve => require(['@/base/commonDetail'], resolve)  
const commonAdd = resolve => require(['@/base/commonAdd'], resolve)  
const commonEdit = resolve => require(['@/base/commonEdit'], resolve) 

Vue.use(Router)

let router = new Router({ 
    routes: [
        {
            path: '/',
            name: 'home', 
            component: home,
            redirect: '/index',
            leaf: true, // 只有一个节点
            menuShow: true,
            iconCls: 'iconfont icon-home_fill_light', // 图标样式class
            children: [
                {path: '/index', component: index, name: '首页', menuShow: true}
            ]
        },
        {
            path: '/',
            name: '活动管理', 
            component: home,
            menuShow: true,
            iconCls: 'iconfont icon-huodong', // 图标样式class
            children: [
                {path: '/reward/list', component: Reward.list, name: '红包管理', menuShow: true},
                {path: '/reward/randomAdd', component: Reward.randomAdd, name: 'randomAdd', menuShow: false},
                {path: '/reward/randomEdit', component: Reward.randomEdit, name: 'randomEdit', menuShow: false},
                {path: '/reward/randomDetail', component: Reward.randomDetail, name: 'randomDetail', menuShow: false},
                {path: '/reward/fixedAdd', component: Reward.fixedAdd, name: 'fixedAdd', menuShow: false},
                {path: '/reward/fixedEdit', component: Reward.fixedEdit, name: 'fixedEdit', menuShow: false},
                {path: '/reward/fixedDetail', component: Reward.fixedDetail, name: 'fixedDetail', menuShow: false},
                {path: '/rewardRecord/index', component: Reward.record, name: '发放记录', menuShow: true},
                {path: '/setValidTime/index', component: Reward.setValidTime, name: '设置有效期', menuShow: true}
            ]
        },
        {
            path: '/',
            component: home,
            name: '广告列表',
            menuShow: true, 
            iconCls: 'iconfont icon-guanggao',  
            children: [
                {path: '/adList/hjxCustomer', component: addList.hjxCustomer, name: '换机侠顾客端-移动端', menuShow: true},
                {path: '/adList/hjxD', component: addList.hjxD, name: '换机侠D端-移动端', menuShow: true},
                {path: '/adList/hjxS', component: addList.hjxS, name: '换机侠S端-移动端', menuShow: true},
                {path: '/commonAdd', component: commonAdd, name: '添加新广告', menuShow: false}, 
                {path: '/commonEdit', component: commonEdit, name: '编辑广告', menuShow: false},
                {path: '/commonDetail', component: commonDetail, name: '广告详情', menuShow: false}, 
            ]
        },
        {
            path: '/',
            component: home,
            name: '广告位设置',
            menuShow: true, 
            iconCls: 'iconfont icon-settings_light', 
            children: [
                {path: '/adPosition/adPosSet', component: adPosition.adPosSet, name: '广告位管理', menuShow: true},
                {path: '/adPosition/add', component: adPosition.add, name: '添加广告位', menuShow: false},
                {path: '/adPosition/edit', component: adPosition.edit, name: '修改广告位', menuShow: false},
                {path: '/adPosition/detail', component: adPosition.detail, name: '广告位详情', menuShow: false}, 
            ]
        }
        
    ]
})


export default router
