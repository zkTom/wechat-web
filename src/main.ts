import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
// 引入Element-ui
import ElementUI from 'element-ui';
Vue.use(ElementUI, {
    size: 'medium'
});
// moment汉化
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import bus from '@/components/common/Bus.ts';
Vue.prototype.$bus = bus;
Vue.config.productionTip = false;

// store.dispatch('login');
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
