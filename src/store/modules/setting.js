const apiFrom = 'https://rsshub.app/api/routes/';

export default {
    namespaced: true,
    state: {
        apis: {},
    },
    // getters,
    actions: {
        async fetchList({commit, dispatch}){
            commit('setLoading', true, {root: true});
            let map = await fetchApiList();
            commit('setLoading', false, {root: true});
            commit('setApis', map);
        },
    },
    mutations: {
        setApis(state, apis){
            state.apis = apis || {};
        },
    },
}


async function fetchApiList(){
    let map = await fetch(apiFrom).then(res => {
        return res.json();
    });
    return map.data || {};
}