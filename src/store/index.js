import Vue from 'vue'
import vuex from 'vuex'
Vue.use(vuex);

import content from './modules/content';
import sidebar from './modules/sidebar';

export default new vuex.Store({
    modules: {
        content,
        sidebar,
    }
});