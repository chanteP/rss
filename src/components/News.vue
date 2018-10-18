<template>
    <a-card class="card" :class="{flex: !mobileMode}" :loading="loading">
        <a slot="title">
            <div class="title-link nowrap" @click="toLink(news.url, $event)">{{news.title}}</div>
            <slot name="tags">
                <div class="title-link">
                    <span><a-icon type="tag-o" /> {{news.from}}</span>
                    <span v-if="!!news.author.name"><a-icon type="user" /> {{news.author.name}}</span>
                    <span v-if="!!news.date_published" ><a-icon type="clock-circle-o"/> {{moment(news.date_published).format('YYYY-MM-DD HH:mm')}}</span>
                    <span v-if="!!+news.starDate" ><a-icon type="star-o"/> {{moment(news.starDate).format('YYYY-MM-DD HH:mm')}}</span>
                </div>
            </slot>
        </a>
        <Pic v-if="news.image || news.banner_image"
            :src="news.image || news.banner_image"
            slot="cover"
            autofit
            :ratio="0/1"
            @click.native="toLink(news.url, $event)"
        />
        <a slot="extra">
            <slot name="tags">
                <a-icon class="title-link star enable" type="star" v-if="star" @click="starIt(news, false)"  />
                <a-icon class="title-link star" type="star-o" v-else @click="starIt(news, true)"  />
            </slot>
        </a>
        <div class="summary-content" @click="toLink(news.url, $event)">
            <a-icon class="title-link clip-link" type="paper-clip" />
            {{news.content_text || filter(news.summary)}}
        </div>
    </a-card>
</template>
<script>
import {mapState} from 'vuex';
import moment from '../utils/moment';
// import lazyload from '../utils/lazy';

export default {
    props: ['news'],
    data(){
        return {
            star: this.news.hasStar,
            loading: false,
        };
    },
    computed: {
        ...mapState({
            mobileMode: state => state.mobileMode,
        }),
    },
    created(){},
    mounted() {
        // lazyload.addLazyItem(this);
    },
    beforeDestroy() {
        // lazyload.removeLazyItem(this);
    },
    methods: {
        moment,
        filter(text){
            let d = document.createElement('div');
            d.innerHTML = text;
            d.innerHTML = d.textContent;
            return d.textContent.slice(0, 500);
        },
        toLink(url, e){
            e.preventDefault();
            window.open(url, '_blank');
        },
        starIt(news, bool){
            this.star = news.hasStar = bool;
            this.$store.dispatch(bool ? 'star/add' : 'star/remove', news);
        },
        load(){
            this.loading = false;
        },
    }
}
</script>

<style lang="scss">
.ant-card-body{
    cursor: pointer;
}
</style>
<style lang="scss" scoped>
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
    display: inline-block;
    padding: 18px;
    margin: -18px;
    &.enable{
        color: #ffd315;
        text-shadow: #ffd315 0 0 30px;
        transform-origin: 50%;
        animation: star .6s linear 0s 1;
    }
}
@keyframes star {
    0%{transform: scale(1) rotate(0deg);}
    13%{transform: scale(1.2) rotate(-10deg);}
    55%{transform: scale(2) rotate(30deg);}
    70%{transform: scale(1.8) rotate(16deg);}
    100%{transform: scale(1) rotate(0deg);}
}
</style>