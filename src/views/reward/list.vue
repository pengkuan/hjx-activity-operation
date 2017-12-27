<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>抽奖设置</el-breadcrumb-item>
        </el-breadcrumb>
        <br>
        <el-tabs type="border-card">
            <!-- ################### 随机 ###################### -->
            <el-tab-pane label="随机">
                <!-- 搜索start -->
                <el-form :inline="true" :model="random_reward.search" ref="random_reward.search"  size="small" class="demo-form-inline">
                    <el-form-item label="活动名称:" prop="activityName">
                        <el-input v-model="random_reward.search.activityName" placeholder="请输入活动名称"></el-input>
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
                        <el-button @click="random_reset('random_reward.search')">重置</el-button>
                    </el-form-item>
                </el-form>
                <div class="operate">
                    <el-button type="primary" @click="random_add" :disabled="power.active_reward_add" size="mini">新增</el-button>
                </div>
                <!-- 搜索end -->
                <el-table border :data="random_reward.list" style="width: 100%,min-height:300px">
                    <el-table-column width="80px" prop="activityId" label="活动ID"></el-table-column>
                    <el-table-column width="80px" prop="activityLevel" label="优先级"></el-table-column>
                    <el-table-column prop="activityName" label="活动名称"></el-table-column>
                    <el-table-column prop="activityStartTime" label="生效时间"></el-table-column>
                    <el-table-column width="80px" prop="publicAlgorithmCoefficient" label="算法系数"></el-table-column>
                    <el-table-column width="160px" label="总额上限状态">
                        <template slot-scope="scope">
                            <span v-if="scope.row.limitStatus == '0' ">未触发</span>
                            <span v-else-if="scope.row.limitStatus == '1' ">触发超额</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="80px" label="活动状态">
                        <template slot-scope="scope">
                            <span v-if="scope.row.valid == '0' ">禁用</span>
                            <span v-else-if="scope.row.valid == '1' ">启用</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="120px" prop="updateUserName" label="最近操作人"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button class='indexFunBtn' type="primary" :disabled="power.active_reward_look" @click="random_check(scope.row.activityId,scope.row.valid)" size="small">查看</el-button>
                            <el-button v-if="scope.row.valid == '1' " class='indexFunBtn' type="danger" :disabled="power.active_reward_setpower" @click="setStatus('1',scope.row.activityId , '0',scope.row.limitStatus)" size="small">禁用</el-button>
                            <el-button v-else class='indexFunBtn' type="primary" :disabled="power.active_reward_setpower" @click="setStatus('1',scope.row.activityId , '1',scope.row.limitStatus)" size="small">启用</el-button>
                            <span v-if="scope.$index == 0 && random_reward.list.length ==1 "></span>
                            <span v-else-if="scope.$index == 0 && random_reward.list.length !=1 ">
                                <el-button class = 'indexFunBtn' :disabled="power.active_reward_setpriority" @click="setActivityLevel('1',scope.row.activityId , '1')"  size="small">下移</el-button>
                            </span>
                            <span v-else-if="scope.$index != 0 && scope.$index == random_reward.list.length-1">
                                <el-button class = 'indexFunBtn' :disabled="power.active_reward_setpriority" @click="setActivityLevel('1',scope.row.activityId , '0')"  size="small">上移</el-button>
                            </span>
                            <span v-else>
                                <el-button class = 'indexFunBtn' :disabled="power.active_reward_setpriority" @click="setActivityLevel('1',scope.row.activityId , '0')"  size="small">上移</el-button>
                                <el-button class = 'indexFunBtn' :disabled="power.active_reward_setpriority" @click="setActivityLevel('1',scope.row.activityId , '1')"  size="small">下移</el-button>
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
            <el-tab-pane label="定额定向">
                <!-- 搜索start -->
                <el-form :inline="true" :model="fixed_reward.search" ref="fixed_reward.search" size="small" class="demo-form-inline">
                    <el-form-item label="活动名称:" prop="activityName">
                        <el-input v-model="fixed_reward.search.activityName" placeholder="请输入活动名称"></el-input>
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
                        <el-button @click="fixed_reset('fixed_reward.search')">重置</el-button>
                    </el-form-item>
                </el-form>
                <div class="operate">
                    <router-link to="/reward/fixedAdd">
                        <el-button type="primary" size="mini">新增</el-button>
                    </router-link>
                </div>
                <!-- 搜索end -->
                <el-table border :data="fixed_reward.list" style="width: 100%,min-height:300px">
                    <el-table-column width="80px" prop="activityId" label="活动ID"></el-table-column>
                    <el-table-column width="80px" prop="activityLevel" label="优先级"></el-table-column>
                    <el-table-column prop="activityName" label="活动名称"></el-table-column>
                    <el-table-column prop="activityStartTime" label="生效时间"></el-table-column>
                    <el-table-column width="80px" prop="directAmount" label="单奖金额"></el-table-column>
                    <el-table-column width="160px" label="总额上限状态">
                        <template slot-scope="scope">
                            <span v-if="scope.row.limitStatus == '0' ">触发</span>
                            <span v-else-if="scope.row.limitStatus == '1' ">触发超额</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="80px" label="活动状态">
                        <template slot-scope="scope">
                            <span v-if="scope.row.valid == '0' ">禁用</span>
                            <span v-else-if="scope.row.valid == '1' ">启用</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="120px" prop="updateUserName" label="最近操作人"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button class='indexFunBtn' type="primary" :disabled="power.active_reward_look" @click="fixed_check(scope.row.activityId,scope.row.valid)" size="small">查看</el-button>
                            <el-button v-if="scope.row.valid == '1' " :disabled="power.active_reward_setpower" class='indexFunBtn' type="danger" @click="setStatus('2',scope.row.activityId , '0')" size="small">禁用</el-button>
                            <el-button v-else class='indexFunBtn' type="primary" :disabled="power.active_reward_setpower" @click="setStatus('2',scope.row.activityId , '1')" size="small">启用</el-button>
                            <span v-if="scope.$index == 0 && fixed_reward.list.length ==1 "></span>
                            <span v-else-if="scope.$index == 0 && fixed_reward.list.length !=1 ">
                                <el-button class = 'indexFunBtn' :disabled="power.active_reward_setpriority"  @click="setActivityLevel('2',scope.row.activityId , '1')"  size="small">下移</el-button>
                            </span>
                            <span v-else-if="scope.$index != 0 && scope.$index == fixed_reward.list.length-1">
                                <el-button class = 'indexFunBtn' :disabled="power.active_reward_setpriority"  @click="setActivityLevel('2',scope.row.activityId , '0')"  size="small">上移</el-button>
                            </span>
                            <span v-else>
                                <el-button class = 'indexFunBtn' :disabled="power.active_reward_setpriority"  @click="setActivityLevel('2',scope.row.activityId , '0')"  size="small">上移</el-button>
                                <el-button class = 'indexFunBtn' :disabled="power.active_reward_setpriority"  @click="setActivityLevel('2',scope.row.activityId , '1')"  size="small">下移</el-button>
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
        random_handleCurrentChange(){
            this.currentPage = val
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
        fixed_handleCurrentChange(){
            this.currentPage = val
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

    }
}

</script>
