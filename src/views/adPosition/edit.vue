<template>
    <div class="addNewAd-wrap">
        <div class="title">修改广告位
            <el-button type="primary" size="mini" @click="back">关闭</el-button>
        </div>
        <el-form ref="form" :model="form" label-width="130px">
            <el-form-item label="广告类型" class="w600 border-no">
                <el-input v-model="form.positionType" disabled></el-input> 
            </el-form-item>
            <el-form-item label="所属客户端" class="w600">
                <el-input v-model="form.clientName" disabled></el-input> 
            </el-form-item>
            <el-form-item label="位置编码" class="w600">
                <el-input v-model="form.positionCode" disabled></el-input>  
            </el-form-item>
            <el-form-item label="广告位置" class="w600"> 
                <el-input v-model="form.positionName" :maxlength="20" placeholder="请输入广告位置"></el-input>
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
                    尺寸：&nbsp;&nbsp;&nbsp;&nbsp;长 <el-input v-model="form.imgWidth" class="w80" placeholder="请输入" ></el-input> 像素&nbsp;&nbsp;*&nbsp;&nbsp;高 <el-input v-model="form.imgHigh" class="w80" placeholder="请输入" ></el-input> 像素
                </p>  
            </el-form-item> 
            <el-form-item label="最多展示素材数量" class="w600">
                <el-select v-model="form.adNum" placeholder="">
                    <el-option :label="item" :value="item" v-for="(item,index) in form.adNumList" :key="index"></el-option>  
                </el-select> 
            </el-form-item>
            <el-form-item label="广告状态" v-show="form.positionType=='阶段性开启'">
                <el-radio-group v-model="form.isUse">
                    <el-radio :label="1">启用</el-radio>
                    <el-radio :label="0">不启用</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="投放时间" v-show="form.isUse==1">
                <el-radio-group v-model="form.useType">
                    <el-radio :label="1">投放后立即开始</el-radio>
                    <el-radio :label="2">自定义时间</el-radio>
                </el-radio-group>
                <div v-show="form.useType == 2"> 
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
            <el-form-item label="已启动广告" class="w600 border-no">
                <el-input v-model="form.effectiveAdNum" disabled></el-input> 
            </el-form-item>
            <el-form-item label="操作人" class="w600 border-no">
                <el-input v-model="form.modifier" disabled></el-input> 
            </el-form-item>
            <el-form-item label="更新时间" class="w600 border-no">
                <el-input v-model="form.modifyTime" disabled></el-input> 
            </el-form-item>   
            <el-form-item> 
                <el-button type="primary" @click="onSubmit" :disabled="needChange">确认修改</el-button> 
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
                positionType: '', //广告类型
                clientName: '', //客户端
                positionCode: '', //编码
                positionName: '', //位置
                positionDesc: '', //位置描述
                adType: 1, //广告类型
                imgWidth: '', //图片宽度
                imgHigh: '', //图片高度
                adNum: 0, //展示素材数量,用于取值
                adNumList: 9, //展示素材数量,用于循环
                isUse: 1, //1是启用 0是不启用
                effectiveAdNum: 0, //启用广告位的数量
                useType: 1, //1是立即生效 2是自定义时间 
                startTime: '', //直接传数字时间戳，或者空字符串，不能是字符串 开始时间
                endTime: '',  //直接传数字时间戳，或者空字符串，不能是字符串 结束时间
                modifier: '', //修改人
                modifyTime: '' //修改时间
            },  
            needChange: false,
        }
    },
    methods: { 
        showDetail() { //获取数据
            let params = {
                positionCode: this.$route.query.code
            }
            api.ad_getAdPositionInfo(params).then((res)=>{
                console.log(res)
                if (res._ret != '0') {
                    this.$message(res._errStr)
                    return
                }
                this.form.positionType = res.positionInfo.positionType == '1' ?'永久开启':'阶段性开启'
                this.form.clientName = res.positionInfo.clientName.clientName
                this.form.positionCode = res.positionInfo.positionCode
                this.form.positionName = res.positionInfo.positionName //位置就是名称
                this.form.positionDesc = res.positionInfo.positionDesc  
                this.form.adType = res.positionInfo.adType
                this.form.imgWidth = res.positionInfo.imgWidth == '0' ? '' : res.positionInfo.imgWidth
                this.form.imgHigh = res.positionInfo.imgHigh == '0' ? '' : res.positionInfo.imgHigh
                this.form.adNum = res.positionInfo.adNum    
                this.form.isUse = res.positionInfo.isUse   
                this.form.useType = res.positionInfo.useType //永久开启，就没有使用类型
                this.form.startTime = res.positionInfo.startTime == 0 ? '' : res.positionInfo.startTime*1000
                this.form.endTime = res.positionInfo.endTime == 0 ? '' : res.positionInfo.endTime*1000 
                this.form.effectiveAdNum = res.positionInfo.effectiveAdNum 
                this.form.modifier = res.positionInfo.modifier 
                this.form.modifyTime = res.positionInfo.modifyTime  
            })
        }, 
        back() { //返回和取消
            if (this.$route.query.from == 'detailPage') {
                this.$router.push('/adPosition/adPosSet')
            } else {
                this.$router.back()
            }
            
        },
        onSubmit() { // 修改广告位
            if (!this.form.positionName) {
                this.$message.error('广告位置不能为空')
                return
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
                if (this.form.positionDesc.gblen() > '200') {
                    this.$message.error('位置描述最多200个字符') 
                    return false 
                }
            } 
            if (this.form.adType == 2) {
                if (!this.form.imgWidth || !this.form.imgHigh) {
                    this.$message.error('图片像素不能为空或0') 
                    return false 
                }
                if (!/^[1-9]\d*$/.test(Number(this.form.imgWidth)) || !/^[1-9]\d*$/.test(Number(this.form.imgHigh))) {
                    this.$message.error('像素只能输入正整数') 
                    return false
                } 
            }
            if (this.form.isUse == '1' && this.form.useType == '2') {
                if (!this.form.startTime) {
                    this.$message.error('开始时间不能为空')  
                    return false 
                }  
                if (Date.now() > this.form.startTime) {
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
            let params = { 
                positionCode: this.form.positionCode,
                positionName: this.form.positionName,
                positionDesc: this.form.positionDesc,
                adNum: this.form.adNum,
                imgWidth: this.form.imgWidth,
                imgHigh: this.form.imgHigh,
                isUse: this.form.isUse,
                useType: this.form.useType,
                startTime: '',
                endTime: '' 
            }
            // console.log(this.form.startTime)
            // return
            params.startTime = this.form.startTime != '' ? Math.floor(this.form.startTime/1000): this.form.startTime
            params.endTime = this.form.endTime != '' ? Math.floor(this.form.endTime/1000): this.form.endTime 
            api.ad_editAdPosition(params).then((res)=>{
                console.log(res)
                if (res._ret != '0') {
                    this.$message.error(res._errStr)
                    return
                } 
                this.$message({
                    type: 'success',
                    message: '修改成功!'
                }) 
                this.$router.push('/adPosition/adPosSet')
            })
        }, 
    },
    computed: {
        fontCount() { //文本框倒计数
            return this.form.positionDesc.gblen()
        }, 
    }, 
    watch: { 
        ['form.effectiveAdNum'](val) {
            if (val > '0') this.needChange = true
        }
    },
    mounted() {  
        // console.log(this.$route.query.item)
        this.showDetail() 
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
