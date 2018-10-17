<template>
    <div class="load-more">
        <slot v-if="!$slots.loading || !isLoading"></slot>
        <slot name="loading" v-if="$slots.loading && isLoading"></slot>
    </div>
</template>
<script>
/**
 * 下拉加载更多
 * 把这个放在列表底部就行，v-if控制加载完之后消失
 * 如果@load方法返回promise，则promise resolve/reject前不会继续触发
 * @demo <Loadmore :end="isEnd" :fetch="fetchSomethingData" />
 * @slot loading 只有加载中的时候会展示
 */
import lazyload from '../utils/lazy';

export default {
    props: {
        end: {
            type: Boolean,
            default: false,
        },
        /**
         * 预加载偏移，0.5则提前半屏加载
         */
        offset: {
            type: Number,
            default: 0.5,
        },
        fetch: Function,
    },
    data(){
        return {
            lock: false,
            isLoading: false,
        };
    },
    created(){},
    mounted() {
        lazyload.addLazyItem(this);
    },
    beforeDestroy() {
        lazyload.removeLazyItem(this);
    },
    watch: {
        end(){
            //this.end && lazyload.removeLazyItem(this);
        },
    },
    methods: {
        checkInView(el) {
            el = el && el.$el || el;
            if(!el || !el.getBoundingClientRect) { return; }
            let height = window.innerHeight;
            let offset = height * this.offset;
            let rect = el.getBoundingClientRect();
            return rect.top < (window.innerHeight + offset) && rect.bottom >= -offset;
        },
        load(){
            if(this.end || typeof this.fetch !== 'function'){
                return;
            }
            if(this.isLoading || this.lock){return;}
            this.isLoading = true;
            this.lock = true;
            Promise.resolve(this.fetch()).then(_ => {
                this.isLoading = false;
                setTimeout(_ => {
                    this.lock = false;
                    lazyload.checkItem(this);
                }, 1000);
            });
        },
    }
}
</script>
<style lang="scss" scoped>
.load-more{
    min-height: 1px;
    overflow: hidden;
    font-size: .24rem;
    text-align: center;
    color: #999;
}
</style>