import Vue from 'vue';
import store from '@/store';
import CustomMenu from './index.vue';

Vue.config.productionTip = false;

new Vue({
    store,
    render: h => h(CustomMenu)
}).$mount('#app');
