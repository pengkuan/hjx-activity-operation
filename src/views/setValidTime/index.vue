<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>设置有效期</el-breadcrumb-item>
        </el-breadcrumb>
        <br><br><br>
        <el-form  label-width="120px" size="small" class="demo-form-inline">
            <el-form-item label="有效天数：">
                <el-input-number size="small" v-model="dayNum" :min="0" ></el-input-number>
            </el-form-item>
            <el-form-item label="时间：">
                <el-input-number size="small" v-model="hour" :min="0" :max="24"></el-input-number>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submit">更新</el-button>
            </el-form-item>
        </el-form>
<input type="submit" value="提交" id="ok" @click="test" />&nbsp;</form>
    </div>
</template>
<script>

var Ajax={
    get: function(url, fn) {
        var obj = new XMLHttpRequest();  // XMLHttpRequest对象用于在后台与服务器交换数据          
        obj.open('GET', url, true);
        obj.onreadystatechange = function() {
            if (obj.readyState == 4 && obj.status == 200 || obj.status == 304) { // readyState == 4说明请求已完成
                fn.call(this, obj.responseText);  //从服务器获得数据
            }
        };
        obj.send();
    },
    post: function (url, data, fn) {         // datat应为'a=a1&b=b1'这种字符串格式，在jq里如果data为对象会自动将对象转成这种字符串格式
        var obj = new XMLHttpRequest();
        obj.withCredentials = true;
        obj.open("POST", url, true);
        obj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");  // 添加http头，发送信息至服务器时内容编码类型
        obj.onreadystatechange = function() {
            if (obj.readyState == 4 && (obj.status == 200 || obj.status == 304)) {  // 304未修改
                fn.call(this, obj.responseText);
            }
        };
        obj.send(data);
    }
}


import api from '@/api/index'
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            dayNum:'',
            id:'',
            hour:''
        }
    },
    computed:{
        ...mapGetters({
            'userId':'userInfo/userId',
            'userName':'userInfo/userName'
        })
    },
    methods: {
        test(){
            api.test({}).then()
            document.cookie = 'aaa = 555666'
            return
            Ajax.post('http://localhost:8884/api/test1')
        },
        init(){
        	api.get_valid_time({}).then(res => {
                if (res._ret != 0) {
                    this.$alert(res._errStr)
                    return
                }
                this.dayNum = res.validTime.dayNum
                this.hour = res.validTime.hour
                this.id = res.validTime.id
            })
        },
        submit(){
            if(String(this.dayNum).indexOf('.') != -1 || String(this.hour).indexOf('.') != -1 ){
                this.$alert('天数和时间仅支持整数')
                return
            }
            let reqData = {
                optId:this.userId,
                optName:this.userId,
                id:this.id,
                dayNum:String(this.dayNum),
                hour:String(this.hour),
            }
            api.update_valid_time(reqData).then(res => {
                if (res._ret != 0) {
                    this.$alert(res._errStr)
                    return
                }
                this.$message({message:res._errStr,type:'success'})
            })
        }
    },
    mounted() {
        this.init()
    },
}
</script>


