<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/reward/list' }">普通红包</el-breadcrumb-item>
            <el-breadcrumb-item>新增</el-breadcrumb-item>
        </el-breadcrumb>
        <br>
        <el-alert title="基本信息" type="success" :closable="false"></el-alert>
        <hjx-left-title label="名称"></hjx-left-title>
        <p><hjx-underline-input label="活动名称" width="200" v-model="activityName"  @change="val_activityName" placeholder="请输入活动名称"></hjx-underline-input><span class="errorInfo">{{errorInfo['activityName']}}</span></p>
        <p><hjx-underline-input label="活动描述" width="200" v-model="activityDesc" @change="val_activityDesc"  placeholder="请输入活动描述"></hjx-underline-input><span class="errorInfo">{{errorInfo['activityDesc']}}</span></p>
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
            <p>
                <span class="hjx-left-label">生效时间：</span><span class="reward-remind hjx-info">（该时间段内，将按规则进行活动）</span>
            </p>
            <p class="mrg-l120" v-for="item in timeLimitTypeList">
                <el-radio v-model="timeLimitType" :label="item.id" :key="item.id" >
                    <span v-if="item.id == '2' && timeLimitType == '2'">
                        <el-date-picker v-model="activityStartDate"  type="date" @change="val_activityDate" size="small" placeholder="开始日期" value-format="yyyy-MM-dd" :picker-options="startDateOption"></el-date-picker>
                        ~
                        <el-date-picker v-model="activityEndDate" type="date" size="small" @change="val_activityDate" value-format="yyyy-MM-dd" placeholder="结束日期" :picker-options="endDateOption"></el-date-picker><span class="errorInfo">{{errorInfo['activityDate']}}</span>
                        <br><br>
                        <span class="mrg-l24">
                            <el-time-select placeholder="每日起始时间" size="small" @change="val_activityTime"  :editable='false' v-model="activityStartTime" :picker-options="{start: '00:00',step: '00:15',end: '24:00',maxTime:activityEndTime}"></el-time-select>
                            ~
                            <el-time-select placeholder="每日结束时间" size="small" @change="val_activityTime"  :editable='false' v-model="activityEndTime" :picker-options="{start: '00:00',step: '00:15',end: '24:00', minTime: minEndTime}"></el-time-select>
                        </span><span class="errorInfo">{{errorInfo['activityTime']}}</span>
                    </span>
                    <span v-else>{{item.name}} 
                        <span v-if="item.id == '1'" class="reward-remind hjx-info"> （时间不限，长期有效）</span>
                    </span>
                </el-radio>
            </p>
        </div>

        <hjx-left-title label="算法"></hjx-left-title>
        <el-radio class='hjx-left-label' v-model="publicAlgorithmFlag" label="0">固定比例</el-radio>
        <el-radio v-model="publicAlgorithmFlag" label="1">随机算法</el-radio><br><br>
        <div class="mrg-b10 ">
            <hjx-underline-input type='number' label="算法系数" width="50" @change="val_publicAlgorithmCoefficient" v-model="publicAlgorithmCoefficient" :textCenter="true"></hjx-underline-input><span class="underline-text">%</span>
            <span class="underline-text-info reward-remind hjx-info">（参与算法计算的相乘系数，为活动成本）</span>
            <span class="errorInfo">{{errorInfo['publicAlgorithmCoefficient']}}</span>
        </div>
        <div class="mrg-b10" v-if="publicAlgorithmFlag == 1">
            <div class="mrg-b10">
                <span class="hjx-left-label">数额设置：</span><span class="reward-remind hjx-info">（设置付款金额在某个区间内，相应的红包金额最高、最低值）</span>
            </div>
            <div class="mrg-l120" v-for="(item , index) in CountRangeList" :key="index">
                <hjx-underline-input type='number' width="50" v-model="item.payLeast" :disabled="index>0?true:false" @change="val_CountRangeList(index)" :textCenter="true"></hjx-underline-input>
                <span class="underline-text"> ≤ 付款金额 < </span>
                <hjx-underline-input type='number' width="50" v-model="item.payMost" :index="index" :textCenter="true" @change="payRangeChange"></hjx-underline-input>

                <span class="underline-text"><i class="iconfont icon-play_forward_fill"></i></span>

                <hjx-underline-input type='number' width="50" v-model="item.bonusLeast" @change="val_CountRangeList(index)" :textCenter="true"></hjx-underline-input>
                <span class="underline-text"> ≤ 店奖金额 ≤ </span>
                <hjx-underline-input type='number' width="50" v-model="item.bonusMost" @change="val_CountRangeList(index)" :textCenter="true"></hjx-underline-input>
                <span v-if="CountRangeList.length==1" class="underline-text"><i class="iconfont icon-roundaddfill hjx-hover" @click="addCountRange(index)"></i></span>
                <span v-else-if="(CountRangeList.length>1) && (index == CountRangeList.length - 1)" class="underline-text">
                    <i v-if="CountRangeList.length < addTopCount" class="iconfont icon-roundaddfill hjx-hover" @click="addCountRange(index)"></i>
                    <i class="iconfont icon-round_close_fill_light hjx-hover" @click="delCountRange"></i>
                </span>
                <span class="errorInfo">{{errorInfo['CountRangeList_'+index]}}</span>
            </div>
        </div>
        <div class="mrg-b10" v-else>
            <div class="mrg-b10">
                <span class="hjx-left-label">数额设置：</span><span class="reward-remind hjx-info">（设置付款金额在某个区间内，订单参与发放）</span>
            </div>
            <hjx-underline-input class='mrg-l120'  type='number' width="50" @change="val_directGrantSection"  v-model="directGrantSection.least"  :textCenter="true"></hjx-underline-input>
            <span class="underline-text "> ≤ 付款金额 < </span>
            <hjx-underline-input type='number' width="50" @change="val_directGrantSection"  v-model="directGrantSection.most" :textCenter="true"></hjx-underline-input>
            <span class="errorInfo">{{errorInfo['directGrantSection']}}</span>
        </div>

        <hjx-left-title label="风控"></hjx-left-title>
        <div class="mrg-b10 ">
            <hjx-underline-input label="发放总额上限" type='number'  width="70" @change="val_upperLimitAmount" v-model="upperLimitAmount" :textCenter="true"></hjx-underline-input><span class="underline-text">元 / 整个时间段</span>
            <span class="reward-remind underline-text-info hjx-info">（{{publicAlgorithmFlag == '1'?'周期内发放金额达到上限后，每笔红包将按单笔最低值发放':'周期内发放金额达到上限，会触发总额状态生效。但店奖仍会正常发放'}}）</span>
            <span class="errorInfo">{{errorInfo['upperLimitAmount']}}</span>
        </div>

        <el-alert title="发放规则" type="success" :closable="false"></el-alert>
        <hjx-left-title label="订单"></hjx-left-title>
        <div class="mrg-b10">
            <p>
                <span class="hjx-left-label">订单回收方式：</span>
                <el-checkbox v-for="item in recycleTypeList" v-model="item.ifChoosed" @change="val_recycleTypeList" :key="item.id">{{item.name}}</el-checkbox>
                <span class="errorInfo">{{errorInfo['recycleTypeList']}}</span>
            </p>
            <p class="reward-remind mrg-l40 hjx-info">（勾选的回收方式，可参与到活动中）</p>
            
        </div>
        <hjx-left-title label="机型"></hjx-left-title>
        <div>
            <span class="hjx-left-label">参与机型：</span>
            <span class="hjx-hover ft13 hjx-blue mrg-l20" @click="showChoose('category')">
                <el-button v-if="modelList.L1.length>0||modelList.L2.length>0" type="text" >已设置 <i class="iconfont icon-duigou"></i></el-button>
                <el-button v-else type="text">未设置<i class="el-icon-arrow-right el-icon--right"></i></el-button>
                <span class="errorInfo">{{errorInfo['modelList']}}</span>
            </span>
            <p class="reward-remind mrg-l40 hjx-info">（满足选中机型的订单，可参与到活动中）</p>
        </div>
        <hjx-left-title label="对象"><span class="errorInfo hjx-info reward-remind">机构和地域做交集判断</span></hjx-left-title>
        <div>    
            <span class="hjx-left-label">商户/门店：</span> 
            <span class="hjx-hover ft13 hjx-blue mrg-l14" @click="showChoose('channel')">
                <el-button v-if="channelList.L1.length>0||channelList.L2.length>0||ischooseAllL1" type="text" >已设置 <i class="iconfont icon-duigou"></i></el-button>
                <!-- <el-button v-if="this.$refs.child.hasChoosedList.L1.length>0||this.$refs.child.hasChoosedList.L2.length>0||this.$refs.child.chooseAllL1" type="text" >已设置 <i class="iconfont icon-duigou"></i></el-button> -->
                <el-button v-else type="text" >未设置<i class="el-icon-arrow-right el-icon--right"></i></el-button>
                <span class="errorInfo">{{errorInfo['participants']}}</span>
            </span>
        </div>
        <div class="mrg-b10">
            <span class="hjx-left-label">门店地域：</span>
            <span class="hjx-hover ft13 hjx-blue mrg-l20" @click="showChoose('addr')">
                <el-button v-if="addrList.L1.length>0||addrList.L2.length>0" type="text" >已设置 <i class="iconfont icon-duigou"></i></el-button>
                <el-button v-else type="text" >未设置<i class="el-icon-arrow-right el-icon--right"></i></el-button>
                <span class="hjx-info" v-show="!addrList.L1.length&&!addrList.L2.length">（若不设置地域，则默认全选）</span>
            </span>
        </div>
        <hjx-select-alert  :action="'category'" :ifshow="ifshowModel" @close="closeAlert" :data="modelList" @setData="setModelData"></hjx-select-alert>
        <hjx-select-alert  :action="'addr'" :ifshow="ifshowAddr" @close="closeAlert" :data="addrList" @setData="setAddrData"></hjx-select-alert>
        <!-- <hjx-select-alert  :action="'channel'" :ifshow="ifshowChannel" @close="closeAlert" :data="channelList" @setData="setChannelData"></hjx-select-alert> -->
        <hjx-select-alert-ty ref="child"  :ifshow="ifshowChannel" @close="closeAlert" @setData="setChannelData"></hjx-select-alert-ty>
        <div class="operate">
            <el-button @click="onSubmit" type="primary" size="mini">确认</el-button>
            <router-link to="/reward/list"><el-button size="mini">取消</el-button></router-link>
        </div>
        
    </div>
</template>
<script>
import api from '@/api/index'
import { mapGetters } from 'vuex'
import hjxPart from '@/base/hjx_part'
import hjxLeftTitle from '@/base/hjx_left_title'
import hjxUnderlineInput from '@/base/hjx_underline_input'
import hjxSelectAlert from '@/base/hjx_select_alert'
import hjxSelectAlertTy from '@/base/hjx_select_alert_ty'
export default {
    components: { hjxPart, hjxLeftTitle, hjxUnderlineInput,hjxSelectAlert, hjxSelectAlertTy },
    data() {
        return {
            errorInfo:{},
            amountLimitType:'1',//总金额限制类型 
            activityName: '',
            activityDesc: '',
            rewardType: '1',//普通抽奖
            operateType:'1',
            ticketTypeList:[
            	{name:'店奖类',id:'1'}
            ],
            showPlan:'1',
            showPlanList:[
            	{name:'方案1',id:'1',}
            ],
            /************ 生效时间限制 ************/
            activityStartDate: '',
            activityEndDate: '',
            activityStartTime: '',
            activityEndTime: '',
            startDateOption: {
                disabledDate: (time) => {
                    if (this.activityEndDate != "") {
                        return this._Util.formatDate.format(time, 'yyyy-MM-dd') > this.activityEndDate
                    } else {
                        return false
                    }

                }
            },
            endDateOption: {
                disabledDate: (time) => {
                    return this._Util.formatDate.format(time, 'yyyy-MM-dd') < this.activityStartDate || time.getTime() < Date.now() - 8.64e7
                }
            },
            timeLimitType: '1',
            timeLimitTypeList: [
                { name: '不限', id: '1' },
                { name: '限制', id: '2' },
            ],
            publicAlgorithmFlag:'0',//算法标识
            directGrantSection:{least:'',most:''}, //算法标识为0时的付款区间
            upperLimitAmount:'',
            /************ 算法标识为1时的数额设置 ************/
            addTopCount: 10 , //可添加最高条数
            CountRangeList:[
            	{
            		payLeast:'',
            		payMost:'',
            		bonusLeast:'',
            		bonusMost:''
            	},
            ],
            publicAlgorithmCoefficient:'',//算法系数
            recycleTypeList:[
                {name:'公益回收',id:'0',ifChoosed:false},
                {name:'环保回收',id:'1',ifChoosed:false},
            	{name:'检测回收',id:'2',ifChoosed:false}
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
            ischooseAllL1: false,  
        }
    },
    computed:{
        ...mapGetters({
            'userId':'userInfo/userId',
            'userName':'userInfo/userName',
        }),
        minEndTime() {
            if (this.activityEndDate && this.activityEndDate == this._Util.formatDate.format(new Date(), 'yyyy-MM-dd')) {
                let nowTime = this._Util.formatDate.format(new Date(), 'hh:mm')
                if (this.activityStartTime > nowTime) {
                    return this.activityStartTime
                } else {
                    return nowTime
                }
            }

            return this.activityStartTime
        }
    },
    methods: { 
        onSubmit() {

            // 店奖优化新增提交数据
            let businessesIdList = {
                addList: this.$refs.child.hasChoosedList.L1
            }
            let storeIdList = {
                addList: this.$refs.child.hasChoosedList.L2
            }
            let businessesFlage = ''  

            if (!businessesIdList.addList.length  && !storeIdList.addList.length && !this.$refs.child.chooseAllL1) {
                this.$set(this.errorInfo , 'participants', '请至少设置一个参与对象') 
                return 
            }
            if (this.$refs.child.chooseAllL1) { //全选的时候
                businessesFlage = '0'
                businessesIdList.addList = []
                storeIdList.addList = []
            } else {
                if (this.$refs.child.businessesFlage) {
                    businessesFlage = '1'
                } else {
                    businessesFlage = '2'
                }
            }

            let submitData = {
                "createUserId": this.userId,
                "updateUserId": this.userId,
                "updateUserName":this.userName,
                "activityName":this.activityName,
                "activityDesc":this.activityDesc,
                "rewardType":this.rewardType,
                "operateType":this.operateType,
                "showPlan":this.showPlan,
                "timeLimitType":this.timeLimitType,
                "publicAlgorithmCoefficient":String(this.publicAlgorithmCoefficient),
                "amountLimitType":this.amountLimitType,
                "upperLimitAmount":this.upperLimitAmount,//单位为分
                "brandIdList":this.brandIdList,
                "productIdList":this.productIdList,
                "businessesIdList":businessesIdList,
                "storeIdList":storeIdList,
                "businessesFlage": businessesFlage,
                "publicAlgorithmFlag" :this.publicAlgorithmFlag
            }

            // 校验工号开通时间时 必传字段
            if(this.isCheckUserCreateTime == '1'){
                submitData.checkUserCreateStartTime =  this.checkUserCreateTime[0]
                submitData.checkUserCreateEndTime =  this.checkUserCreateTime[0]
            }
            let bitOperation = [0,0,0]
            //回收方式
            this.recycleTypeList.forEach((item,index)=>{
                if(item.ifChoosed) bitOperation[index] = 1
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
            /********** 提交时校验 *********/
 
            const validateMethod = ['val_activityName','val_activityDesc','val_activityDate','val_activityTime','val_publicAlgorithmCoefficient','val_upperLimitAmount','val_recycleTypeList','val_modelList']
            if(this.publicAlgorithmFlag == '1' ){ 
                validateMethod.splice(5,0,'val_CountRangeList')
            }else{
                validateMethod.splice(5,0,'val_directGrantSection')
            }
            for(const val of validateMethod){
                if(!this[val]() ) return
            }

            //校验通过 设置值
            if(this.publicAlgorithmFlag == '1'){
                submitData.publicGrantSection = this.CountRangeList.map(item=>{
                    return `${Math.round(item.payLeast*100)}|${Math.round(item.payMost*100)}#${Math.round(item.bonusLeast*100)}|${Math.round(item.bonusMost*100)}`
                }).join('&')
            }else{
                submitData.publicGrantSection = Math.round(this.directGrantSection.least*100)+'|'+Math.round(this.directGrantSection.most*100)
            }

            submitData.upperLimitAmount = String(Math.round(submitData.upperLimitAmount*100))
            //活动时间选择限制时 必传字段
            if (this.timeLimitType == '2') {
                submitData.activityStartDate = this.activityStartDate
                submitData.activityEndDate = this.activityEndDate
                submitData.activityStartTime = this.activityStartTime + ':00'
                submitData.activityEndTime = this.activityEndTime + ':00'
            }
            /********** 提交 ***********/
            api.add_activity_info(submitData).then(res=>{
                if(res._ret != 0){
                    this.$alert(res._errStr)
                    return
                }
                this.$message(res._errStr)
                this.$router.push({ path: '/reward/list' })
            })
        },
        /******关闭选框********/
        closeAlert(status) {
            this.ifshowAddr = false
            this.ifshowModel = false
            this.ifshowChannel = false

            if (status == 'cancel') {
                this.$refs.child.recovery()

                this.ischooseAllL1 = this.$refs.child.chooseAllL1
                this.channelList.L1 = this.$refs.child.hasChoosedList.L1
                this.channelList.L2 = this.$refs.child.hasChoosedList.L2

                if( !this.channelList.L1.length && !this.channelList.L2.length && !this.ischooseAllL1){ 
                    this.$set(this.errorInfo , 'participants', '请至少设置一个参与对象')
                    
                }else{
                    this.$set(this.errorInfo , 'participants', '') 
                }
            } 
        },
        /******设置地址********/
        setAddrData(val) {
            this.addrList = JSON.parse(JSON.stringify(val))
            this.val_participants() //验证
        },
        /******设置机型********/
        setModelData(val) {
            this.modelList = JSON.parse(JSON.stringify(val))
            this.val_modelList() //验证
        },
        /******设置商户门店********/
        setChannelData(val) {
            //店奖优化时增加
            this.channelList.L1 = val.L1
            this.channelList.L2 = val.L2
            this.ischooseAllL1 = this.$refs.child.chooseAllL1
            if( !this.channelList.L1.length && !this.channelList.L2.length && !this.ischooseAllL1){ 
                this.$set(this.errorInfo , 'participants', '请至少设置一个参与对象')
                
            }else{
                this.$set(this.errorInfo , 'participants', '') 
            }  
        },
        
        showChoose(which){
            if(which == 'category') this.ifshowModel = true
            if(which == 'addr') this.ifshowAddr = true
            if(which == 'channel') {
                this.ifshowChannel = true
                this.$refs.child.backup()
                this.$refs.child.channelList = []
            }
        },
        
        // 添加一条数额设置
        addCountRange(index){
            this.$set(this.CountRangeList , this.CountRangeList.length ,{
                payLeast:this.CountRangeList[index].payMost,
                payMost:'',
                bonusLeast:'',
                bonusMost:''
            })

        },
        //修改数额设置
        payRangeChange(val,index){
            this.pre_val_CountRangeList(index , this.CountRangeList[index])
            //判断是否有下一条
            const len = this.CountRangeList.length
            if(index != len-1){
                this.CountRangeList[index+1].payLeast = val
                this.pre_val_CountRangeList(index+1 , this.CountRangeList[index+1])
            }
        },

		// 删除一条数额设置
        delCountRange(){
        	this.CountRangeList.pop()
        },
        /**************** 验证 *******************/
        //验证活动名称
        val_activityName(){
            if(!this._Util.validate.nameLength(this.activityName)){
                this.$set(this.errorInfo , 'activityName', '请输入活动名称（4~50字符）')
                return false 
            }else{
                this.$set(this.errorInfo , 'activityName', '')
                return true
            }
        },
        //验证活动描述
        val_activityDesc(){
            if(!this._Util.validate.desc(this.activityDesc)){
                this.$set(this.errorInfo , 'activityDesc', '请输入活动描述（4~50字符）')
                return false 
            }else{
                this.$set(this.errorInfo , 'activityDesc', '')
                return true 
            }
        },
        //验证付款金额
        val_directGrantSection(){
            if((!this._Util.validate.fixed0(this.directGrantSection.least)) ||
                (!this._Util.validate.fixed0(this.directGrantSection.most))  ||
                Number(this.directGrantSection.least)>Number(this.directGrantSection.most)
            ){
                this.$set(this.errorInfo , 'directGrantSection', '付款金额上限值不应小于下限值（不支持小数）')
                return false 
            }else{
                this.$set(this.errorInfo , 'directGrantSection', '')
                return true 
            }
        },
        //验证算法系数
        val_publicAlgorithmCoefficient(){
            if(!this._Util.validate.precenteFixed2(this.publicAlgorithmCoefficient)){
                this.$set(this.errorInfo , 'publicAlgorithmCoefficient', '请输入0~100算法系数（支持2位小数）')
                return false 
            }else{
                this.$set(this.errorInfo , 'publicAlgorithmCoefficient', '')
                return true 
            }
        },
        //验证总额上限
        val_upperLimitAmount(){
            if(!this._Util.validate.fixed0(this.upperLimitAmount)){
                this.$set(this.errorInfo , 'upperLimitAmount', '请输入发放总额上限（不支持小数）')
                return false 
            }else{
                this.$set(this.errorInfo , 'upperLimitAmount', '')
                return true 
            }
        },
        //验证数额设置
        pre_val_CountRangeList(index , theItem){
            let reg = /^\d+(\.\d{1,2})?$/;
            if(!theItem.payLeast||!theItem.payMost||!theItem.bonusLeast||!theItem.bonusMost){
                this.$set(this.errorInfo , 'CountRangeList_'+index , '请完善当条信息')
                return false  
            }else if(!reg.test(theItem.payLeast)||!reg.test(theItem.payMost)||!reg.test(theItem.bonusLeast)||!reg.test(theItem.bonusMost)){
                this.$set(this.errorInfo , 'CountRangeList_'+index , '只支持两位小数')
                return false 
            }else if(Number(theItem.payMost) < Number(theItem.payLeast)) {
                this.$set(this.errorInfo , 'CountRangeList_'+index , '付款金额上限值不应小于下限值')
                return false  
            }else if(Number(theItem.bonusMost) < Number(theItem.bonusLeast) ){
                this.$set(this.errorInfo , 'CountRangeList_'+index , '奖金金额上限值不应小于下限值')
                return false  
            }else if(Number(theItem.bonusMost) > Number(theItem.payMost) ){
                this.$set(this.errorInfo , 'CountRangeList_'+index , '奖金上线不应大于付款金额上限')
                return false  
            }else{
                this.$set(this.errorInfo , 'CountRangeList_'+index , '')
                return true
            }
        },
        val_CountRangeList(index){
            if(index == undefined){//表示确认提交时的验证
                for(const [key,val] of this.CountRangeList.entries() ){
                    let theItem = val
                    if( !this.pre_val_CountRangeList(key , theItem) ) return false
                }
                return true
            }else{ //表示触发单条change事件时的验证
                this.pre_val_CountRangeList(index , this.CountRangeList[index])
            }
        },
        //验证回收方式
        val_recycleTypeList(){
            let bitOperation = [0,0,0]
            this.recycleTypeList.forEach((item,index)=>{
                if(item.ifChoosed) bitOperation[index] = 1
            })
            let recycleType = this._Util.bitOperation(bitOperation)
            if(recycleType == '0'){
                this.$set(this.errorInfo , 'recycleTypeList', '请至少选择一个订单回收方式')   
                return false             
            }else{
                this.$set(this.errorInfo , 'recycleTypeList', '')
                return true 
            }
        },
         //验证参与机型
        val_modelList(){
            if( !(this.modelList.L1.length>0||this.modelList.L2.length>0) ){
                this.$set(this.errorInfo , 'modelList', '请设置参与机型')
                return false 
            }else{
                this.$set(this.errorInfo , 'modelList', '')
                return true 
            }
        },
        //验证参与对象 
        val_participants(){
            if( !(this.channelList.L1.length>0||this.channelList.L2.length>0) ){
                this.$set(this.errorInfo , 'participants', '请至少设置一个参与对象')
                return false 
            }else{
                this.$set(this.errorInfo , 'participants', '')
                return true 
            }
        },
        //验证限制日期 
        val_activityDate(){
            // 当选择生效时间为限制时 启用验证
            if(this.timeLimitType == '1') return true

            if( !this.activityStartDate || !this.activityEndDate){
                this.$set(this.errorInfo , 'activityDate', '请选择日期范围')
                return false 
            }else if( this.activityStartDate > this.activityEndDate ){
                this.$set(this.errorInfo , 'activityDate', '结束日期需大于等于开始日期')
                return false 
            }else{
                this.$set(this.errorInfo , 'activityDate', '')
                return true 
            }
        },
        //验证限制时间
        val_activityTime(){
            // 当选择生效时间为限制时 启用验证
            if(this.timeLimitType == '1') return true

            if( this.activityStartTime >= this.activityEndTime ){
                this.$set(this.errorInfo , 'activityTime', '结束时间需大于开始时间')
                return false 
            }else{
                this.$set(this.errorInfo , 'activityTime', '')
                return true 
            }
        },
        

    }
}

</script>
<style type="text/css">
	.spc-select{position: relative;margin-bottom: -3px}
</style>
<style type="text/css" scoped="scoped">
    
    p{margin-bottom: 10px}
    .icon-duigou{color:#67c23a;margin-left: 5px;}
    .underline-text{
        font-size: 14px;
        color: #48576a;
        line-height: 1;
        vertical-align: bottom;
        margin:auto 6px;
        padding-bottom: 8px;
        display: inline-block;
    }
	.reward-remind{font-size: 12px;color:#878D99;}
    .underline-text-info{
        display: inline-block;
        vertical-align: bottom;
        padding-bottom: 8px;
    }
</style>