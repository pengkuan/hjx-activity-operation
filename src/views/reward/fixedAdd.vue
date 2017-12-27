<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/reward/list' }">定额定向抽奖</el-breadcrumb-item>
            <el-breadcrumb-item>新增</el-breadcrumb-item>
        </el-breadcrumb>
        <br>
        <el-alert title="基本信息" type="success" :closable="false"></el-alert>
        <hjx-left-title label="名称"></hjx-left-title>
        <hjx-underline-input label="活动名称" width="200" v-model="activityName" placeholder="请输入活动名称"></hjx-underline-input>
        <hjx-underline-input label="活动描述" width="200" v-model="activityDesc" placeholder="请输入活动描述"></hjx-underline-input>
        <hjx-left-title label="类型"></hjx-left-title>
        <div class="mrg-b10">
            <span class="hjx-left-label">运营类型：</span>
            <el-radio v-for="item in ticketTypeList" v-model="operateType" :label="item.id" :key="item.id">{{item.name}}</el-radio>
        </div>
        <div class="mrg-b10">
            <span class="hjx-left-label">前端展示：</span>
            <el-select class="spc-select" v-model="showPlan" placeholder="请选择" size="mini">
                <el-option v-for="item in showPlanList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
            </el-select>
        </div>
        <br>
        <el-alert title="生成规则" type="success" :closable="false"></el-alert>
        <hjx-left-title label="时间"></hjx-left-title>
        <div class="mrg-b10">
            <span class="hjx-left-label">生效时间：</span><span class="reward-remind hjx-info">（该时间段内，将按规则进行活动）</span>
            <p class="mrg-l120" v-for="item in timeLimitTypeList" >
                <el-radio v-model="timeLimitType" :label="item.id" :key="item.id">{{item.name}}</el-radio>
                <span class="mrg-l40" v-if="item.id == '2' && timeLimitType == '2'">
                    <el-date-picker v-model="dateLimitRange" value-format="yyyy-MM-dd" size="small" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                    <el-time-picker is-range size="small" value-format="HH:mm:ss" v-model="timeLimitRange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围">
                    </el-time-picker>
                </span>
            </p>
        </div>
        <hjx-left-title label="算法"></hjx-left-title>
        <div class="mrg-b10 ">
            <hjx-underline-input label="单笔奖金" type='number' width="50"  v-model="directAmount" :textCenter="true"></hjx-underline-input><span class="underline-text">元</span>
            <span class="reward-remind underline-text">（为定额奖金）</span>
        </div>
        <hjx-left-title label="促收"></hjx-left-title>
        <div class="mrg-b10">
            <span class="hjx-left-label">工号开通时间：</span>
            <span class="reward-remind hjx-info">（该时间段内，将按规则进行活动）</span>
            <p class="mrg-l120">
                <el-radio v-for="item in isCheckUserCreateTimeList" v-model="isCheckUserCreateTime" :label="item.id" :key="item.id">{{item.name}}</el-radio>
            </p>
            
            <p class="mrg-l40" v-if="isCheckUserCreateTime == 1">
                <el-date-picker v-model="checkUserCreateTime" value-format="yyyy-MM-dd"  size="small" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </p>
        </div>
        <div class="mrg-b10">
            <div class="mrg-b10">
                <span class="hjx-left-label">付款金额：</span><span class="reward-remind hjx-info">（满足该付款金额区间的订单参与活动）</span>
            </div>
            <div class="mrg-l120">
                <hjx-underline-input type='number' width="50"  v-model="directGrantSection.least"  :textCenter="true"></hjx-underline-input>
                <span class="underline-text"> ≤ 付款金额 < </span>
                <hjx-underline-input type='number' width="50"  v-model="directGrantSection.most" :textCenter="true"></hjx-underline-input>
                
            </div>
        </div>
        <hjx-left-title label="风控"></hjx-left-title>
        <div class="mrg-b10 ">
            <hjx-underline-input label="发放总额上限" type='number' width="50"  v-model="upperLimitAmount" :textCenter="true"></hjx-underline-input><span class="underline-text">元 / 整个时间段</span>
            <span class="reward-remind underline-text">（周期内发放金额达到上限后，每笔红包将按单笔最低值发放）</span>
        </div>
        <el-alert title="发放规则" type="success" :closable="false"></el-alert>
        <hjx-left-title label="订单"></hjx-left-title>
        <div class="mrg-b10">
            <span class="hjx-left-label">订单回收方式：</span>
            <el-checkbox v-for="item in recycleTypeList" v-model="item.ifChoosed" :key="item.id">{{item.name}}</el-checkbox>
            <p class="reward-remind mrg-l40 hjx-info">（勾选的回收方式，可参与到活动中）</p>
        </div>
        <hjx-left-title label="机型"></hjx-left-title>
        <div>
            <span class="hjx-left-label">参与机型：</span>
            <span class="hjx-hover ft13 hjx-blue mrg-l20" @click="showChoose('category')">
                <el-button v-if="modelList.L1.length>0||modelList.L2.length>0" type="text" >已设置 <i class="iconfont icon-duigou"></i></el-button>
                <el-button v-else type="text">未设置<i class="el-icon-arrow-right el-icon--right"></i></el-button>
            </span>
            <p class="reward-remind mrg-l40 hjx-info">（满足选中机型的订单，可参与到活动中）</p>
        </div>
        <hjx-left-title label="对象"></hjx-left-title>
        <div>
            <span class="hjx-left-label">商户/门店：</span>
            <span class="hjx-hover ft13 hjx-blue mrg-l14" @click="showChoose('channel')">
                <el-button v-if="channelList.L1.length>0||channelList.L2.length>0" type="text" >已设置 <i class="iconfont icon-duigou"></i></el-button>
                <el-button v-else type="text" >未设置<i class="el-icon-arrow-right el-icon--right"></i></el-button>
            </span>
        </div>
        <div class="mrg-b10">
            <span class="hjx-left-label">门店地域：</span>
            <span class="hjx-hover ft13 hjx-blue mrg-l20" @click="showChoose('addr')">
                <el-button v-if="addrList.L1.length>0||addrList.L2.length>0" type="text" >已设置 <i class="iconfont icon-duigou"></i></el-button>
                <el-button v-else type="text" >未设置<i class="el-icon-arrow-right el-icon--right"></i></el-button>
            </span>
        </div>
        <hjx-select-alert  :action="'category'" :ifshow="ifshowModel" @close="closeAlert" :data="modelList" @setData="setModelData"></hjx-select-alert>
        <hjx-select-alert  :action="'addr'" :ifshow="ifshowAddr" @close="closeAlert" :data="addrList" @setData="setAddrData"></hjx-select-alert>
        <hjx-select-alert  :action="'channel'" :ifshow="ifshowChannel" @close="closeAlert" :data="channelList" @setData="setChannelData"></hjx-select-alert>
        <div class="operate">
            <el-button @click="onSubmit" type="primary" size="mini">确认</el-button>
            <el-button size="mini">取消</el-button>
        </div>
        <!-- 背景框 -->
        <div v-show="ifshowModel||ifshowAddr||ifshowChannel" class="v-modal" style="z-index:2005"></div>
    </div>
</template>
<script>
import api from '@/api/index'
import { mapGetters } from 'vuex'
import hjxPart from '@/base/hjx_part'
import hjxLeftTitle from '@/base/hjx_left_title'
import hjxUnderlineInput from '@/base/hjx_underline_input'
import hjxSelectAlert from '@/base/hjx_select_alert'
export default {
    components: { hjxPart, hjxLeftTitle, hjxUnderlineInput, hjxSelectAlert },
    data() {
        return {
            amountLimitType: '1', //总金额限制类型 

            activityName: '',
            activityDesc: '',
            rewardType: '2', //定额定向抽奖
            operateType: '1',
            ticketTypeList: [
                { name: '店奖券', id: '1' }
            ],
            showPlan: '1',
            showPlanList: [
                { name: '方案1', id: '1', }
            ],
            /************ 生效时间限制 ************/
            timeLimitType: '1',
            timeLimitTypeList: [
                { name: '不限', id: '1' },
                { name: '限制', id: '2' },
            ],
            dateLimitRange: '',
            timeLimitRange: '',
            upperLimitAmount: '',
            directAmount: '', //单笔奖金
            /**************** 促收 ********************/
            isCheckUserCreateTime: '0',
            isCheckUserCreateTimeList: [
                { name: '不限', id: '0' },
                // { name: '限制', id: '1' },
            ],
            checkUserCreateTime: '',
            /**************** 付款金额 ********************/
            directGrantSection:{least:'',most:''},
            /**************** 回收方式 ********************/
            recycleTypeList: [
                { name: '检测回收', id: '0', ifChoosed: false },
                { name: '环保回收', id: '1', ifChoosed: false },
                { name: '公益回收', id: '2', ifChoosed: false }
            ],
            /********设置省 市*******/
            ifshowAddr: false,
            addrList: { //右边已选
                L1: [],
                L2: []
            },
            /********设置品牌 机型*******/
            ifshowModel: false,
            modelList: { //右边已选
                L1: [],
                L2: []
            },
            /********设置商户 门店*******/
            ifshowChannel: false,
            channelList: { //右边已选
                L1: [],
                L2: []
            },

        }
    },
    computed:{
        ...mapGetters({
            'userId':'userInfo/userId',
            'userName':'userInfo/userName',
        })
    },
    methods: {
        onSubmit() {
            let submitData = {
                "createUserId": this.userId,
                "updateUserId": this.userId,
                "updateUserName":this.userName,
                "activityName": this.activityName,
                "activityDesc": this.activityDesc,
                "rewardType": this.rewardType,
                "operateType": this.operateType,
                "showPlan": this.showPlan,
                "timeLimitType": this.timeLimitType,
                "directAmount":this.directAmount,
                "isCheckUserCreateTime":this.isCheckUserCreateTime,
                "directGrantSection":this.directGrantSection.least+'|'+this.directGrantSection.most,
                "amountLimitType": this.amountLimitType,
                "upperLimitAmount": this.upperLimitAmount, 
            }
            //活动时间选择限制时 必传字段
            if(this.timeLimitType == '2'){
                //生效时间校验
                if(!this.dateLimitRange || !this.timeLimitRange){
                    this.$message('请选择生效时间')
                    return
                }
                submitData.activityStartDate =  this.dateLimitRange[0]
                submitData.activityEndDate =  this.dateLimitRange[1]
                submitData.activityStartTime =  this.timeLimitRange[0]
                submitData.activityEndTime =  this.timeLimitRange[1]
            }
            // 校验工号开通时间时 必传字段
            if(this.isCheckUserCreateTime == '1'){
                submitData.checkUserCreateStartTime =  this.checkUserCreateTime[0]
                submitData.checkUserCreateEndTime =  this.checkUserCreateTime[1]
            }
            //回收方式
            let bitOperation = [0, 0, 0]
            this.recycleTypeList.forEach((item, index) => {
                if (item.ifChoosed) bitOperation[index] = 1
            })
            submitData.recycleType = this._Util.bitOperation(bitOperation)

            //省市设置
            if(this.addrList.L1.length == 0){
                submitData.provinceIdList = ''
            }else{
                let idArr = []
                this.addrList.L1.forEach(item =>{
                    idArr.push(item.id)
                })
                submitData.provinceIdList = idArr.join('#')
            }
            if(this.addrList.L2.length == 0){
                submitData.cityIdList = ''
            }else{
                let idArr = []
                this.addrList.L2.forEach(item =>{
                    idArr.push(item.id)
                })
                submitData.cityIdList = idArr.join('#')
            }

            //品牌机型设置
            if(this.modelList.L1.length == 0){
                submitData.brandIdList = ''
            }else{
                let idArr = []
                this.modelList.L1.forEach(item =>{
                    idArr.push(item.categoryId) //获取机型接口返回id字段为 categoryId
                })
                submitData.brandIdList = idArr.join('#')
            }
            if(this.modelList.L2.length == 0){
                submitData.productIdList = ''
            }else{
                let idArr = []
                this.modelList.L2.forEach(item =>{
                    idArr.push(item.productId) //获取机型下产品接口返回id字段为 productId
                })
                submitData.productIdList = idArr.join('#')
            }

            //商户门店 设置
            if(this.channelList.L1.length == 0){
                submitData.businessesIdList = ''
            }else{
                let idArr = []
                this.channelList.L1.forEach(item =>{
                    idArr.push(item.id) //获取机型接口返回id字段为 id
                })
                submitData.businessesIdList = idArr.join('#')
            }
            if(this.channelList.L2.length == 0){
                submitData.storeIdList = ''
            }else{
                let idArr = []
                this.channelList.L2.forEach(item =>{
                    idArr.push(item.id) //获取机型下产品接口返回id字段为 id
                })
                submitData.storeIdList = idArr.join('#')
            }
            
            /********** 提交 ***********/
            if(this.Validate(submitData)){
                api.add_activity_info(submitData).then(res=>{
                    if(res._ret != 0){
                        this.$alert(res._errStr)
                        return
                    }
                    this.$message(res._errStr)
                    this.$router.push({ path: '/reward/list' })
                })
            }
            
        },
        
        /******关闭选框********/
        closeAlert(status) {
            this.ifshowAddr = false
            this.ifshowModel = false
            this.ifshowChannel = false
        },
        /******设置地址********/
        setAddrData(val) {
            this.addrList = JSON.parse(JSON.stringify(val))
        },
        
        /******设置机型********/
        setModelData(val) {
            this.modelList = JSON.parse(JSON.stringify(val))
        },
        
        /******设置商户门店********/
        setChannelData(val) {
            this.channelList = JSON.parse(JSON.stringify(val))
        },
        
        showChoose(which){
            if(which == 'category') this.ifshowModel = true
            if(which == 'addr') this.ifshowAddr = true
            if(which == 'channel') this.ifshowChannel = true
        },
        /*********** 校验 *************/
        Validate(submitData){
            if(!this._Util.validate.name(submitData.activityName,'请输入活动名称（4~50字符）')) return false
            if(!this._Util.validate.desc(submitData.activityDesc,'请输入活动描述（4~50字符）')) return false
            
            if(!this._Util.validate.fixed2(submitData.upperLimitAmount,'请输入发放总额上限（最多2位小数）')) return false
            submitData.upperLimitAmount = String(submitData.upperLimitAmount*100) //单位为分

            if(!this._Util.validate.fixed2(submitData.directAmount,'请输入单笔奖金（最多2位小数）')) return false
            submitData.directAmount = String(submitData.directAmount*100) //单位为分
            //付款金额区间校验
            if( (!this._Util.validate.fixed2Nomsg(this.directGrantSection.least)) ||
                (!this._Util.validate.fixed2Nomsg(this.directGrantSection.most))  ||
                Number(this.directGrantSection.least)>Number(this.directGrantSection.most)
            ){
                const h = this.$createElement
                this.$msgbox({
                    title: '付款金额设置错误',
                    message: h('p', null, [
                        h('p', { style: 'color: #FA5555' }, '1.最多支持两位小数 '),
                        h('p', { style: 'color: #FA5555' }, '2.付款金额上限值不应小于下限值 ')
                    ])
                })
                return false
            }
            if(submitData.recycleType == '0'){
                this.$message({ message: '请至少选择一个订单回收方式', type: 'error' })
                return false
            }
            if( !(submitData.brandIdList||submitData.productIdList)){
                this.$message({ message: '请设置参与机型', type: 'error' })
                return false
            }
            if( !(submitData.businessesIdList||submitData.storeIdList||submitData.provinceIdList||submitData.cityIdList)){
                this.$message({ message: '请至少设置一个参与对象', type: 'error' })
                return false
            }
            return true
        }

    }
}

</script>
<style type="text/css">
.spc-select {
    position: relative;
    margin-bottom: -3px
}

</style>
<style type="text/css" scoped="scoped">
.icon-duigou{color:#67c23a;margin-left: 5px;}
.underline-text {
    font-size: 14px;
    color: #48576a;
    line-height: 1;
    vertical-align: bottom;
    margin: auto 6px;
    padding-bottom: 8px;
    display: inline-block;
}
.reward-remind{font-size: 12px;color:#878D99;}
</style>
