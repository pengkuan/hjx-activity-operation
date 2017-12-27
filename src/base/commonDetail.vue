<template>
    <div class="commonDetail-wrap">
        <div class="title">广告详情
            <el-button type="primary" size="mini" @click="back">关闭</el-button>
        </div>
        <el-form ref="form" :model="form" label-width="100px" class="commonDetail-form-wrap">
            <el-form-item label="所属客户端" class="w600 border-no">
                <el-input v-model="form.client" disabled></el-input>
            </el-form-item>
            <el-form-item label="广告位置" class="w600">
                <el-input v-model="form.region" disabled></el-input>
            </el-form-item>
            <el-form-item label="广告标题" class="w600">
                <el-input v-model="form.title" disabled></el-input>
            </el-form-item>
            <el-form-item label="广告素材类型" class="w600">
                <el-radio-group v-model="form.AdresourceType">
                    <el-radio :label="0" v-show="form.AdresourceType=='0'">文字</el-radio>
                    <el-radio :label="1" v-show="form.AdresourceType=='1'">图片</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="广告素材" class="w600 pos-rel" v-show="form.AdresourceType == 1">
                <el-input v-model="form.resource" disabled></el-input>
                <div class="thumbnail">图片缩略图 210*140</div>
            </el-form-item>
            <el-form-item label="广告素材" class="w600" v-show="form.AdresourceType == 0">
                <el-input v-model="form.adTextDesc" disabled></el-input>
            </el-form-item>
            <el-form-item label="广告描述" class="w600">
                <el-input type="textarea" :maxlength="200" disabled :autosize="{ minRows: 4, maxRows: 8}" v-model="form.desc"></el-input>
            </el-form-item>
            <el-form-item label="跳转链接" class="w600">
                <el-radio-group v-model="form.needSrc">
                    <el-radio :label="0" v-show="form.needSrc=='0'">无跳转</el-radio>
                    <el-radio :label="1" v-show="form.needSrc=='1'">超链接</el-radio>
                </el-radio-group>
                <el-input v-model="form.srcAddr" disabled v-show="form.needSrc == 1" placeholder="请输入超链接地址"></el-input>
            </el-form-item>
            <el-form-item label="可见范围" class="w600">
                <el-radio-group v-model="form.range">
                    <el-radio :label="0" v-show="form.range=='0'">全部用户</el-radio>
                    <el-radio :label="1" v-show="form.range=='1'">部分用户</el-radio>
                </el-radio-group>
                <div class="usrs-set" v-show="form.range == 1">
                    <el-row class="mb8">
                        <el-col :span="6" class="text-right">
                            <p>渠道：</p>
                        </el-col>
                        <el-col :span="18">
                            <p class="part-channel-text">
                                包含&nbsp;&nbsp;<span>{{form.rangePart.channel}}</span>等50个渠道
                            </p>
                        </el-col>
                    </el-row>
                    <el-row class="mb8">
                        <el-col :span="6" class="text-right">
                            <p>付款金额：</p>
                        </el-col>
                        <el-col :span="18">
                            <p class="pos-rel">
                                大于等于&nbsp;&nbsp;{{form.rangePart.money}}元
                            </p>
                        </el-col>
                    </el-row>
                </div>
            </el-form-item>
            <el-form-item label="广告状态">
                <el-radio-group v-model="form.adStatus">
                    <el-radio :label="0" v-show="form.adStatus=='0'">生效</el-radio>
                    <el-radio :label="1" v-show="form.adStatus=='1'">不生效</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="投放时间" v-show="form.adStatus==0">
                <el-radio-group v-model="form.adActiveTime">
                    <el-radio :label="1">自定义时间</el-radio>
                </el-radio-group>
                <div v-show="form.adActiveTime == 1">
                    <el-date-picker class="w500" disabled v-model="form.timeRange" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker>    
                </div>
            </el-form-item>
            <el-form-item label="广告排序" class="w600 pos-rel" v-show="form.adStatus==0">
                <el-input v-model="form.adOrder" disabled></el-input>
            </el-form-item>
            <el-form-item label="操作人" class="w600">
                <el-input v-model="form.operator" disabled></el-input>
            </el-form-item>
            <el-form-item label="更新时间" class="w600">
                <el-input v-model="form.updataTime" disabled></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">修改</el-button>
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
                client: '广东移动', //所属客户端
                region: '广告位置', //广告位置
                title: '我的babber', //广告位置
                resource: 'www.baidu.com/img', //广告图片链接
                AdresourceType: 1, //0是文字广告，1是图片广告
                desc: '我是广告描述', //我是广告描述
                fileList: [], //
                needSrc: 1, //0是不需要跳转 1是需要跳转
                srcAddr: 'm.huishoubao.com', //有跳转时的跳转链接
                adTextDesc: '只有中文的描述', //无跳转只有文字的描述
                range: 1, //0是全部 1是部分
                rangePart: { //部分用户数据
                    channel: '华为公司华为公司华为公司华为公司华为公司华为公司华为公司华为公司', // 渠道 
                    money: '8888' // 金额
                },
                adStatus: 0, //0是生效 1是不生效
                adActiveTime: 1, //0是立即生效 1是自定义时间 
                timeRange: [new Date(1504454400000), new Date(1513134122000)], //时间范围,放在form中会报错
                operator: '张三', // 修改人 
                adOrder: '1', //广告排序
                updataTime: '2018.6.6 20:20:20' //更新时间
            }, 
        }
    },
    methods: {
        onSubmit() {//跳转到修改页
            
        },
        back() { 
            this.$router.back()
        }
    },
    computed: {},
    watch: {},
    mounted() {}
}

</script>
<style>
.commonDetail-wrap .el-radio+.el-radio {
    margin-left: 0px;
}
.commonDetail-form-wrap {
    /*padding-left: 200px;*/
} 
</style>
<style scoped lang="scss">
.commonDetail-wrap {  
    .title {
        text-align: center;
        position: relative;
        button {
            position: absolute;
            right: 0;
            top: 0;
        }
    }
    .tips {
        height: 20px;
        font-size: 12px;
        line-height: 20px; // color: #606266;
        color: #756BB1;
    }
    .usrs-set {
        width: 475px;
        min-height: 100px;
        border: 1px solid #DCDFE6;
        padding: 12px;
        background: #F5F7FA;
        border-radius: 4px;
        color: #c0c4cc;
        .part-channel-text {
            span {
                display: inline-block;
                width: 220px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                vertical-align: top;
            }
        }
    }
    .ad-time-set {
        width: 600px;
        height: 100px;
        border: 1px solid #DCDFE6;
        padding: 12px;
        border-radius: 4px;
        color: #606266;
    }
    .adTextDesc {
        height: 200px;
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
    .w100 {
        width: 100px;
    }
    .w188 {
        width: 188px;
    }
    .mt30 {
        margin-bottom: 30px;
    }
    .inline-block {
        display: inline-block;
    }
    .pos-rel {
        position: relative;
    }
    .my-close,
    .my-select-sort {
        position: absolute;
        right: 0;
        top: 0;
        height: 40px;
    }
    .border-no {
        border: 0px solid transparent;
    }
    .control-font-count {
        position: absolute;
        right: 0;
        top: 0;
    }
    .thumbnail {
        width: 210px;
        height: 140px;
        border: 1px solid #ccc;
        position: absolute;
        right: -300px;
        top: -50px;
        background: #ccc;
        text-align: center;
        line-height: 140px;
    }
    .selct-channel {
        position: absolute;
        left: 0;
        top: 0;
        width: 100px;
    }
    .channel-list-test {
        position: absolute;
        left: 210px;
        top: 0;
        width: 250px;
        span {
            display: inline-block;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            max-width: 170px;
            vertical-align: top;
            margin-right: 5px;
        }
    }
    .add-channel {
        position: absolute;
        left: 460px;
        top: 0;
        color: blue;
        cursor: pointer;
    }
    .channell-close {
        position: absolute;
        right: 15px;
        top: 0;
        width: 40px;
        text-align: center;
        cursor: pointer;
    }
    .pay-money {
        position: absolute;
        left: 110px;
        top: 0;
        width: 250px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .add-stroe {
        // left: 110px;
        left: 363px;
        color: blue;
        cursor: pointer;
    }
    .text-right {
        text-align: right;
        padding-right: 10px;
    }
    .mb8 {
        margin-bottom: 8px;
    }
}

</style>
