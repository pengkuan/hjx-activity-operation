<template>
    <div class="adDetail-wrap">
        <div class="title">广告详情页  
            <el-button type="primary" size="mini" @click="back">关闭</el-button>
        </div>
        <el-form ref="form" :model="form" label-width="130px">
            <el-form-item label="广告位类型" class="w600 border-no">
                <el-input disabled v-model="form.adType"></el-input>  
            </el-form-item>
            <el-form-item label="所属客户端" class="w600">
                <el-input v-model="form.client" disabled></el-input> 
            </el-form-item>
            <el-form-item label="位置编码" class="w600">
                <el-input v-model="form.code" disabled></el-input>  
            </el-form-item>
            <el-form-item label="广告位置" class="w600"> 
                <el-input v-model="form.position" disabled></el-input> 
            </el-form-item>
            <el-form-item label="位置描述" class="w600">
                <el-input type="textarea" :maxlength="200" :autosize="{ minRows: 4, maxRows: 8}" v-model="form.posDesc" disabled></el-input> 
            </el-form-item>
            <el-form-item label="广告素材类型" class="w600">
                <el-radio-group v-model="form.AdresourceType">
                    <el-radio :label="1" v-show="form.AdresourceType=='1'">文字</el-radio>
                    <el-radio :label="2" v-show="form.AdresourceType=='2'">图片</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="" class="w600 pos-rel" v-show="form.AdresourceType == 2">
                <p>
                    尺寸：&nbsp;&nbsp;&nbsp;&nbsp;长 <el-input v-model="form.width" class="w80" disabled></el-input> 像素&nbsp;&nbsp;*&nbsp;&nbsp;高 <el-input v-model="form.height" class="w80" disabled></el-input> 像素
                </p>  
            </el-form-item> 
            <el-form-item label="最多展示素材数量" class="w600">
                <el-input v-model="form.count" disabled></el-input> 
            </el-form-item>
            <el-form-item label="广告状态" v-show="form.adType=='2'">
                <el-radio-group v-model="form.adStatus">
                    <el-radio :label="1" v-show="form.adStatus=='1'">启用</el-radio>
                    <el-radio :label="0" v-show="form.adStatus=='0'">不启用</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="投放时间" v-show="form.adStatus==1">
                <el-radio-group v-model="form.adActiveTime"> 
                    <el-radio :label="1" v-show="form.adActiveTime==1">投放后立即开始</el-radio>
                    <el-radio :label="2" v-show="form.adActiveTime==2">自定义时间</el-radio>
                </el-radio-group>
                <div v-show="form.adActiveTime == 2">
                    <el-date-picker
                        v-model="form.startTime"
                        type="datetime"
                        disabled
                        placeholder="开始日期">
                    </el-date-picker> 
                    <el-date-picker
                        v-model="form.endTime"
                        type="datetime"
                        disabled
                        placeholder="结束日期">
                    </el-date-picker> 
                </div>
            </el-form-item>
            <el-form-item label="已启动广告" class="w600 border-no">
                <el-input v-model="form.runingCount" disabled></el-input> 
            </el-form-item>
            <el-form-item label="操作人" class="w600 border-no">
                <el-input v-model="form.operator" disabled></el-input> 
            </el-form-item>
            <el-form-item label="更新时间" class="w600 border-no">
                <el-input v-model="form.updataTime" disabled></el-input> 
            </el-form-item>   
            <el-form-item> 
                <el-button type="primary" @click="onSubmit" >修改</el-button> 
                <el-button @click="back">取消</el-button>
            </el-form-item>
        </el-form>  
    </div>
</template>
<script>
import api from '@/api/ad'
export default {
    data() {
        return {
            form: {
                adType: '', //广告位类型
                client: '', //客户端
                code: '', //编码
                position: '', //位置
                posDesc: '', //位置描述
                AdresourceType: 1, //广告位类型，1是文字广告，2是图片广告
                width: '', //图片宽度
                height: '', //图片高度
                count: '0', //展示素材数量
                adStatus: 1, //1是启用 0是不启用
                adActiveTime: 1, //如果启用，则存在自定义时间
                startTime: '',
                endTime: '', 
                runingCount: '0', //已启用广告数量
                operator: '张三', //操作人 
                updataTime: '2018.8.8 8:8:8'
            }, 
            
        }
    },
    methods: {  
        showDetail() {
            let params = {
                positionCode: this.$route.query.code
            }
            api.ad_getAdPositionInfo(params).then((res)=>{
                console.log(res)
                if (res._ret != '0') {
                    this.$message(res._errStr)
                    return
                }
                this.form.adType = res.positionInfo.positionType == '1' ?'永久开启':'阶段性开启'
                this.form.client = res.positionInfo.clientName.clientName
                this.form.code = res.positionInfo.positionCode
                this.form.position = res.positionInfo.positionName //位置就是名称
                this.form.posDesc = res.positionInfo.positionDesc  
                this.form.AdresourceType = res.positionInfo.adType
                this.form.width = res.positionInfo.imgWidth
                this.form.height = res.positionInfo.imgHigh 
                this.form.count = res.positionInfo.adNum  
                this.form.adStatus = res.positionInfo.isUse   
                this.form.startTime = res.positionInfo.startTime == 0 ? '' : res.positionInfo.startTime*1000    
                this.form.endTime = res.positionInfo.endTime == 0 ? '' : res.positionInfo.endTime*1000  
                this.form.runingCount = res.positionInfo.effectiveAdNum 
                this.form.operator = res.positionInfo.modifier 
                this.form.updataTime = res.positionInfo.modifyTime  
            })
        },
        back() { //返回和取消
            this.$router.back()
        },
        onSubmit() { //跳到到对应的修改组件  
            this.$router.push({path:'/adPosition/edit', query:{code:this.$route.query.code, from:'detailPage'}})
        }, 
        
    },
    computed: {
        fontCount() { //文本框倒计数
            return this.form.posDesc.length
        } 
    }, 
    mounted() {   
        this.showDetail()  
    }
}

</script>
<style>
.adDetail-wrap .el-dialog__body {
    border-top: 1px solid #ccc;
}
.adDetail-wrap .el-radio+.el-radio {
    margin-left: 0;
}

</style>
<style scoped lang="scss">
.adDetail-wrap {  
    .title {
        text-align: center;
        position: relative;
        button {
            position: absolute;
            right: 0;
            top: 0;
        }
    }
    .stage-time,.forever-time {
        width: 217px;
        background: #fff;
        border: #797979 1px solid;
        color: #000;
    }
    .stage-time {
        margin-right: 20px; 
    }
    .active {
        background: #ccc;
    }
    .tips {
        height: 20px;
        font-size: 12px;
        line-height: 20px;  
        color: #756BB1;
    }  
    .adTextDesc {
        height: 200px;
    }
    .w80 {
        width: 100px;
    }
    .w600 {
        width: 600px;
    }
    .w500 {
        width: 500px;
    }
    .w300 {
        width: 300px;
    }
    .w470 {
        width: 470px;
    }
    .w220 {
        width:217px;
    }
    .mt30 {
        margin-bottom: 30px;
    } 
    .pos-rel {
        position: relative;
    } 
    .border-no {
        border: 0px solid transparent;
    }
    .control-font-count {
        position: absolute;
        right: 0;
        top: 0;
    } 
}

</style>
