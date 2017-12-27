<template>
    <div>
        <p>设置有效期</p>
    </div>
</template>
<script>
import api from '@/api/index'
export default {
    data() {
        return {}
    },
    methods: {
        init(){
        	api.get_valid_time({}).then()
        }
    },
    mounted() {
        this.init()
    },
}
</script>


