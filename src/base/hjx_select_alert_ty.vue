<template>
  <transition name="fade" >
    <div class="hjx-alert-container" v-if="ifshow">
      <div class="hjx-message-box relative" >
        <div class="alert-title hjx-text-center hjx-blue">选择商户和门店</div>
        <div class="clear choose-container">
          <div class="fl box-left">
            <p class="second-title hjx-blue">备选</p>
            <p class="no-search" v-show="!searchL1Name && !chooseAllL1">搜索后将展示相应数据</p>
            <p class="all-search" v-show="chooseAllL1" v-text="allText"></p>
            <div class="choose-field">
              <div v-if="first">
                <el-input size="small" @input="searchL1(searchL1Name)" placeholder="搜索商户" prefix-icon="el-icon-search" v-model="searchL1Name" clearable :disabled="chooseAllL1"></el-input>
                <p class="breadcrumb"><span class="noTap ">商户列表</span></p>
                <p class="left-item-second">
                  <el-checkbox v-show="showSearchL1" @change="changeL1(chooseAllL1)" :indeterminate="isIndeterminateFirst" v-model="chooseAllL1" :disabled="!businessesFlage"><span class="ft12">全选所有商户</span></el-checkbox>
                </p>
                <div class="list-container"> 
                  <p class="left-item overflow" v-for="(item, index) in channelList" :class="{'disable':item.status, 'relative':true, 'cusor': true}" @click="handleL1(item)">
                      <i class="el-icon-circle-plus-outline"></i>
                      <span class="ft12"><i class="iconfont icon-wenjianjia"></i> {{item.name}}</span>
                    <el-button @click.stop.prevent="setSecond(item.storeList)" type="text" size="mini" class="fr clear-padding" :disabled="item.status"><i class="iconfont icon-xiajiicon"></i>下级</el-button>
                  </p>
                </div>
              </div>
              <div v-else>
                <el-input size="small" @input="searchL2(searchL2Name)" placeholder="搜索门店" prefix-icon="el-icon-search" v-model="searchL2Name" clearable></el-input>
                <div class="breadcrumb"><span class="canTap hjx-hover" @click="backChannel">商户列表 <i class="iconfont icon-right"></i></span><span class="noTap">门店列表</span></div> 
                <div class="list-container">
                  <p class="left-item" v-for="item in storeList" v-show="item.ifshow" @click="handleL2(item)" :class="{'disable':item.status, 'relative':true, 'cusor': true}">
                      <span class="ft12"><i class="iconfont icon-dian"></i>{{item.name}}</span>
                      <i class="el-icon-circle-plus-outline right"></i>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="fr box-right">
            <p class="second-title hjx-blue no-select">
              已选 
              <span style="color:#000;">({{businessesFlage ? '白名单' : '黑名单'}}
                <i class="el-icon-refresh" style="color:#409EFF;cursor: pointer;" @click="mySwitch()"> 
                </i>)</span> 
            </p>
            <div class="choose-field list-container-choosed">
              <div v-for="(list,key) in hasChoosedList">
                <p class="right-item clear" v-for="(item,index) in list">
                  <span v-if="key=='L1'" class="fl hjx-blue"><i class="iconfont icon-wenjianjia"></i> {{item.name}}</span>
                  <span v-else class="fl hjx-blue"><i class="iconfont icon-dian"></i> {{item.name}}</span>
                  <i @click="delRightItem(key,index,item)" class="el-icon-remove-outline fr hjx-hover"></i>
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
      timer: '',
      first: true,
      chooseAllL1: false,
      copyChannelList: [],
      copyHasChoosedList: {
        L1: [],
        L2: []
      },
      showBlackOrWhite: true, //切换黑白名单
      hasChoosedList: {
        L1:[],
        L2:[],
      }, //右边已选
      storeList: [],
      businessesFlage: true,
      channelList: [],  
      searchL1Name: '',
      searchL2Name: '',
      isIndeterminateFirst: false,
      isIndeterminateSecond: false,
      showSearchL1:true,//搜索时使用
      showSearchL2:true,//搜索时使用 
      mydata: {}, //备份数据
      hideChooseAllL1: false,
      allText: '全选',
    }
  },
  props: {
    ifshow: Boolean,
  }, 
  computed: {   
  },
  methods: { 
    /********提交和取消************/
    mySwitch() {
      if (this.chooseAllL1 && this.businessesFlage) {
        this.$alert('黑名单不支持全选，请取消全选后再做切换。')
        return
      }
      this.businessesFlage=!this.businessesFlage
    },
    backup() { 
      for (let json in this.$data) {
        if (json != 'mydata') { 
          this.mydata[json] = JSON.parse(JSON.stringify(this.$data[json]))
        }
      }
      console.log('备份的数据', this.mydata)  
    }, 
    recovery() {
      for (let json in this.mydata) {
        if (json != 'mydata') { 
          this.$data[json] = this.mydata[json]
        }
      }
      console.log('恢复的数据', this.$data)
    },
    submit() {
      this.$emit('setData', this.hasChoosedList)
      this.$emit('close', false)
      this.first = true
      this.searchL1Name = ''
      this.channelList = []
      this.showSearchL1 = true
    },
    close() {
      this.$emit('close', 'cancel')
      // this.init() 
      // this.showSearchL1 = true
    },
    init() { //初始化数据
      this.first = true 
      this.hasChoosedList = {
        L1: [],
        L2: []
      }
      this.channelList = []
      this.searchL1Name = '' 
    }, 
    delRightItem(key, index, item) {
      this.hasChoosedList[key].splice(index, 1)
      if (item.type == 'channel') { //删除渠道 
        this.channelList.forEach((list, index) => {
          if (list.name == item.name && list.id == item.id) {
            list.status = false
          }
        })
      } else { //门店
        console.log(item)
        this.channelList.forEach((list, index) => {
          if (item.pid == list.id) {
            console.log(list,111)
            list.storeList.forEach((term, i) => {
              if (item.id == term.id) {
                term.status = false
              }
            })
          }
        })
      } 
    },
    //返回到渠道
    backChannel() {
      this.first = true ; 
      this.searchL2Name = ''
      this.storeList.forEach((item, index) => { 
        item.ifshow = true 
      })
    },
    /*****设置显示的二级值****/
    setSecond(item) {  
      this.first = false
      this.storeList = item

      this.storeList.forEach((list, index) => {
        let idx = this.hasChoosedList.L2.findIndex((li, i) => {
          return li.id == list.id
        }) 
        if (idx >= 0) {
          list.status = true
        } 
      }) 
    },
    /********/
    //单选L1
    handleL1(item) {   
      if (item.status) return 
      item.status = true 

      this.hasChoosedList.L1.push({id:item.id, name: item.name, type: 'channel'})

      //取消渠道勾选时，需要把下面的门店取消
      let list = []
      this.channelList.forEach((me, i) => {
        if (me.id == item.id) {
          list = me.storeList
        }
      })  
      list.forEach((li, index) => {
        li.status = false
        let idx = this.hasChoosedList.L2.findIndex((that, i) => {
          return that.id == li.id
        })
        if (idx >= 0) {
          this.hasChoosedList.L2.splice(idx, 1)
        }
      }) 
    }, 
    //全选L1
    changeL1(status) { 
      if (status) { 
        if (this.hasChoosedList.L1.length>0||this.hasChoosedList.L2.length>0) {
          this.allText = ''
          this.$confirm('全选后，当前选择的商户记录将不被保留, 确认要全选吗?', '提示', {
            confirmButtonText: '确定全选',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.copyChannelList = JSON.parse(JSON.stringify(this.channelList))
            this.copyHasChoosedList = JSON.parse(JSON.stringify(this.hasChoosedList))
            this.channelList = []
            this.hasChoosedList = {
              L1: [],
              L2: []
            }
            this.searchL1Name = ''
            this.chooseAllL1 = true
            this.allText = '全选'
          }).catch(() => {
            this.chooseAllL1 = false 
            this.allText = '全选'
          }); 
        }


        // this.copyChannelList = JSON.parse(JSON.stringify(this.channelList))
        // this.copyHasChoosedList = JSON.parse(JSON.stringify(this.hasChoosedList))
        // this.channelList = []
        // this.hasChoosedList = {
        //   L1: [],
        //   L2: []
        // }
        // this.searchL1Name = '' 
      } else {
        this.channelList = this.copyChannelList
        this.hasChoosedList = this.copyHasChoosedList
      }  
    },
    //搜索L1
    searchL1(val) { 
       if(!val) {
         this.showSearchL1 = true
         this.channelList = []
         clearTimeout(this.timer)
         return
       } else {
         this.showSearchL1 = false 
         clearTimeout(this.timer)
         this.timer = setTimeout(() => {
           let params = {
             activityId: '',
             channelName: val,
             pageIndex: '0',
             pageSize: '100000' 
           }
           api.get_channel_list_change(params).then((res) => {
             if (res._ret != '0') {
               this.$alert(res._errStr)
               return
             }
             this.channelList = res.channelList; 

             //格式化数据
             this.channelList.forEach((item, index) => {
               item.type = 'channel'
               if (item.status == '1') {
                 item.status = true 
               } else {
                 item.status = false
               }
               if (item.storeList.length && item.storeList) {
                 item.storeList.forEach((val,j) => {
                   val.ifshow = true
                   if (val.status == '1') {
                     val.status  = true
                   } else {
                     val.status = false
                   }
                 })
               }
             })

             // 如果已经选择过了，那么就是禁用状态
             this.channelList.forEach((item, index) => {
               let idx = this.hasChoosedList.L1.findIndex((list, index) => {
                 return list.id == item.id
               })
               if (idx != -1) {
                 item.status = true
               } else {
                 item.status = false
               }
             })  
           })
         },700)   
       }  
    },
    /**************************@L2************************/
    //单个change事件
    handleL2(item) {
      if (item.status) return 
      item.status = true
      let res = this.hasChoosedList.L2.some((list) => {
        return item.id == list.id
      })
      if (!res) {
        this.hasChoosedList.L2.push({id:item.id, name: item.name, pid: item.pid})
      }   
    }, 
    //搜索L2
    searchL2(val) {
      if(!val) {
        this.showSearchL2 = true
        this.storeList.forEach((item, index) => { 
          item.ifshow = true 
        }) 
      }else{
        this.showSearchL2 = false
        this.storeList.forEach((item, index) => { 
          if (item.name.indexOf(val) >= 0) {
            item.ifshow = true
          } else {
            item.ifshow = false
          }
        }) 
      }
    },
  },
  watch: { 
    chooseAllL1(val) {
      val ? this.showBlackOrWhite = false : this.showBlackOrWhite = true
    }
  },
  mounted() {
    // this.$store.dispatch('heavyDate/'+this.mappingResult[5])
  }
}

</script>
<style type="text/css" scoped="scoped">
.disable { color: #ccc;}
.relative {position: relative;}
.cusor {cursor: pointer;}
.right {position:absolute;right: 4px;top:0;}
.no-select {user-select: none;}
.no-search {font-size: 14px; color: #A9AAAA; position: absolute;left: 15%;top: 250px;}
.all-search {font-size: 14px; color: #A9AAAA; position: absolute;left: 75%;top: 250px;}

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
