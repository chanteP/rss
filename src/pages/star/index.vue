<template>
    <div class="content-wrap">
        <div class="cardbox" :class="{flexbox: !mobileMode}">
            <News v-for="(news, index) in list" :key="`${news.from}_${news.url}_${index}`" :news="news" />
        </div>
    </div>
</template>
<script>
import {mapState} from 'vuex';
import News from '../../components/News';

export default {
    components: {
        News,
    },
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
</style>