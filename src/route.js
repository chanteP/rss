import Home from './pages/home/index.vue';
import Setting from './pages/setting/index.vue';

export default [
    {// 首页
        path: '/',
        component: Home,
    },
    {// 分类
        path: '/category/:category/:subCategory/:source',
        component: Home,
    },
    {// 分类
        path: '/category/:category/:source',
        component: Home,
    },
    {// 配置
        path: '/setting',
        component: Setting,
    },
]