export default {
    namespaced: true,
    state: {
        list: [],
        url: null,
    },
    // getters,
    actions: {
        showUrl({commit}, url){
            commit('setUrl', url);
        },
        showList({commit}, list){
            commit('setList', list);
        },
        async fetchList({commit, dispatch}, source){
            let list = await fetchResources(source);
            dispatch('showList', list);
        },
        async fetchAll({commit, dispatch}, sourceList){
            let rs = await Promise.all(sourceList.map(l => fetchResources(l)));
            let list = rs.reduce((d, s) => d.concat(s), []);
            list.sort((a, b) => {
                return new Date(a).getTime() > new Date(b).getTime() ? 1 : -1;
            });
            dispatch('showList', list);
        },
    },
    mutations: {
        setUrl(state, url){
            state.url = url || null;
        },
        setList(state, list){
            state.list = Array.isArray(list) ? list : [];
        },
    },
}


async function fetchResources(source){
    let rs = await fetch(source).then(res => {
        return res.text();
    });
    rs = rs.replace(/\\/g, '\\\\');
    let resInfo = JSON.parse(rs);
    let list = resInfo.items || [];
    list.forEach(item => {
        item.from = resInfo.title;
        item.fromUrl = resInfo.home_page_url;
    })
    return list;
}