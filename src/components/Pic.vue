<template>
    <div :class="'pic-wrap'" ref="picWrap" :data-mode="mode">
        <img v-if="!loaded" :src="placeholder" class="placeholder" />
        <transition name="fade">
            <img v-if="loaded" :src="loadedSrc" class="image" :data-ratio="ratio" />
        </transition>
        <slot></slot>
    </div>
</template>
<script>
import lazyload from '../utils/lazy';

export default {
    props: {
        // 加载的图片src地址
        src: {
            type: String,
            default: null,
        },
        // 加载前占位图
        placeholder: {
            type: String,
            default: null,
        },
        // 长宽比，占位用
        ratio: {
            type: Number,
            default: 0,
        },
        // 加载后自动调整大小。默认false，加载后如果超过占比overflow:hidden
        autofit: {
            type: Boolean,
            default: false,
        },
        //
        autoload: {
            type: Boolean,
            default: false,
        },
        // auto: 宽度100%，cover：覆盖容器  contains： 确保完全展示
        mode: {
            type: String,
            default: 'auto',
        },
    },
    data() {
        return {
            loaded: false,
            loadedSrc: null,
        };
    },
    created() {
    },
    mounted() {
        this.checkHeight();
        lazyload.addLazyItem(this);
        this.autoload && this.load();

        window.addEventListener('resize', this.checkHeight);
    },
    updated() {
        this.checkHeight();
        lazyload.addLazyItem(this);
    },
    watch: {
        src(value, oldValue) {
            if(oldValue !== value || !value) {
                this.loaded = false;
                this.loadedSrc = null;
            }
        },
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.checkHeight);
        lazyload.removeLazyItem(this);
    },
    methods: {
        checkHeight() {
            if(!this.$refs.picWrap){
                return;
            }
            if(this.loaded && this.autofit) {
                this.$refs.picWrap.style.height = 'auto';
            }
            else if(this.ratio) {
                this.$refs.picWrap.style.height = `${this.$refs.picWrap.clientWidth / this.ratio}px`;
                // this.$refs.picWrap.style.height = `${this.$refs.picWrap.clientWidth / this.ratio / window.innerWidth * 100}vw`;
            }
        },
        load() {
            if(!this.src) {
                return;
            }
            let src = this.optimize(this.src);

            let i = new Image();
            i.onload = () => {
                this.loaded = true;
                lazyload.removeLazyItem(this);
                this.loadedSrc = src;
                this.$emit('load');
            };
            i.onerror = () => {
                this.loaded = true;
                lazyload.removeLazyItem(this);
                this.$emit('error');
            }
            i.src = src;
        },
        // 图床特有优化，获取
        optimize(src){
            let targetSrc = src;
            return targetSrc;
        },
    },
};
</script>
<style lang="scss" scoped>
.pic-wrap{
    position: relative;
    overflow: hidden;
}
.placeholder{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-height: 100%;
    max-width: 100%;
}
img{
    display: block;
}
[data-mode="auto"] .image{
    width: 100%;
}
[data-mode="cover"] .image{
    min-width: 100%;
    min-height: 100%;
}
[data-mode="contain"] .image{
    max-width: 100%;
    max-height: 100%;
}
.slot-content{
    position: absolute;
    left: 0;
    top: 0;
}
.fade-enter-active, .fade-leave-active {
    transition: opacity .5s ease 0s;
}
.fade-enter, .fade-leave-to {
    opacity: 0;
}
</style>
