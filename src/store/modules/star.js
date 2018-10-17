import localforage from 'localforage';

const starStore = localforage.createInstance({
    name: "stars"
});

export default {
    namespaced: true,
    state: {
        list: [],
    },
    // getters,
    actions: {
        async fetchStars({commit, dispatch}){
            commit('setLoading', true, {root: true});
            let stars = await starStore.getItem('stars');
            commit('setList', stars);
            commit('setLoading', false, {root: true});
        },
        async add({commit, dispatch}, news){
            news.hasStar = true;
            commit('push', news);
        },
        async remove({commit, dispatch}, news){
            await dispatch('fetchStars');
            news.hasStar = false;
            commit('remove', news);
        },
    },
    mutations: {
        setList(state, value){
            state.list = value || [];
        },
        push(state, news){
            if(state.list.some(n => n.url === news.url)){
                return;
            }
            news.starDate = Date.now();
            state.list.push(news);
            starStore.setItem('stars', state.list);
        },
        remove(state, news){
            state.list.some((n, index) => {
                if(n.url === news.url){
                    state.list.splice(index, 1);
                    return true;
                }
            });
            starStore.setItem('stars', state.list);
        },
    },
}

