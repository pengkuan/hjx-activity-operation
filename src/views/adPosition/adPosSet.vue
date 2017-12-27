<template>
    <div class="adPosset-wrap">
        <div class="title">广告位管理</div>
        <div class="search-box">
            <el-form :inline="true" :model="formData" class="demo-form-inline">
                <el-form-item label="所属客户端">
                    <el-select v-model="formData.client" placeholder="请输入广告位置搜索" size="small">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="广告位置">
                    <el-input v-model="formData.position" placeholder="请输入广告标题搜索" size="small"></el-input>
                </el-form-item>
                <el-form-item label="广告位状态">
                    <el-select v-model="formData.status" placeholder="请选择投放时间" size="small">
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
            <el-button type="primary" size="mini" @click="addNewAd">+ 添加广告位</el-button>
        </div>
        <div class="tab-box">
             <el-table :data="tableData" stripe style="width:100%" >
                 <el-table-column prop="type" label="广告位类型"></el-table-column>
                 <el-table-column prop="client" label="所属客户端"></el-table-column> 
                 <el-table-column prop="position" label="广告位置"></el-table-column>
                 <!-- <el-table-column prop="posDesc" label="位置描述"></el-table-column> -->
                 <el-table-column prop="material" label="广告素材"></el-table-column>
                 <el-table-column prop="publishedCount" label="已发布广告" width="100"></el-table-column>
                 <el-table-column prop="showCount" label="最多展示素材数量"></el-table-column>
                 <el-table-column prop="status" label="广告位状态"></el-table-column>
                 <el-table-column prop="release" label="投放时间"></el-table-column>
                 <el-table-column prop="startTime" label="开始时间"></el-table-column>
                 <el-table-column prop="endTime" label="结束时间"></el-table-column>
                 <el-table-column prop="" label="操作" width="220">
                     <template slot-scope="scope">
                         <el-button type="primary" size="mini" @click="lookDetail(scope)" class="mb5">详情</el-button>  
                         <el-button type="warning" size="mini" @click="edit(scope)" class="mb5">修改</el-button> 
                         <el-button type="danger" size="mini" @click="del(scope)" class="mb5">删除</el-button>
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
export default {
    data() {
        return {
            formData: { //搜索条件
                client: '', //广告位置
                position: '', //广告标题
                status: '' //投放时间
            },
            pagination: { //页码数据
                currentPage: 1, //  当前页
                pageSize: 10, // 一页的数量
                total: 100, // 总条数 

            },
            tableData: [{ type: '阶段时间开启', client: '换机侠顾客端-移动端', position: '首页顶部banner', posDesc: '处于顶部banner位置', material: '图片(长1200*高600)', publishedCount: '1', showCount: '6', status: '不启用', release: '暂不投放', startTime: '2017.12.12 12:12:12', endTime: '2017.12.12 12:12:12'},{ type: '阶段时间开启', client: '换机侠顾客端-移动端', position: '首页顶部banner', posDesc: '处于顶部banner位置', material: '图片(长1200*高600)', publishedCount: '1', showCount: '6', status: '不启用', release: '暂不投放', startTime: '2017.12.12 12:12:12', endTime: '2017.12.12 12:12:12'},{ type: '阶段时间开启', client: '换机侠顾客端-移动端', position: '首页顶部banner', posDesc: '处于顶部banner位置', material: '图片(长1200*高600)', publishedCount: '1', showCount: '6', status: '不启用', release: '暂不投放', startTime: '2017.12.12 12:12:12', endTime: '2017.12.12 12:12:12'},  ],
        }
    },
    methods: {
        handleCurrentChange() {//页码处理 

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
        addNewAd() {//添加新广告位
        	this.$router.push({path:'/adPosition/add'})
        },
        lookDetail() {//查看广告位詳情  
            this.$router.push({path:'/adPosition/detail'})
        },
        edit() {//编辑广告位
            this.$router.push({path:'/adPosition/edit'})
        }
    },
    mounted() {
        console.log(this.$route.path)
        console.log(window.history.length)
    }
}

</script>
<style scoped lang="scss">
    .adPosset-wrap .tool {
        border-bottom: 1px solid #EBEEF5;
        padding-bottom: 10px; 
    } 

</style>
