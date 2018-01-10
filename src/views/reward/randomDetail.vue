<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/reward/list' }">随机红包</el-breadcrumb-item>
            <el-breadcrumb-item>详情</el-breadcrumb-item>
        </el-breadcrumb>
        <br>
        <div class="operate">
            <el-button @click="random_edit" type="primary" size="mini">编辑</el-button>
        </div>
        <el-alert title="基本信息" type="success" :closable="false"></el-alert>
        <hjx-left-title label="名称"></hjx-left-title>
        <p>
        <span class="hjx-left-label">活动名称：</span>
        <span class='detailData'>{{activityName}}</span>
        </p>
        <p>
            <span class="hjx-left-label">活动描述：</span>
            <span class='detailData'>{{activityDesc}}</span>
        </p>
        
        <hjx-left-title label="类型"></hjx-left-title>
        <div class="mrg-b10">
            <span class="hjx-left-label">运营类型：</span>
            <span class='detailData' v-for="item in ticketTypeList" v-if="operateType == item.id">{{item.name}}</span>
        </div>
        <div class="mrg-b10">
            <span class="hjx-left-label">前端展示：</span>
            <span class='detailData'>{{showPlanList[0].name}}</span>
        </div>
        <br>
        <el-alert title="生成规则" type="success" :closable="false"></el-alert>
        <hjx-left-title label="时间"></hjx-left-title>
        <div class="mrg-b10">
            <span class="hjx-left-label">生效时间：</span>
            <span class="detailData" v-for="item in timeLimitTypeList">
                <span v-if="item.id == '1' && timeLimitType == item.id ">{{item.name}}</span>
                <span  v-if="item.id == '2' && timeLimitType == item.id">
                    {{ `${dateLimitRange[0]} 至 ${dateLimitRange[1]} 每日 ${timeLimitRange[0]} 至 ${timeLimitRange[1]}`  }}
                </span>
            </span>
            <span class="reward-remind  hjx-info">（该时间段内，将按规则进行活动）</span>
            
            
        </div>
        <hjx-left-title label="算法"></hjx-left-title>
        <div class="mrg-b10 ">
            <span class="hjx-left-label">算法系数：</span>
            <span class='detailData'>{{publicAlgorithmCoefficient}} %</span>
            <span class="reward-remind hjx-info">（参与算法计算的相乘系数，为活动成本）</span>
        </div>
        <div class="mrg-b10">
            <div class="mrg-b10">
            	<span class="hjx-left-label">数额设置：</span><span class="reward-remind hjx-info">（参与算法计算的相乘系数，为活动成本）</span>
            </div>
            <div class="mrg-l120 mrg-b10" v-for="(item , index) in CountRangeList" :key="index">
            	<span class='detailData'>{{item.payLeast}}</span>
            	<span class="detailData"> ≤ 付款金额 < </span>
                <span class='detailData' >{{item.payMost}}</span>
            	<span class="detailData"><i class="iconfont icon-play_forward_fill"></i></span>
            	<span class='detailData'>{{item.bonusLeast}}</span>
            	<span class="detailData"> ≤ 店奖金额 < </span>
            	<span class='detailData'>{{item.bonusMost}}</span>
            </div>
        </div>

        <hjx-left-title label="风控"></hjx-left-title>
        <div class="mrg-b20 ">
            <span class="hjx-left-label">发放总额上限：</span>
            <span class="detailData">{{upperLimitAmount}} 元 / 整个时间段</span>
            <span class="reward-remind hjx-info">（周期内发放金额达到上限后，每笔红包将按单笔最低值发放）</span>
        </div>

        <el-alert title="发放规则" type="success" :closable="false"></el-alert>
        <hjx-left-title label="订单"></hjx-left-title>
        <div class="mrg-b10">
            <p>
                <span class="hjx-left-label">订单回收方式：</span>
                <span class="detailData" v-for="item in recycleTypeList" v-if="item.ifChoosed">
                    <el-checkbox disabled v-model="item.ifChoosed" :key="item.id"></el-checkbox>
                    {{item.name}}&nbsp;
                </span>
            </p>
            <p class="reward-remind mrg-l40 hjx-info">(勾选的回收方式，可参与到活动中)</p>
        </div>
        <hjx-left-title label="机型"></hjx-left-title>
        <div class="mrg-b10">
            <span class="hjx-left-label">参与机型：</span>
            <span class="hjx-hover ft13 hjx-blue mrg-l20" @click="showChooseDetail('modelList','categoryName','productName')">
                <el-button v-if="modelList.L1.length>0||modelList.L2.length>0" type="text" >查看<i class="el-icon-arrow-right el-icon--right"></i></el-button>
            	<el-button v-else type="text" disabled>未设置<i class="el-icon-arrow-right el-icon--right"></i></el-button>
            </span>
            <p class="reward-remind mrg-l40 hjx-info">(满足选中机型的订单，可参与到活动中)</p>
        </div>
        <hjx-left-title label="对象"></hjx-left-title>
        <div>
            <span class="hjx-left-label">商户/门店：</span>
            <span class="hjx-hover ft13 hjx-blue mrg-l14" @click="showChooseDetail('channelList','name','name')">
                <el-button v-if="channelList.L1.length>0||channelList.L2.length>0" type="text" >查看<i class="el-icon-arrow-right el-icon--right"></i></el-button>
                <el-button v-else type="text" disabled>未设置<i class="el-icon-arrow-right el-icon--right"></i></el-button>
            </span>
        </div>
        <div class="mrg-b10">
        	<span class="hjx-left-label">门店地域：</span>
            <span class="hjx-hover ft13 hjx-blue mrg-l20" @click="showChooseDetail('addrList','name','name')">
                <el-button v-if="addrList.L1.length>0||addrList.L2.length>0" type="text" >查看<i class="el-icon-arrow-right el-icon--right"></i></el-button>
            	<el-button v-else type="text" disabled>未设置<i class="el-icon-arrow-right el-icon--right"></i></el-button>
            </span>
        </div>
        <div class="operate">
            <router-link to="/reward/list"><el-button size="mini">返回</el-button></router-link>
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
export default {
    components: { hjxPart, hjxLeftTitle, hjxUnderlineInput,hjxSelectAlert },
    data() {
        return {
        	ifshowDetail:true, //查看详情时所以选项为禁用状态

            amountLimitType:'1',//总金额限制类型 
            activityName: '',
            activityDesc: '',
            rewardType: '1',//随机抽奖
            operateType:'1',
            ticketTypeList:[
            	{name:'店奖券',id:'1'}
            ],
            showPlan:'1',
            showPlanList:[
            	{name:'方案1',id:'1',}
            ],
            /************ 生效时间限制 ************/
            timeLimitType: '1',
            timeLimitTypeList: [
                { name: '不限', id: '1' },
                { name: '限制', id: '2' },
            ],
            dateLimitRange: '',
            timeLimitRange: '',
            upperLimitAmount:'',
            /************ 数额设置 ************/
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

            
        }
    },
    computed:{
        ...mapGetters({
            'userId':'userInfo/userId',
            'userName':'userInfo/userName',
        })
    },
    methods: {
    	/******获取并设置初始数据********/
    	setDeault(){
            const loading = this.$loading({
                    lock: true,
                    text: '获取数据中...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                })
    		api.search_activity_detail({activityId:this.$route.query.id}).then(res=>{
                if(res._ret != 0){
                    loading.close()
                    this.$alert(res._errStr)
                    return
                }
                loading.close()
                this.activityName = res.activityName
                this.activityDesc = res.activityDesc
                this.amountLimitType = res.amountLimitType
                this.publicAlgorithmCoefficient = res.publicAlgorithmCoefficient
                this.operateType = res.operateType
                this.showPlan = res.showPlan
                this.timeLimitType = res.timeLimitType
                this.upperLimitAmount = res.upperLimitAmount / 100
                //数额设置
		        if(res.publicGrantSection){
		        	let countArr = res.publicGrantSection.split('&')
		        	countArr.forEach((item,index) =>{
		        		let payArr = item.split('#')[0]
		        		let bonusArr = item.split('#')[1]
		        		if(index == 0){
		        			this.CountRangeList[0].payLeast = payArr.split('|')[0]/100+''
		        			this.CountRangeList[0].payMost = payArr.split('|')[1]/100+''
		        			this.CountRangeList[0].bonusLeast = bonusArr.split('|')[0]/100+''
		        			this.CountRangeList[0].bonusMost = bonusArr.split('|')[1]/100+''
		        		}else{
		        			this.CountRangeList.push({
		        				payLeast : payArr.split('|')[0]/100+'',
		        				payMost : payArr.split('|')[1]/100+'',
		        				bonusLeast : bonusArr.split('|')[0]/100+'',
		        				bonusMost : bonusArr.split('|')[1]/100+''
		        			})
		        		}
		        	})
		        	
		        }

                //设置生效时间
                if(res.timeLimitType == '2'){
                	this.dateLimitRange = [res.activityStartDate , res.activityEndDate]
                	this.timeLimitRange = [res.activityStartTime , res.activityEndTime]
                }
                //设置验证工号开通时间
                if(res.checkUserCreateTime == '1'){
                	this.checkUserCreateTime = [res.checkUserCreateStartTime , res.checkUserCreateEndTime]
                }
                
                //设置环保回收方式
                let recycleArr = ( Number(res.recycleType).toString(2) / 1000 ).toFixed(3)
                recycleArr = recycleArr.substr(recycleArr.length-3,3).split('')
                recycleArr.forEach((item, index) => {
	                if(item == 1) this.recycleTypeList[index].ifChoosed = true
	                else this.recycleTypeList[index].ifChoosed = false
	            })
	            //设置已选 省市、品牌机型、商户门店
	            this.addrList.L1 = res.provinceIdList
	            this.addrList.L2 = res.cityIdList

	            this.modelList.L1 = res.brandIdList
	            this.modelList.L2 = res.productIdList

	            this.channelList.L1 = res.businessesIdList
	            this.channelList.L2 = res.storeIdList

            })
    	},
        /******* 展示选择详情*******/
        showChooseDetail(list,nameL1,nameL2){
            let html = ''
            this[list].L1.forEach(item =>{
                html+=`<p class="hjx-blue"><i class="iconfont icon-wenjianjia"></i> ${item[nameL1]}</p>`
            })
            this[list].L2.forEach(item =>{
                html+=`<p class="hjx-blue"><i class="iconfont icon-dian"></i> ${item[nameL2]}</p>`
            })
            this.$alert(html, '详情', {
                showClose:false,
                customClass:'show-detail-box',
                dangerouslyUseHTMLString: true
            })
        },
        /******* go to Edit *******/
        random_edit(id){
            if(this.$route.query.status == '1'){
                this.$alert('启用状态下，不支持编辑')
                return
            }
            this.$router.push({
                name:'randomEdit',
                query:{id:this.$route.query.id}
            })
        },
    },
    mounted() {
        this.setDeault()
	}
}

</script>
<style type="text/css" scoped="scoped">
    p{margin-bottom: 10px}
	.reward-remind{font-size: 12px;}
	.underline-text{
        font-size: 14px;
        color: #48576a;
        line-height: 1;
        vertical-align: bottom;
        margin:auto 6px;
        padding-bottom: 8px;
        display: inline-block;
    }
    .detailData{
		font-size: 14px;
	    color: #48576a;
	}

</style>