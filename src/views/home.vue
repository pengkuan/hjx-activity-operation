<template>
    <div>
        <el-row class="container">
            <!--头部-->
            <el-col :span="24" class="topbar-wrap">
                <div class="topbar-logo topbar-btn">
                    <a href="/"><img src="../assets/images/logo.png" style="margin: 10px 0 0 10px;height:30px;border:0"></a>
                </div>
                <span style="color:red;">{{_Config.ENV_MARK}}</span>
            </el-col>
            <!--中间-->
            <el-col :span="24" class="main">
                <!--左侧导航-->
                <aside :class="collapsed?'menu-collapsed':'menu-expanded'">
                    <!--展开折叠开关-->
                    <div class="menu-toggle" @click.prevent="collapse">
                        <i class="iconfont icon-close_menu" v-show="!collapsed"></i>
                        <i class="iconfont icon-open_menu" v-show="collapsed"></i>
                    </div>
                    <!--菜单展开时的显示情况-->
                    <el-menu v-show="!collapsed" default-active="0"  router>
                        <template v-for="(item,index) in menuList" v-if="item.menuShow">
                            <el-submenu v-if="!item.leaf" :index="index+''">
                                <template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>
                                <el-menu-item v-for="term in item.children" :key="term.path" :index="term.path" v-if="term.menuShow" :class="$route.path==term.path?'is-active-add':''">
                                    {{term.name}}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else-if="item.leaf&&item.children&&item.children.length" :index="item.children[0].path" class="el-submenu__title">
                                <i :class="item.iconCls"></i>{{item.children[0].name}}
                            </el-menu-item>
                        </template>
                    </el-menu>
                    <!--菜单折叠后的显示情况-->
                    <ul v-show="collapsed" class="el-menu collapsed" ref="menuCollapsed">
                        <!-- <template v-for="(item,index) in $router.options.routes" v-if="item.menuShow"> -->
                        <template v-for="(item,index) in menuList" v-if="item.menuShow">
                            <li v-if="!item.leaf" :index="index+''" style="position: relative;" @click="setCollapsed">
                                <div class="el-submenu__title" style="padding-left: 20px;" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)"><i :class="item.iconCls"></i></div>
                                <ul class="el-menu submenu" :class="'submenu-hook-'+index" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)">
                                    <li v-for="term in item.children" :key="term.path" v-if="term.menuShow" class="el-menu-item" style="padding-left: 40px;" :class="$route.path==term.path?'is-active':''">
                                        {{term.name}}
                                    </li>
                                </ul>
                            </li>
                            <li v-else-if="item.leaf&&item.children&&item.children.length" class="el-menu-item el-submenu__title" @click="setCollapsed">
                                <i :class="item.iconCls"></i>
                            </li>
                        </template>
                    </ul>
                </aside>
                <!--右侧内容区-->
                <section class="content-container right-container">
                    <div class="grid-content bg-purple-light">
                        <el-col :span="24" class="content-wrapper">
                            <transition name="fade">
                                <router-view class="router-class"></router-view>
                            </transition>
                        </el-col>
                    </div>
                </section>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import api from '@/api/index'
import { mapMutations } from 'vuex'
export default {
    data() {
        return {
            collapsed: false, 
            menuList: [],
            sysUserName: '',  
        }
    },
    methods: {
        ...mapMutations({
            setPowerList:'userInfo/SET_POWER_LIST',
            setUserName:'userInfo/SET_USERNAME',
            setUserId:'userInfo/SET_USERID',
            setLoginToken:'userInfo/SET_LOGIN_TOKEN', 
        }), 
        setCollapsed() {
            this.collapsed = !this.collapsed
        },
        //折叠导航栏
        collapse: function() {
            this.collapsed = !this.collapsed
        },
        showMenu(i, status) {
            // this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-' + i)[0].style.display = status ? 'block' : 'none'
        },
        // 权限到菜单页面
        getDeepModule(menu) {
            let routes = this.$router.options.routes
            // 清空导航以及导航下子路由的menuShow，注意排除home以及home没有children的容错
            for (let a in routes) {
                if (routes[a].menuShow) {
                    this.$router.options.routes[a].menuShow = false
                }

                let children = this.$router.options.routes[a].children
                if (children) {
                    for (let sub in children) {
                        if (children[sub].menuShow && children[sub].menuShow == true) {
                            this.$router.options.routes[a].children[sub].menuShow = false
                        }
                    }
                }
            }
            for (let i in menu) {
                for (let index in routes) {
                    if (menu[i].name == routes[index].name) {
                        this.$router.options.routes[index].menuShow = true
                    }
                    if (routes[index].children && menu[i].sub_menu) {
                        for (let n in menu[i].sub_menu) {
                            for (let m in routes[index].children) {
                                if (menu[i].sub_menu[n].name == routes[index].children[m].name && routes[index].children[m].menuShow == false) {
                                    this.$router.options.routes[index].children[m].menuShow = true
                                }
                            }
                        }
                    }
                }
            } 
            this.menuList = this.$router.options.routes
        },
        // 本地环境，虚拟菜单
        get_user_authority_test() { 
            // 防止一些接口需要登录信息,而跳转到登录页面
            // this._Util.setCookie('user_id', '694')
            // this._Util.setCookie('user_name', '测试')
            // this._Util.setCookie('login_token', 'bfa1ac797d85704806ba200c19f2af01')
            this.menuList = [
                { 
                    name: '活动管理',
                    sub_menu: [
                        { name: '红包管理' }, 
                        { name: '发放记录' },
                        { name:'领取有效期'},
                    ] 
                },
                { 
                    name: '广告列表',
                    sub_menu: [
                        { name: '换机侠顾客端-移动端' }, 
                        { name: '换机侠D端-移动端' },
                        {name:'换机侠S端-移动端'},
                    ] 
                },
                { 
                    name: '广告位设置',
                    sub_menu: [
                        {name:'广告位管理'},
                    ] 
                }
            ]
            this.getDeepModule(this.menuList) 

            setTimeout(() =>{
                let powerList = [ 'active_reward_look', 'active_reward_setStatus', 'active_reward_setpriority','active_reward_add','active_adpos_look']
                this.setPowerList(powerList)
            }  ,1000)

        },
        // 线上环境，请求菜单
        get_user_authority() {
            let host = encodeURIComponent(this._Config.RETURN_URL),
                userid = this._Util.getQueryStringByName('user_id'),
                token = this._Util.getQueryStringByName('login_token'),
                params = {
                    loginUserId: userid,
                    loginToken: token,
                    loginSystemId: this._Config.SYSTEM_ID
                }

            if (!userid) {
                window.location.href = `${this._Config.POWER_CENTER_LOGIN}/login?system_id=${this._Config.SYSTEM_HOME_ID}&jump_url=${host}`
            } else {
                const loading = this.$loading({
                    lock: true,
                    text: '玩命加载中...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                }) 
                this.setUserId(this._Util.getQueryStringByName('user_id'))
                this.setLoginToken(this._Util.getQueryStringByName('login_token'))
                api.get_login_user_info(params).then((res) => { 
                    if (res._ret != '0') {
                        loading.close()
                        this.$message({
                            message: res._errStr,
                            type: 'warning'
                        })
                        return
                    } 
                    loading.close() 
                    // this.showLoginName()
                    // 显示菜单
                    this.menuList = res.menu
                    this.getDeepModule(this.menuList)
                    // 接收权限数据,同步到vuex
                    let powerList = res.access_flags
                    this.setPowerList(powerList)  
                    /****** 设置用户信息 *****/
                    this.setUserName(res.user_info.username)  
                })
            }
        }

    },
    mounted() {}, 
    created() {
        if (this._Config.IS_NO_DEV) { 
            this.get_user_authority()
        } else {
            this.get_user_authority_test()
        }
    }
}

</script>
<style type="text/css" scoped>
.icon-down {
    font-size: 12px
}

.gohome {
    font-size: 14px;
    cursor: pointer;
}

.gohome>a:hover {
    color: #409EFF;
}

.gohome>a {
    color: #fff
}

</style>
<style>
.el-menu {
    border-right: 0
}

.el-menu-item,
.el-submenu__title {
    color: #fff;
}

.el-submenu__title:hover {
    background-color: #00C1DE;
}

.el-submenu .el-menu-item {
    background-color: #333744
}

.el-submenu .el-menu-item:hover {
    background-color: #4A5064
}


/*.el-submenu .el-menu-item.is-active,
.el-menu-item.is-active,
.el-submenu .el-menu-item.is-active:hover,
.el-menu-item.is-active:hover {
    background-color: #00C1DE;
    color: #fff;
}
.el-submenu .el-menu-item.is-active-add,
.el-menu-item.is-active-add,
.el-submenu .el-menu-item.is-active-add:hover,
.el-menu-item.is-active-add:hover {
    background-color: #00C1DE;
    color: #fff;
}*/

.el-menu .iconfont {
    vertical-align: baseline;
    margin-right: 6px;
}

.warp-breadcrum {
    padding: 10px 0px;
    border-bottom: 1px solid #efefef;
}

.warp-main {
    padding-top: 20px;
}

</style>
<style scoped lang="scss">
.container {
    position: absolute;
    top: 0px;
    bottom: 0px;
    width: 100%;
    min-width:1226px;

    .topbar-wrap {
        height: 50px;
        line-height: 50px;
        background: #373d41;
        padding: 0px;

        .topbar-btn {
            color: #fff;
        }
        .topbar-btn:hover {
            // background-color: #4A5064;
        }
        .topbar-logo {
            float: left;
            text-align: center;
            width: 170px;
            line-height: 26px;
            cursor: pointer;
            a {
                display: inline-block;
            }
        }
        .topbar-title {
            float: left;
            text-align: center;
            width: 129px;
        }
        .topbar-account {
            float: right;
            padding-right: 12px;
        }
        .userinfo-inner {
            cursor: pointer;
            color: #fff;
            padding-left: 10px;
        }
    }
    .main {
        display: flex;
        position: absolute;
        top: 50px;
        bottom: 0px;
        overflow: hidden;
    }
    aside {
        overflow-y: auto;
        flex: 0 0 200px;
        background-color: #333744;
        width: 200px;
        .el-menu {
            border-radius: 0px;
            background-color: #333744;
        }
        .collapsed {
            width: 50px;
            .submenu {
                position: absolute;
                top: 0px;
                left: 50px;
                z-index: 9999;
                height: auto;
                display: none;
            }
        }
    }
    .menu-collapsed {
        flex: 0 0 50px;
        width: 50px;
    }
    .menu-expanded {
        flex: 0 0 200px;
        width: 200px;
        .el-menu {
            width: 100%!important
        }
    }
    .menu-toggle {
        background: #4A5064;
        text-align: center;
        color: white;
        height: 26px;
        line-height: 30px;
    }
    .content-container {
        background: #fff;
        flex: 1;
        overflow-y: auto;
        padding: 10px;
        .content-wrapper {
            background-color: #fff;
            box-sizing: border-box;
            position: relative;
            .router-class {
                position: absolute;
                width: 100%;
                left: 0;
                top: 0;
            }
            .fade-enter-active,
            .fade-leave-active {
                transition: all .3s;
            }

            .fade-enter {
                opacity: 0; // transform: translate3d(10%, 0, 0);
            }

            .fade-leave-to {
                opacity: 0; // transform: translate3d(-10%, 0, 0);
            }
        }
    }
}

</style>
