<template>
    <div>
        <sidebar :size="sidebarWidth" />
        <top-nav :size="topNavHeight" :style="`left:${sidebarWidth};height:${topNavHeight};`" />
        <contentArticle :style="`margin-left:${sidebarWidth};height:${topNavHeight};`" />
    </div>
</template>
<script>
import sidebar from './sideBar';
import topNav from './topNav';
import contentArticle from './content';

export default {
    components: {
        sidebar,
        topNav,
        contentArticle,
    },
    data(){
        return {
            sidebarWidth: '225px',
            // topNavHeight: '45px',
            topNavHeight: '0',
        };
    },
    created(){},
    mounted(){
    },
    methods: {
    }
}
</script>
<style lang="scss" scoped>
</style>