import localforage from 'localforage';

export default {
    namespaced: true,
    state: {
        configs: {},
        show: false,
        countMap: new Map(),
    },
    // getters,
    actions: {
        async fetchConfigs({commit}){
            let configs = await fetchConfigs();
            commit('setConfigs', configs);
        },
        toggle({commit}, opts){
            commit('toggle');
        },
        async save({commit, dispatch}, value){
            await localforage.setItem('rss-menus', value);
            dispatch('fetchConfigs');
        },
        refreshCount({commit, dispatch}, {source, length}){
            commit('setCount', {source, length});
        },
    },
    mutations: {
        setConfigs(state, value){
            state.configs = value;
        },
        toggle(state){
            state.show = !state.show;
        },
        setCount(state, {source, length}){
            // 设计缺陷。。。sidebar不应该这么折腾
            let menus = state.configs.menus;
            menus.forEach(function check(menu){
                let count = 0;
                if(menu.source && menu.source === source){
                    count = length || 0;
                    state.countMap.set(menu, count);
                }
                if(menu.children && menu.children.length){
                    menu.children.forEach(check);
                    count = menu.children.map(m => +state.countMap.get(m) || 0).reduce((d, s) => d + s, 0);
                    state.countMap.set(menu, count);
                }
            });
        },
    },
}

async function fetchConfigs(){
    let [menus, recommendMenus] = await Promise.all([
        localforage.getItem('rss-menus'),
        fetch('/recommend.json').then(res => res.text()).then(rs => eval(rs)),
    ]); 
    return {
        menus: menus || recommendMenus,
    }
}