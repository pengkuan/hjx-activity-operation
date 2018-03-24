<template>
  <transition name="fade" >
    <div class="hjx-alert-container" v-if="ifshow">
      <div class="hjx-message-box relative" >
        <div class="alert-title hjx-text-center hjx-blue">选择商户和门店</div>
        <div class="clear choose-container">
          <div class="fl box-left">
            <p class="second-title hjx-blue">备选</p>
            <p class="no-search" v-show="!searchL1Name && !chooseAllL1">搜索后将展示相应数据</p>
            <p class="all-search" v-show="chooseAllL1">全选</p>
            <div class="choose-field">
              <div v-if="first">
                <el-input size="small" @input="searchL1(searchL1Name)" placeholder="搜索商户" prefix-icon="el-icon-search" v-model="searchL1Name" clearable :disabled="chooseAllL1"></el-input>
                <p class="breadcrumb"><span class="noTap ">商户列表</span></p>
                <p class="left-item-second">
                  <el-checkbox v-show="showSearchL1" @change="changeL1(chooseAllL1)" :indeterminate="isIndeterminateFirst" v-model="chooseAllL1" 
                  :disabled="businessesFlage == '2'"><span class="ft12" >全选所有商户</span></el-checkbox>
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
          <div class="fr box-right" v-loading="refleshLoading">
            <p class="second-title hjx-blue">
              已选 
              <span style="color:#000;" v-if="businessesFlage == '0'">(白名单)</span> 
              <span style="color:#000;" v-if="businessesFlage == '1'">(白名单)</span> 
              <span style="color:#000;" v-if="businessesFlage == '2'">(黑名单)</span> 
            </p> 
            <div class="choose-field list-container-choosed" ref="scrollDiv">
                <pull-to @infinite-scroll="refresh">
                  <div v-for="(list,key) in hasChoosedList">
                    <p class="right-item clear" v-for="(item,index) in list">
                      <span v-if="key=='L1'" class="fl hjx-blue" :class="{'color':item.color}" ><i class="iconfont icon-wenjianjia"></i> {{item.name}}</span>
                      <span v-else class="fl hjx-blue" :class="{'color':item.color}"><i class="iconfont icon-dian"></i> {{item.name}}</span>
                      <i @click="delRightItem(key,index,item)" class="el-icon-remove-outline fr hjx-hover"></i>
                    </p>
                  </div> 
                </pull-to>
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
import PullTo from 'vue-pull-to'
import api from '@/api'
import util from '@/util'
import { mapGetters, mapActions } from 'vuex'
export default {
  name:'hjxSelectAlert',
  components: { PullTo },
  data() {
    return {
      confirmAll: false, //全选弹框的确认
      timer: '',
      loadMorePageIndex: '0',
      loadMorePageSize: '100',
      addList: [], //新增列表
      delList: [], //删除列表
      first: true,
      chooseAllL1: false, 
      copyChannelList: [],
      copyHasChoosedList: {
        L1: [],
        L2: []
      },
      hasChoosedList: {
        L1:[],
        L2:[],
      }, //右边已选
      storeList: [],
      businessesFlage: '',
      refleshLoading: false, //上拉加载标志
      channelList: [],  
      searchL1Name: '',
      searchL2Name: '',
      isIndeterminateFirst: false,
      isIndeterminateSecond: false,
      showSearchL1:true,//搜索时使用
      showSearchL2:true,//搜索时使用 
      isFirst: false,
      mydata: {},
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
      let params = {
        activityId: this.$route.query.id,
        searchKey: '',
        pageIndex: this.loadMorePageIndex + '',
        pageSize: this.loadMorePageSize  + ''
      }
      this.refleshLoading = true
      api.search_activity_channel_store_list(params).then((res) => {
        this.refleshLoading = false
        if (res._ret != '0') {
          this.$alert(res._errStr)
          return
        }
        this.loadMorePageIndex++
        this.businessesFlage = res.businessesFlage

        // 数组合并
        this.hasChoosedList.L1 = this.hasChoosedList.L1.concat(res.businessesIdList)
        this.hasChoosedList.L2 = this.hasChoosedList.L2.concat(res.storeIdList)

        // 数据格式化 父级加 type = channel
        this.hasChoosedList.L1.forEach((item, i) => {
          item.type = 'channel'
        })

        console.log('去重前的L1', this.hasChoosedList.L1)
        console.log('去重前的L2', this.hasChoosedList.L2)
        // 数组去重
        this.hasChoosedList.L1 = util.distinct(this.hasChoosedList.L1)
        this.hasChoosedList.L2 = util.distinct(this.hasChoosedList.L2)

        console.log('去重后的L1', this.hasChoosedList.L1)
        console.log('去重后的L2', this.hasChoosedList.L2)

        // 排除删除列表中的选项 
        for (var i = 0; i < this.delList.length; i++) {
          if (this.delList[i].pid == undefined) { //父级
            let indexL1 = this.hasChoosedList.L1.findIndex((item, index) => {return item.id == this.delList[i].id})
            if (indexL1 >= 0) {
              this.hasChoosedList.L1.splice(indexL1, 1) 
            }
          } else { //子集
            let indexL2 = this.hasChoosedList.L2.findIndex((item, index) => {return item.id == this.delList[i].id})
            if (indexL2 >= 0) {
              this.hasChoosedList.L2.splice(indexL2, 1) 
            }
          } 
        }   
        console.log('排除删除列表后的L1', this.hasChoosedList.L1)
        console.log('排除删除列表后的L2', this.hasChoosedList.L2)

        // L2的pid和L1的id对比，如果有那么就删除子集，选了父级，删除子集(L2)
        for (let i = 0; i < this.hasChoosedList.L2.length; i++) {
          let isRepeatInL1 = this.hasChoosedList.L1.findIndex((val,j) => {return val.id == this.hasChoosedList.L2[i].pid})
          if (isRepeatInL1 >= 0) {
            this.hasChoosedList.L2.splice(i,1)
            i--
          }
        } 


        // 等于0是白名单全选
        // 等于1是白名单非全选
        // 等于2是黑名单
        if (!this.isFirst) {
          if (res.businessesFlage == '0') {
            this.chooseAllL1 = true
            // this.hasChoosedList = {
            //   L1: [],
            //   L2: []
            // } 
          }
          this.isFirst = true
        }
        

        if (this.chooseAllL1) {
          this.hasChoosedList = {
            L1: [],
            L2: []
          }
        } 

      }) 
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
    /********提交和取消************/
    submit() { 
      this.searchL1Name = ''
      this.$emit('setData', this.hasChoosedList)
      this.$emit('close', false)
      this.first = true
      this.showSearchL1 = true
    },
    close() {
      // this.$emit('close', false)
      
      this.init() 
      this.showSearchL1 = true

      this.$emit('close', 'cancel')

    },
    init() { //初始化数据
      this.first = true
      this.searchL1Name = ''
      // 优化添加的
      // this.loadMorePageIndex = '0'
      // this.addList = []
      // this.delList = []
      // this.hasChoosedList = {
      //   L1: [],
      //   L2: []
      // }
      // this.channelList = []
      // this.chooseAllL1 = false
      // this.refresh()

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
          // this.addList.forEach((val, i) => {
          //   if (val.id == item.id && val.type == 'channel') {
          //     this.addList.splice(i,1)
          //   }
          // })

          // console.log(this.addList, '新添加的11111')
          // return


          for (let i = 0; i < this.addList.length; i++) { 
            if (this.addList[i].id == item.id && this.addList[i].type == 'channel') {
              this.addList.splice(i, 1)
              i--
            }
          }

        } else { //非新添加的 
          this.delList.push(item) 
          // this.addList.forEach((val, i) => {
          //   if (val.id == item.id && val.type == 'channel') {
          //     this.addList.splice(i,1)
          //   }
          // })

          for (let i = 0; i < this.addList.length; i++) {
            if (this.addList[i].id == item.id && this.addList[i].type == 'channel') {
              this.addList.splice(i, 1)
              i--
            }
          }
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
          // this.addList.forEach((val, i) => {
          //   if (val.id == item.id && val.type != 'channel') {
          //     this.addList.splice(i,1)
          //   }
          // })

          for (let i = 0; i < this.addList.length; i++) {
            if (this.addList[i].id == item.id && this.addList[i].type != 'channel') {
              this.addList.splice(i, 1)
              i--
            }
          }

        } else { //非新添加的 
          this.delList.push(item) 
          // this.addList.forEach((val, i) => {
          //   if (val.id == item.id && val.type != 'channel') {
          //     this.addList.splice(i,1)
          //   }
          // })

          for (let i = 0; i < this.addList.length; i++) {
            if (this.addList[i].id == item.id && this.addList[i].type != 'channel') {
              this.addList.splice(i, 1)
              i--
            }
          }
        }

      }     
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
              item.color = true
              this.hasChoosedList.L2.unshift(item)
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
      console.log(this.hasChoosedList)
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
      // this.delList.forEach((delItem, i) => {
      //   if (delItem.id == cell.id) {
      //     this.delList.splice(i,1)
      //   }
      // })
      for (let i = 0; i < this.delList.length; i++) {
        if (this.delList[i].id == cell.id) {
          this.delList.splice(i, 1)
          i--
        }
      }


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
        // this.chooseAllL1 = false
        this.confirmAll = true
        if (this.hasChoosedList.L1.length>0||this.hasChoosedList.L2.length>0) {
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
          }).catch(() => {
            this.chooseAllL1 = false 
          }); 
        } 
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
                    this.hasChoosedList.L1.unshift({id: item.id, name: item.name, type: item.type, color: true})
                  } 

                  //处理下级门店的情况 开始
                  item.storeList.forEach((li,j) => {
                    if (li.status) { //状态为true
                      if (this.delList.some(val => val.id == li.id && val.name == li.name )) {  //在删除列表内
                        li.status = false
                      } else { //没有被删除
                        if (!this.hasChoosedList.L2.some(val => val.id == li.id)) { //在L2列表内
                          this.hasChoosedList.L2.unshift({id: item.id, name: item.name, color: true})
                        }
                      }
                    } else {
                      if (this.addList.some(val => val.id == li.id && val.name == li.name)) {
                        li.status = true
                      }
                    }  
                  })
                  //处理下级门店的情况 结束

                }
              } else {
                let a = this.addList.some((val, index) => {
                  return val.id == item.id && val.name == item.name
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
        // this.delList.forEach((delItem, i) => {
        //   if (delItem.id == cell.id) {
        //     this.delList.splice(i,1)
        //   }
        // })

        for (let i = 0; i < this.delList.length; i++) {
          if (this.delList[i].id == cell.id) {
            this.delList.splice(i, 1)
            i--
          }
        }

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
    this.refresh()
    // this.$store.dispatch('heavyDate/'+this.mappingResult[5])
    this.backup()
  },
  created() {
    console.log('created')
  }
}

</script>
<style type="text/css" scoped="scoped">
.disable { color: #ccc;}
.relative {position: relative;}
.cusor {cursor: pointer;}
.right {position:absolute;right: 4px;top:0;}
.no-search {font-size: 14px; color: #A9AAAA; position: absolute;left: 15%;top: 250px;}
.all-search {font-size: 14px; color: #A9AAAA; position: absolute;left: 73%;top: 250px;}
.color {color: red !important;}

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
