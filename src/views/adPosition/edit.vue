<template>
    <div class="addNewAd-wrap">
        <div class="title">修改广告位
            <el-button type="primary" size="mini" @click="back">关闭</el-button>
        </div>
        <el-form ref="form" :model="form" label-width="130px">
            <el-form-item label="广告类型" class="w600 border-no">
                <el-input v-model="form.adType" disabled></el-input> 
            </el-form-item>
            <el-form-item label="所属客户端" class="w600">
                <el-input v-model="form.client" disabled></el-input> 
            </el-form-item>
            <el-form-item label="位置编码" class="w600">
                <el-input v-model="form.code" disabled></el-input>  
            </el-form-item>
            <el-form-item label="广告位置" class="w600"> 
                <el-input v-model="form.position" placeholder="请填写广告所在的位置名称"></el-input>
                <div class="tips">最多20个字符</div> 
            </el-form-item>
            <el-form-item label="位置描述（选填）" class="w600">
                <el-input type="textarea" :maxlength="200" :autosize="{ minRows: 4, maxRows: 8}" v-model="form.posDesc"></el-input>
                <div class="tips pos-rel">支持中文、数字、字母<span class="control-font-count">{{fontCount}}/200</span></div>
            </el-form-item>
            <el-form-item label="广告素材类型" class="w600">
                <el-radio-group v-model="form.AdresourceType">
                    <el-radio :label="0">文字</el-radio>
                    <el-radio :label="1">图片</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="" class="w600 pos-rel" v-show="form.AdresourceType == 1">
                <p>
                    尺寸：&nbsp;&nbsp;&nbsp;&nbsp;长 <el-input v-model="form.width" class="w80"></el-input> 像素&nbsp;&nbsp;*&nbsp;&nbsp;高 <el-input v-model="form.height" class="w80"></el-input> 像素
                </p>  
            </el-form-item> 
            <el-form-item label="最多展示素材数量" class="w600">
                <el-select v-model="form.count" placeholder="请选择活动区域">
                    <el-option label="1" value="shanghai1"></el-option> 
                    <el-option label="2" value="shanghai2"></el-option> 
                    <el-option label="3" value="shanghai3"></el-option> 
                </el-select> 
            </el-form-item>
            <el-form-item label="广告状态">
                <el-radio-group v-model="form.adStatus">
                    <el-radio :label="0">启用</el-radio>
                    <el-radio :label="1">不启用</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="投放时间" v-show="form.adStatus==0">
                <el-radio-group v-model="form.adActiveTime">
                    <el-radio :label="0">投放后立即开始</el-radio>
                    <el-radio :label="1">自定义时间</el-radio>
                </el-radio-group>
                <div v-show="form.adActiveTime == 1">
                    <el-date-picker class="w500" 
                    v-model="form.timeRange" 
                    type="datetimerange"   
                    range-separator="至" 
                    start-placeholder="开始日期"  
                    end-placeholder="结束日期"> 
                    </el-date-picker> 
                </div>
            </el-form-item>
            <el-form-item label="更新时间" class="w600 border-no">
                <el-input v-model="form.updataTime" disabled></el-input> 
            </el-form-item>   
            <el-form-item> 
                <el-button type="primary" @click="onSubmit" >确认修改</el-button> 
                <el-button @click="back">取消</el-button>
            </el-form-item>
        </el-form>  
    </div>
</template>
<script>
export default {
    data() {
        return {
            form: {
                adType: '阶段性开启', //广告类型
                client: '广东移动', //客户端
                code: '2000000300004000', //编码
                position: '我的广告位置', //位置
                posDesc: '位置描述', //位置描述
                AdresourceType: 0,
                width: '200', //图片宽度
                height: '400', //图片高度
                count: 3, //展示素材数量
                adStatus: 0, //0是启用 1是不启用
                adActiveTime: 0, //0是立即生效 1是自定义时间 
                timeRange: [new Date(1504454400000), new Date(1513134122000)], //时间段
                updataTime: '2017.8.8 23:23:23'
            }, 
            
        }
    },
    methods: {  
        back() { //返回和取消
            this.$router.back()
        },
        onSubmit() { //阶段性开启

        },
        onSubmit_next() { //如果是永久开启，需要添加一个默认广告，在新增广告的页面统一先调添加广告位接口，再调添加广告接口

        }
    },
    computed: {
        fontCount() { //文本框倒计数
            return this.form.posDesc.length
        } 
    }, 
    watch: { 
    },
    mounted() {   
    }
}

</script>
<style>
.addNewAd-wrap .el-dialog__body {
    border-top: 1px solid #ccc;
}

</style>
<style scoped lang="scss">
.addNewAd-wrap {  
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
