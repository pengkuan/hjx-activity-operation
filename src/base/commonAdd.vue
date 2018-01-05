<template>
    <div class="addNewAd-wrap">
        <div class="title">添加新广告
            <el-button type="primary" size="mini" @click="back">关闭</el-button>
        </div>
        <el-form ref="form" :model="form" label-width="100px"> 
            <el-form-item label="所属客户端" class="w600">
                <el-select v-model="form.clientId" placeholder="" disabled >
                    <el-option :label="item.clientName" :value="item.clientId" v-for="(item,index) in form.clientList" :key="index"></el-option> 
                </el-select> 
            </el-form-item>
            <el-form-item label="广告位置" class="w600">
                <el-select v-model="form.positionCode" placeholder="请选择广告位置" v-if="this.$route.query.from!='adPosition'">  
                    <el-option :label="item.positionName" :value="item.positionCode" v-for="(item,index) in form.positionList" :key="index"></el-option>  
                </el-select>
                <el-input v-model="form.positionCode_pos" v-if="this.$route.query.from=='adPosition'" disabled></el-input>
                <div class="tips">提示：此广告位线上已发布{{form.effectiveAdNum}}个广告，最多可发布{{form.adNum}}个广告</div>
            </el-form-item>
            <el-form-item label="广告标题" class="w600">
                <el-input v-model="form.adTitle" placeholder="请输入广告标题" :maxlength="20"></el-input>
                <div class="tips">最多20个字符</div>
            </el-form-item>
            <el-form-item label="广告素材类型" class="w600 img-text">
                <el-radio-group v-model="form.adType">
                    <el-radio :label="1" v-show="form.adType == 1">文字</el-radio>
                    <el-radio :label="2" v-show="form.adType == 2">图片</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="广告素材" class="w600 pos-rel upload-img-url" v-show="form.adType == 2">
                <p>
                    <el-input v-model="form.adImg" class="inline-block" disabled></el-input>
                    <el-upload class="upload-demo inline my-close"  
                        :action="this.uploadUrl"   
                        :on-success="uploadSuccess" 
                        :on-remove="uploadRemove"
                        :before-upload="beforeUpload" 
                        :limit="1" 
                        :data = "uploadData" 
                        :file-list="form.fileList">
                        <el-button size="small" type="primary" class="my-close">选择图片</el-button>
                    </el-upload> 
                </p>
                <div class="thumbnail">
                    <img :src="form.showSrc" alt="210*170" width="210" title="缩略图" v-show="form.showImg">
                </div>
                <div class="tips" style="padding-bottom:10px;">支持长仅{{form.imgWidth}}*高仅{{form.imgHigh}}的图片 png、jpeg格式，4M以内</div>
            </el-form-item>
            <el-form-item label="广告素材" class="w600" v-show="form.adType == 1">
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
                <el-input v-model="form.jumpUrl" v-show="form.isJump == 2" placeholder="如：http://www.huishoubao.com"></el-input>
            </el-form-item>
            <el-form-item label="可见范围" class="w600">
                <el-radio-group v-model="form.range">
                    <el-radio :label="1">全部用户</el-radio>
                    <el-radio :label="2" v-if="this.$route.query.from != 'adPosition'">部分用户</el-radio>
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
                                <p class="channel-list-test" v-show="this.channelResultList.length">
                                <span>{{this.hasSelectChannel}}</span>
                                <i v-show="this.channelResultList.length>1">等</i>
                                {{this.channelResultList.length}}个渠道
                                </p>
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
                                <el-input placeholder="请输入付款金额" class="pay-money" v-model.number="form.rangeList.amount.values" type="number">
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
            <el-form-item label="广告状态" v-if="this.$route.query.from != 'adPosition'">
                <el-radio-group v-model="form.isUse">
                    <el-radio :label="1">生效</el-radio>
                    <el-radio :label="0">不生效</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="投放时间" v-show="form.isUse==1" v-if="this.$route.query.from != 'adPosition'">
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
                <el-button type="primary" size="mini" class="my-select-sort" @click="ad_sort" :disabled="this.$route.query.from == 'adPosition'">选择</el-button>
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
                        <el-input v-model.trim="searchKey" class="input"></el-input>
                        <ul class="search-ul" v-show="part_detail_tit == '门店类'">
                            <li v-for="(item,index) in defaulSearchList" :key="index" @click="part_add_info(item)">{{item.storeName}}</li>  
                        </ul>
                        <ul class="search-ul" v-show="part_detail_tit == '渠道类'"> 
                            <li v-for="(item,index) in defaulSearchList" :key="index" @click="part_add_info(item)">{{item.channelName}}</li> 
                        </ul>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="has-select">
                        <p>已选{{defaultResultList.length}}/100</p>
                        <ul class="has-select-ul" v-show="part_detail_tit == '门店类'">
                            <li class="pos-rel" v-for="(item,index) in defaultResultList" :key="index">{{item.storeName}}<span @click="part_del_has_select(item,index)" class="iconfont icon-roundclosefill"></span></li>
                        </ul>
                        <ul class="has-select-ul" v-show="part_detail_tit == '渠道类'">
                            <li class="pos-rel" v-for="(item,index) in defaultResultList" :key="index">{{item.channelName}}<span @click="part_del_has_select(item,index)" class="iconfont icon-roundclosefill"></span></li>
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
                            <li class="sort-li pos-rel" v-for="(item, index) in sortData" :key="index">
                                {{item.adTitle}}
                                <span class="iconfont icon-triangleupfill up" :class="{'up-over':index==0}" v-show="item.adTitle == '本条广告'" @click="adSortUp(item,index)"></span> 
                                <span class="iconfont icon-triangledownfill down" :class="{'up-over':index==sortData.length-1}" v-show="item.adTitle == '本条广告'" @click="adSortDown(item,index)"></span> 
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
import config from '@/config'
export default {
    data() {
        return {
            form: {
                clientId: '', //客户端
                clientList: [], //客户端列表，用于循环
                positionCode: '', //广告位置
                positionCode_pos: '', //广告位置 - 从广告位过来的
                adNum: '0', //某条广告的最大投放数量
                effectiveAdNum: '0', //某条广告的目前生效数量
                positionList: [], //广告位列表
                adTitle: '', //广告标题
                adImg: '', //图片链接描述，如果是图片
                showSrc: '', //图片显示连接
                showImg: false, //图片最开始隐藏，因为有裂纹图
                imgWidth: '0', //图片宽
                imgHigh: '0', //图片高
                adType: 1, //文字还是图片 1是文字 2是图片 由广告位决定
                adDesc: '', //广告描述
                fileList: [], //文件相关
                isJump: 1, //1是不需要跳转 2是需要跳转
                jumpUrl: '', //需要跳转的跳转链接
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
                        values: '' //金额
                    }
                }, 
                isUse: 1, //1是生效 0是不生效
                useType: 1, //1是立即生效 2是自定义时间  
                startTime: '', //开始时间
                endTime: '', //结束时间
                sort: 1, //广告排序
            },
            // 部分可见数据
            addConditionValue: '', //选择什么条件添加
            addCondition: [{ label: '渠道类', options: [{ value: 'channel', label: '渠道' }, { value: 'store', label: '门店' }] }, { label: '订单类', options: [{ value: 'money', label: '金额付款' }] }],
            part_detail_tit: '',//选择渠道和门店弹框的标题  
            partChannelShow: false, 
            partStoreShow: false, 
            moneyLimitShow: false,
            dialog1: false, //选择渠道和门店
            dialog2: false, //广告排序
            // 排序数据(之前的广告列表)
            sortData: [],
            temporary_sortData: [], //广告临时数据
            needChangeAdFlag: true, //广告取消标志位
            // 部分用户dialog1弹框搜索数据和已选数据
            searchKey: '', //搜索关键字
            defaulSearchList:  [], //默认搜索数据，用来赋值用
            defaultResultList: [], //默认结果数据，用来赋值用
            channelSearchLish: [{channelName:'华为科技公司',channelId:'11'},{channelName:'华为2科技公司',channelId:'22'},{channelName:'华为3科技公司',channelId:'33'},], //渠道搜索数据
            channelResultList: [], //渠道结果数据，如果是修改广告，就不为空，新增应该为空
            storeSearchLish:   [{storeName:'小米科技公司',storeId:'1'},{storeName:'小米2科技公司',storeId:'2'},{storeName:'小米3科技公司',storeId:'3'},], //门店搜索数据
            storeResultList:   [], //门店结果数据，如果是修改广告，就不为空，新增应该为空
            // 临时数据，若不保存，需要回到数据操作前的数据
            temporary_channelResultList: [], //渠道临时数据
            temporary_storeResultList: [], //门店临时数据
            needChange: true, //添加渠道或者门店取消标志位，如果取消，那么不保存，确认才保存 
            // 文件上传参数
            uploadData: { 
                type: 'json',
                _version:"0.01",
                _msgType:"request",
                _timestamps:Math.floor(new Date().getTime()/1000) + '',
                _interface: 'ad_uploadImg',
                _remark: "",
                userid: "测试694", 
                token: "3077a9e5c2c6ea2c21c57c5bd95ccb8e", 
            },
            uploadUrl: config.uploadUrl,
            adPositionParams: {}, 
        }
    },
    methods: {
        validata() { //提交前表单验证 
            if (!this.form.positionCode && this.$route.query.from != 'adPosition') {
                this.$message.error('广告位置不能为空') 
                return false 
            } 
            if (!this.form.adTitle) {
                this.$message.error('广告标题不能为空') 
                return false 
            }
            if (!/^[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(this.form.adTitle)) {
                this.$message.error('广告标题只能输入中文，数字和字母') 
                return false
            } 
            if (this.form.adType == 1) {
                if (!this.form.adText) {
                    this.$message.error('广告素材不能为空') 
                    return false 
                }
                if (!/^[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(this.form.adText)) {
                    this.$message.error('广告素材只能输入中文，数字和字母') 
                    return false
                }
            }
            if (this.form.adType == 2) {
                if (!this.form.adImg) {
                    this.$message.error('广告素材不能为空') 
                    return false 
                }
                // if (/[\u4e00-\u9fa5]+/.test(this.form.adImg)) {
                //     this.$message.error('广告素材不能包含中文') 
                //     return false 
                // } 
            }  
            if (!this.form.adDesc) {
                this.$message.error('广告描述不能为空') 
                return false 
            }
            if (!/^[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(this.form.adDesc)) {
                this.$message.error('广告描述只能输入中文，数字和字母') 
                return false
            }  
            if (this.form.isJump == 2) {
                if (!this.form.jumpUrl) {
                    this.$message.error('跳转链接不能为空')  //跳转链接可能传中文的参数
                    return false 
                }
            }  
            if (this.form.range == '2' && this.partChannelShow == false && this.partStoreShow == false && this.moneyLimitShow == false) {
                this.$message.error('请至少选择1个条件')   
                return false 
            }
            if (this.form.range == 2 && this.partChannelShow == true) { //部分用户，且点出了渠道
                if (!this.form.rangeList.channel.values) {
                    this.$message.error('请选择渠道')  //跳转链接可能传中文的参数
                    return false
                }
            }
            if (this.form.range == 2 && this.partStoreShow == true) { //部分用户，且点出了门店
                if (!this.form.rangeList.store.values) {
                    this.$message.error('请选择门店')  //跳转链接可能传中文的参数
                    return false
                }
            }
            if (this.form.range == 2 && this.moneyLimitShow == true) { //部分用户，且点出了金额
                if (!this.form.rangeList.amount.values) {
                    this.$message.error('请输入金额')  //跳转链接可能传中文的参数
                    return false
                }
            }

            if (this.form.isUse == 1 && this.form.useType == 2) { //广告生效且自定义时间 就校验时间
                if (!this.form.startTime) {
                    this.$message.error('开始时间不能为空')  //结束时间可不校验
                    return false 
                }
                if (!this.form.endTime) {
                    this.$message.error('结束时间不能为空')  
                    return false 
                }
                if (this.form.endTime - this.form.startTime < 0) {
                    this.$message.error('结束时间不能小于开始时间')  //结束时间存在就必须比较大小
                    return false
                }
            } 

            if (this.form.isUse == 1 && this.form.adNum == this.form.effectiveAdNum) {
                this.$message.error('此广告位上的发布已达上限')  //广告生效且改广告位的最大值和生效值一致，那么不能添加 
                return false
            }
            return true //都验证ok，返回true
        },
        onSubmit() { //确认添加广告   
            if (!this.validata()) return   
            let params = {   //直接传form是否会有风险？？？？？
                clientId: this.form.clientId,
                positionCode: this.form.positionCode,
                adTitle: this.form.adTitle,
                adDesc: this.form.adDesc,
                adText: this.form.adText,
                adImg: this.form.adImg,
                isJump: this.form.isJump,
                jumpUrl: this.form.jumpUrl,
                isUse: this.form.isUse,
                useType: this.form.useType,
                startTime: this.form.startTime,
                endTime: this.form.endTime,
                sort: this.form.sort,
                range: this.form.range, 
                rangeList: {
                    channel: {
                        status: this.form.rangeList.channel.status,  
                        values: this.form.rangeList.channel.values
                    },
                    store: {
                        status: this.form.rangeList.store.status,  
                        values: this.form.rangeList.store.values,  
                    },
                    amount: {
                        status: this.form.rangeList.amount.status,  
                        values: this.form.rangeList.amount.values,  
                    }
                }
            }
            //容错处理
            //文字 图片是唯一的，不需要处理
            if(this.form.isJump == 1) params.jumpUrl = ''  //不需要跳转，则取消跳转链接
            if(this.form.isUse == 2) params.startTime = '' //不生效，则取消时间 
            if(this.form.isUse == 2) params.endTime = ''   //不生效，则取消时间
            if(this.form.isUse == 1 && this.form.useType == 1) params.startTime = '' //生效且，立即生效，则取消时间
            if(this.form.isUse == 1 && this.form.useType == 1) params.endTime = ''   //生效且，立即生效，则取消时间 
            if(this.form.isUse == 1 && this.form.useType == 2) { //启动，且阶段生效
               params.startTime = Math.floor(this.form.startTime.getTime()/1000)
               params.endTime = Math.floor(this.form.endTime.getTime()/1000) 
            } 
            if(this.form.range == 1) params.rangeList = '' 

            // console.log(params)
            // return  
            if (this.$route.query.from == 'adPosition') { //来自广告位新建永久广告的新建广告
                params.positionCode = this.form.positionCode_pos
                // console.log(params)
                // console.log(this.adPositionParams)
                this.adPositionParams.adImg = params.adImg
                this.adPositionParams.adText = params.adText
                this.adPositionParams.adTitle = params.adTitle
                this.adPositionParams.adDesc = params.adDesc
                this.adPositionParams.isJump = params.isJump
                this.adPositionParams.jumpUrl = params.jumpUrl  
                api.ad_addAdPositionPermanent(this.adPositionParams).then((res)=> {
                    if (res._ret != '0') {
                        this.$message.error(res._errStr)
                        return
                    }
                    let returnPath = this.$route.query.pagePath
                    this.$router.push({path:returnPath}) 
                }) 
            } else {
                api.ad_addAdInfo(params).then((res)=>{ //直接添加广告的广告
                    if (res._ret != '0') {
                        this.$message.error(res._errStr)
                        return
                    }
                    let returnPath = this.$route.query.pagePath
                    this.$router.push({path:returnPath}) 
                })
            } 
        },
        getChannel() { //获取渠道列表数据
            api.ad_getChannel({}).then((res)=> {
                // console.log(res)
                if (res._ret != '0') {
                    this.$message.error(res._errStr)
                    return
                }
                this.channelSearchLish = res.list
            })
        },
        getStore() { //获取门店列表数据
            api.ad_getStore({}).then((res)=> {
                // console.log(res)
                if (res._ret != '0') {
                    this.$message.error(res._errStr)
                    return
                }
                this.storeSearchLish = res.list
            })
        },
        getClientList() { //获取客户端列表数据
            api.ad_getClient({}).then((res)=>{
                if (res._ret != '0') {
                    this.$message.error(res._errStr)
                    return
                } 
                console.log(res)
                this.form.clientList = res.clientList  
                this.form.clientId = this.$route.query.clientId 
            })
        },
        getAdPosList() { //获取广告位列表
            let params = {clientId: this.$route.query.clientId, inUse:'1'} 
            api.ad_getAdPosition(params).then((res)=>{
                if (res._ret != '0') {
                    this.$message.error(res._errStr)
                    return
                }    
                this.form.positionList = res.positionList 
                console.log(this.form.positionList) 
            })
        },
        ad_getPositionaInfo(code) { //获取广告位详情 
            let params = {positionCode: code}
            api.ad_getPositionaInfo(params).then((res)=>{
                if (res._ret != '0') {
                    this.$message.error(res._errStr)
                    return
                }  
                console.log(res)
                this.sortData = res.positionaInfo.adList 
                console.log(this.sortData)
                this.form.adNum = res.positionaInfo.adNum
                this.form.effectiveAdNum = res.positionaInfo.effectiveAdNum
                this.form.adType = res.positionaInfo.adType
                this.form.imgWidth = res.positionaInfo.imgWidth
                this.form.imgHigh = res.positionaInfo.imgHigh
            })
        },
        // 文件处理函数
        beforeUpload(file) { //头像上传前的钩子
            const type = file.type === 'image/jpeg' || file.type === 'image/png' 
            const isLt4M = file.size / 1024 / 1024 / 1024 / 1024 < 2 
            console.log(file)
            if (!type) {
              this.$message.error('上传头像图片只能是jpeg或png格式!')
              return false
            }
            if (!isLt4M) {
              this.$message.error('上传图片大小不能超过4MB!')
              return false
            } 
        },
        uploadSuccess(response, file, fileList) {  //上传成功
            let res = response._data
            if (res._ret != '0') {
                this.$message.error(res._errStr)
                return false
            }
            this.form.showImg = true 
            this.form.adImg = res.data.url
            this.form.showSrc = res.data.url

            console.log(this.form.fileList)
        },
        uploadRemove(file) { //删除上传的图片
            this.form.adImg = ''
            this.form.showSrc = ''
            this.form.showImg = false
        },
        checkIsAdd(arr) {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].adTitle == '本条广告') {
                    return false
                }
            }
            return true
        },
        ad_sort() { //广告排序
            this.dialog2 = true
            if (this.checkIsAdd(this.sortData)) {  
                this.sortData.push({adTitle:'本条广告'})
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
                    if(item.adTitle == '本条广告') {
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
            this.$confirm('是否确认将条件数据删除？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (flag == 'channel')  this.partChannelShow = false, this.channelResultList = []
                if (flag == 'store')  this.partStoreShow = false, this.storeResultList = []
                if (flag == 'money')  this.moneyLimitShow = false, this.form.rangeList.amount.values = ''
            }).catch(() => {}) 
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
        back() { //返回和取消
            let pagePath = this.$route.query.pagePath
            this.$router.push({path: pagePath})
        }
    },
    computed: {
        fontCount() { //文字倒计数
            return this.form.adDesc.length
        },
        hasSelectChannel() { //已选渠道列表的文字描述 
            let str = '',
                len = this.channelResultList.length
            this.channelResultList.forEach(function(item, index){
                if (len == index+1) {
                    str += item.channelName
                } else {
                    str += item.channelName + ','
                } 
            })
            return str 
        }
    },
    watch: {
        searchKey(val) {//关键字搜索
            let arr1 = [] 
            if (this.part_detail_tit == '渠道类') {
                this.channelSearchLish.forEach(function(item){  
                    if (item.channelName.indexOf(val) != -1) {
                        arr1.push(item)
                    }
                })
            } else if (this.part_detail_tit == '门店类') {
                this.storeSearchLish.forEach(function(item){ 
                    if (item.storeName.indexOf(val) != -1) {
                        arr1.push(item)
                    }
                })
            }  
            this.defaulSearchList = arr1  
        },
        channelResultList(val) { //监控已选渠道结果的变化
            console.log('channelResultList变了') 
            let str = '',
                len = this.channelResultList.length
            this.channelResultList.forEach(function(item, index){
                if (len == index+1) {
                    str += item.channelId
                } else {
                    str += item.channelId + ','
                } 
            })  
            this.form.rangeList.channel.values = str
        },
        storeResultList(val) { //监控已选门店结果的变化
            let str = '',
                len = this.storeResultList.length
            this.storeResultList.forEach(function(item, index){
                if (len == index+1) {
                    str += item.storeId
                } else {
                    str += item.storeId + ','
                } 
            })
            this.form.rangeList.store.values = str 
        },
        ['form.positionCode'](code){
            // console.log(code)
            this.ad_getPositionaInfo(code) 
        },
        sortData() {
            // this.form.sort = this.sortData.length + 1
        }

    },
    created() {
        if (this.$route.query.from == 'adPosition') { 
            this.adPositionParams = util.Get_lsdata('adParams')
            this.form.positionCode_pos = this.adPositionParams.positionCode 
            this.form.adNum = this.adPositionParams.adNum
            this.form.effectiveAdNum = 0
            this.form.adType = this.adPositionParams.adType
            this.form.sort = 1
            // console.log(this.adPositionParams)
        }
    },
    mounted() {  
        this.form.sort = this.sortData.length + 1  
        this.getClientList() //客户端列表 
        this.getAdPosList() //广告位列表
        this.getChannel() //渠道列表
        this.getStore() //门店列表  
    }
}

</script>
<style>
.addNewAd-wrap .el-dialog__body {      
    border-top: 1px solid #ccc;
}
.addNewAd-wrap .el-upload-list {
    margin-top: 17px;
} 
.addNewAd-wrap .el-upload-list__item:hover {   
    background: none;
}
.addNewAd-wrap .img-text .el-radio+.el-radio {  
    margin-left: 0;
}

</style>
<style scoped lang="scss">
.addNewAd-wrap { 
    .sort-box {
        text-align: center;
        max-height: 500px;
        overflow: auto;
        .sort-p {
            line-height: 40px;
        }
        .sort-ul {
            padding: 0;
            max-height: 500px;
            margin-bottom: 20px;
            // border: 1px solid #ccc;
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
    .upload-img-url {
        padding-right: 80px;   
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
