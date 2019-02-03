<template>
    <div v-if="mobileMode" :class="{'on-view': onShow}"  class="webview-wrap fullscreen">
        <div class="float-back" @click="goback">
            <a-icon type="left" />
        </div>
        <iframe class="web-view fullscreen" :src="viewUrl"></iframe>
    </div>
</template>
<script>
import {mapState} from 'vuex';

export default {
    data(){
        return {
            onShow: false,
            viewUrl: null,
        };
    },
    computed: {
        ...mapState({
            mobileMode: state => state.mobileMode,
        }),
    },
    created(){
        window.$open = this.mobileMode ? this.open : window.open;
        document.body.addEventListener('click', this.checkLink);
        window.addEventListener('pageshow', this.hideNav);
    },
    mounted(){
        document.body.appendChild(this.$el);
    },
    methods: {
        checkLink(e){
            if(!this.mobileMode){
                return;
            }
            let node = e.target;
            while(node){
                if(node.tagName === 'A' && node.href && node.target === 'blank'){
                    e.preventDefault;
                    this.open(node.href);
                    break;
                }
                node = node.parentNode;
            }
        },
        hideNav(){
            document.querySelector('[name="apple-mobile-web-app-capable"]').content = 'yes';
        },
        open(url){
            document.querySelector('[name="apple-mobile-web-app-capable"]').content = 'no';
            window.open(url, '_blank');
            // this.onShow = true;
            // this.viewUrl = url;
        },
        goback(){
            this.onShow = false;
            setTimeout(_ => {
                this.viewUrl = null;
            }, 500);
        },
    },
}
</script>
<style lang="scss" scoped>
.fullscreen{
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
}
.webview-wrap{
    position: fixed;
    transform: translate(100%, 0);
    transition: all .4s ease;
    pointer-events: none;
    &.on-view{
        transform: translate(0, 0);
        pointer-events: auto;
    }
}
.float-back{
    position: absolute;
    top: 10px;
    left: 10px;
    width: 45px;
    height: 45px;
    line-height: 45px;
    border-radius: 100%;
    background: #fff;
    box-shadow: rgba(188,188,188,.4) 0 0 30px;
    font-size: 20px;
    text-align: center;
    z-index: 1;
}
.web-view{
    position: absolute;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    border: none;
    background: #fff;
}
</style>