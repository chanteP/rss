<template>
    <div class="content-wrap">
        <div v-if="!isLoading && !list.length" class="empty-tips">这里啥都没有</div>
        <div class="cardbox" :class="{flexbox: !mobileMode}">
            <News v-for="(news, index) in list" :key="`${news.from}_${news.url}_${index}`" :news="news" />
        </div>
    </div>
</template>
<script>
import {mapState} from 'vuex';
import News from '../../components/News';
import Loadmore from '../../components/Loadmore';

export default {
    components: {
        News,
        Loadmore,
    },
    data(){
        return {
        };
    },
    computed: {
        ...mapState({
            isLoading: state => state.isLoading,
            list: state => state.content.list,
            url: state => state.content.url,
            mobileMode: state => state.mobileMode,
            category: state => state.sidebar.configs.menus,
        }),
    },
    watch: {
        category(){
            this.checkFetch(this.$route);
        },
        $route(to, from){
            this.checkFetch(to);
        },
        list(){
            document.documentElement.scrollTop = document.body.scrollTop = 0;
        },
    },
    created(){},
    mounted(){
    },
    methods: {
        checkFetch(route){
            route.params.source ? 
                this.fetchData(route.params.source) :
                this.fetchAll();
        },
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
        },
    }
}
</script>
<style lang="scss" scoped>
.content-wrap{
}
.cardbox{
    padding: 5px;
}
.cardbox.flexbox{
    display: flex;
    flex-wrap: wrap;
}
.empty-tips{
    line-height: 100px;
    color: #999;
    text-align: center;
    font-size: 12px;
}
</style>