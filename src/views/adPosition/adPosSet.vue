<template>
    <div class="adPosset-wrap">
        <div class="title">广告位管理</div>
        <div class="search-box">
            <el-form :inline="true" :model="formData" class="demo-form-inline">
                <el-form-item label="所属客户端">
                    <el-select v-model="formData.clientId" placeholder="请输入广告位置搜索" size="small">
                        <el-option label="全部" value=""></el-option>
                        <el-option :label="item.clientName" :value="item.clientId" v-for="(item,index) in formData.clientList" :key="index"></el-option> 
                    </el-select>
                </el-form-item>
                <el-form-item label="广告位置">
                    <el-input v-model="formData.positionName" placeholder="请输入广告位置" size="small"></el-input>
                </el-form-item>
                <el-form-item label="广告位状态">
                    <el-select v-model="formData.positionStatus" placeholder="" size="small">
                        <el-option label="全部" value="0"></el-option>
                        <el-option label="启用" value="1"></el-option>
                        <el-option label="不启用" value="2"></el-option> 
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small" @click="search">搜索</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="tool">
            <el-button type="primary" size="mini" @click="addNewAd" :disabled="power.active_adpos_add">+ 添加广告位</el-button>
        </div>
        <div class="tab-box">
             <el-table :data="tableData" stripe style="width:100%" >
                 <el-table-column prop="positionType" label="广告位类型"></el-table-column>
                 <el-table-column prop="clientName" label="所属客户端"></el-table-column> 
                 <el-table-column prop="positionName" label="广告位置"></el-table-column> 
                 <el-table-column prop="adTypeDesc" label="广告素材"></el-table-column>
                 <el-table-column prop="effectiveAdNum" label="已发布广告" width="90"></el-table-column>
                 <el-table-column prop="adNum" label="最多展示素材数量"></el-table-column>
                 <el-table-column prop="isUse" label="广告位状态" width="90"></el-table-column>
                 <el-table-column prop="useStatus" label="投放时间"></el-table-column>
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
                 <el-table-column prop="" label="操作" width="220">
                     <template slot-scope="scope">
                         <el-button type="primary" size="mini" @click="lookDetail(scope)" class="mb5" :disabled="power.active_adpos_look">详情</el-button>  
                         <el-button type="warning" size="mini" @click="edit(scope)" class="mb5" :disabled="power.active_adpos_edit">修改</el-button> 
                         <el-button type="danger" size="mini" @click="del(scope)" class="mb5" :disabled="power.active_adpos_del">删除</el-button>
                     </template>
                 </el-table-column>
             </el-table>

            <div class="pagination-wrap">
             <el-pagination 
                 @current-change="handleCurrentChange" 
                 :current-page="pagination.currentPage" 
                 :page-size="pagination.pageSize" 
                 layout="total, prev, pager, next, jumper" 
                 :total="pagination.total">
             </el-pagination>
            </div>
        </div> 
    </div>
</template>
<script> 
import api from '@/api/ad'
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            formData: { //搜索条件
                clientId: '', //客户端
                clientList: [], //广告位置列表数据
                positionName: '', //广告位置
                positionStatus: '0' //投放状态
            },
            pagination: { //页码数据
                currentPage: 1, //  当前页,最小为1,
                pageIndex: '0', //传给后台的值，区分与currentPage
                pageSize: 10, // 1页的数量
                total: 0, // 总条数 

            },
            tableData: [],
        }
    },
    methods: {
        handleCurrentChange(val) {//页码处理  
            this.pagination.currentPage = val
            this.pagination.pageIndex = String(val-1) 
            this.showList()
        }, 
        del(item) { //删除广告
            let params = {positionCode: item.row.positionCode}
            this.$confirm('广告删除将不可修复，确认删除？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {  
                api.ad_deleteAdPosition(params).then((res)=>{ 
                    console.log(res)
                    if (res._ret != '0') {
                        this.$message.error(res._errStr)
                        return
                    }   
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    }) 
                    this.showList()
                })   
            }).catch(() => {})
        },
        addNewAd() {//添加新广告位
        	this.$router.push({path:'/adPosition/add'})
        },
        lookDetail(item) {//查看广告位詳情 
            console.log(item)
            this.$router.push({path:'/adPosition/detail', query: {code:item.row.positionCode}})
        },
        edit(item) {//编辑广告位
            this.$router.push({path:'/adPosition/edit', query: {code:item.row.positionCode}})
        },
        showList() { //广告位列表
            let params = {
                clientId: this.formData.clientId,
                positionName: this.formData.positionName,
                positionStatus: this.formData.positionStatus, 
                pageIndex: this.pagination.pageIndex, 
                pageSize: this.pagination.pageSize + ''
            }
            api.ad_adPositionList(params).then((res)=>{ 
                if (res._ret != '0') {
                    this.$message.error(res._errStr)
                    return
                } 
                this.tableData = res.positionlist
                this.pagination.total = res.num
            }) 
        },
        clientList() { //获取客户端列表数据
            api.ad_getClient({}).then((res)=>{
                if (res._ret != '0') {
                    this.$message.error(res._errStr)
                    return
                }
                this.formData.clientList = res.clientList

            })
        },
        search() { //搜索查询 
            this.pagination.currentPage = 1
            this.pagination.pageIndex = 0
            this.showList()
        }
    },
    computed:{
        ...mapGetters({ 
            'power':'userInfo/power'
        })
    },
    mounted() {
        // console.log(this.$route.path)
        // console.log(window.history.length) 
        this.showList()
        this.clientList()
    }
}

</script>
<style>
    .adPosset-wrap .el-button+.el-button {
        margin-left: 0;
    }
</style>
<style scoped lang="scss">
    .adPosset-wrap .tool {
        border-bottom: 1px solid #EBEEF5;
        padding-bottom: 10px; 
    }  
</style>
