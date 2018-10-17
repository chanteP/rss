import localforage from 'localforage';

export default {
    namespaced: true,
    state: {
        configs: {},
        show: false,
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
                if(menu.source && menu.source === source){
                    menu.count = length || 0;
                }
                if(menu.children && menu.children.length){
                    menu.children.forEach(check);
                    menu.count = menu.children.map(m => +m.count || 0).reduce((d, s) => d + s, 0);
                }
                console.log(menu.name, menu.count)
            });
        },
    },
}

async function fetchConfigs(){
    let menus = await localforage.getItem('rss-menus');
    return {
        menus: menus || [
            {
                "name": "技术",
                "source": "",
                "icon": "github",
                "children": [
                    {
                        "name": "掘金前端",
                        "source": "https://rsshub.app/juejin/category/frontend.json"
                    },
                    {
                        "name": "掘金本月前端",
                        "source": "https://rsshub.app/juejin/trending/frontend/monthly.json"
                    },
                    {
                        "name": "V2EX",
                        "source": "https://rsshub.app/v2ex/topics/latest.json"
                    },
                    {
                        "name": "V2EX最热",
                        "source": "https://rsshub.app/v2ex/topics/hot.json"
                    },
                    {
                        "name": "gitlab",
                        "source": "https://rsshub.app/gitlab/explore/trending.json"
                    }
                ]
            },
            {
                "name": "逼乎收藏",
                "source": "",
                "icon": "zhihu",
                "children": [
                    {
                        "name": "知乎看热闹",
                        "source": "https://rsshub.app/zhihu/collection/100960447.json"
                    },
                    {
                        "name": "装逼指南",
                        "source": "https://rsshub.app/zhihu/collection/71859050.json"
                    },
                    {
                        "name": "有空再看",
                        "source": "https://rsshub.app/zhihu/collection/32147143.json"
                    },
                ]
            },
            {
                "name": "新番",
                "source": "",
                "icon": "youtube",
                "children": [
                ]
            },
            {
                "name": "大新闻",
                "source": "",
                "icon": "profile",
                "children": [
                ]
            },
        ],
    }
}