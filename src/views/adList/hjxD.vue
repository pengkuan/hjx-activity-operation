<template>
    <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="用户管理" name="first">
            <input type="text" v-model="msg">
            {{aa}} <br>
            {{bb}}
        </el-tab-pane>
        <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
        <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
        <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
    </el-tabs>
</template>
<script>
export default {
    data() {
        return {
            msg: '1',
            activeName: 'second'
        };
    },
    methods: {
        handleClick(tab, event) {
            console.log(tab, event);
        }
    },
    computed:{
        aa() {
            return this.msg + 1
        },
        bb() {
            return this.msg + 2
        }
    }
};

</script>
