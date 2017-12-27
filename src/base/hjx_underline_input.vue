<template>
    <div class="clear underline-container">
        <span class="hjx-left-label hjx-vertical-bottom" v-if="label">{{label}}：</span>
        <input 
            :class="[
                'underline-input',
                {
                    'hjx-disabled':disabled,
                    'hjx-text-center':textCenter,
                }
            ]"
            :type="type"
            @change="handleChange" :index="index" :disabled="disabled"  
            :readonly="readonly" 
            :value="value" @input="$emit('input', $event.target.value)" 
            :placeholder="placeholder" 
            :style=" 'width:'+width+'px'" 
        >
    </div>
</template>



<script type="text/javascript">
export default {
    data() {
        return {
        }
    },
    props: {
        type:String,
        placeholder: String,
        label: String,
        width:[Number,String],
        readonly: Boolean,
        textCenter:Boolean,
        index:Number,
        disabled:Boolean,
        value: {}
    },
    methods:{
        handleChange(event) {
            this.$emit('change', event.target.value,this.index)
        },
    }
}

</script>

<style type="text/css" scoped="scoped">
.underline-container{
    padding-bottom: 8px;
    display: inline-block;
}

.underline-input {
    border-bottom: 1px solid #dbdbdb;
    border-top: 0px;
    border-left: 0px;
    border-right: 0px;
    height: 26px;
    padding: 0 6px;
    color:#5a5e66;
    font-size: 14px;
}
</style>