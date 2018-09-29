<template>
    <div class="sidebar-wrap">
        <div class="float-menu" v-if="mobileMode" :data-show="+show" @click="$store.dispatch('sidebar/toggle')">
            <a-icon :type="!show ? 'appstore' : 'appstore-o'" />
        </div>
        <transition name="spread">
            <a-menu
                v-if="show || !mobileMode"
                :style="`min-width:${size};`"
                class="sidebar"
                :defaultSelectedKeys="['home']"
                :mode="mode"
                :theme="theme"
            >
                <a-menu-item key="home" @click="fetchAll()">
                    <a-icon type="smile-o" />全部
                </a-menu-item>

                <template v-for="menu in category">
                    <a-menu-item :key="menu.name" v-if="!menu.children" @click="fetchData(menu.source)">
                        <a-icon :type="menu.icon || 'paper-clip'" />
                        {{menu.name}}
                    </a-menu-item>
                    
                    <a-sub-menu :key="menu.name" v-else @click="fetchAll(menu.children)">
                        <span slot="title"><a-icon :type="menu.icon || 'tags-o'" /><span>{{menu.name}}</span></span>
                        <template v-for="childMenu in menu.children">
                            <a-menu-item :key="menu.name + '|||' + childMenu.name" @click="fetchData(childMenu.source)">{{childMenu.name}}</a-menu-item>
                        </template>
                    </a-sub-menu>
                </template>

                <!-- <a-menu-item key="config">
                    <a-icon type="setting" />Config
                </a-menu-item> -->
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
            mode: 'inline',
            theme: 'light',
        };
    },
    computed: {
        ...mapState({
            category: state => state.sidebar.configs.menus,
            mobileMode: state => state.mobileMode,
            show: state => state.sidebar.show,
        }),
    },
    created(){},
    async mounted(){
        document.body.appendChild(this.$el);
        await this.$store.dispatch('sidebar/fetchConfigs', {
            sourceUrl: decodeURIComponent(queryString.parse(window.location.search).url || ''),
        });
        this.fetchAll();
    },
    methods: {
        fetchAll(list){
            let menus = [];

            (list || this.category).forEach(function loop(item){
                item.source && menus.push(item.source);
                item.children && item.children.forEach(child => loop(child));
            });

            this.$store.dispatch('content/fetchAll', menus);
        },
        fetchData(source){
            this.$store.dispatch('content/fetchList', source);
            this.mobileMode && this.$store.dispatch('sidebar/toggle');
        },
    }
}
</script>
<style lang="scss">
.mobileMode .sidebar{
    width: 100vw;
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
</style>