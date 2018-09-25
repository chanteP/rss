<template>
    <div class="sidebar-wrap">
        <a-menu
            :style="`width:${size};`"
            class="sidebar"
            :defaultSelectedKeys="['home']"
            :mode="mode"
            :theme="theme"
        >
            <a-menu-item key="home" @click="loadAll">
                <a-icon type="mail" />全部
            </a-menu-item>

            <template v-for="menu in category">
                <a-menu-item :key="menu.name" v-if="!menu.children" @click="$store.dispatch('content/fetchList', menu.source)">
                    <a-icon :type="menu.icon || 'paper-clip'" />
                    {{menu.name}}
                </a-menu-item>
                
                <a-sub-menu :key="menu.name" v-else>
                    <span slot="title"><a-icon :type="menu.icon || 'tags-o'" /><span>{{menu.name}}</span></span>
                    <template v-for="childMenu in menu.children">
                        <a-menu-item :key="menu.name + '|||' + childMenu.name" @click="$store.dispatch('content/fetchList', childMenu.source)">{{childMenu.name}}</a-menu-item>
                    </template>
                </a-sub-menu>
            </template>

            <!-- <a-menu-item key="config">
                <a-icon type="setting" />Config
            </a-menu-item> -->
        </a-menu>
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
        }),
    },
    created(){},
    async mounted(){
        document.body.appendChild(this.$el);
        await this.$store.dispatch('sidebar/fetchConfigs', {
            sourceUrl: decodeURIComponent(queryString.parse(window.location.search).url || ''),
        });
        this.loadAll();
    },
    methods: {
        loadAll(){
            let menus = [];
            this.category.forEach(c => {
                c.source && menus.push(c.source);
                c.children && c.children.forEach(cc => {
                    cc.source && menus.push(cc.source);
                })
            });
            this.$store.dispatch('content/fetchAll', menus);
        },
    }
}
</script>
<style lang="scss" scoped>
.sidebar-wrap{
    position: fixed;
    height: 100vh;
    top: 0;
    bottom: 0;
    left: 0;
    box-sizing: border-box;
    overflow: hidden;
}
.sidebar{
    height: 100vh;
}
</style>