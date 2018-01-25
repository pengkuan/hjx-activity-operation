<template>
    <div class="hjxS-wrap">
        <div class="title">换机侠S端-移动端</div>
        <div class="search-box">
            <el-form :inline="true" :model="search" class="demo-form-inline" size="mini">
                <el-form-item label="广告位置">
                    <el-select v-model="search.positionId" placeholder="请输入广告位置搜索">
                        <el-option label="全部" value=""></el-option>
                        <el-option :label="item.positionName" :value="item.positionId" v-for="(item,index) in search.positionList" :key="index"></el-option> 
                    </el-select>
                </el-form-item>
                <el-form-item label="广告标题">
                    <el-input v-model="search.adTitle" placeholder="请输入广告标题搜索"></el-input>
                </el-form-item>
                <el-form-item label="投放状态">
                    <el-select v-model="search.adStatus" placeholder="" v-show="isIng == 'ing'">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="已开始" value="1"></el-option>
                        <el-option label="待开始" value="2"></el-option>
                    </el-select>
                    <el-select v-model="search.adStatus" placeholder="" v-show="isIng != 'ing'">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="已过期" value="3"></el-option>
                        <el-option label="暂不投放" value="4"></el-option> 
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSearch">搜索</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="tool">
            <el-button type="primary" size="mini" @click="addNewAd" :disabled="power.active_ad_add">+ 添加广告</el-button>
        </div>
        <div class="tab-box">
            <el-tabs @tab-click="handleTabClick" v-model="activeName">
                <el-tab-pane label="进行中的广告" name="ing">
                    <el-table :data="tableData1" stripe style="width: 100%" size="mini">
                        <el-table-column prop="positionName" label="广告位置"></el-table-column>
                        <el-table-column prop="adTitle" label="广告标题"></el-table-column> 
                        <el-table-column prop="range" label="可见范围"></el-table-column>
                        <el-table-column prop="adStatus" label="广告状态"></el-table-column>
                        <el-table-column prop="useStatus" label="投放状态"></el-table-column>
                        <el-table-column prop="startTime" label="开始时间">
                            <template slot-scope="scope">
                                <span v-show="scope.row.startTime == ''">----</span>
                                <span v-show="scope.row.startTime != ''">{{scope.row.startTime}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="endTime" label="结束时间">
                            <template slot-scope="scope">
                                <span v-show="scope.row.endTime == ''">----</span>
                                <span v-show="scope.row.endTime != ''">{{scope.row.endTime}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="adSort" label="广告排序" width="80"></el-table-column>
                        <el-table-column prop="" label="操作" width="150">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" @click="lookDetail(scope)" :disabled="power.active_ad_look">详情</el-button>
                                <el-button type="warning" size="mini" @click="edit(scope)" :disabled="power.active_ad_edit">修改</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination-wrap">
                        <el-pagination 
                            @current-change="handleCurrentChange_Running" 
                            :current-page="pagination.currentPage_running" 
                            :page-size="pagination.pageSize_running" 
                            layout="total, prev, pager, next, jumper" 
                            :total="pagination.total_running">
                        </el-pagination>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="未运行的广告" name="not_ing">
                    <el-table :data="tableData2" stripe style="width:100%" size="mini">
                        <el-table-column prop="positionName" label="广告位置"></el-table-column>
                        <el-table-column prop="adTitle" label="广告标题"></el-table-column> 
                        <el-table-column prop="range" label="可见范围"></el-table-column>
                        <el-table-column prop="adStatus" label="广告状态"></el-table-column>
                        <el-table-column prop="useStatus" label="投放状态"></el-table-column>
                        <el-table-column prop="startTime" label="生效时间">
                            <template slot-scope="scope">
                                <span v-show="scope.row.startTime == ''">----</span>
                                <span v-show="scope.row.startTime != ''">{{scope.row.startTime}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="endTime" label="失效时间">
                            <template slot-scope="scope">
                                <span v-show="scope.row.endTime == ''">----</span>
                                <span v-show="scope.row.endTime != ''">{{scope.row.endTime}}</span>
                            </template>
                        </el-table-column> 
                        <el-table-column prop="" label="操作" width="220">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" @click="lookDetail(scope)" :disabled="power.active_ad_look">详情</el-button>
                                <el-button type="warning" size="mini" @click="edit(scope)" :disabled="power.active_ad_edit">修改</el-button>
                                <el-button type="danger" size="mini" @click="del(scope)" :disabled="power.active_ad_del">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination-wrap">
                        <el-pagination 
                            @current-change="handleCurrentChange_NotRun" 
                            :current-page="pagination.currentPage_notRun" 
                            :page-size="pagination.pageSize_notRun" 
                            layout="total, prev, pager, next, jumper" 
                            :total="pagination.total_notRun">
                        </el-pagination>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div> 
    </div>
</template>
<script>
import api from '@/api/ad'
import util from '@/util'
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            search: { //搜索条件
                positionId: '', //广告位置
                adTitle: '', //广告标题 
                adStatus: '', //广告位状态
                positionList: [] //广告位列表
            },
            clientId: 3, //1代表 换机侠顾客端-移动端 2是D 3是S
            isIng: 'ing', //是否运行
            activeName: 'ing',
            pagination: { //页码数据
                currentPage_running: 1, //运行中 当前页,只给页码用,最小值1
                pageIndex_running: 0, //运行中 当前页,只给传参用，最小值0
                pageSize_running: 10, //运行中 一页的数量
                total_running: 0, //运行中 总条数
                currentPage_notRun: 1, //未运行 当前页
                pageIndex_notRun: 0, //未运行 当前页
                pageSize_notRun: 10, //未运行 一页的数量
                total_notRun: 0, //未运行 总条数
            },
            tableData1: [],
            tableData2: [{pos:'123',tit:'123',range:"123",status:'234',setStatus:'23',startTime:'23',endTime:'23',sort:'23'}],
            loading: false,
        }
    },
    methods: {
        handleCurrentChange_Running(index) { //页码处理 运行中
            this.pagination.currentPage_running = index
            this.pagination.pageIndex_running = index -1
            this.showList_ing()
        },
        handleCurrentChange_NotRun(index) { //页码处理 未运行
            this.pagination.currentPage_notRun = index
            this.pagination.pageSize_notRun = index -1
            this.showList_not_ing()
        },
        handleTabClick(val) { //处理tab切换
            this.isIng = val.name
            this.search.adStatus = ''
            console.log(this.isIng) 
        },
        onSearch() { //搜索 
            if (this.isIng == 'ing') {
                this.pagination.currentPage_running = 1
                this.pagination.pageIndex_running = 0
                this.showList_ing()
            } else {
                this.pagination.currentPage_notRun = 1
                this.pagination.pageIndex_notRun = 0
                this.showList_not_ing()
            } 
        },
        del(item) { //删除广告
            this.$confirm('广告删除将不可修复，确认删除？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                console.log(item)
                let params = {
                    adId: item.row.adId
                }
                console.log(this.isIng)
            	api.ad_deleteAdInfo(params).then((res)=> {
                    if (res._ret != '0') {
                        this.$message.error(res._errStr)
                        return
                    }
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                    this.showList_not_ing()
                    // this.isIng == 'ing' ? this.showList_ing() : this.showList_not_ing() //虽然目前只有未运行列表
                })
                
            }).catch(() => {})
        },
        addNewAd() {//添加新广告
            let path = this.$route.path
        	this.$router.push({path:'/commonAdd',query:{clientId:this.clientId,pagePath:path}})
        },
        lookDetail(item) {//查看詳情  
            let path = this.$route.path,
                adId = item.row.adId
            this.$router.push({path:'/commonDetail',query:{clientId:this.clientId,pagePath:path, adId:adId}})
        },
        edit(item) {//编辑广告
            let path = this.$route.path,
                adId = item.row.adId  
            this.$router.push({path:'/commonEdit',query:{clientId:this.clientId,pagePath:path,adId:adId}})
        }, 
        getAdPosList() { //获取广告位列表
            let params = {clientId: this.clientId}
            api.ad_getAdPosition(params).then((res)=>{
                if (res._ret != '0') {
                    this.$message.error(res._errStr)
                    return
                } 
                console.log(res)
                this.search.positionList = res.positionList
            })
        },
        showList_ing() { //显示运行的广告列表
            let params1 = {
                inUse: '1', //运行中广告
                clientId: this.clientId, //客户端，写死的
                adStatus: this.search.adStatus, //广告状态
                positionId: this.search.positionId, //位置id
                adTitle: this.search.adTitle, //位置标题
                pageIndex: this.pagination.pageIndex_running, //第几页
                pageSize: this.pagination.pageSize_running //一页几条 
            }  
            this.loading = true
            api.ad_getAdList(params1).then((res)=>{
                if (res._ret != '0') {
                    this.$message.error(res._errStr) 
                    this.loading = false
                    return
                }  
                this.loading = false
                this.tableData1 = res.adList 
                this.pagination.total_running = res.num
            }) 
        },
        showList_not_ing() { //显示未运行的广告列表
            let params2 = {
                inUse: '2', //未运行广告
                clientId: this.clientId, //客户端，写死的
                adStatus: this.search.adStatus, //广告状态
                positionId: this.search.positionId, //位置id
                adTitle: this.search.adTitle, //位置标题
                pageIndex: this.pagination.pageIndex_notRun, //第几页
                pageSize: this.pagination.pageSize_notRun //一页几条 
            }
            this.loading = true
            api.ad_getAdList(params2).then((res)=>{
                if (res._ret != '0') {
                    this.$message.error(res._errStr)
                    this.loading = true
                    return
                }  
                this.loading = true
                console.log(res)
                this.tableData2 = res.adList
                this.pagination.total_notRun = res.num 
            })
        },
    }, 
    computed:{
        ...mapGetters({ 
            'power':'userInfo/power'
        })
    },
    mounted() { 
        this.showList_ing()
        this.showList_not_ing()
        this.getAdPosList()
        // console.log(this.$route.path)
        // console.log(window.history.length)
    }
}

</script>
<style>
.hjxS-wrap .el-button+.el-button {
    margin-left: 0;
} 
</style>
