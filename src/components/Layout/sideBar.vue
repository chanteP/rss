<template>
    <div class="sidebar-wrap">
        <div class="float-menu" v-if="mobileMode" :data-show="+show" @click="$store.dispatch('sidebar/toggle')">
            <a-icon :type="!show ? 'appstore' : 'appstore-o'" />
        </div>
        <transition name="spread">
            <a-menu
                v-if="ready && (show || !mobileMode)"
                :style="`min-width:${size};`"
                class="sidebar"
                :defaultSelectedKeys="currentOpen"
                :defaultOpenKeys="currentOpen"
                :mode="mode"
                :theme="theme"
                ref="menu"
            >
                <a-menu-item key="/" @click="go('/')">
                    <a-icon type="smile-o" />全部
                </a-menu-item>

                <template v-for="menu in category">
                    <a-menu-item :key="menu.name" v-if="!menu.children || !menu.children.length" @click="go(`/category/${menu.name}/${encode(menu.source)}`)">
                        <a-icon :type="menu.icon || 'paper-clip'" />
                        {{menu.name}}
                        <a-tag color="orange" class="tag-count" v-if="countMap.get(menu)">{{countMap.get(menu)}}</a-tag>
                    </a-menu-item>
                    
                    <a-sub-menu :key="menu.name" v-else>
                        <span slot="title"><a-icon :type="menu.icon || 'tags-o'" />
                            <span>{{menu.name}}</span>
                            <a-tag color="orange" class="tag-count" v-if="countMap.get(menu)">{{countMap.get(menu)}}</a-tag>
                        </span>
                        <template v-for="childMenu in menu.children">
                            <a-menu-item :key="childMenu.name" @click="go(`/category/${menu.name}/${childMenu.name}/${encode(childMenu.source)}`)">
                                {{childMenu.name}}
                                <a-tag color="orange" class="tag-count" v-if="countMap.get(childMenu)">{{countMap.get(childMenu)}}</a-tag>
                            </a-menu-item>
                        </template>
                    </a-sub-menu>
                </template>

                <a-menu-item key="/star" @click="go('/star')">
                    <a-icon type="star-o"/>收藏
                </a-menu-item>
                <a-menu-item key="/setting" @click="go('/setting')">
                    <a-icon type="setting" />设置
                </a-menu-item>
            </a-menu>
        </transition>
    </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
import queryString from 'query-string';

export default {
    props: ['size'],
    data() {
        return {
            currentOpen: [this.$route.params.category || this.$route.fullPath || '/', this.$route.params.subCategory].filter(d => typeof d === 'string'),
            mode: 'inline',
            theme: 'light',
            ready: false,
        };
    },
    computed: {
        ...mapState({
            category: state => state.sidebar.configs.menus,
            countMap: state => state.sidebar.countMap,
            mobileMode: state => state.mobileMode,
            show: state => state.sidebar.show,
        }),
    },
    created(){},
    async mounted(){
        document.body.appendChild(this.$el);
        await this.$store.dispatch('sidebar/fetchConfigs');
        this.ready = true;
    },
    methods: {
        encode: window.encodeURIComponent,
        go(path){
            this.$router.push(path);
            this.mobileMode && this.$store.dispatch('sidebar/toggle');
        },
    }
}
</script>
<style lang="scss">
.mobileMode .sidebar{
    width: 100vw;
}
.ant-menu-sub.ant-menu-inline{
    background: #f0f0f0;
}
</style>
<style lang="scss" scoped>
.float-menu{
    position: fixed;
    bottom: 0;
    left: 0;
    padding: 17px 20px 10px 15px;
    border-radius: 0 80% 0 0;
    background: #fff;
    box-shadow: rgba(188,188,188,.4) 0 0 30px;
    font-size: 20px;
    z-index: 1;
    &[data-show="1"]{
        box-shadow: rgba(255,255,255,.4) 0 0 30px;
    }
}
.sidebar-wrap{
    position: fixed;
    height: 100vh;
    top: 0;
    bottom: 0;
    left: 0;
    box-sizing: border-box;
}
.sidebar{
    height: 100vh;
    overflow-x: hidden;
    overflow-y: auto;
}

.spread-enter-active, .spread-leave-active {
    transition: all .2s ease 0s;
    transform: translate(0, 0);
}
.spread-enter, .spread-leave-to {
    transform: translate(0, 100%);
}
.tag-count{
    transform: scale(.7);
}
</style>