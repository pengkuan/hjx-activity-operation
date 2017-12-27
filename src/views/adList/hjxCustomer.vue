<template>
    <div class="hjxCustomer-wrap">
        <div class="title">换机侠顾客端-移动端</div>
        <div class="search-box">
            <el-form :inline="true" :model="formData" class="demo-form-inline">
                <el-form-item label="广告位置">
                    <el-select v-model="formData.pos" placeholder="请输入广告位置搜索" size="small">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="广告标题">
                    <el-input v-model="formData.title" placeholder="请输入广告标题搜索" size="small"></el-input>
                </el-form-item>
                <el-form-item label="投放时间">
                    <el-select v-model="formData.time" placeholder="请选择投放时间" size="small">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small">搜索</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="tool">
            <el-button type="primary" size="mini" @click="addNewAd">+ 添加广告</el-button>
        </div>
        <div class="tab-box">
            <el-tabs>
                <el-tab-pane label="进行中的广告">
                    <el-table :data="tableData" stripe style="width: 100%">
                        <el-table-column prop="pos" label="广告位置"></el-table-column>
                        <el-table-column prop="tit" label="广告标题"></el-table-column> 
                        <el-table-column prop="range" label="可见范围"></el-table-column>
                        <el-table-column prop="status" label="广告状态"></el-table-column>
                        <el-table-column prop="setStatus" label="投放状态"></el-table-column>
                        <el-table-column prop="startTime" label="开始时间"></el-table-column>
                        <el-table-column prop="endTime" label="结束时间"></el-table-column>
                        <el-table-column prop="sort" label="广告排序" width="80"></el-table-column>
                        <el-table-column prop="" label="操作" width="150">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" @click="lookDetail(scope)">详情</el-button>
                                <el-button type="warning" size="mini" @click="edit(scope)">修改</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination-wrap">
                        <el-pagination 
                            @current-change="handleCurrentChange_Running" 
                            :current-page="pagination.currentPage_running" 
                            :page-size="pagination.pageSize_running" l
                            ayout="total, prev, pager, next, jumper" 
                            :total="pagination.total_running">
                        </el-pagination>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="未运行的广告">
                    <el-table :data="tableData1" stripe style="width:100%">
                        <el-table-column prop="pos" label="广告位置"></el-table-column>
                        <el-table-column prop="tit" label="广告标题"></el-table-column> 
                        <el-table-column prop="range" label="可见范围"></el-table-column>
                        <el-table-column prop="status" label="广告状态"></el-table-column>
                        <el-table-column prop="setStatus" label="投放状态"></el-table-column>
                        <el-table-column prop="startTime" label="开始时间"></el-table-column>
                        <el-table-column prop="endTime" label="结束时间"></el-table-column>
                        <el-table-column prop="sort" label="广告排序" width="80"></el-table-column>
                        <el-table-column prop="" label="操作" width="220">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" @click="lookDetail(scope)">详情</el-button>
                                <el-button type="warning" size="mini" @click="edit(scope)">修改</el-button>
                                <el-button type="danger" size="mini" @click="del(scope)">删除</el-button>
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
export default {
    data() {
        return {
            formData: { //搜索条件
                pos: '', //广告位置
                title: '', //广告标题
                time: '' //投放时间
            },
            pagination: { //页码数据
                currentPage_running: 1, //运行中 当前页
                pageSize_running: 10, //运行中 一页的数量
                total_running: 100, //运行中 总条数
                currentPage_notRun: 1, //未运行 当前页
                pageSize_notRun: 10, //未运行 一页的数量
                total_notRun: 100, //未运行 总条数

            },
            tableData: [{ pos: '首页顶部banner', tit: '首页顶部banner', desc: '双十一换机活动', range: '所有可见', status: '生效中', setStatus: '已开设', startTime: '2017.04.03 12:23:49', endTime: '2017.04.03 12:23:49', sort: '1' }, { pos: '首页顶部banner', tit: '首页顶部banner', desc: '双十一换机活动', range: '所有可见', status: '生效中', setStatus: '已开设', startTime: '2017.04.03 12:23:49', endTime: '2017.04.03 12:23:49', sort: '1' }, { pos: '首页顶部banner', tit: '首页顶部banner', desc: '双十一换机活动', range: '所有可见', status: '生效中', setStatus: '已开设', startTime: '2017.04.03 12:23:49', endTime: '2017.04.03 12:23:49', sort: '1' }, { pos: '首页顶部banner', tit: '首页顶部banner', desc: '双十一换机活动', range: '所有可见', status: '生效中', setStatus: '已开设', startTime: '2017.04.03 12:23:49', endTime: '2017.04.03 12:23:49', sort: '1' }, { pos: '首页顶部banner', tit: '首页顶部banner', desc: '双十一换机活动', range: '所有可见', status: '生效中', setStatus: '已开设', startTime: '2017.04.03 12:23:49', endTime: '2017.04.03 12:23:49', sort: '1' }, { pos: '首页顶部banner', tit: '首页顶部banner', desc: '双十一换机活动', range: '所有可见', status: '生效中', setStatus: '已开设', startTime: '2017.04.03 12:23:49', endTime: '2017.04.03 12:23:49', sort: '1' }, { pos: '首页顶部banner', tit: '首页顶部banner', desc: '双十一换机活动', range: '所有可见', status: '生效中', setStatus: '已开设', startTime: '2017.04.03 12:23:49', endTime: '2017.04.03 12:23:49', sort: '1' }, { pos: '首页顶部banner', tit: '首页顶部banner', desc: '双十一换机活动', range: '所有可见', status: '生效中', setStatus: '已开设', startTime: '2017.04.03 12:23:49', endTime: '2017.04.03 12:23:49', sort: '1' }, { pos: '首页顶部banner', tit: '首页顶部banner', desc: '双十一换机活动', range: '所有可见', status: '生效中', setStatus: '已开设', startTime: '2017.04.03 12:23:49', endTime: '2017.04.03 12:23:49', sort: '1' }, { pos: '首页顶部banner', tit: '首页顶部banner', desc: '双十一换机活动', range: '所有可见', status: '生效中', setStatus: '已开设', startTime: '2017.04.03 12:23:49', endTime: '2017.04.03 12:23:49', sort: '1' }, ],
            tableData1: [{ pos: '首页顶部banner', tit: '首页顶部banner', desc: '双十一换机活动', range: '所有可见', status: '生效中', setStatus: '已开设', startTime: '2017.04.03 12:23:49', endTime: '2017.04.03 12:23:49', sort: '1' }, { pos: '首页顶部banner', tit: '首页顶部banner', desc: '双十一换机活动', range: '所有可见', status: '生效中', setStatus: '已开设', startTime: '2017.04.03 12:23:49', endTime: '2017.04.03 12:23:49', sort: '1' }, ],
        }
    },
    methods: {
        handleCurrentChange_Running() {//页码处理 运行中

        },
        handleCurrentChange_NotRun() {//页码处理 未运行

        },
        del() { //删除广告
            this.$confirm('广告删除将不可修复，确认删除？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
            	console.log('处理删除操作')
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch(() => {})
        },
        addNewAd() {//添加新广告
        	this.$router.push({path:'/commonAdd'})
        },
        lookDetail() {//查看詳情  
            this.$router.push({path:'/commonDetail'})
        },
        edit() {//编辑广告
            this.$router.push({path:'/commonEdit'})
        }
    },
    mounted() {
        console.log(this.$route.path)
        console.log(window.history.length)
    }
}

</script>
<style scoped lang="scss">


</style>
