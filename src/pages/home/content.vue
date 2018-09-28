<template>
    <div class="content-wrap">
        <div>
            <a-card v-for="news in list" :key="news.id" :loading="false" @click="toLink(news.url)">
                <a slot="title">
                    <div class="title-link">{{news.title}}</div>
                    <div class="title-link">
                        <span>{{news.from}}</span>
                        <span>{{news.author.name || ''}}</span>
                        <span>{{moment(news.date_published).format('YYYY-MM-DD HH:mm')}}</span>
                    </div>
                </a>
                <a slot="extra">
                    <a-icon class="title-link" type="double-right" />
                </a>
                <div class="summary-content">{{filter(news.summary)}}</div>
            </a-card>
        </div>
        <div v-if="isLoading" class="content-loading">
            <div class="loading-icon">
                <a-spin />
                <div>加载中</div>
            </div>
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
            isLoading: state => state.content.isLoading,
        }),
    },
    watch: {
        list(){
            document.documentElement.scrollTop = document.body.scrollTop = 0;
        },
    },
    created(){},
    mounted(){},
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
    }
}
</script>
<style lang="scss" scoped>
.content-loading{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(255,255,255,.2);
}
.loading-icon{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    line-height: 2.4;
    font-size: 12px;
    color:cadetblue;
}
.content-wrap{
    position: relative;
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
        margin-right: 1em;
        font-size: .5em;
        font-weight: 100;
    }
}
</style>