<template>
    <div class="addNewAd-wrap">
        <div class="title">添加新广告
            <el-button type="primary" size="mini" @click="back">关闭</el-button>
        </div>
        <el-form ref="form" :model="form" label-width="100px"> 
            <el-form-item label="所属客户端" class="w600">
                <el-select v-model="form.clientId" placeholder="" disabled>
                    <el-option :label="item.clientName" :value="item.clientId" v-for="(item,index) in form.clientList" :key="index"></el-option> 
                </el-select> 
            </el-form-item>
            <el-form-item label="广告位置" class="w600">
                <el-select v-model="form.region" placeholder="请选择广告位置">  
                    <el-option :label="item.positionName" :value="item.positionCode" v-for="(item,index) in form.positionList" :key="index"></el-option>  
                </el-select>
                <div class="tips">提示：此广告位线上已发布5个广告，最多可发布6个广告</div>
            </el-form-item>
            <el-form-item label="广告标题" class="w600">
                <el-input v-model="form.adTitle" placeholder="请输入广告标题" :maxlength="20"></el-input>
                <div class="tips">最多20个字符</div>
            </el-form-item>
            <el-form-item label="广告素材类型" class="w600">
                <el-radio-group v-model="form.AdresourceType">
                    <el-radio :label="0">文字</el-radio>
                    <el-radio :label="1">图片</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="广告素材" class="w600 pos-rel" v-show="form.AdresourceType == 1">
                <p>
                    <el-input v-model="form.adImg" class="inline-block"></el-input>
                    <el-upload class="upload-demo inline my-close" action="https://jsonplaceholder.typicode.com/posts/" :on-preview="handlePreview" :on-remove="handleRemove" multiple :limit="3" :on-exceed="handleExceed" :file-list="form.fileList">
                        <el-button size="small" type="primary" class="my-close">选择图片</el-button>
                    </el-upload>
                </p>
                <div class="thumbnail">
                    图片缩略图 210*140
                </div>
                <div class="tips">支持长仅1200*高仅500的图片 png、jpeg格式，4M以内</div>
            </el-form-item>
            <el-form-item label="广告素材" class="w600" v-show="form.AdresourceType == 0">
                <el-input type="textarea" :rows="4" v-model="form.adText" :maxlength="100" placeholder="请输入广告文字，前端将展示此文字"></el-input>
                <div class="tips pos-rel">最多可输入100字符</div>
            </el-form-item>
            <el-form-item label="广告描述" class="w600">
                <el-input type="textarea" :maxlength="200" :autosize="{ minRows: 4, maxRows: 8}" v-model="form.adDesc"></el-input>
                <div class="tips pos-rel">支持中文、数字、字母<span class="control-font-count">{{fontCount}}/200</span></div>
            </el-form-item>
            <el-form-item label="跳转链接" class="w600">
                <el-radio-group v-model="form.isJump">
                    <el-radio :label="1">无跳转</el-radio>
                    <el-radio :label="2">超链接</el-radio>
                </el-radio-group>
                <el-input v-model="form.jumpUrl" v-show="form.isJump == 2" placeholder="请输入超链接地址"></el-input>
            </el-form-item>
            <el-form-item label="可见范围" class="w600">
                <el-radio-group v-model="form.range">
                    <el-radio :label="1">全部用户</el-radio>
                    <el-radio :label="2">部分用户</el-radio>
                </el-radio-group>
                <div class="usrs-set" v-show="form.range == 2">
                    <el-row class="mb8" v-show="partChannelShow">
                        <el-col :span="4" class="text-right">
                            <p>渠道</p>
                        </el-col>
                        <el-col :span="20">
                            <p class="pos-rel">
                                <el-select v-model="form.rangeList.channel.status" placeholder="" class="selct-channel">
                                    <el-option label="包含"   value="1"></el-option> 
                                    <el-option label="不包含" value="2"></el-option> 
                                </el-select>
                                <p class="channel-list-test" v-show="this.channelResultList.length"><span>{{this.hasSelectChannel}}</span>等{{this.channelResultList.length}}个渠道</p>
                                <span class="add-channel" @click="part_add_detail('channel')">+添加渠道</span>
                                <i class="iconfont icon-roundclosefill channell-close" @click="del_condition('channel')"></i>
                            </p>
                        </el-col>
                    </el-row>
                    <el-row class="mb8" v-show="partStoreShow">
                        <el-col :span="4" class="text-right">
                            <p>门店</p>
                        </el-col>
                        <el-col :span="20">
                            <p class="pos-rel">
                                <el-select v-model="form.rangeList.store.status" placeholder="" class="selct-channel">
                                    <el-option label="包含" value="1"></el-option> 
                                    <el-option label="不包含" value="2"></el-option> 
                                </el-select>
                                <span class="channel-list-test add-stroe" @click="part_add_detail('store')">+添加门店</span>
                                <i class="iconfont icon-roundclosefill channell-close" @click="del_condition('store')"></i>
                            </p>
                        </el-col>
                    </el-row>
                    <el-row class="mb8" v-show="moneyLimitShow">
                        <el-col :span="4" class="text-right">
                            <p>付款金额</p>
                        </el-col>
                        <el-col :span="20">
                            <p class="pos-rel">
                                <el-select v-model="form.rangeList.amount.status" placeholder="" class="selct-channel">
                                    <el-option label="大于等于" value="3"></el-option> 
                                    <!-- <el-option label="小于等于" value="4"></el-option>  -->
                                </el-select>
                                <el-input placeholder="请输入内容" class="pay-money" v-model.number="form.rangeList.amount.values" type="number">
                                    <template slot="append">元</template>
                                </el-input>
                                <i class="iconfont icon-roundclosefill channell-close" @click="del_condition('money')"></i>
                            </p>
                        </el-col>
                    </el-row>
                    <el-row class="mb8">
                        <el-col :span="4" class="text-right">
                            <p>&nbsp;</p>
                        </el-col>
                        <el-col :span="20">
                            <p class="pos-rel"> 
                                <el-select v-model="addConditionValue" placeholder="添加条件" class="selct-channel" @change="add_condition"> 
                                    <el-option-group v-for="group in addCondition" :key="group.label" :label="group.label">
                                        <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-option-group>
                                </el-select>
                            </p>
                        </el-col>
                    </el-row>
                </div>
            </el-form-item>
            <el-form-item label="广告状态">
                <el-radio-group v-model="form.isUse">
                    <el-radio :label="1">生效</el-radio>
                    <el-radio :label="0">不生效</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="投放时间" v-show="form.isUse==1">
                <el-radio-group v-model="form.useType">
                    <el-radio :label="1">投放后立即开始</el-radio>
                    <el-radio :label="2">自定义时间</el-radio>
                </el-radio-group>
                <div v-show="form.useType == 2">
                    <el-date-picker
                        v-model="form.startTime"
                        type="datetime"
                        placeholder="开始日期">
                    </el-date-picker> 
                    <el-date-picker
                        v-model="form.endTime"
                        type="datetime"
                        placeholder="结束日期">
                    </el-date-picker> 
                </div>
            </el-form-item>
            <el-form-item label="广告排序" class="w300 pos-rel">
                <el-input v-model="form.sort" disabled></el-input>
                <el-button type="primary" size="mini" class="my-select-sort" @click="ad_sort">选择</el-button>
            </el-form-item>
            <el-form-item label="操作人" class="w600">
                <el-input v-model="form.operator" disabled></el-input>
            </el-form-item>
            <el-form-item label="更新时间" class="w600">
                <el-input v-model="form.name" disabled></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">确认添加</el-button>
                <el-button @click="back">取消</el-button>
            </el-form-item>
        </el-form>
        <el-dialog :title="part_detail_tit" center :visible.sync="dialog1" class="part-select" @close="close1">
            <el-row :gutter="20">
                <el-col :span="12">
                    <div class="search">
                        <el-input v-model.trim="searchKey" class="input" @input="searchByKey"></el-input>
                        <ul class="search-ul">
                            <li v-for="(item,index) in defaulSearchList" :key="index" @click="part_add_info(item)">{{item}}</li> 
                        </ul>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="has-select">
                        <p>已选{{defaultResultList.length}}/100</p>
                        <ul class="has-select-ul">
                            <li class="pos-rel" v-for="(item,index) in defaultResultList" :key="index">{{item}}<span @click="part_del_has_select(item,index)" class="iconfont icon-roundclosefill"></span></li>
                        </ul>
                    </div>
                </el-col>
            </el-row>
            <div style="text-align: center;">
                <el-button size="small" @click="dialog1=false">取 消</el-button>
                <el-button type="primary" @click="dialog1_confirm" size="small" >确 定</el-button>
            </div> 
        </el-dialog>
        <el-dialog title="广告排序" width="30%" center :visible.sync="dialog2" class="part-select order-dialog" @close="close2">
            <div class="sort-box">
                <el-row>
                    <el-col :span="4">
                        排序
                    </el-col>
                    <el-col :span="20">
                        广告标题
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="4">
                        <p class="sort-p" v-for="(item, index) in sortData" :key="index">{{index+1}}</p>  
                    </el-col>
                    <el-col :span="20">
                        <ul class="sort-ul">   
                            <li class="sort-li pos-rel" v-for="(item, index) in sortData">
                                {{item.name}}
                                <span class="iconfont icon-triangleupfill up" :class="{'up-over':index==0}" v-show="item.name == '本条广告'" @click="adSortUp(item,index)"></span> 
                                <span class="iconfont icon-triangledownfill down" :class="{'up-over':index==sortData.length-1}" v-show="item.name == '本条广告'" @click="adSortDown(item,index)"></span> 
                            </li>  
                        </ul>
                    </el-col>
                </el-row>
                <el-button size="small" @click="dialog2=false">取 消</el-button>
                <el-button type="primary" size="small" @click="sort_select_ok">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import api from '@/api/ad'
import util from '@/util'
export default {
    data() {
        return {
            form: {
                clientId: this.$route.query.clientId, //客户端
                clientList: [], //客户端列表，用于循环
                positionList: [], //广告位列表
                adTitle: '', //广告标题
                adImg: 'www.baidu.com/img', //图片链接描述，如果是图片
                AdresourceType: 0,
                adDesc: '', //广告描述
                fileList: [],
                isJump: 2, //1是不需要调整 2是需要跳转
                jumpUrl: 'm.huishoubao.com11', //需要跳转的跳转链接
                adText: '', //文字描述，如果是文字
                range: 1, //可见范围 1是全部 2是部分
                rangeList: { //条件范围，range为2时必传
                    channel: {
                        status: '1', //1是包含，2是不包含
                        values: '', //渠道id,多个用逗号隔开
                    },
                    store: {
                        status: '1', //1是包含，2是不包含
                        values: '',//门店id,多个用逗号隔开
                    },
                    amount: {
                        status: '3', //3是大于等于 4是小于等于
                        values: '888' //金额
                    }
                },
                rangePart: {
                    channel: '华为公司',
                    store: '华为门店',
                    money: '8888'
                },
                isUse: 1, //1是生效 0是不生效
                useType: 2, //1是立即生效 2是自定义时间 
                timeRange: '',
                operator: '张三',
                startTime: '', //开始时间
                endTime: '', //结束时间
                sort: 1, //广告排序
            },
            // 部分可见数据
            addConditionValue: '', //选择什么条件添加
            addCondition: [{ label: '渠道类', options: [{ value: 'channel', label: '渠道' }, { value: 'store', label: '门店' }] }, { label: '订单类', options: [{ value: 'money', label: '金额付款' }] }],
            part_detail_tit: '',//选择渠道和门店弹框的标题
            payMoneyCount: '', //部分用户金额设置
            partChannel: '0', //部分用户渠道数据，0是包含，1是不包含
            partChannelShow: false,
            partStore: '0', //部分用户门店数据，0是包含，1是不包含
            partStoreShow: false,
            moneyLimit: '0',//付款限制，目前是大于等于
            moneyLimitShow: false,
            dialog1: false, //选择渠道和门店
            dialog2: false, //广告排序
            // 排序数据(之前的广告列表)
            sortData: [{name: '轮播图'},{name: '轮播图'},{name: '轮播图'},{name: '轮播图'} ],
            temporary_sortData: [], //广告临时数据
            needChangeAdFlag: true, //广告取消标志位
            // 部分用户dialog1弹框搜索数据和已选数据
            searchKey: '', //搜索关键字
            defaulSearchList: [],
            defaultResultList: [], 
            channelSearchLish: ['华为科技公司','中兴科技公司','回收宝科技公司',],
            channelResultList: ['华为科技公司','魅族科技公司'],
            storeSearchLish: ['华为科技公司','中兴科技公司','回收宝科技公司','小米科技公司','魅族科技公司'],
            storeResultList: [],
            // 临时数据，若不保存，需要回到数据操作前的数据
            temporary_channelResultList: [], //渠道临时数据
            temporary_storeResultList: [], //门店临时数据
            needChange: true
        }
    },
    methods: {
        getClientList() {
            api.ad_getClient({}).then((res)=>{
                if (res._ret != '0') {
                    this.$message.error(res._errStr)
                    return
                }
                this.form.clientList = res.clientList
            })
        },
        getAdPosList() { //获取广告位列表
            let params = {clientId: this.form.clientId}
            api.ad_getAdPosition(params).then((res)=>{
                if (res._ret != '0') {
                    this.$message.error(res._errStr)
                    return
                }  
                this.form.positionList = res.positionList
                console.log(this.form.positionList)
            })
        },
        // 文件处理函数
        select1() {
            alert(1)
        },
        onSubmit() {
            api.ad_addAdInfo({}).then((res)=>{
                console.log(res)
            })
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
        handleExceed(files, fileList) {
            // this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        checkIsAdd(arr) {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].name == '本条广告') {
                    return false
                }
            }
            return true
        },
        ad_sort() { //广告排序
            this.dialog2 = true
            if (this.checkIsAdd(this.sortData)) {  
                this.sortData.push({name:'本条广告'})
            }
            this.temporary_sortData = [...this.sortData]  
        },
        adSortUp(item,index) { //广告排序上升  
            let so = this.sortData[index] 
            if (index > 0) { 
                this.sortData.splice(index,1)
                this.sortData.splice(index-1,0,so)
            }  
        },
        adSortDown(item,index) { //广告排序下降 
            let so = this.sortData[index] 
            let len = this.sortData.length
            if (index < len-1) {
                this.sortData.splice(index,1)
                this.sortData.splice(index+1,0,so)
                
            } 
        },
        close2() { //广告排序关闭后的回调
            if(this.needChangeAdFlag) this.sortData = this.temporary_sortData
            this.needChangeAdFlag = true
        },
        sort_select_ok() {//排序选择ok  
            this.needChangeAdFlag = false
            if (!this.sortData.length || this.sortData.length == 1) {
                this.adOrder = 1
                this.dialog2 = false 
            } else {
                this.sortData.forEach((item,index)=>{
                    if(item.name == '本条广告') {
                        // console.log(index,121212)
                        this.form.sort = index + 1
                        this.dialog2 = false  
                    }
                }) 
            } 
        },
        add_condition() {//部分用户，条件选择, 分别显示渠道，门店，金额设置项
            if (this.addConditionValue == 'channel') this.partChannelShow = true
            if (this.addConditionValue == 'store') this.partStoreShow = true
            if (this.addConditionValue == 'money') this.moneyLimitShow = true
            this.addConditionValue = ''
        },
        del_condition(flag) {//部分用户，点击，渠道，门店，金额设置项隐藏
            if (flag == 'channel')  this.partChannelShow = false
            if (flag == 'store')  this.partStoreShow = false
            if (flag == 'money')  this.moneyLimitShow = false
        },
        part_add_detail(flag) {//部分用户，添加渠道和门店的详细信息,显示弹框1
            this.dialog1 = true
            // 设置临时数据，如果选择渠道，那么数据不能改变
            this.temporary_channelResultList = [...this.channelResultList]
            this.temporary_storeResultList = [...this.storeResultList]
            if (flag == 'channel') {
                this.part_detail_tit = '渠道类'
                this.defaulSearchList = this.channelSearchLish
                this.defaultResultList = this.channelResultList
            }
            if (flag == 'store') {
                this.part_detail_tit = '门店类'
                this.defaulSearchList = this.storeSearchLish
                this.defaultResultList = this.storeResultList
            }
        },
        part_add_info(item) { //部分用户 - 添加渠道或者门面列表数据 左边搜索和点击选择 
            if (this.part_detail_tit == '渠道类') {
                if (this.channelResultList.indexOf(item) < 0) this.channelResultList.push(item) 
            }
            if (this.part_detail_tit == '门店类') {
                if (this.storeResultList.indexOf(item) < 0) this.storeResultList.push(item) 
            }
        },
        part_del_has_select(item,index) { //部分用户 - 添加渠道或者门面列表数据  右边删除
            if (this.part_detail_tit == '渠道类') this.channelResultList.splice(index,1)  
            if (this.part_detail_tit == '门店类') this.storeResultList.splice(index,1)  
        },
        close1() { //添加渠道或者门店的关闭按钮回调 
            if (this.part_detail_tit == '渠道类' && this.needChange) this.channelResultList = this.temporary_channelResultList
            if (this.part_detail_tit == '门店类' && this.needChange) this.storeResultList = this.temporary_storeResultList
            this.needChange = true
            this.searchKey = ''
        }, 
        dialog1_confirm() { //选择渠道，门店 点击确认按钮
            this.needChange = false
            this.dialog1 = false 
        },
        searchByKey() { //选择渠道，门店，关键字搜索

        },
        back() { //返回和取消
            this.$router.back()
        }
    },
    computed: {
        fontCount() { //文字倒计数
            return this.form.adDesc.length
        },
        hasSelectChannel() { //已选渠道列表的文字描述
            return this.channelResultList.join()
        }
    },
    watch: {
        searchKey(val) {//关键字搜索
            let arr1 = [] 
            if (this.part_detail_tit == '渠道类') {
                this.channelSearchLish.forEach(function(item){ 
                    if (item.indexOf(val) != -1) {
                        arr1.push(item)
                    }
                })
            } else if (this.part_detail_tit == '门店类') {
                this.storeSearchLish.forEach(function(item){ 
                    if (item.indexOf(val) != -1) {
                        arr1.push(item)
                    }
                })
            }  
            this.defaulSearchList = arr1  
        }
    },
    mounted() {  
        this.getClientList() //客户端列表
        this.getAdPosList() //广告位列表
        this.form.sort = this.sortData.length + 1 
    }
}

</script>
<style>
.addNewAd-wrap .el-dialog__body {
    border-top: 1px solid #ccc;
}

</style>
<style scoped lang="scss">
.addNewAd-wrap {
    .sort-box {
        text-align: center;
        .sort-p {
            line-height: 40px;
        }
        .sort-ul {
            padding: 0;
            max-height: 500px;
            margin-bottom: 20px;
            border: 1px solid #ccc;
            box-sizing: border-box;
        }
        .sort-li {
            line-height: 50px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            padding: 0 40px;
            box-sizing: border-box;
        }
        .up, .down {
            position: absolute;
            right: 10px;
            top: 0;
            cursor:pointer;
            color: #409EFF;
        }
        .up {
            right: 35px; 
        }
        .up-over {
            color: #606266;
        }
        .down-over {
            color: #606266;
        }
    }
    .part-select {
        .search {
            border: 1px solid #ccc;
            margin-bottom: 20px;
            .input {
                width: 80%;
                margin-left: 33px;
                margin-top: 10px;
            }
        }
        p {
            height: 50px;
            line-height: 50px;
        }
        .search-ul {
            padding: 0;
            height: 240px;
            overflow-y: auto;
            text-align: center;
            li {
                line-height: 24px;
                cursor: pointer;
                &:hover {
                    background: #ccc;
                }
            }
        }
        .has-select-ul {
            height: 240px;
            overflow-y: auto;
            padding: 0;
            text-align: center;
            border: 1px solid #ccc;
            li {
                line-height: 24px;
                span {
                    position: absolute;
                    right: 10px;
                    top: 0;
                    cursor: pointer;
                }
                &:hover {
                    background: #ccc;
                }
            }
        }
    }
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
        width: 586px;
        height: 200px;
        border: 1px solid #DCDFE6;
        padding: 12px;
        border-radius: 4px;
        color: #606266;
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
