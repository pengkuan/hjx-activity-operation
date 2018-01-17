<template>
    <div class="addNewAd-wrap" v-loading="loading">
        <div class="title">添加广告位
            <el-button type="primary" size="mini" @click="back">关闭</el-button>
        </div>
        <el-form ref="form" :model="form" label-width="130px">
            <el-form-item label="广告类型" class="w600 border-no">
                <el-button type="primary" class="stage-time" :class="{'active':form.positionType==1}" @click="form.positionType=1">阶段时间开启</el-button>
                <el-button type="primary" class="forever-time" :class="{'active':form.positionType==2}" @click="form.positionType=2">永久开启</el-button> 
            </el-form-item>
            <el-form-item label="所属客户端" class="w600">
                <el-select v-model="form.clientName" placeholder="请选择所属客户端">
                    <el-option :label="item.clientName" :value="item.clientId" v-for="(item,index) in form.clientList" :key="index"></el-option> 
                </el-select> 
            </el-form-item>
            <el-form-item label="位置编码" class="w600">
                <el-input v-model="form.positionCode" placeholder="请输入位置编码" :maxlength="200"></el-input>
                <div class="tips">最多200个字符</div>
            </el-form-item>
            <el-form-item label="广告位置" class="w600"> 
                <el-input v-model="form.positionName" placeholder="请输入广告位置" :maxlength="20"></el-input>
                <div class="tips">最多20个字符</div> 
            </el-form-item>
            <el-form-item label="位置描述（选填）" class="w600">  
                <el-input type="textarea" :maxlength="200" :autosize="{ minRows: 4, maxRows: 8}" v-model="form.positionDesc" placeholder="请输入位置描述"></el-input>
                <div class="tips pos-rel">最多200个字符</span></div>
            </el-form-item>
            <el-form-item label="广告素材类型" class="w600">
                <el-radio-group v-model="form.adType">
                    <el-radio :label="1">文字</el-radio>
                    <el-radio :label="2">图片</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="" class="w600 pos-rel" v-show="form.adType == 2">
                <p>
                    尺寸：&nbsp;&nbsp;&nbsp;&nbsp;长 <el-input v-model.number="form.imgWidth" type="number" class="w80" placeholder="请输入"></el-input> 像素&nbsp;&nbsp;*&nbsp;&nbsp;高 <el-input v-model.number="form.imgHigh" type="number" class="w80" placeholder="请输入"></el-input> 像素
                </p>  
            </el-form-item> 
            <el-form-item label="最多展示素材数量" class="w600">
                <el-select v-model="form.adNum" placeholder="请选择素材数量">
                    <el-option :label="item" :value="item" v-for="(item,index) in form.adNumList" :key="index"></el-option>  
                </el-select> 
            </el-form-item>
            <el-form-item label="广告状态" v-show="form.positionType==1">
                <el-radio-group v-model="form.isUse">
                    <el-radio :label="1">启用</el-radio>
                    <el-radio :label="0">不启用</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="投放时间" v-show="form.positionType==1 && form.isUse=='1'">
                <el-radio-group v-model="form.useType">
                    <el-radio :label="1">投放后立即开始</el-radio>
                    <el-radio :label="2">自定义时间</el-radio>
                </el-radio-group>
                <div v-show="form.useType == '2'"> 
                    <el-date-picker
                        v-model="form.startTime"
                        type="datetime"
                        placeholder="开始日期">
                    </el-date-picker> 
                    <el-date-picker
                        v-model="form.endTime"
                        type="datetime"
                        placeholder="结束日期">
                    </el-date-picker> 
                </div>
            </el-form-item>   
            <el-form-item>
                <el-button type="primary" @click="onSubmit" v-show="form.positionType==1">确认添加</el-button>
                <el-button type="primary" @click="onSubmit_next" v-show="form.positionType==2">下一步，添加默认广告</el-button>
                <el-button @click="back">取消</el-button>
            </el-form-item>
        </el-form>  
    </div>
</template>
<script>
import api from '@/api/ad'
import util from '@/util'
export default {
    data() {
        return {
            form: {
                positionType: 1, //广告类型 1是阶段开启，2是永久开启，新建广告位时不传，因为接口是分开的
                clientName: '', //客户端
                clientList: [], //客户端列表
                positionCode: '', //编码
                positionName: '', //位置
                positionDesc: '', //位置描述
                adType: 1, //广告素材类型，1是文字广告，2是图片广告
                imgWidth: '', //图片宽度
                imgHigh: '', //图片高度
                adNum: '1', //展示素材数量
                adNumList: 9, //展示素材数量,固定为9
                isUse: 1, //1是启用 0是不启用
                useType: 1, //1是立即生效 2是自定义时间  
                startTime: null, //直接传数字时间戳，或者空字符串，不能是字符串 开始时间
                endTime: null, //直接传数字时间戳，或者空字符串，不能是字符串 结束时间  
            },  
            loading: false,
        }
    },
    methods: {  
        validata() {
            if (!this.form.clientName) {
                this.$message.error('所属客户端不能为空')
                return false
            }
            if (!this.form.positionCode) {
                this.$message.error('位置编码不能为空') 
                return false 
            }
            if (/[\u4e00-\u9fa5]+/.test(this.form.positionCode)) {
                this.$message.error('位置编码不能包含中文') 
                return false   
            } 
            if (this.form.positionCode.gblen() > '200') {
                this.$message.error('位置编码最多200个字符') 
                return false 
            }  
            if (!this.form.positionName) {
                this.$message.error('广告位置不能为空') 
                return false 
            }
            if (!/^[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(this.form.positionName)) {
                this.$message.error('广告位置只能输入中文，数字和字母') 
                return false
            } 
            if (this.form.positionName.gblen() > '20') {
                this.$message.error('广告位置最多20个字符') 
                return false 
            }
            if (this.form.positionDesc) {
                // if (!/^[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(this.form.positionDesc)) {
                //     this.$message.error('位置描述只能输入中文，数字和字母') 
                //     return false
                // }
                if (this.form.positionDesc.gblen() > '200') {
                    this.$message.error('位置描述最多200个字符') 
                    return false 
                }
            }  
            if (this.form.adType == '2') {   
                if (!this.form.imgWidth || !this.form.imgHigh) {
                    this.$message.error('图片像素不能为空') 
                    return false 
                } 
                let w = this.form.imgWidth,
                    h = this.form.imgHigh 
                if (!/^[1-9]\d*$/.test(w) || !/^[1-9]\d*$/.test(h)) {
                    this.$message.error('像素只能输入正整数') 
                    return false
                }  
            }
            if (!this.form.adNum) {
                this.$message.error('素材数量不能为空') 
                return false 
            }
            if (this.form.isUse == '1' && this.form.useType == '2') {
                if (!this.form.startTime) {
                    this.$message.error('开始时间不能为空')  
                    return false 
                } 
                if (Date.now() > this.form.startTime.getTime()) {
                    this.$message.error('开始时间不能小于当前北京时间') 
                    return false 
                }
                if (!this.form.endTime) {
                    this.$message.error('结束时间不能为空')  
                    return false 
                }
                if (this.form.endTime - this.form.startTime < 0) {
                    this.$message.error('结束时间不能小于开始时间')  
                    return false
                }
            }   
            return true //都验证ok，返回true
        },
        back() { //返回和取消
            this.$router.back()
        },
        onSubmit() { //阶段性开启
            if (!this.validata()) return  
            let params = {
                clientId: this.form.clientName,
                positionCode: this.form.positionCode,
                positionName: this.form.positionName,
                positionDesc: this.form.positionDesc,
                adNum: this.form.adNum,
                adType: this.form.adType,
                imgWidth: this.form.imgWidth,
                imgHigh: this.form.imgHigh,
                isUse: this.form.isUse,
                useType: this.form.useType,
                startTime: '',
                endTime: ''
            }
            params.startTime = this.form.startTime != null ? Math.floor(this.form.startTime.getTime()/1000): '' 
            params.endTime = this.form.endTime != null ? Math.floor(this.form.endTime.getTime()/1000): ''  
            this.loading = true
            api.ad_addAdPositionDeadline(params).then((res)=> {
                this.loading = false
                if (res._ret != '0') {
                    this.$message.error(res._errStr)
                    return
                }
                this.$message({
                    type: 'success', 
                    message: '添加成功!'
                })
                this.$router.push({path: '/adPosition/adPosSet'})
            })
        },
        onSubmit_next() { //如果是永久开启，需要添加一个默认广告
            if (!this.validata()) return  
            let params = {
                clientId: this.form.clientName,
                positionCode: this.form.positionCode,
                positionName: this.form.positionName,
                positionDesc: this.form.positionDesc,
                adNum: this.form.adNum,
                adType: this.form.adType,
                imgWidth: this.form.imgWidth,
                imgHigh: this.form.imgHigh,
                isUse: this.form.isUse,
                useType: this.form.useType,
                startTime: '',
                endTime: ''
            }
            params.startTime = this.form.startTime != null ? Math.floor(this.form.startTime.getTime()/1000): '' 
            params.endTime = this.form.endTime != null ? Math.floor(this.form.endTime.getTime()/1000): ''  
            if (this.form.adType == '1') params.imgHigh = '' , params.imgWidth = '' 
            util.Set_lsdata('adParams',params) //本地缓存数据  
            this.$router.push({path: '/commonAdd', query:{from:'adPosition', pagePath:'/adPosition/adPosSet', clientId:params.clientId}})
        },
        clientList() { //获取客户端列表数据
            api.ad_getClient({}).then((res)=>{
                if (res._ret != '0') {
                    this.$message.error(res._errStr)
                    return
                }
                this.form.clientList = res.clientList

            })
        },
    },
    computed: {
        fontCount() { //文本框倒计数 
            return this.form.positionDesc.gblen()
        } 
    }, 
    watch: { 
    },
    mounted() { 
        this.clientList()  
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
        // margin-right: 20px; 
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
    .w475 {
        width: 475px;
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
