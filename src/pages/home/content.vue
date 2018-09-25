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
        }),
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