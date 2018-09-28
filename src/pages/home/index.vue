<template>
    <div>
        <sidebar :class="{mobileMode}" :size="sidebarWidth" />
        <top-nav :class="{mobileMode}" :size="topNavHeight" :style="`left:${sidebarWidth};height:${topNavHeight};`" />
        <contentArticle :style="`margin-left:${sidebarWidth};height:${topNavHeight};`" />
    </div>
</template>
<script>
import sidebar from './sideBar';
import topNav from './topNav';
import contentArticle from './content';
import {mapState} from 'vuex';

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
    computed: {
        ...mapState({
            sidebarShow: state => state.sidebar.show,
            mobileMode: state => state.mobileMode,
        }),
    },
    created(){},
    mounted(){
        if(this.mobileMode){
            this.sidebarWidth = '0';
        }
    },
    methods: {
    }
}
</script>
<style lang="scss" scoped>
</style>