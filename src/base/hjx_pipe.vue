<template>
    <div class="label">
        <span class="hjx-fl">【{{strF1}}】{{strF2}}</span>
        <span class="hjx-fr"><slot></slot></span>
    </div>
</template>
<script type="text/javascript">
export default {
    name:'hjxPipe',
    data() {
        return {}
    },
    props: {
        strF1: {type: String},
        strF2: {type: String}
    }
}

</script>
<style type="text/css" scoped="scoped">
	.label{
		margin: 8px auto;
        overflow: hidden;
        line-height: 20px;
        border-bottom: 1px dashed #eee;
        color: #878d99;
        font-size: 13px;
	}
</style>
