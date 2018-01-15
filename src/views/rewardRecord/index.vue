<template>
    <div id = "rewardRecord">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>发放记录</el-breadcrumb-item>
        </el-breadcrumb>
        <br>
        <!-- 搜索start -->
        <el-form id = "search" :inline="true" :model="search" ref="search" label-width="120px" size="mini" class="demo-form-inline">
            <el-form-item label="流水号:" prop="txnId">
                <el-input v-model="search.txnId" @keyup.13.native="init($event)" @change="search.txnId = _Util.Trim(search.txnId)" placeholder="请输入流水号"></el-input>
            </el-form-item>
            <el-form-item label="活动ID:" prop="activityId">
                <el-input v-model="search.activityId" @keyup.13.native="init($event)" @change="search.activityId = _Util.Trim(search.activityId)" placeholder="请输入活动ID"></el-input>
            </el-form-item>
            <el-form-item label="订单编号:" prop="orderNum">
                <el-input v-model="search.orderNum" @keyup.13.native="init($event)" @change="search.orderNum = _Util.Trim(search.orderNum)" placeholder="请输入订单编号"></el-input>
            </el-form-item>
            <el-form-item label="奖励类型:" prop="activityType">
                <el-select class="aaa" v-model="search.activityType" placeholder="请选择奖励类型">
                    <el-option label="全部" value="0"></el-option>
                    <el-option label="随机" value="1"></el-option>
                    <el-option label="定额定向" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="发放时间:" prop="createTime">
                <el-date-picker size class="aaa" v-model="search.createTime" type="daterange" value-format="yy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="领取时间:" prop="receiveTime">
                <el-date-picker class="aaa" v-model="search.receiveTime" type="daterange" value-format="yy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="红包状态:" prop="packetStatus">
                <el-select class="aaa" v-model="search.packetStatus" placeholder="请选择红包状态">
                    <el-option label="全部" value="0"></el-option>
                    <el-option label="未领取" value="1"></el-option>
                    <el-option label="已领取" value="2"></el-option>
                    <el-option label="已失效" value="3"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="奖金状态:" prop="amountStatus">
                <el-select class="aaa" v-model="search.amountStatus" placeholder="请选择奖金状态">
                    <el-option label="全部" value="0"></el-option>
                    <el-option label="未领取" value="1"></el-option>
                    <el-option label="未激活" value="2"></el-option>
                    <el-option label="已激活" value="3"></el-option>
                    <el-option label="已失效" value="4"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="S1手机号/姓名:" prop="s1Info">
                <el-input v-model="search.s1Info" @keyup.13.native="init($event)" @change="search.s1Info = _Util.Trim(search.s1Info)" placeholder="请输入S1手机号/姓名"></el-input>
            </el-form-item>
            <el-form-item label="O3 ID/名称:" prop="o3Info">
                <el-input v-model="search.o3Info" @keyup.13.native="init($event)" @change="search.o3Info = _Util.Trim(search.o3Info)" placeholder="请输入O3 ID/名称"></el-input>
            </el-form-item>
            <el-form-item label="O1 ID/名称:" prop="o1Info">
                <el-input v-model="search.o1Info" @keyup.13.native="init($event)" @change="search.o1Info = _Util.Trim(search.o1Info)" placeholder="请输入O1 ID/名称"></el-input>
            </el-form-item>
            <el-form-item label="O1城市:" prop="o1City">
                <el-input v-model="search.o1City" @keyup.13.native="init($event)" @change="search.o1City = _Util.Trim(search.o1City)" placeholder="请输入O1城市（模糊搜索）"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="init">查询</el-button>
                <el-button @click="reset('search')">清空</el-button>
            </el-form-item>
        </el-form>
        <br>
        <!-- 搜索end -->
        <el-table size="mini" border :data="list" style="width: 100%,min-height:300px">
            <el-table-column prop="txnId" label="流水号"></el-table-column>
            <el-table-column prop="createTime" label="发放时间"></el-table-column>
            <el-table-column prop="receiveTime" label="领取时间"></el-table-column>
            <el-table-column prop="activityId" width="100" label="活动ID"></el-table-column>
            <el-table-column prop="orderNum" label="订单编号"></el-table-column>
            <el-table-column width="100" label="奖励类型">
                <template slot-scope="scope">
                    <span v-if="scope.row.activityType == '1' ">随机</span>
                    <span v-else-if="scope.row.activityType == '2' ">定额定向</span>
                </template>
            </el-table-column>
            <el-table-column width="100" label="奖金">
                <template slot-scope="scope">
                    <span> {{(scope.row.amount / 100).toFixed(2)}} </span>
                </template>
            </el-table-column>
            <el-table-column width="100" label="红包状态">
                <template slot-scope="scope">
                    <span v-if="scope.row.packetStatus == '1' ">未领取</span>
                    <span v-else-if="scope.row.packetStatus == '2' ">已领取</span>
                    <span v-if="scope.row.packetStatus == '3' ">已失效</span>
                </template>
            </el-table-column>
            <el-table-column width="100" label="奖金状态">
                <template slot-scope="scope">
                    <span v-if="scope.row.amountStatus == '1' ">未领取</span>
                    <span v-else-if="scope.row.amountStatus == '2' ">未激活</span>
                    <span v-if="scope.row.amountStatus == '3' ">已激活</span>
                    <span v-else-if="scope.row.amountStatus == '4' ">已失效</span>
                </template>
            </el-table-column>
            <el-table-column label="S1手机号/姓名">
                <template slot-scope="scope">
                    {{scope.row.s1Info.phone}}/{{scope.row.s1Info.name}}
                </template>
            </el-table-column>
            <el-table-column label="O3 ID/名称">
                <template slot-scope="scope">
                    {{scope.row.o3Info.id}}/{{scope.row.o3Info.name}}
                </template>
            </el-table-column>
            <el-table-column label="O1 ID/名称">
                <template slot-scope="scope">
                    {{scope.row.o1Info.id}}/{{scope.row.o1Info.name}}
                </template>
            </el-table-column>
            <el-table-column prop="o1City" width="100" label="O1城市"></el-table-column>
        </el-table>
        <div class="hjx-pagination">
            <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" layout="total, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import api from '@/api/index'
import merge from '@/util/merge'
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            list: [],
            search: {
                "txnId": "",
                "activityId": "",
                "activityType": "0",
                "orderNum": "",
                "s1Info": "",
                "o1Info": "",
                "o1City": "",
                "o3Info": "",
                "createTime": '',
                "receiveTime": '',
                "packetStatus": "",
                "amountStatus": "",
                "pageIndex": "0",
                "pageSize": "10"
            },
            currentPage: 1,
            total: 0
        }
    },
    computed:{

    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            let submitData = {}
            
            submitData.createTimeStart = this.search.createTime[0] ? this.search.createTime[0] + ' 00:00:00' : ''
            submitData.createTimeEnd = this.search.createTime[1] ? this.search.createTime[1] + ' 23:59:59' : ''
            submitData.receiveTimeStart = this.search.receiveTime[0] ? this.search.receiveTime[0] + ' 00:00:00' : ''
            submitData.receiveTimeEnd = this.search.receiveTime[1] ? this.search.receiveTime[1] + ' 23:59:59' : ''

            submitData = merge(submitData,this.search)
            api.search_grant_record(submitData).then(res => {
                if (res._ret != 0) {
                    this.$alert(res._errStr)
                    return
                }
                this.list = res.recordList
                this.total = Number(res.pageInfo.total)
            })
        },
        handleCurrentChange(val) {
            this.currentPage = val
            this.search.pageIndex = String(val - 1)
            this.init()
        },
        reset(formName){
            this.$refs[formName].resetFields()
            this.init()
        }
    }

}

</script>
<style type="text/css">
    #search .el-input__inner ,
    #search .el-date-editor.el-input
    {width: 240px!important}
</style>

