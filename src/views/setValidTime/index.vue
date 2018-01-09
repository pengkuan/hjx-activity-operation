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
                <el-button type="primary" :disabled="power.active_reward_setdeadline" @click="submit">更新</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>


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
            'userName':'userInfo/userName',
            'power':'userInfo/power'
        })
    },
    methods: {
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


