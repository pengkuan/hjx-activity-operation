<template>
     <el-dialog :title="category" center :visible.sync="showFlag.flag" class="part-select" @close="cancel">
         <el-row :gutter="20">
             <el-col :span="12">
                 <div class="search">
                     <el-input v-model.trim="searchKey" class="input"></el-input>
                     <ul class="search-ul" ref="searchUl"> 
                         <li v-for="(item,index) in defaulSearchList" :key="index" @click="addInfo(item)">{{item[name]}}</li>  
                     </ul> 
                 </div>
             </el-col>
             <el-col :span="12">
                 <div class="has-select">
                     <p>已选{{defaultResultList.length}}/100</p>
                     <ul class="has-select-ul">
                         <li class="pos-rel" v-for="(item,index) in defaultResultList" :key="index">{{item[name]}}<span @click="delInfo(item,index)" class="iconfont icon-roundclosefill"></span></li>
                     </ul>  
                 </div>
             </el-col>
         </el-row>
         <div style="text-align: center;">
             <el-button size="small" @click="showFlag.flag=false">取 消</el-button>
             <el-button type="primary" @click="ok" size="small" >确 定</el-button>
         </div> 
     </el-dialog>
</template>
<script type="text/javascript">
export default {
    name: 'adSort',
    data() {
        return { 
            bSign: 'isCancel',
            searchKey: '',
            defaulSearchList: [], //默认搜索数据，用来赋值用 
            defaultResultList: [], //默认结果数据，用来赋值用
            temporaryResultList: [], //临时数据  
        }
    },
    props: ['category', 'showFlag', 'searchLish', 'resultList'],
    methods: {
        addInfo(item, index) { //点击左边添加类别  
            let id = this.id
            let exit = this.defaultResultList.findIndex(function(val, index){
                return val[id] == item[id]
            })
            exit == -1 && this.defaultResultList.push(item)
        },
        delInfo(item, index) { //点击右边删除类别
            this.defaultResultList.splice(index, 1)
        },
        cancel() { //关闭的回调函数
            if (this.bSign == 'isOk') { 
                this.temporaryResultList = [...this.defaultResultList]
            } else {
                this.defaultResultList = [...this.temporaryResultList]
            }  
            this.$emit('conditionSelectClose', this.category, this.defaultResultList)
            this.bSign = 'isCancel'  
            this.searchKey = ''
        },
        ok() { //点击确认按钮
            this.bSign = 'isOk'
            this.showFlag.flag = false
        }
    },
    watch: { 
        'searchLish': {
            handler(val) {
                console.log('search数据变了') 
                this.defaulSearchList = [...val] 
            },
            deep: true
        },
        'resultList': {
            handler(val) {
                console.log('result数据变了')
                console.log(val)
                this.defaultResultList = [...val]
            },
            deep: true
        },
        searchKey(val) { //关键字搜索  
            let name = this.name 
            this.defaulSearchList = this.searchLish.filter(function(item, index){ 
                return item[name].indexOf(val) != -1 
            })    
        }, 
    },
    computed: {
        name() {
            return this.category == '渠道类' ?  'channelName' :  'storeName'
        },
        id() {
            return this.category == '渠道类' ?  'channelId' :  'storeId'
        }
    },
    created() { 
    },
    mounted() { 
        this.defaulSearchList = [...this.searchLish]
        this.defaultResultList = [...this.resultList]
        this.temporaryResultList = [...this.resultList]
    },
}

</script>
<style lang="scss" scoped="scoped"> 
.pos-rel {
    position: relative;
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
</style>
