<template>
    <div>
    	<p class="label hjx-lightblack hjx-ft16">{{label}}</p>
    </div>
</template>
<script type="text/javascript">
export default {
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
	.label{
		border-bottom: 1px solid #eee;
		margin: 8px auto;
		padding-bottom: 8px;
		font-weight: 600

	}
</style>
