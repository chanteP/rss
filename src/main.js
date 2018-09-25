import Vue from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import './styles/global.scss'
import store from './store';

Vue.config.productionTip = false

Vue.use(Antd);

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
