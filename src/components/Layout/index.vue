<template>
    <div class="main-wrap">
        <sidebar :class="{mobileMode}" :size="sidebarWidth" />
        <top-nav :class="{mobileMode}" :size="topNavHeight" :style="`left:${sidebarWidth};height:${topNavHeight};`" />
        <div class="content" :style="`margin-left:${sidebarWidth};margin-top:${topNavHeight};`" >
            <Loading v-if="isLoading" />
            <transition v-show="!isLoading" name="fade">
                <slot></slot>
            </transition>
        </div>
    </div>
</template>
<script>
import sidebar from './sideBar';
import topNav from './topNav';
import {mapState} from 'vuex';

export default {
    components: {
        sidebar,
        topNav,
    },
    data(){
        return {
            // topNavHeight: '45px',
            topNavHeight: '0',
        };
    },
    computed: {
        sidebarWidth(){
            return !this.mobileMode ? '225px': '0';
        },
        ...mapState({
            isLoading: state => state.isLoading,
            sidebarShow: state => state.sidebar.show,
            mobileMode: state => state.mobileMode,
        }),
    },
    created(){},
    mounted(){
    },
    methods: {
    }
}
</script>
<style lang="scss" scoped>
.main-wrap{
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}
.content{
    position: relative;
    min-height: 100vh;
}
.fade-enter-active, .fade-leave-active {
    transition: opacity .2s ease 0s;
}
.fade-enter, .fade-leave-to {
    opacity: 0;
}
</style>