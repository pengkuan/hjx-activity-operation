<template>
    <div class="editNewAd-wrap" v-loading="loading">
        <div class="myimg" style="position:absolute;z-index:-999;opacity:0;" ref="myDivDom"><img :src="myscr" ref="myImgDom"></div>
        <div class="title">修改广告 
            <el-button type="primary" size="mini" @click="back">关闭</el-button>
        </div>
        <el-form ref="form" :model="form" label-width="100px"> 
            <el-form-item label="所属客户端" class="w600">
                <el-select v-model="form.clientId" placeholder="" disabled>
                    <el-option :label="item.clientName" :value="item.clientId" v-for="(item,index) in form.clientList" :key="index"></el-option> 
                </el-select> 
            </el-form-item>
            <el-form-item label="广告位置" class="w600">
                <el-select v-model="form.positionId" placeholder="请选择广告位置" disabled>  
                    <el-option :label="item.positionName" :value="item.positionId" v-for="(item,index) in form.positionList" :key="index"></el-option>  
                </el-select> 
            </el-form-item>
            <el-form-item label="广告标题" class="w600">
                <el-input v-model="form.adTitle" placeholder="请输入广告标题" :maxlength="20"></el-input>
                <div class="tips">最多20个字符</div>
            </el-form-item>
            <el-form-item label="广告素材类型" class="w600 img-text">
                <el-radio-group v-model="form.adType">
                    <el-radio :label="1" v-show="form.adType==1">文字</el-radio>
                    <el-radio :label="2" v-show="form.adType==2">图片</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="广告素材" class="w600 pos-rel" v-show="form.adType == 2">
                <p>
                    <el-input v-model="form.adImg" class="inline-block" disabled></el-input>
                    <el-upload class="upload-demo inline my-close"  
                        :action="this.UPLOAD_URL"
                        ref="myUpload"   
                        :on-exceed="exceed" 
                        :on-success="uploadSuccess" 
                        :on-error="uploadError" 
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
                <el-input type="textarea" :maxlength="200" :autosize="{ minRows: 4, maxRows: 8}" v-model="form.adDesc" placeholder="请输入广告描述"></el-input>
                <div class="tips pos-rel">最多可输入200字符</span></div> 
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
                    <el-radio :label="2">部分用户</el-radio>
                </el-radio-group>
                <div class="usrs-set" v-show="form.range == 2">
                    <el-row class="mb8" v-show="partChannelShow">
                        <el-col :span="4" class="text-right">
                            <p>渠道</p>
                        </el-col>
                        <el-col :span="20">
                            <p class="pos-rel">
                                <el-select v-model="form.rangeList.channel.status" placeholder="请选条件" class="selct-channel">
                                    <el-option label="包含"   :value="1"></el-option> 
                                    <el-option label="不包含" :value="2"></el-option> 
                                </el-select>
                                <p class="channel-list-test" v-show="this.channelResultList.length"><span>{{this.hasSelectChannel}}</span>
                                <i v-show="this.channelResultList.length>1">等</i>
                                {{this.channelResultList.length}}个渠道</p>
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
                                <el-select v-model="form.rangeList.store.status" placeholder="请选条件" class="selct-channel">
                                    <el-option label="包含"   :value="1"></el-option> 
                                    <el-option label="不包含" :value="2"></el-option> 
                                </el-select>
                                <p class="channel-list-test" v-show="this.storeResultList.length">
                                <span>{{this.hasSelectStore}}</span>
                                <i v-show="this.storeResultList.length>1">等</i>
                                {{this.storeResultList.length}}个渠道
                                </p>
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
                                <el-select v-model="form.rangeList.amount.status" placeholder="请选条件" class="selct-channel">
                                    <el-option label="大于等于" :value="3"></el-option> 
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
                    <el-radio :label="0" :disabled="form.isDefault">不生效</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="投放时间" v-show="form.isUse==1">
                <el-radio-group v-model="form.useType">
                    <el-radio :label="1">投放后立即开始</el-radio>
                    <el-radio :label="2" :disabled="form.isDefault">自定义时间</el-radio>
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
            <el-form-item label="广告排序" class="w300 pos-rel" v-show="form.isUse==1">
                <el-input v-model="form.sort" disabled></el-input>
                <el-button type="primary" size="mini" class="my-select-sort" @click="ad_sort">选择</el-button>
            </el-form-item>  
            <el-form-item label="操作人" class="w600">
                <el-input v-model="form.modifier" disabled></el-input>
            </el-form-item>
            <el-form-item label="更新时间" class="w600">
                <el-input v-model="modifyTime_date" disabled></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">确认修改</el-button>
                <el-button @click="back">取消</el-button>
            </el-form-item>
        </el-form> 
        <conditionSelect 
            v-if="this.channelSearchLish.length && this.storeSearchLish.length"
            :category="part_detail_tit" 
            :showFlag="conditonDialog"
            :searchLish="searchLish"
            :resultList="resultList"
            @conditionSelectClose="conditionSelectClose"> 
        </conditionSelect> 
        <adSort 
            v-if="form.adTitle"
            :showFlag="adDialog" 
            :adTitle="form.adTitle" 
            @adSortClose="adSortClose" 
            :sortData="sortData"> 
        </adSort>
    </div>
</template>
<script>
import api from '@/api/ad'
import util from '@/util'
import config from '@/config'
import {formatDate} from '@/assets/js/date'
import adSort from '@/base/hjx_ad_sort'
import conditionSelect from '@/base/hjx_ad_part'
export default {
    data() {
        return {
            form: {
                clientId: this.$route.query.clientId, //客户端
                isDefault:this.$route.query.isDefault,
                clientList: [], //客户端列表，用于循环
                positionCode: '', //广告位置code吗 
                positionId: '', //广告位置id码
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
                isJump: 2, //1是不需要跳转 2是需要跳转
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
                useType: 2, //1是立即生效 2是自定义时间  
                startTime: '', //开始时间
                endTime: '', //结束时间
                sort: 1, //广告排序
                currentTitle: '', //当前广告，用于广告排序删除数据
                modifier: '', //操作人
                modifyTime: '', //操作时间
            },
            // 部分可见数据
            addConditionValue: '', //选择什么条件添加
            addCondition: [{ label: '渠道类', options: [{ value: 'channel', label: '渠道' }, { value: 'store', label: '门店' }] }, { label: '订单类', options: [{ value: 'money', label: '付款金额' }] }],
            part_detail_tit: '',//选择渠道和门店弹框的标题  
            partChannelShow: false, 
            partStoreShow: false, 
            moneyLimitShow: false,
            dialog1: false, //选择渠道和门店
            adDialog: { //广告排序
                flag: false,
                where: 'edit'
            },
            conditonDialog: { //部分用户条件选择
                flag: false, 
            },  
            sortData: [],  // 排序数据(之前的广告列表)
            channelSearchLish: [], //渠道搜索数据
            channelResultList: [], //渠道结果数据，如果是修改广告，就不为空，新增应该为空
            storeSearchLish: [], //门店搜索数据
            storeResultList: [], //门店结果数据，如果是修改广告，就不为空，新增应该为空 
            searchLish: [],
            resultList: [],  
            uploadData: util.commonUploadData(this.$store.getters['userInfo/userId'], this.$store.getters['userInfo/loginToken']), //上传参数
            UPLOAD_URL: config.UPLOAD_URL,
            myscr: '',
            loading: false, 
        }
    },
    methods: {
        validata() { //提交前表单验证  
            let option = [
                { 
                    condition: !this.form.positionCode, 
                    tips: '广告位置不能为空'
                },
                { 
                    condition: !this.form.adTitle, 
                    tips: '广告标题不能为空'
                },
                { 
                    condition: !/^[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(this.form.adTitle), 
                    tips: '广告标题只能输入中文，数字和字母'
                },
                { 
                    condition: this.form.adTitle.gblen() > '20', 
                    tips: '广告标题最多20个字符'
                },
                { 
                    condition: !this.form.positionCode, 
                    tips: '广告位置不能为空'
                },
                { 
                    condition: this.form.adType == 1, 
                    children: [
                        { 
                           condition: !this.form.adText,
                           tips: '广告素材不能为空' 
                        },
                        { 
                           condition: !/^[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(this.form.adText),
                           tips: '广告素材只能输入中文，数字和字母' 
                        },
                        { 
                           condition: this.form.adText.gblen() > '100',
                           tips: '广告素材最多100个字符' 
                        }, 
                    ]
                }, 
                { 
                    condition: this.form.adType == 2, 
                    children: [
                        { 
                           condition: !this.form.adImg,
                           tips: '广告素材不能为空' 
                        }, 
                    ]
                },
                { 
                    condition: this.form.adDesc, 
                    children: [
                        { 
                           condition: this.form.adDesc.gblen() > '200',
                           tips: '广告描述最多200个字符' 
                        }, 
                    ]
                },
                { 
                    condition: this.form.isJump == 2, 
                    children: [
                        { 
                           condition: !this.form.jumpUrl,
                           tips: '跳转链接不能为空' 
                        }, 
                    ]
                },
                { 
                    condition: this.form.range == '2' && this.partChannelShow == false && this.partStoreShow == false && this.moneyLimitShow == false, 
                    tips: '请至少选择1个条件'
                },
                { 
                    condition: this.form.range == 2 && this.partChannelShow == true, 
                    children: [
                        { 
                           condition: !this.form.rangeList.channel.values,
                           tips: '请选择渠道' 
                        }, 
                    ]
                }, 
                { 
                    condition: this.form.range == 2 && this.partStoreShow == true, 
                    children: [
                        { 
                           condition: !this.form.rangeList.store.values,
                           tips: '请选择门店' 
                        }, 
                    ]
                },
                { 
                    condition: this.form.range == 2 && this.moneyLimitShow == true, 
                    children: [
                        { 
                           condition: !this.form.rangeList.amount.values,
                           tips: '请输入金额' 
                        }, 
                        { 
                           condition: !/^[1-9]\d*$/.test(Number(this.form.rangeList.amount.values)),
                           tips: '付款金额只能为正整数' 
                        },
                    ]   
                },
                { 
                    condition: this.form.isUse == 1 && this.form.useType == 2, 
                    children: [
                        { 
                           condition: !this.form.startTime,
                           tips: '开始时间不能为空' 
                        },  
                        { 
                           condition: !this.form.endTime,
                           tips: '结束时间不能为空' 
                        },
                        { 
                           condition: this.form.endTime - this.form.startTime < 0,
                           tips: '结束时间不能小于开始时间' 
                        },
                    ]
                },
                { 
                    condition: this.form.isUse == 1 && !this.form.sort, 
                    tips: '请选择广告排序'
                },
            ] 
            return util.validata(option)   
        },
        onSubmit() { //确认修改广告
            if (!this.validata()) return  

            let params = {   //直接传form是否会有风险？？？？？
                clientId: this.form.clientId,
                adId: this.$route.query.adId,
                positionId: this.form.positionId,
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
                modifier: this.form.modifier, 
                modifyTime: this.form.modifyTime, 
                rangeList: {
                    channel: {
                        status: this.form.rangeList.channel.status,  
                        values: this.form.rangeList.channel.values,  
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
            if(this.form.isUse == 2) params.sort = ''   //不生效，排序为空
            if(this.form.isUse == 1 && this.form.useType == 1) params.startTime = '' //生效且，立即生效，则取消时间
            if(this.form.isUse == 1 && this.form.useType == 1) params.endTime = ''   //生效且，立即生效，则取消时间 
            if(this.form.isUse == 1 && this.form.useType == 2) { //启动，且阶段生效
               params.startTime = Math.floor(this.form.startTime/1000)
               params.endTime = Math.floor(this.form.endTime/1000) 
            } 
            if (this.form.range == 1) params.rangeList = ''
            // console.log(params)
            // return 
            this.loading = true
            api.ad_editAdInfo(params).then((res)=>{ //修改广告接口
                if (res._ret != '0') {
                    this.$message.error(res._errStr)
                    this.loading = false
                    return
                }
                this.loading = false
                let returnPath = this.$route.query.pagePath
                this.$router.push({path:returnPath})  
            })
        },
        ad_getAdInfo() { //获取广告详情
            let params = {
                adId: this.$route.query.adId 
            }
            this.loading = true
            api.ad_getAdInfo(params).then((res)=> {
                if (res._ret != '0') {
                    this.$message.error(res._errStr)
                    return
                }    
                this.sortData = res.adInfo.position.adList 
                this.loading = false
                // console.log(res)
                // console.log(this.sortData)
                this.form.positionCode = res.adInfo.position.positionCode
                this.form.positionId = res.adInfo.positionId
                this.form.adTitle = res.adInfo.adTitle 
                this.form.adImg = res.adInfo.adImg 
                this.form.imgWidth = res.adInfo.position.imgWidth 
                this.form.imgHigh = res.adInfo.position.imgHigh 
                this.form.adImg = res.adInfo.adImg 
                this.form.showSrc = res.adInfo.adImg 
                this.form.showImg = true
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
                this.form.currentTitle = res.adInfo.adTitle  
                this.form.modifier = res.adInfo.modifier   
                this.form.modifyTime = res.adInfo.modifyTime 
                // 单独处理部分用户部分
                if (this.form.range == 2&&res.adInfo.rangeList.channel != '') {
                    this.partChannelShow = true
                    this.form.rangeList.channel.status = res.adInfo.rangeList.channel.status
                    this.channelResultList = res.adInfo.rangeList.channel.values
                }
                if (this.form.range == 2&&res.adInfo.rangeList.store != '') {
                    this.partStoreShow = true
                    this.form.rangeList.store.status = res.adInfo.rangeList.store.status
                    this.storeResultList = res.adInfo.rangeList.store.values
                }
                if (this.form.range == 2&&res.adInfo.rangeList.amount != '') {
                    this.moneyLimitShow = true
                    this.form.rangeList.amount.status = res.adInfo.rangeList.amount.status
                    this.form.rangeList.amount.values = res.adInfo.rangeList.amount.values
                }  
            })
        },
        getChannel() { //获取渠道列表数据
            api.ad_getChannel({}).then((res)=> { 
                if (res._ret != '0') {
                    this.$message.error(res._errStr)
                    return
                }
                this.channelSearchLish = res.list
            })
        },
        getStore() { //获取门店列表数据
            api.ad_getStore({}).then((res)=> { 
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
                this.form.positionList = res.positionList 
            })
        },
        // 文件处理函数
        beforeUpload(file) { //头像上传前的钩子
            const type = file.type === 'image/jpeg' || file.type === 'image/png'
            const isLt4M = file.size / 1024 / 1024 / 1024 / 1024 < 2   
            const url = window.URL.createObjectURL(file)
            this.myscr = url  
            this.$refs.myImgDom.onload = ()=> {   
                if (this.$refs.myDivDom.offsetWidth != this.form.imgWidth) {
                    this.$message.error('上传图片宽度不正确!')  
                    this.$refs.myUpload.abort() 
                    this.$refs.myUpload.clearFiles()
                }
                if (this.$refs.myDivDom.offsetHeight != this.form.imgHigh) {
                    this.$message.error('上传图片高度不正确!')
                    this.$refs.myUpload.abort() 
                    this.$refs.myUpload.clearFiles()
                }  
            }       
            if (!type) {
              this.$message.error('上传图片只能是jpeg或png格式!')
              this.src = ''
              return false
            }
            if (!isLt4M) {
              this.$message.error('上传图片大小不能超过4MB!')
              this.src = ''
              return false
            }   
        }, 
        exceed(files, fileList) {
            this.$message.error('只能上传1个,若需要更换需先删除')
        },
        uploadError(files, fileList) {
            this.$message.error('上传失败')
        },
        uploadSuccess(response, file, fileList) {  //上传成功   
            let res = response._data
            if (res._ret != '0') {
                this.$message.error(res._errStr)
                this.$refs.myUpload.clearFiles()
                return false
            }
            this.form.showImg = true 
            this.form.adImg = res.data.url
            this.form.showSrc = res.data.url 
        },
        uploadRemove(file) { //删除上传的图片
            this.form.adImg = ''
            this.form.showSrc = ''
            this.form.showImg = false
        }, 
        ad_sort() { //广告排序
            this.adDialog.flag = true  
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
        part_add_detail(flag) {//部分用户，添加渠道和门店的详细信息,显示弹框
            this.conditonDialog.flag = true 
            if (flag == 'channel') {
                this.part_detail_tit = '渠道类' 
                this.searchLish = this.channelSearchLish
                this.resultList = this.channelResultList
            }
            if (flag == 'store') {
                this.part_detail_tit = '门店类'
                this.searchLish = this.storeSearchLish
                this.resultList = this.storeResultList
            } 
        }, 
        back() { //返回和取消
            let returnPath = this.$route.query.pagePath
            this.$router.push({path:returnPath}) 
        },
        adSortClose(flag, data) { //广告排序关闭回调函数  
            if (flag == 'isOk') {
                let n = -1
                data.forEach(function(item, index){
                    if(item.adTitle == '本条广告') {
                       n = index + 1 
                    }
                })  
                this.form.sort = n
            } else {
                this.sortData = data
            }  
        },
        conditionSelectClose(flag, data) { //部分用户类别选择关闭的回调函数
            if (flag == '渠道类') {
                this.channelResultList = data
            } else {
                this.storeResultList = data
            } 
        }
    },
    // filters: {
    //     formatDate(time) {
    //         let date = new Date(time)
    //         return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    //     }
    // },
    computed: { 
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
        },
        hasSelectStore() { //已选门店列表的文字描述 
            let str = '',
                len = this.storeResultList.length
            this.storeResultList.forEach(function(item, index){
                if (len == index+1) {
                    str += item.storeName
                } else {
                    str += item.storeName + ','
                } 
            })
            return str 
        },
        modifyTime_date() {
            let date = new Date(this.form.modifyTime*1000)
            return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
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
            // console.log('channelResultList变了') 
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
        ['form.range'](val) { //设置默认值，避免不自动选择
            if (val == 2) {
                this.form.rangeList.channel.status = 1
                this.form.rangeList.store.status = 1
                this.form.rangeList.amount.status = 3
            }
        }
    },
    components: {
        adSort,
        conditionSelect
    },
    mounted() {  
        this.getClientList() //客户端列表
        this.getAdPosList() //广告位列表
        this.getChannel() //渠道列表
        this.getStore() //门店列表
        this.ad_getAdInfo() //获取广告详情
        this.form.sort = this.sortData.length + 1  
    }
}

</script>
<style> 
.editNewAd-wrap .el-dialog__body {      
    border-top: 1px solid #ccc;
}
.editNewAd-wrap .el-upload-list {
    margin-top: 17px;
} 
.editNewAd-wrap .el-upload-list__item:hover {   
    background: none;
}
.editNewAd-wrap .img-text .el-radio+.el-radio {  
    margin-left: 0;
}

</style>
<style scoped lang="scss">
.editNewAd-wrap {
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
        overflow: hidden;
        img {  
            position: absolute;
            left: 0;
            top: 50%;
            transform: translate(0,-50%);
        }
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
            max-width: 150px;
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
        left: 460px;
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
