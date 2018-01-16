<template>
    <div id = "rewardList">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>红包管理</el-breadcrumb-item>
        </el-breadcrumb>
        <br>
        <el-tabs type="border-card"  v-model="activeName" >
            <!-- ################### 随机 ###################### -->
            <el-tab-pane label="随机" name="ramdom">
                <!-- 搜索start -->
                <el-form :inline="true" :model="random_reward.search" ref="random_reward.search"  size="mini" class="demo-form-inline">
                    <el-form-item label="活动名称:" prop="activityName">
                        <el-input v-model="random_reward.search.activityName" @change="random_reward.search.activityName = _Util.Trim(random_reward.search.activityName)" @keyup.13.native="random_init($event)" placeholder="请输入活动名称" ></el-input>
                    </el-form-item>
                    <el-form-item label="活动状态:" prop="activityValid">
                        <el-select v-model="random_reward.search.activityValid" placeholder="请选择活动状态">
                            <el-option label="全部" value="0"></el-option>
                            <el-option label="启用" value="1"></el-option>
                            <el-option label="禁用" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="random_init">查询</el-button>
                        <el-button @click="random_reset('random_reward.search')">清空</el-button>
                    </el-form-item>
                </el-form>
                <div class="operate">
                    <el-button type="primary" @click="random_add" :disabled="power.active_reward_add" size="mini">新增</el-button>
                </div>
                <!-- 搜索end -->
                <el-table size="mini" border :data="random_reward.list" style="width: 100%,min-height:300px">
                    <el-table-column  prop="activityId" label="活动ID"></el-table-column>
                    <el-table-column  prop="activityLevel" label="优先级"></el-table-column>
                    <el-table-column  label="活动名称">
                        <template slot-scope="scope">
                            <span v-if="scope.row.activityName.length<8">{{scope.row.activityName}}</span>
                            <span v-else>
                                {{scope.row.activityName.substring(0,8)}}...
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column width="260px" label="生效时间">
                        <template slot-scope="scope">
                            <span v-if="!scope.row.activityStartTime">不限</span>
                            <span v-else>
                                {{scope.row.activityStartDate}}~{{scope.row.activityEndDate}}&nbsp;&nbsp;
                                {{scope.row.activityStartTime.substr(0,5)}}~{{scope.row.activityEndTime.substr(0,5)}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column  prop="publicAlgorithmCoefficient" label="算法系数"></el-table-column>
                    <el-table-column  label="总额上限状态">
                        <template slot-scope="scope">
                            <span v-if="scope.row.limitStatus == '0' ">未触发</span>
                            <span v-else-if="scope.row.limitStatus == '1' ">已触发</span>
                        </template>
                    </el-table-column>
                    <el-table-column  label="活动状态">
                        <template slot-scope="scope">
                            <span v-if="scope.row.valid == '0' ">禁用</span>
                            <span v-else-if="scope.row.valid == '1' ">启用</span>
                        </template>
                    </el-table-column>
                    <el-table-column  prop="updateUserName" label="最近操作人"></el-table-column>
                    <el-table-column width="240px" label="操作">
                        <template slot-scope="scope">
                            <el-button class='indexFunBtn' type="text" :disabled="power.active_reward_look" @click="random_check(scope.row.activityId,scope.row.valid)" size="mini">查看</el-button>
                            <el-button v-if="scope.row.valid == '1' " class='indexFunBtn hjx-danger' type="text" :disabled="power.active_reward_setStatus" @click="setStatus('1',scope.row.activityId , '0',scope.row.limitStatus)" size="mini">禁用</el-button>
                            <span v-else >
                                <el-button class='indexFunBtn' type="text" :disabled="power.active_reward_edit" @click="random_edit(scope.row.activityId)" size="mini">编辑</el-button>
                                <el-button class='indexFunBtn' type="text" :disabled="power.active_reward_setStatus" @click="setStatus('1',scope.row.activityId , '1',scope.row.limitStatus)" size="mini">启用</el-button>
                            </span>

                            <span>
                                <el-button class = 'indexFunBtn' type="text"  :disabled="power.active_reward_setpriority" @click="setActivityLevel('1',scope.row.activityId , '0')"  size="mini">上移</el-button>
                                <el-button class = 'indexFunBtn' type="text"  :disabled="power.active_reward_setpriority" @click="setActivityLevel('1',scope.row.activityId , '1')"  size="mini">下移</el-button>
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="hjx-pagination">
                    <el-pagination @current-change="random_handleCurrentChange" :current-page="random_reward.currentPage"   layout="total, prev, pager, next, jumper" :total="random_reward.total">
                    </el-pagination>
                </div>
            </el-tab-pane>
            <!-- ################### 定额定向 ###################### -->
            <el-tab-pane label="定额定向" name="fixed">
                <!-- 搜索start -->
                <el-form :inline="true" :model="fixed_reward.search" ref="fixed_reward.search" size="mini" class="demo-form-inline">
                    <el-form-item label="活动名称:" prop="activityName">
                        <el-input v-model="fixed_reward.search.activityName" @change="fixed_reward.search.activityName = _Util.Trim(fixed_reward.search.activityName)" @keyup.13.native="fixed_init($event)" placeholder="请输入活动名称"></el-input>
                    </el-form-item>
                    <el-form-item label="活动状态:" prop="activityValid">
                        <el-select v-model="fixed_reward.search.activityValid" placeholder="请选择活动状态">
                            <el-option label="全部" value="0"></el-option>
                            <el-option label="启用" value="1"></el-option>
                            <el-option label="禁用" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="fixed_init">查询</el-button>
                        <el-button @click="fixed_reset('fixed_reward.search')">清空</el-button>
                    </el-form-item>
                </el-form>
                <div class="operate">
                    <router-link to="/reward/fixedAdd">
                        <el-button type="primary" size="mini">新增</el-button>
                    </router-link>
                </div>
                <!-- 搜索end -->
                <el-table size="mini" border :data="fixed_reward.list" style="width: 100%,min-height:300px">
                    <el-table-column  prop="activityId" label="活动ID"></el-table-column>
                    <el-table-column  prop="activityLevel" label="优先级"></el-table-column>
                    <el-table-column  label="活动名称">
                        <template slot-scope="scope">
                            <span v-if="scope.row.activityName.length<8">{{scope.row.activityName}}</span>
                            <span v-else>
                                {{scope.row.activityName.substring(0,8)}}...
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column  width="260px" label="生时间">
                        <template slot-scope="scope">
                            <span v-if="!scope.row.activityStartTime">不限</span>
                            <span v-else>
                                {{scope.row.activityStartDate}}~{{scope.row.activityEndDate}}&nbsp;&nbsp;
                                {{scope.row.activityStartTime.substr(0,5)}}~{{scope.row.activityEndTime.substr(0,5)}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column  label="单奖金额">
                        <template slot-scope="scope">
                            <span> {{(scope.row.directAmount / 100).toFixed(2)}} </span>
                        </template>
                    </el-table-column>
                    <el-table-column  label="总额上限状态">
                        <template slot-scope="scope">
                            <span v-if="scope.row.limitStatus == '0' ">未触发</span>
                            <span v-else-if="scope.row.limitStatus == '1' ">已触发</span>
                        </template>
                    </el-table-column>
                    <el-table-column  label="活动状态">
                        <template slot-scope="scope">
                            <span v-if="scope.row.valid == '0' ">禁用</span>
                            <span v-else-if="scope.row.valid == '1' ">启用</span>
                        </template>
                    </el-table-column>
                    <el-table-column  prop="updateUserName" label="最近操作人"></el-table-column>
                    <el-table-column width="240px" label="操作">
                        <template slot-scope="scope">
                            <el-button class='indexFunBtn' type="text" :disabled="power.active_reward_look" @click="fixed_check(scope.row.activityId,scope.row.valid)" size="mini">查看</el-button>
                            <el-button v-if="scope.row.valid == '1' " :disabled="power.active_reward_setStatus" class='indexFunBtn hjx-danger' type="text" @click="setStatus('2',scope.row.activityId , '0')" size="mini">禁用</el-button>
                            <span v-else >
                                <el-button class='indexFunBtn' type="text" :disabled="power.active_reward_edit" @click="fixed_edit(scope.row.activityId)" size="mini">编辑</el-button>
                                <el-button class='indexFunBtn' type="text" :disabled="power.active_reward_setStatus" @click="setStatus('2',scope.row.activityId , '1',scope.row.limitStatus)" size="mini">启用</el-button>
                            </span>
                            <span>
                                <el-button class = 'indexFunBtn' type='text' :disabled="power.active_reward_setpriority" @click="setActivityLevel('1',scope.row.activityId , '0')"  size="mini">上移</el-button>
                                <el-button class = 'indexFunBtn' type='text' :disabled="power.active_reward_setpriority" @click="setActivityLevel('1',scope.row.activityId , '1')"  size="mini">下移</el-button>
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="hjx-pagination">
                    <el-pagination @current-change="fixed_handleCurrentChange" :current-page="fixed_reward.currentPage"   layout="total, prev, pager, next, jumper" :total="fixed_reward.total">
                    </el-pagination>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import api from '@/api/index'
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            activeName:'ramdom',
            random_reward: { //随机
                list: [],
                search: {
                    activityType: "1",
                    activityName: '',
                    activityValid: '0',
                    pageIndex: '0',
                    pageSize: '10',
                },
                currentPage: 1,
                total: 0

            },
            fixed_reward: { //固定
                list: [],
                search: {
                    activityType: "2",
                    activityName: '',
                    activityValid: '0',
                    pageIndex: '0',
                    pageSize: '10',
                },
                currentPage: 1,
                total: 0

            }

        }
    },
    computed:{
        ...mapGetters({
            'userId':'userInfo/userId',
            'userName':'userInfo/userName',
            'power':'userInfo/power'
        })
    },
    
    mounted() {
        if(this.$route.query.show) this.activeName = this.$route.query.show
        this.random_init()
        this.fixed_init()
    },
    methods: {
       
        /*****更改状态*****/
        setStatus(activityType,id,status,limitStatus) {
            if(limitStatus == '1'){
                this.$alert('该活动上限已触发，不支持启用')
                return
            }
            let reqData = {
                updateUserId:this.userId,
                updateUserName:this.userName,
                activityId:id,
                valid: status
            }
            api.update_activity_valid(reqData).then(res =>{
                if(res._ret != 0){
                    this.$alert(res._errStr)
                    return
                }
                this.$message(res._errStr)
                if(activityType == '1') this.random_init()
                else this.fixed_init()
            })
        },

        /*****更改优先级*****/
        setActivityLevel(activityType,id,setLevel){
            let reqData = {
                updateUserId:this.userId,
                updateUserName:this.userName,
                activityId:id,
                changeLevel: setLevel
            }
            api.change_activity_level(reqData).then(res =>{
                if(res._ret != 0){
                    this.$alert(res._errStr)
                    return
                }
                this.$message(res._errStr)
                if(activityType == '1') this.random_init()
                else this.fixed_init()
            })
        },
        
        /*****随机*****/
        random_reset(formName){
            this.$refs[formName].resetFields()
            this.random_init()
        },
        random_init() {
            api.search_activity_info_list(this.random_reward.search).then(res => {
                if(res._ret != 0){
                    this.$alert(res._errStr)
                    return
                }
                this.random_reward.list = res.activityList
                this.random_reward.total =Number(res.pageInfo.total)
            })
        },
        random_handleCurrentChange(val){
            this.currentPage = val
            this.random_reward.search.pageIndex = String(val - 1)
            this.random_init()
        },
        random_check(id,status){
            this.$router.push({
                name:'randomDetail',
                query:{id:id,status:status}
            })
        },
        random_add(){
            this.$router.push({
                name:'randomAdd',
            })
        },
        random_edit(id){
            this.$router.push({
                name:'randomEdit',
                query:{id:id}
            })
        },
        /*****固定*****/
        fixed_reset(formName){
            this.$refs[formName].resetFields()
            this.fixed_init()
        },
        fixed_init() {
            api.search_activity_info_list(this.fixed_reward.search).then(res => {
                if(res._ret != 0){
                    this.$alert(res._errStr)
                    return
                }
                this.fixed_reward.list = res.activityList
                this.fixed_reward.total =Number(res.pageInfo.total)
            })
        },
        fixed_handleCurrentChange(val){
            this.currentPage = val
            this.fixed_reward.search.pageIndex = String(val - 1)
            this.fixed_init()
        },
        fixed_check(id,status){
            this.$router.push({
                name:'fixedDetail',
                query:{id:id,status:status}
            })
        },
        fixed_add(){
            this.$router.push({
                name:'fixedAdd',
            })
        },
        fixed_edit(id){
            this.$router.push({
                name:'fixedEdit',
                query:{id:id}
            })
        },

    }
}

</script>
<style type="text/css">
    .hjx-danger.el-button--text{color:#FA5555;}
</style>