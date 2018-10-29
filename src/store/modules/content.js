import storage from '../../utils/storage';
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
            commit('setLoading', false, {root: true});
        },
        async fetchList({commit, dispatch}, source){
            commit('setLoading', true, {root: true});
            let list = await fetchResources(source);
            dispatch('sidebar/refreshCount', {source, length: list.length}, {root: true});
            dispatch('showList', list);
        },
        async fetchAll({commit, dispatch}, sourceList){
            commit('setLoading', true, {root: true});
            let list = [];
            await Promise.all(sourceList.map(l => {
                return fetchResources(l).then(r => {
                    list.push(...r);
                    dispatch('sidebar/refreshCount', {source: l, length: r.length}, {root: true});
                    dispatch('showList', list);
                }).catch(e => {
                    window.console.error(e);
                });
            }));
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
    if(!/\.json$/.test(source)){
        source += '.json';
    }
    let cacheKey = `rss-source:${source}`;
    let cache = storage.get(cacheKey);
    let rs
    if(cache){
        rs = await new Promise(res => {
            // 就为了好看，怎么了
            setTimeout(_ => {
                res(cache);
            }, 1000);
        });
    }
    else{
        rs = await fetch(source).then(res => {
            return res.text();
        });
        rs && storage.set(cacheKey, rs, 0.25 * 3600 * 1000);
    }
    rs = rs.replace(/\\/g, '\\\\');
    let resInfo = {items: []};
    try{
        resInfo = JSON.parse(rs);
    }catch(e){
        window.console.error(source, e);
    }
    let list = resInfo.items || [];
    list.forEach(item => {
        // 来源标记
        item.from = resInfo.title;
        item.fromUrl = resInfo.home_page_url;

        // 缩略图
        item.image = item.image || item.banner_image || (/https?:\/\/([\s\S]+?)\.(jpg|png|gif|webp)/i.exec(item.content_html || item.summary) || [])[0];
    })
    return list;
}