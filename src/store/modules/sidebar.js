export default {
    namespaced: true,
    state: {
        configs: {},
    },
    // getters,
    actions: {
        async fetchConfigs({commit}, opts){
            let configs = await fetchConfigs(opts);
            commit('setConfigs', configs);
        },
    },
    mutations: {
        setConfigs(state, value){
            state.configs = value;
        },
    },
}

async function fetchConfigs(opts){
    let {sourceUrl} = opts || {};
    let menus = sourceUrl && await fetch(sourceUrl).then(rs => rs.json());
    return menus || {
        menus: [
            {name: '技术', source: '', children: [
                {name: '掘金', source: 'https://rsshub.app/juejin/category/frontend.json'},
                {name: 'V2EX', source: 'https://rsshub.app/v2ex/topics/latest.json'},
            ]},
        ],
    }
}