<template>
    <div class="content-wrap">
        <div class="cardbox" :class="{flexbox: !mobileMode}">
            <a-card class="card" :class="{flex: !mobileMode}" v-for="(news, index) in list" :key="`${news.from}_${news.url}_${index}`" :loading="false">
                <a slot="title">
                    <div class="title-link nowrap">{{news.title}}</div>
                    <div class="title-link">
                        <span><a-icon type="tag-o" /> {{news.from}}</span>
                        <span v-if="!!news.author.name"><a-icon type="user" /> {{news.author.name}}</span>
                        <span v-if="!!news.date_published" ><a-icon type="clock-circle-o"/> {{moment(news.date_published).format('YYYY-MM-DD HH:mm')}}</span>
                        <span v-if="!!+news.starDate" ><a-icon type="star-o"/> {{moment(news.starDate).format('YYYY-MM-DD HH:mm')}}</span>
                    </div>
                </a>
                <Pic v-if="news.image || news.banner_image"
                    :src="news.image || news.banner_image"
                    slot="cover"
                    autofit
                    :ratio="0/1"
                    @click.native="toLink(news.url)"
                />
                <a slot="extra">
                    <a-icon class="title-link star enable" type="star" v-if="news.hasStar" @click="news.hasStar = true;$store.dispatch('star/remove', news)"  />
                    <a-icon class="title-link star" type="star-o" v-else/>
                </a>
                <div class="summary-content" @click="toLink(news.url)">
                    <a-icon class="title-link clip-link" type="paper-clip" />
                    {{news.content_text || filter(news.summary)}}
                </div>
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
            list: state => state.star.list,
            mobileMode: state => state.mobileMode,
        }),
    },
    watch: {
    },
    created(){},
    mounted(){
        this.$store.dispatch('star/fetchStars');
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
    }
}
</script>
<style lang="scss">
.content-wrap{
    .ant-card-body{
        cursor: pointer;
    }
}
</style>
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
    transition: background-color .2s ease;
    &:hover{
        background: #fafafa;
    }
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
    position: relative;
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
.nowrap{
    text-overflow: ellipsis;
    overflow: hidden;
}
.star{
    padding: 18px;
    margin: -18px;
    &.enable{
        color: #ffd315;
    }
}
</style>