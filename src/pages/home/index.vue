<template>
    <div class="content-wrap">
        <div class="cardbox" :class="{flexbox: !mobileMode}">
            <a-card class="card" :class="{flex: !mobileMode}" v-for="(news, index) in list" :key="`${news.from}_${news.url}_${index}`" :loading="false" @click="toLink(news.url)">
                <a slot="title">
                    <div class="title-link">{{news.title}}</div>
                    <div class="title-link">
                        <span><a-icon type="tag-o" /> {{news.from}}</span>
                        <span v-if="!!news.author.name"><a-icon type="user" /> {{news.author.name}}</span>
                        <span v-if="!!+news.date_published" ><a-icon type="clock-circle-o"/> {{moment(news.date_published).format('YYYY-MM-DD HH:mm')}}</span>
                    </div>
                </a>
                <Pic v-if="news.image || news.banner_image"
                    :src="news.image || news.banner_image"
                    slot="cover"
                    autofit
                    :ratio="2/1"
                />
                <a slot="extra">
                    <a-icon class="title-link" type="paper-clip" />
                </a>
                <div class="summary-content">{{news.content_text || filter(news.summary)}}</div>
            </a-card>
        </div>
    </div>
</template>
<script>
import {mapState} from 'vuex';
import moment from '../../utils/moment';

export default {
    data(){
        return {};
    },
    computed: {
        ...mapState({
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
        moment,
        filter(text){
            let d = document.createElement('div');
            d.innerHTML = text;
            d.innerHTML = d.textContent;
            return d.textContent.slice(0, 500);
        },
        toLink(url){
            window.open(url, '_blank');
        },
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
    background: #f0f0f0;
    min-height: 100vh;
}
.cardbox.flexbox{
    display: flex;
    flex-wrap: wrap;
}
.card{
    box-sizing: border-box;
    margin: 5px;
}

.card.flex{
    width: 30%;
    flex: 1;
    justify-content: center;
    // box-shadow: rgba(0,0,0,.1) 0 0 10px;
}
@media screen and (max-width: 1200px) {
    .card.flex{
        width: 50%;
    }    
}
.summary-content{
    overflow : hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 6;
    -webkit-box-orient: vertical;
}
.title-link{
    color: #333;
    span{
        display: inline-block;
        margin-right: 4px;
        padding: 0px 6px;
        font-size: 12px;
        background: #f7f7f7;
        font-weight: 100;
        border-radius: 3px;
    }
}
</style>