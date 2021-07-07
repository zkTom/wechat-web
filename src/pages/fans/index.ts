import Vue from 'vue';
import store from '@/store';
import Fans from './index.vue';

Vue.config.productionTip = false;

new Vue({
    store,
    render: h => h(Fans)
}).$mount('#app');
