<template>
  <transition name="fade" >
    <div class="hjx-alert-container" v-if="ifshow">
      <div class="hjx-message-box" >
        <div class="alert-title hjx-text-center hjx-blue">选择商户和门店</div>
        <div class="clear choose-container">
          <div class="fl box-left">
            <p class="second-title hjx-blue">备选</p>
            <div class="choose-field">
              <div v-if="first">
                <el-input size="small" @input="searchL1(searchL1Name)" placeholder="搜索商户" prefix-icon="el-icon-search" v-model="searchL1Name" clearable :disabled="chooseAllL1"></el-input>
                <p class="breadcrumb"><span class="noTap ">商户列表</span></p>
                <p class="left-item-second">
                  <el-checkbox v-show="showSearchL1" @change="changeL1(chooseAllL1)" :indeterminate="isIndeterminateFirst" v-model="chooseAllL1"><span class="ft12" >全选所有商户</span></el-checkbox>
                </p>
                <div class="list-container"> 
                  <p class="left-item overflow" v-for="(item, index) in channelList" >
                    <el-checkbox size="mini" class="fl" v-model="item.status" @change="handleL1(item)" :disabled="item.status">
                      <span class="ft12"><i class="iconfont icon-wenjianjia"></i> {{item.name}}</span>
                    </el-checkbox>
                    <el-button @click="setSecond(item.storeList)" type="text" size="mini" class="fr clear-padding" :disabled="item.status"><i class="iconfont icon-xiajiicon"></i>下级</el-button>
                  </p>
                </div>
              </div>
              <div v-else>
                <el-input size="small" @input="searchL2(searchL2Name)" placeholder="搜索门店" prefix-icon="el-icon-search" v-model="searchL2Name" clearable></el-input>
                <div class="breadcrumb"><span class="canTap hjx-hover" @click="first = true">商户列表 <i class="iconfont icon-right"></i></span><span class="noTap">门店列表</span></div>
                <p class="left-item-second">
                  <el-checkbox v-show="showSearchL2" @change="changeL2(chooseAllL2)" :indeterminate="isIndeterminateFirst" v-model="chooseAllL2"><span class="ft12">全选所有门店</span></el-checkbox>
                </p>
                <div class="list-container">
                  <p class="left-item" v-for="item in storeList" v-show="item.ifshow">
                    <el-checkbox v-model="item.status"  @change="handleL2(item)" :disabled="item.status">
                      <span class="ft12"><i class="iconfont icon-dian"></i>{{item.name}}</span>
                    </el-checkbox>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="fr box-right">
            <p class="second-title hjx-blue">已选</p>
            <div class="choose-field list-container-choosed">
              <div v-for="(list,key) in hasChoosedList">
                <p class="right-item clear" v-for="(item,index) in list">
                  {{key}}
                  <span v-if="key=='L1'" class="fl hjx-blue"><i class="iconfont icon-wenjianjia"></i> {{item.name}}</span>
                  <span v-else class="fl hjx-blue"><i class="iconfont icon-dian"></i> {{item.name}}</span>
                  <i @click="delRightItem(key,index,item)" class="iconfont icon-round_close_fill_light fr hjx-hover"></i>
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
      first: true,
      chooseAllL1: false,
      chooseAllL2: false,
      copyChannelList: [],
      copyHasChoosedList: {},
      hasChoosedList: {
        L1:[],
        L2:[],
      }, //右边已选
      storeList: [],
      channelList: [
        {
          id: '1',
          name: '华为',
          status: false,
          storeList: [
            {
              id: '11',
              name: '华为门店1',
              status: false,
              pid: '1',
              ifshow: true,

            },
            {
              id: '12',
              name: '华为门店2',
              status: false,
              pid: '1',
              ifshow: true,
            },
            {
              id: '13',
              name: '华为门店3',
              status: false,
              pid: '1',
              ifshow: true,
            }
          ]
        },
        {
          id: '2',
          name: '小米',
          status: false,
          storeList: [
            {
              id: '21',
              name: '小米门店1',
              status: false,
              pid: '2',
              ifshow: true,
            },
            {
              id: '22',
              name: '小米门店2',
              status: false,
              pid: '2',
              ifshow: true,
            },
          ]
        }
      ], 
      channelList2: [
        {
          id: '5',
          name: '魅族1',
          status: false,
          storeList: [
            {
              id: '51',
              name: '魅族门店1',
              status: false,
              pid: '5',
              ifshow: true,

            },
            {
              id: '52',
              name: '魅族门店2',
              status: false,
              pid: '5',
              ifshow: true,
            },
            {
              id: '53',
              name: '魅族门店3',
              status: false,
              pid: '5',
              ifshow: true,
            }
          ]
        },
        {
          id: '72',
          name: '联想',
          status: false,
          storeList: [
            {
              id: '861',
              name: '联想门店1',
              status: false,
              pid: '72',
              ifshow: true,
            },
            {
              id: '8622',
              name: '联想门店2',
              status: false,
              pid: '72',
              ifshow: true,
            },
          ]
        }
      ],
      channelList3: [
        {
          id: '1',
          name: '华为',
          status: false,
          storeList: [
            {
              id: '11',
              name: '华为门店1',
              status: false,
              pid: '1',
              ifshow: true,

            },
            {
              id: '12',
              name: '华为门店2',
              status: false,
              pid: '1',
              ifshow: true,
            },
            {
              id: '13',
              name: '华为门店3',
              status: false,
              pid: '1',
              ifshow: true,
            }
          ]
        },
        {
          id: '2',
          name: '小米',
          status: false,
          storeList: [
            {
              id: '21',
              name: '小米门店1',
              status: false,
              pid: '2',
              ifshow: true,
            },
            {
              id: '22',
              name: '小米门店2',
              status: false,
              pid: '2',
              ifshow: true,
            },
          ]
        }
      ],
      searchL1Name: '',
      searchL2Name: '',
      isIndeterminateFirst: false,
      isIndeterminateSecond: false,
      showSearchL1:true,//搜索时使用
      showSearchL2:true,//搜索时使用 
    }
  },
  props: {
    action: String,
    ifshow: Boolean,
    data: Object
  }, 
  computed: {   
  },
  methods: { 
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
      if (item.status) { //勾选时
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
      } else { //取消勾选时
        this.hasChoosedList.L1.forEach((list, index) => {
          if (item.id == list.id) {
            this.hasChoosedList.L1.splice(index, 1)
          }
        })
      }  
    }, 
    //全选L1
    changeL1(status) { 
      if (status) {
        this.copyChannelList = JSON.parse(JSON.stringify(this.channelList))
        this.copyHasChoosedList = JSON.parse(JSON.stringify(this.hasChoosedList))
        this.channelList = []
        this.hasChoosedList = {}
        this.searchL1Name = ''
      } else {
        this.channelList = this.copyChannelList
        this.hasChoosedList = this.copyHasChoosedList
      }  
    },
    //搜索L1
    searchL1(val) {
      if(!val) {
        this.showSearchL1 = true
        return
      } else {
        this.showSearchL1 = false
        if (val == '1234') {
          this.channelList = [...this.channelList2]
        } else if (val == '2234') {
          this.channelList = [...this.channelList3]
        }

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

      }
    },
    /**************************@L2************************/
    //单个change事件
    handleL2(item) {
      if (item.status) {
        let res = this.hasChoosedList.L2.some((list) => {
          return item.id == list.id
        })
        if (!res) {
          this.hasChoosedList.L2.push({id:item.id, name: item.name, pid: item.pid})
        }
      } else {
        this.hasChoosedList.L2.forEach((list, index) => {
          if (item.id == list.id) {
            this.hasChoosedList.L2.splice(index, 1)
          }
        })
      }   
    },
    //全选L2操作
    changeL2(status) { 
      if (status) { //选择
        this.storeList.forEach((item, index) => {
          item.status = true
          let idx = this.hasChoosedList.L2.findIndex((list, index) => {return list.id == item.id})
          if (idx == -1) {
            this.hasChoosedList.L2.push(item)
          }
        })
      } else { //取消选择 
        this.storeList.forEach((item, index) => {
          item.status = false
          let idx = this.hasChoosedList.L2.findIndex((list, index) => {return list.id == item.id})
          if (idx >= 0) {
            this.hasChoosedList.L2.splice(idx, 1)
          }
        })
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
    first(val) {
      if (val) {
        this.chooseAllL2 = false
      } else {
        this.chooseAllL1 = false
      }
    }
  },
  mounted() {
    // this.$store.dispatch('heavyDate/'+this.mappingResult[5])
  }
}

</script>
<style type="text/css" scoped="scoped">
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
