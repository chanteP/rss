<template>
    <div class="content-loading">
        <div class="loading-icon">
            <a-spin />
            <div>加载中</div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {};
    },
    created(){},
    mounted(){},
    methods: {
    }
}
</script>
<style lang="scss" scoped>
.content-loading{
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    max-height: 100vh;
    background: rgba(255,255,255,.6);
    z-index: 999;
}
.loading-icon{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    line-height: 2.4;
    font-size: 12px;
    color:#1890ff;
}
</style>