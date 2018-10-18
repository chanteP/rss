import Vue from 'vue';
window.Vue = Vue;
import store from './store';
import App from './App.vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
Vue.use(Antd);
import storage from './utils/storage';
import './styles/global.scss';
import routes from './route';
import lazy from './utils/lazy';

import Layout from './components/Layout';
import Loading from './components/Loading';
import Pic from './components/Pic';

Vue.config.productionTip = false;

Vue.component('Layout', Layout);
Vue.component('Loading', Loading);
Vue.component('Pic', Pic);
Vue.use(lazy);
Vue.prototype.$storage = storage;

const router = new VueRouter({
    mode: 'hash',
    routes,
    base: __dirname,
});
new Vue({
    store,
    router,
    el: '#app',
    render: h => h(App),
});

router.beforeEach((to, from, next) => {
    if(to.meta && to.meta.title){
        window.document.title = to.meta.title;
    }
    next();
});