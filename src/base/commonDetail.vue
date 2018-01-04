<template>
    <div class="commonDetail-wrap">
        <div class="title">广告详情
            <el-button type="primary" size="mini" @click="back">关闭</el-button>
        </div>
        <el-form ref="form" :model="form" label-width="100px" class="commonDetail-form-wrap"> 
            <el-form-item label="所属客户端" class="w600">
                <el-select v-model="form.clientId" placeholder="" disabled>
                    <el-option :label="item.clientName" :value="item.clientId" v-for="(item,index) in form.clientList" :key="index"></el-option> 
                </el-select> 
            </el-form-item>
            <el-form-item label="广告位置" class="w600"> 
                <el-select v-model="form.positionCode" placeholder="请选择广告位置" disabled>  
                    <el-option :label="item.positionName" :value="item.positionCode" v-for="(item,index) in form.positionList" :key="index"></el-option>  
                </el-select>
            </el-form-item>
            <el-form-item label="广告标题" class="w600">
                <el-input v-model="form.adTitle" disabled></el-input>
            </el-form-item>
            <el-form-item label="广告素材类型" class="w600">
                <el-radio-group v-model="form.adType">
                    <el-radio :label="1" v-show="form.adType=='1'">文字</el-radio>
                    <el-radio :label="2" v-show="form.adType=='2'">图片</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="广告素材" class="w600 pos-rel" v-show="form.adType == 2">
                <el-input v-model="form.adImg" disabled></el-input>
                <div class="thumbnail">
                    <img :src="form.adImg" alt="210*170" width="210" title="缩略图">
                </div>
            </el-form-item>
            <el-form-item label="广告素材" class="w600" v-show="form.adType == 1">
                <el-input v-model="form.adText" disabled></el-input>
            </el-form-item>
            <el-form-item label="广告描述" class="w600">
                <el-input type="textarea" :maxlength="200" disabled :autosize="{ minRows: 4, maxRows: 8}" v-model="form.adDesc"></el-input>
            </el-form-item>
            <el-form-item label="跳转链接" class="w600">
                <el-radio-group v-model="form.isJump">
                    <el-radio :label="1" v-show="form.isJump=='1'">无跳转</el-radio>
                    <el-radio :label="2" v-show="form.isJump=='2'">超链接</el-radio>
                </el-radio-group>
                <el-input v-model="form.jumpUrl" disabled v-show="form.isJump == 2" placeholder="请输入超链接地址"></el-input>
            </el-form-item>
            <el-form-item label="可见范围" class="w600">
                <el-radio-group v-model="form.range">
                    <el-radio :label="1" v-show="form.range=='1'">全部用户</el-radio>
                    <el-radio :label="2" v-show="form.range=='2'">部分用户</el-radio>
                </el-radio-group>
                <div class="usrs-set" v-show="form.range == 2">
                    <el-row class="mb8">
                        <el-col :span="6" class="text-right">
                            <p>渠道：</p>
                        </el-col>
                        <el-col :span="18">
                            <p class="part-channel-text">
                                <i v-show="this.form.rangeList.channel.status == 1">包含</i> 
                                <i v-show="this.form.rangeList.channel.status == 2">不包含</i>
                                &nbsp;&nbsp;<span>{{channel_values}}</span>
                                <i v-show="this.form.rangeList.channel.values.length>1">等</i>
                                <i>{{this.form.rangeList.channel.values.length}}</i>个渠道
                            </p>
                        </el-col>
                    </el-row>
                    <el-row class="mb8">
                        <el-col :span="6" class="text-right">
                            <p>付款金额：</p>
                        </el-col>
                        <el-col :span="18">
                            <p class="pos-rel">
                                <i>大于等于</i>
                                <!-- <i v-show="this.form.rangeList.amount.status == 3">大于等于</i> -->
                                <!-- <i v-show="this.form.rangeList.amount.status == 4">小于等于</i> -->
                                &nbsp;&nbsp;{{money}}元
                            </p>
                        </el-col>
                    </el-row>
                </div>
            </el-form-item>
            <el-form-item label="广告状态">
                <el-radio-group v-model="form.isUse">
                    <el-radio :label="1" v-show="form.isUse=='1'">生效</el-radio>
                    <el-radio :label="0" v-show="form.isUse=='0'">不生效</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="投放时间" v-show="form.isUse==1">
                <el-radio-group v-model="form.useType">
                    <el-radio :label="1" v-show="form.useType=='1'">立即开始</el-radio>
                    <el-radio :label="2" v-show="form.useType=='2'">自定义时间</el-radio>
                </el-radio-group>
                <div v-show="form.useType == 2">
                    <el-date-picker
                        v-model="form.startTime"
                        type="datetime"
                        disabled
                        placeholder="开始日期">
                    </el-date-picker> 
                    <el-date-picker
                        v-model="form.endTime"
                        type="datetime"
                        disabled
                        placeholder="结束日期">
                    </el-date-picker>   
                </div>
            </el-form-item>
            <el-form-item label="广告排序" class="w600 pos-rel" v-show="form.isUse==1">
                <el-input v-model="form.sort" disabled></el-input>
            </el-form-item>
            <el-form-item label="操作人" class="w600">
                <el-input v-model="form.modifier" disabled></el-input>
            </el-form-item>
            <el-form-item label="更新时间" class="w600">
                <el-input v-model="modifyTime_date" disabled></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">修改</el-button>
                <el-button @click="back">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import api from '@/api/ad'
import {formatDate} from '@/assets/js/date'
export default {
    data() {
        return {
            form: {   
                clientId: this.$route.query.clientId, //客户端
                clientList: [], //客户端列表，用于循环
                positionCode: '', //广告位置
                positionList: [], //广告位列表
                adTitle: '', //广告标题
                adImg: '', //图片链接描述，如果是图片
                adType: 2, //文字还是图片 1是文字 2是图片 由广告位决定
                adDesc: '', //广告描述 
                isJump: 2, //1是不需要跳转 2是需要跳转
                jumpUrl: '', //需要跳转的跳转链接
                adText: '', //文字描述，如果是文字
                range: 1, //可见范围 1是全部 2是部分
                rangeList: { //条件范围，range为2时必传
                    channel: {
                        status: '8', //1是包含，2是不包含
                        values: [], //渠道id,多个用逗号隔开
                    },
                    store: {
                        status: '8', //1是包含，2是不包含
                        values: [],//门店id,多个用逗号隔开
                    },
                    amount: {
                        status: '3', //3是大于等于 4是小于等于
                        values: '' //金额
                    }
                },   
                isUse: 1, //1是生效 0是不生效
                useType: 1, //1是立即生效 2是自定义时间  
                startTime: '', //开始时间
                endTime: '', //结束时间
                sort: '', //广告排序
                modifier: '', //操作人
                modifyTime: '', //操作时间
            }, 
        }
    },
    methods: {
        onSubmit() {//跳转到修改页
            let returnPath = this.$route.query.pagePath,
                clientId = this.$route.query.clientId,
                adId = this.$route.query.adId
            this.$router.push({path:'/commonEdit', query:{clientId:clientId, pagePath:returnPath, adId:adId}})
        },
        back() { 
            let returnPath = this.$route.query.pagePath
            this.$router.push({path:returnPath}) 
        },
        ad_getAdInfo() { //获取广告详情
            let params = {
                adId: this.$route.query.adId 
            }
            api.ad_getAdInfo(params).then((res)=> {
                if (res._ret != '0') {
                    this.$message.error(res._errStr)
                    return
                }  
                console.log(res) 
                this.form.positionCode = res.adInfo.position.positionCode
                this.form.positionId = res.adInfo.positionId
                this.form.adTitle = res.adInfo.adTitle 
                this.form.adImg = res.adInfo.adImg     
                this.form.adDesc = res.adInfo.adDesc 
                this.form.adType = res.adInfo.adType 
                this.form.isJump = res.adInfo.isJump 
                this.form.jumpUrl = res.adInfo.jumpUrl 
                this.form.adText = res.adInfo.adText 
                this.form.isUse = res.adInfo.isUse 
                this.form.useType = res.adInfo.useType 
                this.form.range = res.adInfo.range   
                this.form.startTime = res.adInfo.startTime == 0 ? '' : res.adInfo.startTime*1000
                this.form.endTime = res.adInfo.endTime == 0 ? '' : res.adInfo.endTime*1000
                this.form.sort = res.adInfo.sort  
                this.form.modifier = res.adInfo.modifier   
                this.form.modifyTime = res.adInfo.modifyTime  
                // 单独处理部分用户部分
                if (this.form.range == 2&&res.adInfo.rangeList.channel.values.length) { 
                    this.form.rangeList.channel.status = res.adInfo.rangeList.channel.status
                    this.form.rangeList.channel.values = res.adInfo.rangeList.channel.values
                }
                if (this.form.range == 2&&res.adInfo.rangeList.store.values.length) {  
                    this.form.rangeList.store.status = res.adInfo.rangeList.store.status
                    this.form.rangeList.store.values = res.adInfo.rangeList.store.values
                }
                if (this.form.range == 2&&res.adInfo.rangeList.amount.values != '') { 
                    this.form.rangeList.amount.values = res.adInfo.rangeList.amount.values
                }  
            })
        },
        getClientList() { //获取客户端列表数据
            api.ad_getClient({}).then((res)=>{
                if (res._ret != '0') {
                    this.$message.error(res._errStr)
                    return
                }
                // console.log(res)
                this.form.clientList = res.clientList
            })
        },
        getAdPosList() { //获取广告位列表
            let params = {clientId: this.form.clientId, inUse:'1'}
            api.ad_getAdPosition(params).then((res)=>{
                if (res._ret != '0') {
                    this.$message.error(res._errStr)
                    return
                }  
                console.log(res) 
                this.form.positionList = res.positionList 
            })
        },
    },
    computed: {
        channel_values() {
            let str = '',
                len = this.form.rangeList.channel.values.length
            this.form.rangeList.channel.values.forEach(function(item, index){ 
                if (len == index+1) {
                    str += item.channelName
                } else {
                    str += item.channelName + ','
                } 
            })
            return str 
        },
        money() {
            return this.form.rangeList.amount.values
        },
        modifyTime_date() {
            let date = new Date(this.form.modifyTime*1000)
            return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
        }
    },
    watch: {},
    mounted() {
        this.getClientList() //客户端列表
        this.getAdPosList() //广告位列表
        this.ad_getAdInfo() //获取广告详情
    }
}

</script>
<style>
.commonDetail-wrap .el-radio+.el-radio {
    margin-left: 0px;
}
.commonDetail-form-wrap {
    /*padding-left: 200px;*/
} 
</style>
<style scoped lang="scss">
.commonDetail-wrap {  
    .title {
        text-align: center;
        position: relative;
        button {
            position: absolute;
            right: 0;
            top: 0;
        }
    }
    .tips {
        height: 20px;
        font-size: 12px;
        line-height: 20px; // color: #606266;
        color: #756BB1;
    }
    .usrs-set {
        width: 475px;
        min-height: 100px;
        border: 1px solid #DCDFE6;
        padding: 12px;
        background: #F5F7FA;
        border-radius: 4px;
        color: #c0c4cc;
        .part-channel-text {
            span {
                display: inline-block;
                max-width: 220px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                vertical-align: top;
            }
        }
    }
    .ad-time-set {
        width: 600px;
        height: 100px;
        border: 1px solid #DCDFE6;
        padding: 12px;
        border-radius: 4px;
        color: #606266;
    }
    .adTextDesc {
        height: 200px;
    }
    .w600 {
        width: 600px;
    }
    .w500 {
        width: 500px;
    }
    .w300 {
        width: 300px;
    }
    .w100 {
        width: 100px;
    }
    .w188 {
        width: 188px;
    }
    .mt30 {
        margin-bottom: 30px;
    }
    .inline-block {
        display: inline-block;
    }
    .pos-rel {
        position: relative;
    }
    .my-close,
    .my-select-sort {
        position: absolute;
        right: 0;
        top: 0;
        height: 40px;
    }
    .border-no {
        border: 0px solid transparent;
    }
    .control-font-count {
        position: absolute;
        right: 0;
        top: 0;
    }
    .thumbnail {
        width: 210px;
        height: 140px;
        border: 1px solid #ccc;
        position: absolute;
        right: -300px;
        top: -50px;
        background: #ccc;
        text-align: center;
        line-height: 140px;
        overflow: hidden;
    }
    .selct-channel {
        position: absolute;
        left: 0;
        top: 0;
        width: 100px;
    }
    .channel-list-test {
        position: absolute;
        left: 210px;
        top: 0;
        width: 250px;
        span {
            display: inline-block;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            max-width: 170px;
            vertical-align: top;
            margin-right: 5px;
        }
    }
    .add-channel {
        position: absolute;
        left: 460px;
        top: 0;
        color: blue;
        cursor: pointer;
    }
    .channell-close {
        position: absolute;
        right: 15px;
        top: 0;
        width: 40px;
        text-align: center;
        cursor: pointer;
    }
    .pay-money {
        position: absolute;
        left: 110px;
        top: 0;
        width: 250px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .add-stroe {
        // left: 110px;
        left: 363px;
        color: blue;
        cursor: pointer;
    }
    .text-right {
        text-align: right;
        padding-right: 10px;
    }
    .mb8 {
        margin-bottom: 8px;
    }
}

</style>
