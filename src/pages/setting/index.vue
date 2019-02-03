<template>
    <div class="setting-wrap">
        <h2>
            感谢
            <a href="https://docs.rsshub.app/#%E9%B8%A3%E8%B0%A2" target="_blank">RSSHub</a>
            & 
            <a href="https://tangjinzhou.gitee.io/ant-design-vue/components/icon-cn/" target="_blank">ant-design-vue</a>
        </h2>
        <p>图标见</p>
        <a-collapse defaultActiveKey="menuSetting">
            <a-collapse-panel key="menuSetting" header="菜单配置修改">
                <menuSetting />
            </a-collapse-panel>
        </a-collapse>
    </div>
</template>
<script>
import {mapState} from 'vuex';
import menuSetting from './menu';

export default {
    components: {
        menuSetting,
    },
    data(){
        return {
        };
    },
    computed: {
        ...mapState({
        }),
    },
    watch: {
    },
    created(){},
    mounted(){
    },
    methods: {
        
    }
}
</script>
<style lang="scss" scoped>
.setting-wrap{
    padding: 10px;
}
</style>