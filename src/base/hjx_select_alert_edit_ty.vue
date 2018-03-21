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
                <!-- <p class="left-item-second">
                  <el-checkbox v-show="showSearchL2" @change="changeL2(chooseAllL2)" :indeterminate="isIndeterminateFirst" v-model="chooseAllL2"><span class="ft12" :disabled="chooseAllL2" >全选所有门店</span></el-checkbox>
                </p> -->
                <div class="list-container"> 
                  <p class="left-item" v-for="item in storeList" v-show="item.ifshow" @click="handleL2(item)" :class="{'disable':item.status, 'relative':true, 'cusor': true}">
                    <span class="ft12"><i class="iconfont icon-dian"></i>{{item.name}}</span> 
                    <i class="el-icon-circle-plus-outline right"></i>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="fr box-right" v-loading="refleshLoading">
            <p class="second-title hjx-blue">
              已选 
              <span style="color:#000;">({{blackAndWhiteFlag ? '黑名单' : '白名单'}}
                <i class="el-icon-refresh" style="color:#409EFF;cursor: pointer;" @click="blackAndWhiteFlag=!blackAndWhiteFlag"> 
                </i>)</span> 
            </p>

            <div class="choose-field list-container-choosed" ref="scrollDiv" @scroll="scroll">
                <pull-to @infinite-scroll="refresh" >
                  <div v-for="(list,key) in hasChoosedList">
                    <p class="right-item clear" v-for="(item,index) in list">
                      {{key}}
                      <span v-if="key=='L1'" class="fl hjx-blue"><i class="iconfont icon-wenjianjia"></i> {{item.name}}</span>
                      <span v-else class="fl hjx-blue"><i class="iconfont icon-dian"></i> {{item.name}}</span>
                      <i @click="delRightItem(key,index,item)" class="el-icon-remove-outline fr hjx-hover"></i>
                    </p>
                  </div>
                  <!-- <p v-show="refleshLoading">加载中...</p> -->
                  <!-- <p>已经到底了</p> -->
                </pull-to>
            </div>

            <!-- <div class="choose-field list-container-choosed">
              <div v-for="(list,key) in hasChoosedList">
                <p class="right-item clear" v-for="(item,index) in list">
                  {{key}}
                  <span v-if="key=='L1'" class="fl hjx-blue"><i class="iconfont icon-wenjianjia"></i> {{item.name}}</span>
                  <span v-else class="fl hjx-blue"><i class="iconfont icon-dian"></i> {{item.name}}</span>
                  <i @click="delRightItem(key,index,item)" class="iconfont icon-round_close_fill_light fr hjx-hover"></i>
                </p>
              </div>
            </div>  -->
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
import PullTo from 'vue-pull-to'
import api from '@/api'
import { mapGetters, mapActions } from 'vuex'
export default {
  name:'hjxSelectAlert',
  components: { PullTo },
  data() {
    return {
      timer: '',
      addList: [], //新增列表
      delList: [], //删除列表
      first: true,
      chooseAllL1: false, 
      copyChannelList: [],
      copyHasChoosedList: {},
      hasChoosedList: {
        L1:[],
        L2:[],
      }, //右边已选
      storeList: [],
      blackAndWhiteFlag: true,
      refleshLoading: false, //上拉加载标志
      channelList: [ 
        // {
        //   id: '1',
        //   name: '华为',
        //   status: false,
        //   storeList: [
        //     {
        //       id: '11',
        //       name: '华为门店1',
        //       status: false,
        //       pid: '1',
        //       ifshow: true,

        //     },
        //     {
        //       id: '12',
        //       name: '华为门店2',
        //       status: false,
        //       pid: '1',
        //       ifshow: true,
        //     },
        //     {
        //       id: '13',
        //       name: '华为门店3',
        //       status: false,
        //       pid: '1',
        //       ifshow: true,
        //     },
        //     {
        //       id: '134',
        //       name: '华为门店3',
        //       status: false,
        //       pid: '1',
        //       ifshow: true,
        //     },
        //     {
        //       id: '135',
        //       name: '华为门店3',
        //       status: false,
        //       pid: '1',
        //       ifshow: true,
        //     },
        //     {
        //       id: '136',
        //       name: '华为门店3',
        //       status: false,
        //       pid: '1',
        //       ifshow: true,
        //     },
        //     {
        //       id: '137',
        //       name: '华为门店3',
        //       status: false,
        //       pid: '1',
        //       ifshow: true,
        //     },
        //     {
        //       id: '138',
        //       name: '华为门店3',
        //       status: false,
        //       pid: '1',
        //       ifshow: true,
        //     },
        //     {
        //       id: '139',
        //       name: '华为门店3',
        //       status: false,
        //       pid: '1',
        //       ifshow: true,
        //     },
        //     {
        //       id: '1312',
        //       name: '华为门店3',
        //       status: false,
        //       pid: '1',
        //       ifshow: true,
        //     },
        //     {
        //       id: '1313',
        //       name: '华为门店3',
        //       status: false,
        //       pid: '1',
        //       ifshow: true,
        //     },
        //     {
        //       id: '1314',
        //       name: '华为门店3',
        //       status: false,
        //       pid: '1',
        //       ifshow: true,
        //     },
        //     {
        //       id: '1315',
        //       name: '华为门店3',
        //       status: false,
        //       pid: '1',
        //       ifshow: true,
        //     },
        //     {
        //       id: '1316',
        //       name: '华为门店3',
        //       status: false,
        //       pid: '1',
        //       ifshow: true,
        //     },
        //     {
        //       id: '1317',
        //       name: '华为门店3',
        //       status: false,
        //       pid: '1',
        //       ifshow: true,
        //     },
        //     {
        //       id: '1318',
        //       name: '华为门店3',
        //       status: false,
        //       pid: '1',
        //       ifshow: true,
        //     },
        //     {
        //       id: '1319',
        //       name: '华为门店3',
        //       status: false,
        //       pid: '1',
        //       ifshow: true,
        //     },
        //     {
        //       id: '1323',
        //       name: '华为门店3',
        //       status: false,
        //       pid: '1',
        //       ifshow: true,
        //     },
        //     {
        //       id: '1325',
        //       name: '华为门店3',
        //       status: false,
        //       pid: '1',
        //       ifshow: true,
        //     },

        //   ]
        // },
        // {
        //   id: '2',
        //   name: '小米',
        //   status: false,
        //   storeList: [
        //     {
        //       id: '21',
        //       name: '小米门店1',
        //       status: false,
        //       pid: '2',
        //       ifshow: true,
        //     },
        //     {
        //       id: '22',
        //       name: '小米门店2',
        //       status: false,
        //       pid: '2',
        //       ifshow: true,
        //     },
        //   ]
        // }
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
    /********上拉加载************/
    refresh() {  
      this.refleshLoading = true
      setTimeout(() => {

        this.hasChoosedList.L2.push({id:1212, name: '测试中L2'})
        this.hasChoosedList.L1.push({id:1212, name: '测试中L1'}) 
        this.refleshLoading = false
      }, 1000)
      console.log('上拉了')
      

    },
    scroll() {
      console.log('滚动的时候')
    },
    /********提交和取消************/
    submit() {

      console.log(this.addList)
      console.log(this.delList)
      return

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
        
        //先判断添加列表内，是否包含这个渠道，若包含则删除添加的渠道，且不添加到删除列表内，
        //若不包含，那么就就不是新增的，直接添加到删除列表内
        let isInAddList = this.addList.some((val, index) => {
          return  val.id == item.id && val.type == 'channel' 
        })

        // 新添加的
        if (isInAddList) { 
          this.addList.forEach((val, i) => {
            if (val.id == item.id && val.type == 'channel') {
              this.addList.splice(i,1)
            }
          })
        } else { //非新添加的 
          this.delList.push(item) 
          this.addList.forEach((val, i) => {
            if (val.id == item.id && val.type == 'channel') {
              this.addList.splice(i,1)
            }
          })
        }

      } else { //门店
        // console.log(item)
        this.channelList.forEach((list, index) => {
          if (item.pid == list.id) { 
            list.storeList.forEach((term, i) => {
              if (item.id == term.id) {
                term.status = false
              }
            })
          }
        })

        let isInAddList = this.addList.some((val, index) => {
          return  val.id == item.id && val.type != 'channel' 
        })

        // 新添加的
        if (isInAddList) { 
          this.addList.forEach((val, i) => {
            if (val.id == item.id && val.type != 'channel') {
              this.addList.splice(i,1)
            }
          })
        } else { //非新添加的 
          this.delList.push(item) 
          this.addList.forEach((val, i) => {
            if (val.id == item.id && val.type != 'channel') {
              this.addList.splice(i,1)
            }
          })
        }

      }  



      // this.$nextTick(() => {
      //   // this.$refs.scrollDiv.scrollTop = 5
      //   console.log(this.$refs.scrollDiv.scrollTop, '滚动条位置')
      // })

      
      

    },
    backChannel() {
      this.first = true ; 
      this.searchL2Name = ''
      this.storeList.forEach((item, index) => { 
        item.ifshow = true 
      })
    },
    
    /*****设置显示的二级值****/
    setSecond(storeList) {  
      this.first = false
      console.log('二级菜单为：', storeList)
      this.storeList = storeList


      // this.storeList.forEach((list, index) => {
      //   let idx = this.hasChoosedList.L2.findIndex((li, i) => {
      //     return li.id == list.id
      //   })

      //   if (idx >= 0) {
      //     list.status = true
      //   } 
      // }) 

      //这个逻辑可言合并
      this.storeList.forEach((item, index) => {
        if (item.status) {
          let flag = this.delList.some((val, i) => {
            return val.id == item.id && val.name == item.name
          })
          if (flag) {//在删除列表中
            item.status = false
          } else {//不在删除列表中
            //把搜索到已选的放到右边的列表内,且要高亮
            let is = this.hasChoosedList.L2.some((list, index) => {
              return list.id == item.id
            })
            if (!is) {
              this.hasChoosedList.L2.push(item)
            } 
          }
        } else {
          let a = this.addList.some((val, index) => {
            return val.id == item.id 
          })
          if (a) {
            item.status = true
          }
        }
      })

    },
    /********/
    //单选L1
    handleL1(item) {    

      if (item.status) return

      item.status = true 
      let cell = {id:item.id, name: item.name, type: 'channel'}
      this.hasChoosedList.L1.push(cell)

      //勾选时添加到添加数据
      this.addList.push(cell)

      if (item.storeList && item.storeList.length) {
        item.storeList.forEach((item, index) => {
          let idx = this.addList.findIndex((li,i) => {
            return li.id == item.id && li.name == item.name
          })
          if (idx >= 0) {
            this.addList.splice(idx, 1)
          }
        })
      }

      //需要看看删除列表内有无此数据，如果有那么也需要删除
      this.delList.forEach((delItem, i) => {
        if (delItem.id == cell.id) {
          this.delList.splice(i,1)
        }
      })

      //渠道勾选时，需要把下面的门店取消
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
        this.channelList = []
        clearTimeout(this.timer)
        return
      } else {
        this.showSearchL1 = false 
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          let params = {
            activityId: this.$route.query.id,
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

            // 把存在删除列表中的，且status是true的，设置为false
            this.channelList.forEach((item, index) => {
              if (item.status) {
                let flag = this.delList.some((val, i) => {
                  return val.id == item.id && val.name == item.name
                })
                if (flag) {//在删除列表中
                  item.status = false
                } else {//不在删除列表中
                  //把搜索到已选的放到右边的列表内,且要高亮
                  let is = this.hasChoosedList.L1.some((list, index) => {
                    return list.id == item.id
                  })
                  if (!is) {
                    this.hasChoosedList.L1.push(item)
                  } 
                }
              } else {
                let a = this.addList.some((val, index) => {
                  return val.id == item.id 
                })
                if (a) {
                  item.status = true
                }
              }
            }) 


            console.log(this.channelList, '搜索到的channelList')



            // //同步已选列表，如果右边有的，那么就打钩
            // this.channelList.forEach((item, index) => {
            //   let idx = this.hasChoosedList.L1.findIndex((list, index) => {
            //     return list.id == item.id
            //   })
            //   if (idx >= 0) {
            //     item.status = true
            //   }
            // })

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
        let cell = {id:item.id, name: item.name, pid: item.pid}
        this.hasChoosedList.L2.push(cell)

        //勾选时添加到添加数据
        this.addList.push(cell)

        //需要看看删除列表内有无此数据，如果有那么也需要删除
        this.delList.forEach((delItem, i) => {
          if (delItem.id == cell.id) {
            this.delList.splice(i,1)
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
    },
    addList(val,old) {
      console.log(val, '新增列表')
    },
    delList(val, old) {
      console.log(val, '删除列表')
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
