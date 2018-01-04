<template>
    <div class="label clear">
        <span class="left fl"></span>
        <span class="right fl hjx-font14"> &nbsp;{{label}}</span>
        <slot></slot>
    </div>
</template>
<script type="text/javascript">
export default {
    name:'hjxLeftTitle',
    data() {
        return {}
    },
    props: {
        label: {
            type: String,
            required: true
        }
    },
    methods: {
        
    }
}

</script>
<style type="text/css" scoped="scoped">
    .left{width:3px;height:100%;background: #878d99}
    .right{height:100%;color: #878d99;font-size: 15px}
    /*.right{width:90px;height:100%;background: #f3f4f5;color: #878d99}*/
	.label{
		margin: 18px auto 12px auto;
        height: 20px;
        line-height: 20px;
	}
</style>
