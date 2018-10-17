import Vue from 'vue'
import vuex from 'vuex'
Vue.use(vuex);

import content from './modules/content';
import sidebar from './modules/sidebar';
import setting from './modules/setting';
import star from './modules/star';

let globalStore;

export default globalStore = new vuex.Store({
    modules: {
        content,
        sidebar,
        setting,
        star,
    },
    state: {
        mobileMode: window.innerWidth / window.innerHeight < 1,
        isLoading: false,
    },
    actions: {
        checkMobileMode({commit}){
            let bool = window.innerWidth / window.innerHeight < 1;
            commit('setMobileMode', bool);
        },
    },
    mutations: {
        setMobileMode(state, value){
            state.mobileMode = value;
        },
        setLoading(state, bool){
            state.isLoading = !!bool;
        },
    },
});

window.addEventListener('resize', () => {
    globalStore.dispatch('checkMobileMode');
});

