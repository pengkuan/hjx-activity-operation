<template>
    <el-dialog title="广告排序" width="30%" center :visible.sync="showFlag.flag" class="part-select order-dialog" @close="cancel">
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
                    <p class="sort-p" v-for="(item, index) in mySortData" :key="index">{{index+1}}</p>
                </el-col>
                <el-col :span="20">
                    <ul class="sort-ul">
                        <li class="sort-li pos-rel" v-for="(item, index) in mySortData">
                            {{item.adTitle}}
                            <span class="iconfont icon-triangleupfill up" :class="{'up-over':index==0}" v-show="item.adTitle == '本条广告'" @click="adSortUp(item,index)">  
                            </span>
                            <span class="iconfont icon-triangledownfill down" :class="{'up-over':index==mySortData.length-1}" v-show="item.adTitle == '本条广告'" @click="adSortDown(item,index)"> 
                            </span>
                        </li>
                    </ul>
                </el-col>
            </el-row>
            <el-button size="small" @click="showFlag.flag=false">取 消</el-button>
            <el-button type="primary" size="small" @click="ok">确 定</el-button> 
        </div>
    </el-dialog>
</template>
<script type="text/javascript">
export default {
    name: 'adSort',
    data() {
        return {
            bSign: 'isCancel',
            mySortData: [],
            midData: []
        }
    },
    props: ['sortData', 'showFlag', 'adTitle'],
    methods: {
        adSortUp(item, index) { //向上排序
            let so = this.mySortData[index]
            if (index > 0) {
                this.mySortData.splice(index, 1)
                this.mySortData.splice(index - 1, 0, so)
            }
        },
        adSortDown(item, index) { //向下排序
            let so = this.mySortData[index]
            let len = this.mySortData.length
            if (index < len - 1) {
                this.mySortData.splice(index, 1)
                this.mySortData.splice(index + 1, 0, so)
            }
        },
        cancel() { //点击取消
            if (this.bSign == 'isOk') {
                this.midData = [...this.mySortData]
            } else {
                this.mySortData = [...this.midData]
            }  
            this.$emit('adSortClose', this.bSign, this.mySortData)
            this.bSign = 'isCancel'  
        },
        ok() { //点击确定
            this.bSign = 'isOk'
            this.showFlag.flag = false
        },
        init() { //初始化
            this.mySortData = [...this.sortData] 
            this.midData = [...this.sortData] 
            if (this.showFlag.where == 'add') { //添加
                this.check() && this.mySortData.push({adTitle: '本条广告'})
            } else { //编辑
                this.changeTitle() 
            }
            
        },
        changeTitle() { //添加本条广告
            let adTitle = this.adTitle
            this.mySortData.forEach(function(item, index) {
                if (adTitle == item.adTitle) {
                    item.adTitle = '本条广告'
                }
            })
        },
        check() { //检查是否有本条广告  
            let n = this.mySortData.findIndex(function(item, index){
                return item.adTitle == '本条广告'
            })
            if (n == -1) {
                return true
            } else {
                return false
            }
        }
    },
    watch: {
        'sortData': {
            handler (val) {  
                this.init()
            },
            deep: true
        }
    },
    computed: {},
    created() { 
    },
    mounted() {
        this.init() 
    },
}

</script>
<style lang="scss" scoped="scoped">
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
    .up,
    .down {
        position: absolute;
        right: 10px;
        top: 0;
        cursor: pointer;
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

.pos-rel {
    position: relative;
}

</style>
