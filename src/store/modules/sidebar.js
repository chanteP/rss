export default {
    namespaced: true,
    state: {
        configs: {},
        show: false,
    },
    // getters,
    actions: {
        async fetchConfigs({commit}, opts){
            let configs = await fetchConfigs(opts);
            commit('setConfigs', configs);
        },
        toggle({commit}, opts){
            commit('toggle');
        },
    },
    mutations: {
        setConfigs(state, value){
            state.configs = value;
        },
        toggle(state){
            state.show = !state.show;
        },
    },
}

async function fetchConfigs(opts){
    let {sourceUrl} = opts || {};
    let menus = sourceUrl && await fetch(sourceUrl).then(rs => rs.json());
    return menus || {
        menus: [
            {name: '技术', source: '', children: [
                {name: '掘金前端', source: 'https://rsshub.app/juejin/category/frontend.json'},
                {name: '掘金本月前端', source: 'https://rsshub.app/juejin/trending/frontend/monthly.json'},
                {name: 'V2EX', source: 'https://rsshub.app/v2ex/topics/latest.json'},
                {name: 'V2EX最热', source: 'https://rsshub.app/v2ex/topics/hot.json'},
                {name: 'gitlab', source: 'https://rsshub.app/gitlab/explore/trending.json'},
            ]},
            {name: '新闻', source: '', children: [
                {name: '澎湃', source: 'https://rsshub.app/thepaper/featured.json'},
                {name: '新京报', source: 'https://rsshub.app/bjnews/realtime.json'},
            ]},
        ],
    }
}