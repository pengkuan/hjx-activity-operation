<template>
  <transition name="fade" >
    <div class="hjx-alert-container" v-if="ifshow">
      <div class="hjx-message-box" >
        <div class="alert-title hjx-text-center hjx-blue">选择{{mappingResult[9]}}和{{mappingResult[10]}}</div>
        <div class="clear choose-container">
          <div class="fl box-left">
            <p class="second-title hjx-blue">备选</p>
            <div class="choose-field">
              <div v-if="first">
                <el-input size="small" @input="searchL1(searchL1Name)" :placeholder=" '搜索'+mappingResult[9]" prefix-icon="el-icon-search" v-model="searchL1Name" clearable></el-input>
                <p class="breadcrumb"><span class="noTap ">{{mappingResult[9]}}列表</span></p>
                <p class="left-item-second">
                  <el-checkbox v-show="showSearchL1" @change="changeL1(chooseAllL1)" :indeterminate="isIndeterminateFirst" v-model="chooseAllL1"><span class="ft12">全选</span></el-checkbox>
                </p>
                <div class="list-container">
                  <p class="left-item overflow" v-for="item in preChooseL1" v-show="item.ifshow || showSearchL1">
                    <el-checkbox size="mini" class="fl" v-model="item.ifChoosed" :key="item[mappingResult[0]]" @change="handleL1(item.ifChoosed,item[mappingResult[1]],item[mappingResult[0]], item)">
                      <span class="ft12"><i class="iconfont icon-wenjianjia"></i> {{item[mappingResult[1]]}}</span>
                    </el-checkbox>
                    <el-button @click="setSecond(item[mappingResult[0]])" type="text" size="mini" class="fr clear-padding" :disabled="item.ifChoosed"><i class="iconfont icon-xiajiicon"></i>下级</el-button>
                  </p>
                </div>
              </div>
              <div v-else>
                <el-input size="small" @input="searchL2(searchL2Name)" :placeholder=" '搜索'+mappingResult[10]" prefix-icon="el-icon-search" v-model="searchL2Name" clearable></el-input>
                <div class="breadcrumb"><span class="canTap hjx-hover" @click="first = true">{{mappingResult[9]}}列表 <i class="iconfont icon-right"></i></span><span class="noTap">{{mappingResult[10]}}列表</span></div>
                <p class="left-item-second">
                  <el-checkbox v-show="showSearchL2" @change="changeL2(chooseAllL2)" :indeterminate="isIndeterminateFirst" v-model="chooseAllL2"><span class="ft12">全选</span></el-checkbox>
                </p>
                <div class="list-container">
                  <p class="left-item" v-for="item in preChooseL2" v-show="item.ifshow || showSearchL2">
                    <el-checkbox v-model="item.ifChoosed" :key="item[mappingResult[3]]" @change="handleL2(item.ifChoosed,item[mappingResult[4]],item[mappingResult[3]],item.parentId, item)">
                      <span class="ft12"><i class="iconfont icon-dian"></i>{{item[mappingResult[4]]}}</span>
                    </el-checkbox>
                  </p> 
                </div>
              </div>
            </div>
          </div>
          <div class="fr box-right">
            <p class="second-title hjx-blue">已选</p>
            <div class="choose-field list-container-choosed">
              <div v-for="(list,key) in choosedList">
                <p class="right-item clear" v-for="(item,index) in list">
                  <span v-if="key=='L1'" class="fl hjx-blue"><i class="iconfont icon-wenjianjia"></i> {{item[mappingResult[1]]}}</span>
                  <span v-else class="fl hjx-blue"><i class="iconfont icon-dian"></i> {{item[mappingResult[4]]}}</span>
                  <i @click="delRightItem(key,index)" class="iconfont icon-round_close_fill_light fr hjx-hover"></i> 
                </p>
              </div>
            </div>
          </div>
          <div class="clear btn">
            <el-button @click="submit" type="primary" size="mini">确认</el-button>
            <el-button @click="close" size="mini">取消</el-button>
          </div>
        </div>
      </div>
      <!-- 背景框 -->
      <div  class="hjx-bg"></div>
    </div>
  </transition>
</template>
<script type="text/javascript">
import api from '@/api'
import { mapGetters, mapActions } from 'vuex'
export default {
  name:'hjxSelectAlert',
  data() {
    return {
      mapping:{ //接口字段映射表
        /**数组参数说明
        *@ 0.一级列表字段id、1.一级列表字段name、2.二级查询id字段、3.二级列表字段id、4.二级列表字段name、
        *@ 5.action接口、6.get接口、7.根据id获取二级api、8.获取二级列表接口字段、9.一级名称、10.二级名称
        */
        addr:['id','name','provinceId','id','name','getAllProvinces','allProvinces','get_city_list','cityList','省','市'], //地址 
        category:['categoryId','categoryName','categoryId','productId','productName','getAllCategory','allCategory','get_category_products','productList','品牌','机型'], //品牌
        channel:['id','name','channelId','id','name','getAllChannel','allChannel','get_channel_store_list','storeList','商户','门店'], //商户
      },
      first: true,
      searchL1Name: '',
      searchL2Name: '',
      isIndeterminateFirst: false,
      isIndeterminateSecond: false,
      showSearchL1:true,//搜索时使用
      showSearchL2:true,//搜索时使用
      choosedList: {
        L1:[],
        L2:[],
      }, //右边已选
      chooseAllL1: false,
      chooseAllL2: false,
      depositAllL2: {}, //一级id为key值
      initPreChooseL2: [],//左侧备选二级列表
    }
  },
  props: {
    action: String,
    ifshow: Boolean,
    data: Object
  },
  watch: {
    'data.L1': function(val, oldVal) {
        this.choosedList = JSON.parse(JSON.stringify(this.data))
    },
    'data.L2': function(val, oldVal) {
        this.choosedList = JSON.parse(JSON.stringify(this.data))
    }
  },
  computed: {
    mappingResult:function(){
      for(let key in this.mapping){
        if(this.action == key) return this.mapping[key]
      }
    },
    preChooseL1: function() {
      //根据已选 反选备选列表
      this.initPreChooseL1.forEach(itemA => {
        let iftrue = false
        this.choosedList.L1.forEach(itemB => {
          if (itemA[this.mappingResult[0]] == itemB[this.mappingResult[0]]) {
            itemA.ifChoosed = true
            iftrue = true
          }
        })
        if (!iftrue) itemA.ifChoosed = false
      })

      return this.initPreChooseL1
    },
    preChooseL2: function() {
      //根据已选 反选备选列表
      this.initPreChooseL2.forEach(itemA => {
        let iftrue = false
        this.choosedList.L2.forEach(itemB => {
          if (itemA[this.mappingResult[3]] == itemB[this.mappingResult[3]]) {
            itemA.ifChoosed = true
            iftrue = true
          }
        })
        if (!iftrue) itemA.ifChoosed = false
      })

      return this.initPreChooseL2
    },

    firstLen: function() {
      return this.getDefault.length
    },
    initPreChooseL1 () {
      let preL1Arr = this.$store.getters['heavyDate/'+this.mappingResult[6]]
      return this.addIfshow(preL1Arr)
    }
  },
  methods: {
    /** 为preChoose列表添加ifshow属性 **/
    addIfshow(list){
      list.forEach(item =>{
        item.ifshow = false
      })
      return list
    },
    /********提交和取消************/
    submit() {
      this.$emit('setData', this.choosedList)
      this.$emit('close', false)
      this.first = true
    },
    close() {
      this.$emit('close', false)
      this.init()
      this.first = true
    },
    init() { //初始化数据
      this.choosedList = JSON.parse(JSON.stringify(this.data))
      this.first = true
    },

    delRightItem(key, index) {
      this.choosedList[key].splice(index, 1)
    },
    
    /*****设置显示的二级值****/
    setSecond(id) {
      this.first = false
      var _self = this
      let reqData = {}
      reqData[this.mappingResult[2]] = id
      api[this.mappingResult[7]](reqData).then(res => {
        if(!res[this.mappingResult[8]]) {
          this.initPreChooseL2 = []
        }else{
          this.initPreChooseL2 = res[this.mappingResult[8]]
          this.initPreChooseL2.forEach(item=>{
            item.parentId = id
          })
        } 
      })
    },
    /********/
    //单选L1
    handleL1(val, name, id, item) {  

      if (val) {
        let pushObj = {}
        pushObj[this.mappingResult[0]] = id
        pushObj[this.mappingResult[1]] = name
        this.choosedList.L1.push(pushObj)
        //判断是否存在该L1下的L2，有则移除该L2
        // this.choosedList.L2.forEach((item,index)=>{
        //   if(item.parentId == id) this.choosedList.L2.splice(index,1)
        // })
        let len = this.choosedList.L2.length
        for(let index = 0 ; index <this.choosedList.L2.length ; index++){
          if (this.choosedList.L2[index].parentId == id) {

            this.choosedList.L2.splice(index, 1)
            index--
          }
        }
      } else {
        this.choosedList.L1.forEach((item, index) => {
          if (item[this.mappingResult[0]] == id) {
            this.choosedList.L1.splice(index, 1)
          }
        })
      }
    },
    //全选L1
    changeL1(val) {
      if (val) {
        this.initPreChooseL1.map(item => {
          item.ifChoosed = true
          this.choosedList.L1 = [...this.initPreChooseL1]
          //全选一级，则包含所有二级，所以选的二级清空
          this.choosedList.L2 = []
        })
      } else {
        this.initPreChooseL1.map(item => {
          item.ifChoosed = false
          this.choosedList.L1 = []
        })
      }
    },
    searchL1(val) {
      if(!val) {
        this.showSearchL1 = true
        return
      }else{
        this.preChooseL1.forEach(item =>{
          if( item[this.mappingResult[1]].search(val) != -1) {
              item.ifshow = true 
              this.showSearchL1 = false
          }else{
              item.ifshow = false
          }
        })
      }
    },
    /**************************@L2************************/
    //单个change事件
    handleL2(val, name, id ,parentId, item) { 
      if (val) {
        let pushObj = {}
        pushObj[this.mappingResult[3]] = id
        pushObj[this.mappingResult[4]] = name
        pushObj.parentId = parentId
        this.choosedList.L2.push(pushObj)
      } else {
        this.choosedList.L2.forEach((item, index) => {
          if (item[this.mappingResult[3]] == id) {
            this.choosedList.L2.splice(index, 1)
          }
        })
      }

    },
    //全选L2操作
    changeL2(val) {
      if (val) {
        this.initPreChooseL2.map(item => {
          item.ifChoosed = true
          let hasFind = false
          this.choosedList.L2.forEach(val => {
            if (item[this.mappingResult[3]] == val[this.mappingResult[3]]) hasFind = true
          })
          if (!hasFind) this.choosedList.L2.push(item)
        })
      } else {
        this.initPreChooseL2.map(item => {
          item.ifChoosed = false
          let hasFind = false
          this.choosedList.L2.forEach((val, index) => {
            if (item[this.mappingResult[3]] == val[this.mappingResult[3]]) this.choosedList.L2.splice(index, 1)
          })
        })
      }
    },
    searchL2(val) {
      if(!val) {
        this.showSearchL2 = true
        return
      }else{
        this.preChooseL2.forEach(item =>{
          if( item[this.mappingResult[4]].search(val) != -1) {
              item.ifshow = true 
              this.showSearchL2 = false
          }else{
              item.ifshow = false
          }
        })
      }
    },

  },
  mounted() {
    this.$store.dispatch('heavyDate/'+this.mappingResult[5])
  }
}

</script>
<style type="text/css" scoped="scoped">

.disable { color: #ccc;}
.relative {position: relative;}
.cusor {cursor: pointer;}
.right {position:absolute;right: 4px;top:0;}


.hjx-alert-container{position: fixed;top: 0;left: 0;width: 100%;height: 100%;text-align: center;z-index: 2000;}
.hjx-alert-container .hjx-bg{position: absolute;top:0;left: 0;bottom: 0;right: 0;background-color: rgba(0,0,0,0.5);}
.alert-title {border-radius: 5px;background-color: #f3f4f5;font-size: 15px;height: 35px;line-height: 35px;font-weight: 600;}
.hjx-message-box{border-radius: 5px;}
.hjx-alert-container .hjx-message-box {background: #fff;width: 800px;position: absolute;display: inline-block;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 2006;}
.box-left {width: 45%;}
.box-right {width: 45%;}
.clear-padding {padding: 0}
.choose-field {text-align: left;background-color: #f3f4f5;padding: 12px;overflow: hidden;}
.choose-container {padding: 0 20px 10px 20px;overflow: hidden;}
.left-item,
.right-item {margin: 6px 0;}
.right-item {color: #5a5e66;font-size: 12px;overflow: hidden;}
.left-item-second {padding-left: 23px;margin: 0;}
.second-title {font-size: 14px;margin: 8px 0;}
.btn {text-align: right;padding-top: 16px;}
.noTap {font-size: 12px;color: #878D99;}
.canTap {font-size: 12px;color: #409EFF;}
.icon-right {font-size: 13px}
.breadcrumb {margin: 4px 0 8px 0;}
.list-container{height: 300px;overflow-y:auto;font-size: 12px}

.list-container-choosed{height: 380px;overflow-y:auto;}
.fade-enter-active, .fade-leave-active {transition: opacity .5s}
.fade-enter, .fade-leave-to /* .fade-leave-active in below version 2.1.8 */ {opacity: 0}
</style>
